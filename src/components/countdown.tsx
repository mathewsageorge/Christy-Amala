"use client";

import { useEffect, useState } from "react";
import { remainingTime } from "@/lib/calendar";

export function Countdown() {
  const [time, setTime] = useState<ReturnType<typeof remainingTime> | null>(null);
  useEffect(() => {
    const update = () => setTime(remainingTime(Date.now()));
    const frame = requestAnimationFrame(update);
    const interval = setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => { cancelAnimationFrame(frame); clearInterval(interval); document.removeEventListener("visibilitychange", update); };
  }, []);
  if (!time) return <p className="countdown-fallback">Until we celebrate together.</p>;
  if (time.started) return <p className="countdown-fallback celebratory" role="status">The day is here.<br/><em>Let the celebration begin!</em></p>;
  return <div className="countdown" role="timer" aria-label="Time until the wedding ceremony">
    {(["days", "hours", "minutes", "seconds"] as const).map(unit => <div key={unit}><span className="countdown-value">{String(time[unit]).padStart(2,"0")}</span><span className="countdown-unit">{unit}</span></div>)}
  </div>;
}
