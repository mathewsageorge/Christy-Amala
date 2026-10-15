"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { wedding } from "@/config/wedding";
import { Reveal } from "@/components/reveal";
import { sendRsvp } from "@/lib/rsvp";

export function Rsvp() {
  const [attending, setAttending] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const busy = useRef(false);
  const guestInput = useRef<HTMLInputElement>(null);
  const confirmation = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (state === "saved") confirmation.current?.focus(); }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    if (!name) {
      const field = form.elements.namedItem("name") as HTMLInputElement;
      field.setCustomValidity("Please enter your name."); field.reportValidity(); return;
    }
    busy.current = true; setState("sending");
    try {
      await sendRsvp(wedding.rsvp.endpoint, {
        name, phone: String(data.get("phone") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        attending: attending === "Yes" ? "Yes" : "No",
        guests: attending === "Yes" ? Number(data.get("guests")) : 0,
        message: String(data.get("message") ?? "").trim(),
      });
      setState("saved");
    } catch {
      // No automatic retry: the supplied script appends on every request.
      setState("error");
    } finally { busy.current = false; }
  }

  return <section className="rsvp section" id="rsvp" aria-labelledby="rsvp-title">
    <Reveal className="rsvp-layout">
      <header className="rsvp-intro">
        <p className="eyebrow">The pleasure of your company</p>
        <h2 id="rsvp-title">A seat for you.<br/><em>A joy for us.</em></h2>
        <p>We would love to celebrate with you.<br/>Let us know if you can join us.</p>
        <div className="rsvp-date"><span>03</span><div>January 2027<small>Sunday · Pathanamthitta</small></div></div>
        <p className="rsvp-signature">{wedding.couple.groom} <i>&</i> {wedding.couple.bride}</p>
      </header>
      <div className={"rsvp-card " + (state === "saved" ? "is-confirmed" : "")}>
        <div className="rsvp-card-heading"><span className="eyebrow">Kindly reply</span><span aria-hidden="true">C <i>&</i> A</span></div>
        {state === "saved" ? <div className="rsvp-success"><div className="rsvp-confetti" aria-hidden="true">{Array.from({ length: 32 }, (_, index) => <i key={index} style={{ "--x": (12 + index * 31 % 78) + "%", "--drift": ((index % 2 ? 1 : -1) * (18 + index * 13 % 58)) + "px", "--spin": (180 + index * 47) + "deg", "--delay": (index % 8 * 65) + "ms", "--duration": (2100 + index % 5 * 180) + "ms", "--foil": ["#b69759", "#d9c48e", "#eee1c5", "#875566"][index % 4] } as CSSProperties}/>)}</div><span aria-hidden="true">✓</span><h3 ref={confirmation} tabIndex={-1}>Your reply is with us.</h3><p>{attending === "Yes" ? "We can’t wait to celebrate with you!" : "You’ll be with us in spirit. Thank you for letting us know."}</p></div> :
          <form className="rsvp-form" onSubmit={submit}>
            <fieldset className="rsvp-fields" aria-busy={state === "sending"} disabled={state === "sending"}>
              <legend className="sr-only">Your RSVP</legend>
              <fieldset className="attendance-group rsvp-wide">
                <legend>Will you be joining us? <span>(required)</span></legend>
                <div className="attendance-options">
                  {[{ value: "Yes", title: "Joyfully accepts", note: "I’ll be there" }, { value: "No", title: "Regretfully declines", note: "With you in spirit" }].map(option => <label className="attendance-choice" key={option.value}>
                    <input type="radio" name="attending" value={option.value} required checked={attending === option.value} onChange={event => setAttending(event.target.value)}/>
                    <span className="choice-indicator" aria-hidden="true"/>
                    <span className="choice-copy"><strong>{option.title}</strong><span>{option.note}</span></span>
                  </label>)}
                </div>
              </fieldset>
              <label className="rsvp-wide" htmlFor="rsvp-name">Your name <span>(required)</span><input id="rsvp-name" name="name" autoComplete="name" required maxLength={120} placeholder="First and last name" onInput={event => event.currentTarget.setCustomValidity("")} /></label>
              {attending === "Yes" && <div className="rsvp-wide guest-count"><label htmlFor="rsvp-guests">Number attending, including you</label><span className="guest-stepper"><button type="button" aria-label="One fewer guest" onClick={() => guestInput.current?.stepDown()}>−</button><input ref={guestInput} id="rsvp-guests" name="guests" type="number" inputMode="numeric" min={1} max={50} step={1} defaultValue={1} required/><button type="button" aria-label="One more guest" onClick={() => guestInput.current?.stepUp()}>+</button></span></div>}
              <label htmlFor="rsvp-phone">Phone <span>(optional)</span><input id="rsvp-phone" name="phone" type="tel" autoComplete="tel" maxLength={40}/></label>
              <label htmlFor="rsvp-email">Email <span>(optional)</span><input id="rsvp-email" name="email" type="email" autoComplete="email" maxLength={254}/></label>
              <label className="rsvp-wide" htmlFor="rsvp-message">A little note for us <span>(optional)</span><textarea id="rsvp-message" name="message" rows={2} maxLength={2000} placeholder="Leave us a wish…"/></label>
              <button type="submit" className="rsvp-button rsvp-wide">{state === "sending" ? "Sending your reply…" : "Send my RSVP"}{state === "sending" ? <span className="rsvp-spinner" aria-hidden="true"/> : <span aria-hidden="true">↗</span>}</button>
              <p className="rsvp-note rsvp-wide">Your reply and any contact details you share will be saved in our private Google Sheet to help us plan the celebration.</p>
            </fieldset>
            <p className="rsvp-progress" role="status" aria-live="polite">{state === "sending" ? "Saving your reply. Please keep this page open…" : ""}</p>
            {state === "error" && <p className="rsvp-error" role="alert">We couldn’t confirm that your reply was saved. Your details are still here. Please check with the couple before sending again, as your first reply may have arrived. <a href="#contact">Give us a call</a>.</p>}
            <noscript><p>Please enable JavaScript to send your RSVP.</p></noscript>
          </form>}
      </div>
    </Reveal>
  </section>;
}
