import { memo, useCallback, useState, useRef, useEffect } from 'react';

function Emergente({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const toggleOpen = useCallback(() => {
    setOpen((actual) => !actual);
  }, []);

  const alignClasses = {
    left:   'left-0',
    right:  'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={toggleOpen}>{trigger}</div>
      {open && (
        <div
          className={`absolute top-full mt-2 z-50
            bg-white/95 backdrop-blur-md
            rounded-2xl shadow-2xl shadow-black/10
            border border-gray-100/80
            ${alignClasses[align]}
            animate-elastic-in`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default memo(Emergente);
