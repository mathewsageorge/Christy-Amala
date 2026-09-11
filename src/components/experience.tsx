"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { wedding } from "@/config/wedding";
import { MusicController, type MusicStatus } from "@/lib/music-controller";

const idleSubscribe = () => () => {};
const serverMusic = (): MusicStatus => wedding.music.src ? "off" : "unavailable";
const OPENED_KEY = "ca-invitation-opened-royal";

export function Experience() {
  const dialog = useRef<HTMLDialogElement>(null);
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
  }, []);

  const open = useCallback(() => {
    if (opening) return;
    audio.current?.open(); // Call within the guest gesture; autoplay is never assumed.
    try { sessionStorage.setItem(OPENED_KEY, "yes"); } catch { /* Works with storage disabled. */ }
    setOpening(true);
    document.documentElement.classList.add("invitation-entering");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Transition completion closes the curtain; this timer is a no-animation fallback.
    timers.current.push(setTimeout(finishOpening, reduced ? 180 : 3400));
  }, [opening, finishOpening]);

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
  }, []);

  const label = status === "playing" ? "Music on" : status === "loading" ? "Loading music" : status === "resume" ? "Tap to resume music" : status === "unavailable" ? "Music unavailable" : "Music off";
  return <>
    <dialog ref={dialog} open className={`invitation-gate ${opening ? "is-opening" : ""}`} aria-labelledby="gate-title" onCancel={event => { event.preventDefault(); open(); }} onTransitionEnd={event => {
      if (!opening) return;
      const panelFinished = event.propertyName === "transform" && (event.target as HTMLElement).classList.contains("curtain-right");
      const reducedFinished = event.target === dialog.current && event.propertyName === "opacity";
      if (panelFinished || reducedFinished) finishOpening();
    }}>
      <div className="gate-scenery" aria-hidden="true"><div className="gate-veil"/>
        <div className="curtain-panel curtain-left"/><div className="curtain-panel curtain-right"/>
      </div>
      <div className="gate-content">
        <p className="gate-prelude">With joyful hearts</p>
        <div className="royal-invitation">
          <div className="royal-card">
            <div className="royal-card-content">
              <p className="gate-kicker">The wedding of</p>
              <h2 id="gate-title"><span>Christy</span><i>&</i><span>Amala</span></h2>
              <p className="gate-date">{wedding.dateShort}</p>
              <form method="dialog" onSubmit={event => { event.preventDefault(); open(); }}><button className="open-button" type="submit" autoFocus disabled={opening}><span>Open invitation</span><span className="open-arrow" aria-hidden="true">⟶</span></button></form>
              <p className="gate-note">A lifetime begins.</p>
            </div>
          </div>
        </div>
        <p className="gate-location">{wedding.place}</p>
      </div>
    </dialog>
    <nav className="bottom-nav" aria-label="Celebration quick links">
      <a href="#ceremony"><span aria-hidden="true" className="nav-index">01</span>Ceremony</a>
      <a href="#reception"><span aria-hidden="true" className="nav-index">02</span>Reception</a>
      <a href="#rsvp">RSVP</a>
      <button className="music-control" onClick={() => { if (status === "unavailable") { setHint(!hint); } else audio.current?.toggle(); }} aria-label={status === "playing" ? "Pause music" : label} aria-pressed={status === "playing"} aria-describedby={hint ? "music-hint" : undefined}>
        <span className={`music-bars ${status === "playing" ? "is-playing" : ""}`} aria-hidden="true"><i/><i/><i/><i/></span>
        <span className="music-label">{status === "unavailable" ? "Music off" : label}</span>
      </button>
      {hint && <p id="music-hint" className="music-hint" role="status">Music isn’t available just yet.</p>}
    </nav>
  </>;
}
