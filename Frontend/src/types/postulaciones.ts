// ── Types & Interfaces ──────────────────────────────────────────────

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  location: string;
  stacks: string[];
  stackColors: Record<string, string>;
  coverLetter: string;
  status: 'nuevo' | 'en_revision' | 'entrevistado' | 'rechazado';
  isInvited: boolean;
  notes: string[];
}

export interface ProjectStats {
  totalPostulados: number;
  nuevosHoy: number;
  enRevision: number;
  entrevistados: number;
}

export interface ScheduleSlot {
  date: string;      // ISO date string
  time: string;      // HH:mm format
  message?: string;
}

export interface SidebarItem {
  icon: string;
  label: string;
  path: string;
  badge?: number;
  active?: boolean;
}

export type ExportFormat = 'csv' | 'pdf';
export type SortField = 'name' | 'status' | 'date';
export type SortDirection = 'asc' | 'desc';
