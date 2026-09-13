"use client";

import { useEffect, useRef } from "react";

type RevealKind = "section" | "portrait" | "date";

/** Content remains visible without JavaScript or animation support. */
export function Reveal({ children, className = "", kind = "section" }: { children: React.ReactNode; className?: string; kind?: RevealKind }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || preference.matches || !("IntersectionObserver" in window) || !element.animate) return;
    const animations: Animation[] = [];
    const ease = "cubic-bezier(.22,1,.36,1)";
    const targets = kind === "portrait" ? [element.querySelector("img")].filter((item): item is HTMLImageElement => !!item) : Array.from(element.children);
    const seen = new Set<Element>();
    const play = (target: Element, index: number) => {
      if (seen.has(target) || preference.matches) return;
      seen.add(target);
      if (target.contains(document.activeElement)) return;
      let frames: Keyframe[] = [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }];
      let duration = 950;
      let delay = Math.min(index * 90, 270);
      if (kind === "portrait") {
        frames = [{ opacity: .2, clipPath: "inset(0 0 100% 0)", transform: "scale(1.035)" }, { opacity: 1, clipPath: "inset(0 0 0% 0)", transform: "scale(1)" }];
        duration = 1500; delay = 0;
      } else if (target.classList.contains("date-rule")) {
        frames = [{ opacity: 0, transform: "scaleX(0)" }, { opacity: 1, transform: "scaleX(1)" }];
        duration = 850; delay = 350;
      }
      animations.push(target.animate(frames, { duration, delay, easing: ease, fill: "backwards" }));
    };
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
        observer.unobserve(entry.target);
        play(entry.target, index);
      });
    }, { threshold: .15 });
    const observe = () => targets.forEach(target => observer.observe(target));
    // Wait for the invitation to open, so reveals do not play behind its cover.
    const gate = document.querySelector(".invitation-gate");
    const gateObserver = new MutationObserver(() => {
      if (!gate?.hasAttribute("open")) { gateObserver.disconnect(); observe(); }
    });
    if (gate?.hasAttribute("open")) gateObserver.observe(gate, { attributes: true, attributeFilter: ["open"] });
    else observe();
    const cancel = () => animations.forEach(animation => animation.cancel());
    const reduce = () => { if (preference.matches) { observer.disconnect(); gateObserver.disconnect(); cancel(); } };
    // Keyboard users should never wait for a control to finish entering.
    element.addEventListener("focusin", cancel);
    preference.addEventListener("change", reduce);
    return () => { observer.disconnect(); gateObserver.disconnect(); cancel(); preference.removeEventListener("change", reduce); element.removeEventListener("focusin", cancel); };
  }, [kind]);
  return <div ref={ref} className={className} data-reveal={kind}>{children}</div>;
}
