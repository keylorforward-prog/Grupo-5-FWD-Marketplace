import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../../../../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import './CrearProyectoIA.css';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: '¡Hola! Voy a ayudarte a publicar tu proyecto en FWD. Para arrancar, contame: ¿qué problema querés resolver?',
};

async function apiPost(path, body) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    const res = await fetch(`/api/agent/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.json();
  } catch {
    return { success: false, message: 'Algo salió mal de nuestro lado. Intentá de nuevo.' };
  }
}

async function apiConv(method, path, body, token) {
  try {
    const res = await fetch(`/api/conversaciones-ia${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return res.json();
  } catch {
    return { success: false };
  }
}

export default function CrearProyectoIA() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [history, setHistory] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [state, setState] = useState('interviewing');
  const [extracted, setExtracted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversacionId, setConversacionId] = useState(null);

  const chatContainerRef = useRef(null);
  const empresarioId = user?.id_perfil_empresario ?? user?.id;

  const historyRef = useRef(history);
  const conversacionIdRef = useRef(conversacionId);
  const stateRef = useRef(state);

  useEffect(() => {
    historyRef.current = history;
    conversacionIdRef.current = conversacionId;
    stateRef.current = state;
  }, [history, conversacionId, state]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (stateRef.current !== 'done' && historyRef.current.length > 1) {
        const body = JSON.stringify({
          id_perfil_empresario: empresarioId,
          historial: historyRef.current,
          estado: 'en_progreso'
        });
        const cid = conversacionIdRef.current;
        const url = cid ? `/api/conversaciones-ia/${cid}` : '/api/conversaciones-ia';
        const method = cid ? 'PUT' : 'POST';

        fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body,
          keepalive: true
        }).catch(() => {});
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [empresarioId, token]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  useEffect(() => {
    if (!empresarioId) return;
    async function loadConversacion() {
      const res = await apiConv('GET', `/empresario/${empresarioId}`, null, token);
      if (res.success && res.data) {
        try {
          const historial = JSON.parse(res.data.historial);
          if (Array.isArray(historial) && historial.length > 1) {
            setHistory(historial);
            setConversacionId(res.data.id_conversacion_ia);
          }
        } catch {}
      }
    }
    loadConversacion();
  }, [empresarioId, token]);

  async function saveConversacion(historial, estado) {
    if (conversacionId) {
      await apiConv('PUT', `/${conversacionId}`, { historial, estado }, token);
      return conversacionId;
    }
    const res = await apiConv('POST', '', { id_perfil_empresario: empresarioId, historial }, token);
    if (res.success && res.data) {
      setConversacionId(res.data.id_conversacion_ia);
      return res.data.id_conversacion_ia;
    }
    return null;
  }

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const historySnapshot = history;
    const newHistory = [...historySnapshot, userMsg];

    setHistory(newHistory);
    setInput('');
    setLoading(true);

    try {
      const result = await apiPost('interview', { history: historySnapshot, userMessage: input });

      if (!result.success) {
        setHistory((prev) => [...prev, { role: 'assistant', content: result.message }]);
        return;
      }

      const agentMsg = { role: 'assistant', content: result.data.message };
      const updatedHistory = [...newHistory, agentMsg];
      setHistory(updatedHistory);

      if (result.data.state === 'confirming') {
        setState('confirming');

        const extraction = await apiPost('extract', { history: updatedHistory });

        if (extraction.success) {
          setExtracted(extraction.data);
          setState('done');
          await saveConversacion(updatedHistory, 'completada');
        } else {
          setHistory((prev) => [
            ...prev,
            { role: 'assistant', content: extraction.message || 'No pudimos procesar tu proyecto. Intentá de nuevo.' },
          ]);
        }
      }
    } catch {
      setHistory((prev) => [
        ...prev,
        { role: 'assistant', content: 'Algo salió mal de nuestro lado. Intentá de nuevo.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend();
  }

  function handlePublish() {
    if (!extracted) return;
    sessionStorage.setItem('agent_project_draft', JSON.stringify(extracted));
    if (conversacionId) {
      sessionStorage.setItem('agent_conversacion_id', String(conversacionId));
    }
    navigate('/DashboardEmpresario/publicar-proyecto?from=agent');
  }

  return (
    <DashboardLayout activePage="proyectos">
      <div className="de-page-heading">
        <p className="de-eyebrow">Nuevo proyecto</p>
        <h1>
          Contame tu idea<span style={{ color: 'var(--color-primary, #3b5bdb)' }}>.</span>
        </h1>
        <p className="de-page-subtitle">
          El agente te hace las preguntas correctas y arma el proyecto por vos.
        </p>
      </div>

      <div className="de-panel" style={{ padding: 0, overflow: 'hidden' }}>

        {/* Header del agente */}
        <div className="cia-header">
          <div className="cia-header-dot">
            <Sparkles size={16} />
          </div>
          <div className="cia-header-info">
            <span className="cia-header-name">Agente FWD</span>
            <span className="cia-header-status">En línea</span>
          </div>
        </div>

        <div
          className="cia-chat-area"
          ref={chatContainerRef}
          role="log"
          aria-live="polite"
          aria-label="Conversación con el agente"
        >
          {history.map((msg, i) => (
            <div
              key={i}
              className={`cia-msg-row ${msg.role === 'user' ? 'cia-msg-row--user' : 'cia-msg-row--agent'}`}
            >
              {msg.role === 'assistant' && (
                <div className="cia-agent-avatar">
                  <Sparkles size={13} />
                </div>
              )}
              <span
                className={`cia-bubble ${msg.role === 'user' ? 'cia-bubble--user' : 'cia-bubble--agent'}`}
              >
                {msg.content}
              </span>
            </div>
          ))}

          {loading && (
            <div className="cia-msg-row cia-msg-row--agent">
              <div className="cia-agent-avatar">
                <Sparkles size={13} />
              </div>
              <span className="cia-bubble cia-bubble--agent cia-bubble--thinking">
                Pensando
                <span className="cia-dots">
                  <span className="cia-dot" />
                  <span className="cia-dot" />
                  <span className="cia-dot" />
                </span>
              </span>
            </div>
          )}
        </div>

        {state !== 'done' && (
          <div className="cia-input-row">
            <label htmlFor="cia-input" className="sr-only">Tu mensaje</label>
            <input
              id="cia-input"
              type="text"
              className="cia-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu respuesta..."
              disabled={loading}
            />
            <button
              className="de-btn-primary"
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label={loading ? 'Enviando mensaje' : 'Enviar mensaje'}
              style={{ borderRadius: '999px', padding: '8px 20px', fontSize: '0.875rem' }}
            >
              Enviar
            </button>
          </div>
        )}

        {state === 'done' && extracted && (
          <div className="cia-result">
            <p className="cia-result-eyebrow">Tu proyecto quedó así</p>
            <p className="cia-result-title">{extracted.title}</p>
            <p className="cia-result-desc">{extracted.description}</p>

            {extracted.stack?.length > 0 && (
              <div className="cia-stack-pills">
                {extracted.stack.map((tech) => (
                  <span key={tech} className="cia-pill">{tech}</span>
                ))}
              </div>
            )}

            <button
              className="de-btn-primary"
              type="button"
              onClick={handlePublish}
              style={{ width: '100%', borderRadius: '999px' }}
            >
              Revisar y publicar
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
