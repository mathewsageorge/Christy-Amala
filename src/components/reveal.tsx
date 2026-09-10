"use client";

import { useEffect, useRef } from "react";

/** Server-rendered content stays visible if JS, Motion, or IntersectionObserver fails. */
export function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    let active = true;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      // Load the motion engine only when needed; never hide content while it downloads.
      void import("motion/react").then(({ animate }) => {
        if (active) animate(element, { opacity: [0, 1], y: [16, 0] }, { duration: 0.85, ease: [0.22, 1, 0.36, 1] });
      }).catch(() => {});
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => { active = false; observer.disconnect(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
