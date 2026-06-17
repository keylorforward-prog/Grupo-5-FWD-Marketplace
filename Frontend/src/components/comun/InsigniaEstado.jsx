import { CircleCheck, Clock } from 'lucide-react';

export default function InsigniaEstado({ status }) {
  const isCompleted = status === 'Completado';
  return (
    <span className={`admin-status-pill ${isCompleted ? 'success' : 'warning'}`}>
      {isCompleted ? <CircleCheck size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
}
