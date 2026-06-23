'use client';

import { useState, useRef, useEffect, type KeyboardEvent, type ReactNode } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { AgentMessage, InterviewState, ExtractedProject } from '@/lib/agent/types';
import { sendInterviewMessage, extractProjectData } from '@/actions/agent';
import { publishProjectFromAgent } from '@/lib/agent/publish';

function renderPlanteamiento(md: string): ReactNode {
  const nodes: ReactNode[] = [];
  let listBuf: string[] = [];
  let listKey = 0;
  const flush = () => {
    if (!listBuf.length) return;
    nodes.push(
      <ul key={`ul-${listKey++}`} className="my-1 space-y-0.5">
        {listBuf.map((item, j) => (
          <li key={j} className="flex items-start gap-1.5 text-sm text-ink-muted leading-relaxed">
            <span className="text-primary shrink-0 mt-[3px]">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>,
    );
    listBuf = [];
  };
  md.split('\n').forEach((line, i) => {
    if (line.startsWith('## '))        { flush(); nodes.push(<h2 key={i} className="text-sm font-bold text-ink mt-5 mb-1 first:mt-0">{line.slice(3)}</h2>); }
    else if (line.startsWith('### '))  { flush(); nodes.push(<h3 key={i} className="text-sm font-semibold text-ink mt-3 mb-0.5">{line.slice(4)}</h3>); }
    else if (line.startsWith('#### ')) { flush(); nodes.push(<h4 key={i} className="text-xs font-semibold text-ink-muted uppercase tracking-wide mt-2 mb-0.5">{line.slice(5)}</h4>); }
    else if (line.startsWith('- '))    { listBuf.push(line.slice(2)); }
    else if (line.trim())              { flush(); nodes.push(<p key={i} className="text-sm text-ink-muted leading-relaxed">{line}</p>); }
    else                               { flush(); }
  });
  flush();
  return <>{nodes}</>;
}

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
  const [errorExtraccion, setErrorExtraccion] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historialParaReintentar = useRef<AgentMessage[]>([]);
  const errorExtraccionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  useEffect(() => {
    if (errorExtraccion) {
      errorExtraccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [errorExtraccion]);

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
      // Show error as a temporary bubble that auto-removes after 5s
      const errorMsg: AgentMessage = { role: 'assistant', content: result.error };
      setHistory((prev) => [...prev, errorMsg]);
      setLoading(false);
      setTimeout(() => {
        setHistory((prev) => prev.filter((m) => m !== errorMsg));
      }, 5000);
      return;
    }

    const isConfirming = result.data.state === 'confirming';

    const mensajeLimpio = (result.data.message || '')
      .replace(/\[\s*ENTREVISTA_COMPLETA\s*\]/i, '')
      .trim();

    let updatedHistory = newHistory;
    if (mensajeLimpio.length > 0) {
      const agentMsg: AgentMessage = { role: 'assistant', content: mensajeLimpio };
      updatedHistory = [...newHistory, agentMsg];
      setHistory(updatedHistory);
    }

    if (isConfirming) {
      setState('confirming');

      const mensajeTransicion: AgentMessage = {
        role: 'assistant',
        content: 'Gracias por toda la información. Estoy armando tu proyecto, dame un momento...',
      };
      setHistory([...updatedHistory, mensajeTransicion]);
      historialParaReintentar.current = updatedHistory;

      setLoading(false);
      await new Promise((r) => setTimeout(r, 3000));
      setLoading(true);

      let exito = false;
      for (let intento = 0; intento < 3 && !exito; intento++) {
        const extraction = await extractProjectData(updatedHistory);
        if (extraction.success) {
          setExtracted(extraction.data);
          setState('done');
          exito = true;
        } else if (intento < 2) {
          await new Promise((r) => setTimeout(r, 3000));
        }
      }

      if (!exito) {
        setErrorExtraccion('No pudimos armar el resumen automáticamente. Tocá reintentar.');
      }

      setLoading(false);
      return;
    }

    setLoading(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSend();
  }

  async function reintentarExtraccion() {
    setErrorExtraccion('');
    setLoading(true);

    let exito = false;
    for (let intento = 0; intento < 3 && !exito; intento++) {
      const extraction = await extractProjectData(historialParaReintentar.current);
      if (extraction.success) {
        setExtracted(extraction.data);
        setState('done');
        exito = true;
      } else if (intento < 2) {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    if (!exito) {
      setErrorExtraccion('Seguimos teniendo problemas. Esperá unos segundos y reintentá.');
    }
    setLoading(false);
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

    const presupuestoMin = minColones > 0 ? minColones : 100_000;
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
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-20 sm:pb-8 min-h-screen space-y-6">
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

      {/* Chat card — visible only while the interview is active */}
      {state !== 'done' && (
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
                  {state === 'confirming' ? 'Armando tu proyecto...' : 'Pensando'}
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

          {/* Error de extracción con reintento */}
          {errorExtraccion && (
            <div ref={errorExtraccionRef} className="m-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-center justify-between gap-3">
              <p className="text-sm text-destructive">{errorExtraccion}</p>
              <button
                type="button"
                onClick={reintentarExtraccion}
                disabled={loading}
                className="shrink-0 rounded-full bg-destructive text-white px-4 py-2 text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result panel — standalone card outside the chat container, flows naturally with page scroll */}
      {state === 'done' && extracted !== null && (
        <div className="border border-border bg-surface shadow-soft rounded-2xl p-5 space-y-3">
          <p className="text-xs font-bold tracking-[0.14em] uppercase text-ink-muted font-heading">
            Tu proyecto quedó así
          </p>
          <p className="font-heading font-bold text-lg text-ink">{extracted.title}</p>
          <p className="text-sm text-ink-muted whitespace-pre-wrap">{extracted.description}</p>

          {extracted.budget_min > 0 && (
            <p className="text-sm text-ink-muted">
              Presupuesto:{' '}
              {extracted.budget_max > 0
                ? `${extracted.budget_currency === 'USD' ? '$' : '₡'}${extracted.budget_min.toLocaleString('es-CR')} – ${extracted.budget_currency === 'USD' ? '$' : '₡'}${extracted.budget_max.toLocaleString('es-CR')}`
                : `${extracted.budget_currency === 'USD' ? '$' : '₡'}${extracted.budget_min.toLocaleString('es-CR')}`}
            </p>
          )}

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

          {extracted.planteamiento && (
            <div className="border border-border bg-surface rounded-2xl p-5">
              <p className="text-xs font-bold tracking-[0.14em] uppercase text-ink-muted font-heading mb-3">
                Análisis del proyecto
              </p>
              {renderPlanteamiento(extracted.planteamiento)}
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
  );
}
