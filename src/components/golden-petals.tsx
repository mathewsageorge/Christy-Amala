"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";

export function GoldenPetals() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: .55 });

  return <div ref={ref} id="golden-petals" className={`golden-petals ${visible ? "is-visible" : ""}`} aria-hidden="true">
    <div className="golden-petal-rule" />
    <span className="golden-monogram">C <i>&</i> A</span>
    {["left", "right"].map((side, sideIndex) => <div key={side} className={`golden-petal-lane ${side}`}>
      {Array.from({ length: 9 }, (_, index) => <span key={index} className="golden-petal-fall" style={{
        left: `${8 + (index * 31 % 80)}%`,
        "--delay": `${index * .16 + sideIndex * .12}s`,
        "--duration": `${2.8 + index % 3 * .22}s`,
        "--size": `${16 + index % 4 * 5}px`,
        "--drift": `${index % 2 ? -12 : 12}px`,
        "--turn": `${index % 2 ? -155 : 195}deg`,
      } as CSSProperties}><span /></span>)}
    </div>)}
  </div>;
}
