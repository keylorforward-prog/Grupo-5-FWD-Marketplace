'use server';

import OpenAI from 'openai';
import { SYSTEM_PROMPT, EXTRACTION_PROMPT, CORRECTION_PROMPT } from '@/lib/agent/prompts';
import { detectState, cleanMessage } from '@/lib/agent/interview';
import type { AgentMessage, AgentResponse, ExtractedProject } from '@/lib/agent/types';
import { ok, err, type Result } from '@/lib/result';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let intento = 0; intento <= maxRetries; intento++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (intento < maxRetries) {
        await new Promise((r) => setTimeout(r, 500 * (intento + 1)));
      }
    }
  }
  throw lastError;
}

function stripMarkdown(text: string): string {
  return text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
}

export async function sendInterviewMessage(
  history: AgentMessage[],
  userMessage: string,
): Promise<Result<AgentResponse>> {
  try {
    const response = await callWithRetry(() =>
      client.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          { role: 'user', content: userMessage },
        ],
      }),
    );
    const text = response.choices[0].message.content ?? '';
    const state = detectState(text);

    try {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const historialActualizado: AgentMessage[] = [
          ...history,
          { role: 'user', content: userMessage },
          { role: 'assistant', content: cleanMessage(text) },
        ];

        await supabase
          .from('conversacion_ia')
          .upsert(
            {
              id_perfil_empresario: user.id,
              historial: JSON.stringify(historialActualizado),
              estado: state === 'confirming' ? 'finalizada' : 'en_progreso',
              fecha_actualizacion: new Date().toISOString(),
            },
            { onConflict: 'id_perfil_empresario' },
          );
      }
    } catch {
      // Si falla el guardado no interrumpimos el flujo del chat
    }

    return ok({ message: cleanMessage(text), state });
  } catch (e) {
    console.error('Agent error:', e);
    const mensaje = e instanceof Error ? e.message.toLowerCase() : '';
    if (mensaje.includes('rate') || mensaje.includes('429')) {
      return err('El agente está recibiendo muchas consultas. Esperá unos segundos.');
    }
    if (mensaje.includes('timeout') || mensaje.includes('network')) {
      return err('Hubo un problema de conexión. Intentá de nuevo.');
    }
    return err('Algo salió mal de nuestro lado. Intentá de nuevo.');
  }
}

export async function extractProjectData(
  history: AgentMessage[],
): Promise<Result<ExtractedProject>> {
  try {
    const historialTexto = history
      .map((m) => `${m.role === 'user' ? 'Empresario' : 'Agente'}: ${m.content}`)
      .join('\n');

    const response = await callWithRetry(() =>
      client.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        max_tokens: 800,
        messages: [{ role: 'user', content: EXTRACTION_PROMPT + '\n' + historialTexto }],
      }),
    );
    const text = response.choices[0].message.content ?? '';
    const data = JSON.parse(stripMarkdown(text)) as ExtractedProject;
    return ok(data);
  } catch (e) {
    console.error('Agent error:', e);
    const mensaje = e instanceof Error ? e.message.toLowerCase() : '';
    if (mensaje.includes('rate') || mensaje.includes('429')) {
      return err('El agente está recibiendo muchas consultas. Esperá unos segundos.');
    }
    if (mensaje.includes('timeout') || mensaje.includes('network')) {
      return err('Hubo un problema de conexión. Intentá de nuevo.');
    }
    return err('No se pudo procesar la información del proyecto.');
  }
}

export async function correctProjectData(
  current: ExtractedProject,
  correction: string,
): Promise<Result<ExtractedProject>> {
  try {
    const response = await callWithRetry(() =>
      client.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        max_tokens: 600,
        messages: [
          {
            role: 'user',
            content:
              CORRECTION_PROMPT +
              '\n' +
              JSON.stringify(current, null, 2) +
              '\n\nCambios: ' +
              correction,
          },
        ],
      }),
    );
    const text = response.choices[0].message.content ?? '';
    const data = JSON.parse(stripMarkdown(text)) as ExtractedProject;
    return ok(data);
  } catch (e) {
    console.error('Agent error:', e);
    const mensaje = e instanceof Error ? e.message.toLowerCase() : '';
    if (mensaje.includes('rate') || mensaje.includes('429')) {
      return err('El agente está recibiendo muchas consultas. Esperá unos segundos.');
    }
    if (mensaje.includes('timeout') || mensaje.includes('network')) {
      return err('Hubo un problema de conexión. Intentá de nuevo.');
    }
    return err('No se pudo procesar la información del proyecto.');
  }
}
