'use client';

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { AgentMessage, InterviewState, ExtractedProject } from '@/lib/agent/types';
import { sendInterviewMessage, extractProjectData } from '@/actions/agent';
import { publishProjectFromAgent } from '@/lib/agent/publish';

const INITIAL_MESSAGE: AgentMessage = {
  role: 'assistant',
  content:
    '¡Hola! Voy a ayudarte a publicar tu proyecto en FWD. Para arrancar, contame: ¿qué problema querés resolver?',
};

export default function AgentNewPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [history, setHistory] = useState<AgentMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [state, setState] = useState<InterviewState>('interviewing');
  const [extracted, setExtracted] = useState<ExtractedProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg: AgentMessage = { role: 'user', content: input };
    const historySnapshot = history;
    const newHistory = [...historySnapshot, userMsg];

    setHistory(newHistory);
    setInput('');
    setLoading(true);

    const result = await sendInterviewMessage(historySnapshot, input);

    if (!result.success) {
      setHistory((prev) => [...prev, { role: 'assistant', content: result.error }]);
      setLoading(false);
      return;
    }

    const agentMsg: AgentMessage = { role: 'assistant', content: result.data.message };
    const updatedHistory = [...newHistory, agentMsg];
    setHistory(updatedHistory);

    if (result.data.state === 'confirming') {
      setState('confirming');

      const extraction = await extractProjectData(updatedHistory);

      if (extraction.success) {
        setExtracted(extraction.data);
        setState('done');
      } else {
        setHistory((prev) => [...prev, { role: 'assistant', content: extraction.error }]);
      }
    }

    setLoading(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  async function handlePublish() {
    if (!extracted || publishing) return;
    setPublishing(true);
    setPublishError('');

    const TIPO_CAMBIO = 520;

    function convertirAColones(monto: number, moneda: string): number {
      if (!monto || monto <= 0) return 0;
      if (moneda === 'USD') return Math.round(monto * TIPO_CAMBIO);
      return Math.round(monto);
    }

    const minColones = convertirAColones(extracted.budget_min, extracted.budget_currency);
    const maxColones = convertirAColones(extracted.budget_max, extracted.budget_currency);

    const presupuestoMin = minColones > 0 ? Math.max(minColones, 100_000) : 100_000;
    const presupuestoMax = maxColones > 0 ? maxColones : 0;

    const result = await publishProjectFromAgent({
      ...extracted,
      budget_min: presupuestoMin,
      budget_max: presupuestoMax,
    });

    if (!result.success) {
      setPublishError(result.error);
      setPublishing(false);
      return;
    }

    router.push(`/${locale}/empresa/proyectos`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* PageTitle */}
      <div className="space-y-1">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-ink-muted font-heading">
          Nuevo proyecto
        </p>
        <h1 className="text-3xl font-bold tracking-tight font-heading text-ink">
          Contame tu idea<span className="text-primary">.</span>
        </h1>
        <p className="font-body text-ink-muted max-w-prose">
          El agente te hace las preguntas correctas y arma el proyecto por vos.
        </p>
      </div>

      {/* Chat card */}
      <div className="bg-surface border border-border rounded-2xl shadow-soft flex flex-col overflow-hidden">
        {/* Messages */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Conversación con el agente"
          className="min-h-[320px] max-h-[480px] overflow-y-auto p-4 space-y-3"
        >
          {history.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <span
                className={`inline-block max-w-[80%] px-4 py-2.5 text-sm leading-relaxed break-words ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm'
                    : 'bg-surface-sunken text-ink rounded-2xl rounded-bl-sm'
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 text-sm bg-surface-sunken text-ink-muted rounded-2xl rounded-bl-sm">
                Pensando
                <span className="inline-flex gap-0.5 items-end">
                  <span className="w-1 h-1 rounded-full bg-ink-muted animate-bounce [animation-delay:0ms]" />
                  <span className="w-1 h-1 rounded-full bg-ink-muted animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-1 rounded-full bg-ink-muted animate-bounce [animation-delay:300ms]" />
                </span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {state !== 'done' && (
          <div className="border-t border-border p-3 flex gap-2">
            <label htmlFor="agent-input" className="sr-only">
              Tu mensaje
            </label>
            <input
              id="agent-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu respuesta..."
              disabled={loading}
              className="flex-1 min-w-0 bg-surface-sunken rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-ink-subtle disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="shrink-0 bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-medium disabled:opacity-40 transition duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:opacity-90"
            >
              Enviar
            </button>
          </div>
        )}

        {/* Result panel */}
        {state === 'done' && extracted !== null && (
          <div className="border border-border bg-surface shadow-soft rounded-2xl p-5 m-4 space-y-3">
            <p className="text-xs font-bold tracking-[0.14em] uppercase text-ink-muted font-heading">
              Tu proyecto quedó así
            </p>
            <p className="font-heading font-bold text-lg text-ink">{extracted.title}</p>
            <p className="text-sm text-ink-muted">{extracted.description}</p>

            {extracted.stack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {extracted.stack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-primary/10 text-primary rounded-full text-xs px-2.5 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {publishError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-2.5">
                {publishError}
              </p>
            )}

            <button
              onClick={handlePublish}
              disabled={publishing}
              className="bg-primary text-primary-foreground rounded-full w-full py-2.5 font-medium text-sm transition duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:opacity-90 disabled:opacity-50"
            >
              {publishing ? 'Publicando...' : 'Confirmar y publicar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
