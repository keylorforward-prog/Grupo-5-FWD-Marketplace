export type AgentMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type InterviewState = 'interviewing' | 'confirming' | 'done';

export type ExtractedProject = {
  title: string;
  description: string;
  area_negocio: string;
  stack: string[];
  duration_weeks: number;
  work_mode: 'remote' | 'hybrid' | 'onsite';
  budget_min: number;
  budget_max: number;
  usa_ia: boolean;
  raw_requirements: string;
};

export type AgentResponse = {
  message: string;
  state: InterviewState;
  extracted?: ExtractedProject;
};
