
export default function ElementoBarraLateral({ icon: Icono, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
      type="button"
    >
      <Icono size={20} />
      <span>{label}</span>
    </button>
  );
}
