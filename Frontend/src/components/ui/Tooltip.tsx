import { useState, useRef, useEffect, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const positionClasses: Record<string, string> = {
    top:    'bottom-full left-1/2 -translate-x-1/2 mb-2.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2.5',
    left:   'right-full top-1/2 -translate-y-1/2 mr-2.5',
    right:  'left-full top-1/2 -translate-y-1/2 ml-2.5',
  };

  const arrowClasses: Record<string, string> = {
    top:    'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
    left:   'left-full top-1/2 -translate-y-1/2 -ml-1',
    right:  'right-full top-1/2 -translate-y-1/2 -mr-1',
  };

  const handleEnter = () => { timeoutRef.current = setTimeout(() => setShow(true), 180); };
  const handleLeave = () => { clearTimeout(timeoutRef.current); setShow(false); };
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div className="relative inline-flex" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {children}
      {show && (
        <div
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap pointer-events-none animate-elastic-in
            px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide
            bg-gray-900/95 text-white backdrop-blur-sm
            shadow-xl shadow-black/20
            ${positionClasses[position]}`}
        >
          {content}
          <span
            className={`absolute w-2 h-2 bg-gray-900/95 rotate-45 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
}
