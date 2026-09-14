"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAnimate } from "motion/react";
import { wedding } from "@/config/wedding";
import { MusicController, type MusicStatus } from "@/lib/music-controller";

const idleSubscribe = () => () => {};
const serverMusic = (): MusicStatus => wedding.music.src ? "off" : "unavailable";
const OPENED_KEY = "ca-invitation-opened-ribbon";

export function Experience() {
  const [dialog, animate] = useAnimate<HTMLDialogElement>();
  const started = useRef(false);
  const audio = useRef<MusicController | null>(null);
  const [controller, setController] = useState<MusicController | null>(null);
  const [opening, setOpening] = useState(false);
  const [hint, setHint] = useState(false);
  const finishing = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const status = useSyncExternalStore(controller?.subscribe ?? idleSubscribe, controller?.getSnapshot ?? serverMusic, serverMusic);

  const finishOpening = useCallback(() => {
    if (finishing.current) return;
    finishing.current = true;
    timers.current.forEach(clearTimeout);
    dialog.current?.close();
    document.documentElement.classList.remove("invitation-locked");
    document.getElementById("couple-names")?.focus({ preventScroll: true });
  }, [dialog]);

  const open = useCallback(() => {
    if (started.current) return;
    started.current = true;
    audio.current?.open(); // Keep playback inside the guest gesture.
    try { sessionStorage.setItem(OPENED_KEY, "yes"); } catch { /* Optional preference. */ }
    setOpening(true);
    document.documentElement.classList.add("invitation-entering");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // A guest can still enter if animation support fails or is interrupted.
    timers.current.push(setTimeout(finishOpening, reduced ? 250 : 2900));
    void (async () => {
      try {
        if (reduced) {
          await animate(dialog.current, { opacity: 0 }, { duration: .15 });
        } else {
          const travel = Math.max(window.innerWidth, 750);
          await animate([
            [".ribbon-hint", { opacity: 0, y: 6 }, { duration: .2, at: 0 }],
            [".ribbon-knot", { scaleX: [1, 1.1, .6], scaleY: [1, .85, .25], opacity: [1, 1, 0] }, { duration: .55, at: 0, ease: "easeInOut" }],
            [".ribbon-left", { x: [0, -25, -travel], y: [0, -8, -45], rotate: [0, -4, -14], scaleY: [1, .85, .45] }, { duration: 1.35, at: .22, ease: [.42, 0, .16, 1] }],
            [".ribbon-right", { x: [0, 30, travel], y: [0, 12, 60], rotate: [0, 5, 17], scaleY: [1, .8, .4] }, { duration: 1.4, at: .3, ease: [.42, 0, .16, 1] }],
            [".ribbon-card", { scale: [1, 1.025, 1.075], y: [0, 0, -24], opacity: [1, 1, 0] }, { duration: 1.05, at: 1.05, times: [0, .25, 1], ease: [.25, .6, .2, 1] }],
            [".gate-peripheral", { opacity: 0 }, { duration: .4, at: .35 }],
            [".gate-wash", { opacity: 0 }, { duration: .9, at: 1.2 }],
          ]);
        }
      } catch { /* The native invitation remains usable if motion fails. */ }
      finishOpening();
    })();
  }, [animate, dialog, finishOpening]);

  useEffect(() => {
    const music = new MusicController(wedding.music.src, wedding.music.volume);
    audio.current = music;
    const frame = requestAnimationFrame(() => setController(music));
    // A guest may submit the native form before hydration. Preserve that entry.
    let opened = dialog.current?.open === false;
    try { opened = opened || sessionStorage.getItem(OPENED_KEY) === "yes"; if (opened) sessionStorage.setItem(OPENED_KEY,"yes"); } catch { /* Best effort session preference. */ }
    // SSR supplies a native, immediately usable form. Upgrade its nonmodal dialog
    // to a modal only after hydration; form method=dialog still works without JS.
    dialog.current?.close();
    if (!opened && dialog.current) {
      dialog.current.showModal();
      document.documentElement.classList.add("invitation-locked");
    }
    const activeTimers = timers.current;
    return () => {
      music.dispose(); cancelAnimationFrame(frame); activeTimers.forEach(clearTimeout);
      document.documentElement.classList.remove("invitation-locked");
    };
  }, [dialog]);

  const label = status === "playing" ? "Music on" : status === "loading" ? "Loading music" : status === "resume" ? "Tap to resume music" : status === "unavailable" ? "Music unavailable" : "Music off";
  return <>
    <dialog ref={dialog} open className={`invitation-gate ${opening ? "is-opening" : ""}`} aria-labelledby="gate-title" onCancel={event => { event.preventDefault(); open(); }}>
      <div className="gate-wash" aria-hidden="true"/>
      <div className="gate-content">
        <p className="gate-prelude gate-peripheral">A little knot. A beautiful beginning.</p>
        <div className="ribbon-card">
          <div className="ribbon-card-heading">
            <p className="gate-kicker">Together, forever</p>
            <h2 id="gate-title"><span>Christy</span><i>&</i><span>Amala</span></h2>
          </div>
          <div className="ribbon-wrap" aria-hidden="true">
            <div className="ribbon-layer ribbon-left"/>
            <div className="ribbon-layer ribbon-right"/>
            <div className="ribbon-layer ribbon-knot"/>
          </div>
          <form className="ribbon-form" method="dialog" onSubmit={event => { event.preventDefault(); open(); }}>
            <button className="ribbon-button" type="submit" autoFocus disabled={opening} aria-label="Click here to open invitation"><span className="ribbon-hint">Click here to open invitation <span aria-hidden="true">⟶</span></span></button>
          </form>
          <p className="gate-date">{wedding.dateShort}</p>
        </div>
        <p className="gate-location gate-peripheral">{wedding.place}</p>
      </div>
    </dialog>
    <nav className="bottom-nav" aria-label="Celebration quick links">
      <a href="#ceremony"><span aria-hidden="true" className="nav-index">01</span>Ceremony</a>
      <a href="#reception"><span aria-hidden="true" className="nav-index">02</span>Reception</a>
      <a href="#rsvp">RSVP</a>
      <button className="music-control" onClick={() => { if (status === "unavailable") { setHint(!hint); } else audio.current?.toggle(); }} aria-label={status === "playing" ? "Pause music" : label} aria-pressed={status === "playing"} aria-describedby={hint ? "music-hint" : undefined}>
        <span className={`music-bars ${status === "playing" ? "is-playing" : ""}`} aria-hidden="true"><i/><i/><i/><i/></span>
        <span className="music-label">{status === "playing" ? "Music on" : status === "loading" ? "Loading…" : "Music off"}</span>
      </button>
      {hint && <p id="music-hint" className="music-hint" role="status">Music isn’t available just yet.</p>}
    </nav>
  </>;
}
