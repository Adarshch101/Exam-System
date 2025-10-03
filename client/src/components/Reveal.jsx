import React, { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, delay = 0, from = 'up' }) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const dir = from === 'up' ? 'translate-y-4' : from === 'down' ? '-translate-y-4' : from === 'left' ? 'translate-x-4' : '-translate-x-4';
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${show ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${dir}`}`}
    >
      {children}
    </div>
  );
}
