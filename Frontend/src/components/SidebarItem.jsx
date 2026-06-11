
export default function SidebarItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-md'
          : 'text-ink-muted hover:bg-surface/10 hover:text-canvas'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}