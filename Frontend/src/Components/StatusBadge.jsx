import React from 'react';
import { CircleCheck, Clock } from 'lucide-react';

export default function StatusBadge({ status }) {
  const isCompleted = status === 'Completado';
  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold w-fit ${
      isCompleted ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
    }`}>
      {isCompleted ? <CircleCheck size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
}