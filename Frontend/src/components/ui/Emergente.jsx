import { useState, useRef, useEffect } from 'react';

export default function Emergente({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const alignClasses = {
    left:   'left-0',
    right:  'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
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
