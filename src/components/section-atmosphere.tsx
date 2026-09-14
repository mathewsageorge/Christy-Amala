"use client";

import { useEffect } from "react";

/** Decorative effects never hide content or intercept guest interactions. */
export function SectionAtmosphere() {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const sections = Array.from(document.querySelectorAll("main > section"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("atmosphere-entered");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
    const start = () => sections.forEach(section => observer.observe(section));
    const gate = document.querySelector(".invitation-gate");
    const gateObserver = new MutationObserver(() => {
      if (!gate?.hasAttribute("open")) { gateObserver.disconnect(); start(); }
    });
    if (gate?.hasAttribute("open")) gateObserver.observe(gate, { attributes: true, attributeFilter: ["open"] });
    else start();
    const stop = () => {
      observer.disconnect();
      gateObserver.disconnect();
      sections.forEach(section => section.classList.remove("atmosphere-entered"));
    };
    const reduce = () => { if (preference.matches) stop(); };
    preference.addEventListener("change", reduce);
    return () => { stop(); preference.removeEventListener("change", reduce); };
  }, []);
  return null;
}
