import type { AgentMessage, InterviewState } from './types';

const TOKEN_COMPLETA = /\[\s*ENTREVISTA_COMPLETA\s*\]/i;

export function detectState(lastAssistantMessage: string): InterviewState {
  if (TOKEN_COMPLETA.test(lastAssistantMessage)) return 'confirming';
  return 'interviewing';
}

export function buildMessages(
  history: AgentMessage[],
  state: InterviewState,
  userMessage?: string,
): AgentMessage[] {
  if (state === 'interviewing') {
    if (userMessage !== undefined) {
      return [...history, { role: 'user', content: userMessage }];
    }
    return history;
  }

  if (state === 'confirming') {
    const historialEnTextoPlano = history
      .map((msg) => {
        const prefix = msg.role === 'user' ? 'Empresario' : 'Agente';
        return `${prefix}: ${msg.content}`;
      })
      .join('\n');

    return [{ role: 'user', content: historialEnTextoPlano }];
  }

  return history;
}

export function cleanMessage(message: string): string {
  return message.replace(TOKEN_COMPLETA, '').trim();
}
