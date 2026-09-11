"use client";

import { useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";

type Petal = { dx: number; rise: number; drift: number; spin: number; size: number };
type Burst = { id: number; x: number; y: number; petals: Petal[] };
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function SendLove() {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [taps, setTaps] = useState(0);
  const nextId = useRef(0);
  const lastTap = useRef(-Infinity);

  function sendLove(event: MouseEvent<HTMLButtonElement>) {
    const now = performance.now();
    if (now - lastTap.current < 450) return;
    lastTap.current = now;
    setTaps(value => value + 1);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + 34;
    const spread = Math.min(innerWidth * .85, 650);
    const petals = Array.from({ length: 20 }, (_, i) => {
      const destination = Math.max(20, Math.min(innerWidth - 20, x + (i / 19 - .5) * spread + (Math.random() - .5) * 40));
      return { dx: destination - x, rise: 90 + Math.random() * 150, drift: 25 + Math.random() * 95, spin: (Math.random() - .5) * 540, size: 20 + Math.random() * 17 };
    });
    const burst = { id: nextId.current++, x, y, petals };
    // Cap repeat taps at two bursts; no accumulated particles or timers.
    setBursts(previous => [...previous.slice(-1), burst]);
  }

  return <section className="send-love" id="send-love" aria-label="Send some love">
    <button className="love-button" type="button" disabled={!ready} onClick={sendLove} aria-describedby="love-message">
      <span key={taps} className={`love-heart ${taps ? "love-heart-pulse" : ""}`} aria-hidden="true">
        <svg width="31" height="29" viewBox="0 0 32 30" fill={taps ? "currentColor" : "none"}><path d="M16 26S3 18 3 9.5A6.5 6.5 0 0 1 16 8a6.5 6.5 0 0 1 13 1.5C29 18 16 26 16 26Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <span className="love-label">Send some love</span>
    </button>
    <p id="love-message" className="love-message" role="status" aria-live="polite">{taps ? "Thank you for celebrating with us!" : "A little love for Christy & Amala."}</p>
    {bursts.length > 0 && createPortal(<div className="love-petals" aria-hidden="true">
      {bursts.map(burst => burst.petals.map((petal, index) => <motion.span
        key={`${burst.id}-${index}`} className="love-petal"
        style={{ width: petal.size, height: petal.size }}
        initial={{ x: burst.x, y: burst.y, opacity: 0, scale: .3, rotate: 0 }}
        animate={{ x: [burst.x, burst.x + petal.dx * .55, burst.x + petal.dx], y: [burst.y, burst.y - petal.rise, burst.y + petal.drift], opacity: [0, 1, 0], scale: [.3, 1, .65], rotate: [0, petal.spin * .4, petal.spin] }}
        transition={{ duration: 2.3 + index * .025, ease: "easeOut" }}
        onAnimationComplete={index === burst.petals.length - 1 ? () => setBursts(previous => previous.filter(item => item.id !== burst.id)) : undefined}
      />))}
    </div>, document.body)}
  </section>;
}
