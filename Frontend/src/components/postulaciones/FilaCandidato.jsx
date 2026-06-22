import { MapPin } from 'lucide-react';
import BotonesAccion from './BotonesAccion';

const configEstado = {
  nuevo: { label: 'Nuevo', badge: 'nueva' },
  en_revision: { label: 'En revisión', badge: 'revision' },
  entrevistado: { label: 'Entrevistado', badge: 'recepcion' },
  rechazado: { label: 'Rechazado', badge: 'rechazado' },
  nuevo: { label: 'Nuevo', bg: 'rgba(37,99,235,0.1)', text: '#2563eb', dot: '#3b82f6' },
  pendiente: { label: 'Pendiente', bg: 'rgba(245,158,11,0.08)', text: '#92400e', dot: '#d97706' },
  en_revision: { label: 'En revisión', bg: 'rgba(245,158,11,0.12)', text: '#b45309', dot: '#f59e0b' },
  entrevistado: { label: 'Entrevistado', bg: 'rgba(124,58,237,0.1)', text: '#7c3aed', dot: '#a78bfa' },
  aceptado: { label: 'Aceptado', bg: 'rgba(5,150,105,0.1)', text: '#047857', dot: '#10b981' },
  rechazado: { label: 'Rechazado', bg: 'rgba(107,114,128,0.1)', text: '#6b7280', dot: '#9ca3af' },
};

// Pastel colors for stacks like in the photo
const COLORES_PASTEL_TECNOLOGIAS = {
  React: 'bg-blue-200 text-blue-800',
  'Node.js': 'bg-purple-200 text-purple-800',
  TypeScript: 'bg-blue-300 text-blue-900',
  'Next.js': 'bg-pink-100 text-pink-800',
  Tailwind: 'bg-cyan-200 text-cyan-800',
  PostgreSQL: 'bg-purple-300 text-purple-900',
  Python: 'bg-yellow-200 text-yellow-800',
  Docker: 'bg-blue-200 text-blue-800',
  Angular: 'bg-red-200 text-red-800',
  Firebase: 'bg-orange-200 text-orange-800',
  Vue: 'bg-emerald-200 text-emerald-800',
  MongoDB: 'bg-green-200 text-green-800',
  GraphQL: 'bg-pink-200 text-pink-800',
  Flutter: 'bg-sky-200 text-sky-800',
  Go: 'bg-cyan-200 text-cyan-800',
  AWS: 'bg-orange-300 text-orange-900',
  Java: 'bg-red-300 text-red-900',
  Swift: 'bg-orange-300 text-orange-900',
  Kotlin: 'bg-violet-200 text-violet-800',
  Rust: 'bg-orange-400 text-orange-900',
};

export default function FilaCandidato({
  candidate,
  estaSeleccionado,
  index = 0,
  alSeleccionar,
  alVer,
  alInvitar,
  alRechazar,
  alAceptar,
}) {
  const { id, name, location, stacks, coverLetter, status, estaInvitado, avatar } = candidate;
  const infoEstado = configEstado[status] ?? configEstado.nuevo;

  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const avatarColor = `hsl(${hue}, 62%, 52%)`;
  
  // Show max 2 stacks, then +X
  const tecnologiasVisibles = stacks.slice(0, 2);
  const cantidadTecnologiasOcultas = Math.max(0, stacks.length - 2);

  return (
    <tr
      className={`group border-b border-gray-100/60 bg-white transition-all duration-200
        animate-row-in hover:shadow-sm hover:z-10
      `}
      style={{
        animationDelay: `${index * 42}ms`,
        position: 'relative',
      }}
    >
      {/* Candidato */}
      <td className="py-4 pl-6 pr-4">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={estaSeleccionado}
            onChange={() => alSeleccionar(id)}
            aria-label={`Seleccionar a ${name}`}
            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          {avatar ? (
            <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
              style={{ backgroundColor: avatarColor }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-gray-900 truncate">{name}</p>
            <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0 text-gray-400" />
              {location}
            </p>
            <span className={`de-badge ${infoEstado.badge} mt-2`}>
              {infoEstado.label}
            </span>
          </div>
        </div>
      </td>

      {/* Stack */}
      <td className="py-4 px-4">
        <div className="flex flex-wrap gap-1.5 items-center">
          {tecnologiasVisibles.map((s) => (
            <span
              key={s}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${COLORES_PASTEL_TECNOLOGIAS[s] ?? 'bg-gray-100 text-gray-700'}`}
            >
              {s}
            </span>
          ))}
          {cantidadTecnologiasOcultas > 0 && (
            <span className="px-2 py-1 rounded-full text-[10px] font-bold text-gray-500 bg-gray-100">
              +{cantidadTecnologiasOcultas}
            </span>
          )}
        </div>
      </td>

      {/* Carta */}
      <td className="py-4 px-4 max-w-[280px]">
        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 italic pr-4">
          "{coverLetter}"
        </p>
      </td>

      {/* Acciones */}
      <td className="py-4 pr-6 text-right">
        <BotonesAccion
          idCandidato={id}
          nombreCandidato={name}
          estaInvitado={estaInvitado}
          status={status}
          alVer={alVer}
          alInvitar={alInvitar}
          alRechazar={alRechazar}
          alAceptar={alAceptar}
        />
      </td>
    </tr>
  );
}
