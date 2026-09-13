import Image from "next/image";
import { wedding, mapLink } from "@/config/wedding";
import { Experience } from "@/components/experience";
import { Reveal } from "@/components/reveal";
import { Countdown } from "@/components/countdown";
import { Rsvp } from "@/components/rsvp";

function Flourish({ light = false }: { light?: boolean }) {
  return <svg className={`flourish ${light ? "light" : ""}`} width="154" height="42" viewBox="0 0 154 42" fill="none" aria-hidden="true"><path d="M1 23h44c16 0 21-17 11-17-13 0-5 27 20 27S109 6 97 6c-11 0-6 17 11 17h45M60 23c7-13 16-16 17-16s10 3 17 16" stroke="currentColor" strokeWidth=".8"/></svg>;
}

function Arrow() { return <span aria-hidden="true" className="action-arrow">↗</span>; }

export default function Home() {
  return <>
    <a className="skip-link" href="#celebration">Skip to event details</a>
    <header className="masthead"><a className="monogram" href="#invitation" aria-label="Christy and Amala, invitation">C <i>&</i> A</a><span className="eyebrow">A celebration of love</span><a className="header-date" href="#celebration">{wedding.dateNumeric}</a></header>
    <main id="invitation">
      <section className="hero" aria-labelledby="couple-names">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker">Together with our families</p>
          <h1 id="couple-names" tabIndex={-1}><span className="name-mask"><span>{wedding.couple.groom}</span></span><i>&</i><span className="name-mask"><span>{wedding.couple.bride}</span></span></h1>
          <p className="invitation-line">{wedding.invitation}</p>
          <div className="hero-date"><span>{wedding.date}</span><span>{wedding.place}</span></div>
          <a className="discover" href="#families"><span>Discover the celebration</span><span aria-hidden="true">↓</span></a>
        </div>
        <figure className="hero-portrait"><div className="portrait-frame"><Image src={wedding.photo.src} width={wedding.photo.width} height={wedding.photo.height} alt={wedding.photo.alt} sizes="(max-width: 760px) 85vw, 43vw" priority /></div><figcaption><span>{wedding.couple.names}</span><span>{wedding.dateNumeric}</span></figcaption></figure>
      </section>
      <section className="scripture" aria-label="Our wedding scripture"><Reveal><blockquote><p>{wedding.verse.text}</p><cite><a href={wedding.verse.source} target="_blank" rel="noopener noreferrer" title={wedding.verse.translation}>{wedding.verse.reference}</a></cite></blockquote></Reveal></section>
      <section className="families section" id="families" aria-labelledby="families-title"><Reveal><p className="eyebrow">Our families</p><h2 id="families-title">With love & blessings</h2><div className="family-grid">{wedding.families.map(family=><article key={family.name}><p className="eyebrow">{family.role}</p><h3>{family.name}</h3><p>{family.relation}<br/><strong>{family.parents}</strong></p><p className="family-address">{family.address}</p></article>)}</div><Flourish/></Reveal></section>
      <section className="celebration section" id="celebration" aria-labelledby="celebration-title">
        <div className="celebration-inner">
          <Reveal><div className="section-heading"><div><p className="eyebrow">The celebration</p><h2 id="celebration-title">A day to remember.<br/><em>A joy to share.</em></h2></div><p className="celebration-date">{wedding.date}<br/><span>All times in India · IST</span></p></div></Reveal>
          {[wedding.ceremony,wedding.reception].map((event,index)=><Reveal key={event.id}><article className="event" id={event.id} aria-labelledby={`${event.id}-title`}>
            <div className="event-name"><span className="event-number">0{index+1}</span><h3 id={`${event.id}-title`}>{event.title}</h3><p className="event-date">{wedding.date}</p><p className="event-time">{event.time}</p></div>
            <div className="event-details"><p className="venue-name">{event.venue}</p><p className="venue-address">{event.address}</p><div className="event-actions"><a href={mapLink(event)} target="_blank" rel="noopener noreferrer" className="text-action" aria-label={`Get directions to ${event.venue}`}>Get directions<Arrow/></a><a href={`/calendar/${event.id}.ics`} download={`christy-amala-${event.id}.ics`} className="calendar-action" aria-label={`Add ${event.title.toLowerCase()} to calendar`}><svg width="17" height="18" viewBox="0 0 20 21" fill="none" aria-hidden="true"><rect x="2" y="4" width="16" height="15" rx="1" stroke="currentColor"/><path d="M6 1v6m8-6v6M2 9h16M7 13h6m-3-3v6" stroke="currentColor"/></svg><span>Add to calendar</span></a></div></div>
          </article></Reveal>)}
          <p className="calendar-both"><a href="/calendar/all.ics" download="christy-amala-wedding.ics">Save the celebration to your calendar <span aria-hidden="true">↓</span></a></p>
        </div>
      </section>
      <section className="anticipation section" aria-labelledby="countdown-title"><Reveal><p className="eyebrow">A moment to look forward to</p><h2 id="countdown-title">Counting the days<br/><em>until we celebrate.</em></h2><Countdown/><p className="countdown-date">{wedding.dateShort} <span aria-hidden="true">·</span> {wedding.ceremony.time} IST</p></Reveal></section>
      <Rsvp/>
      <section className="closing section" aria-labelledby="closing-title"><Reveal><Flourish light/><h2 id="closing-title">{wedding.closing}</h2><p className="with-love">With love,</p><p className="closing-names">{wedding.couple.names}</p><p className="eyebrow closing-date">{wedding.date}</p><div className="best-wishes"><p>Best wishes from</p><p className="best-wishes-name">{wedding.bestWishes}</p></div><div className="closing-monogram" aria-hidden="true">C <i>&</i> A</div></Reveal></section>
      <section className="wedding-contact" id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">For any assistance</h2>
        <div className="contact-list">{wedding.contacts.map(contact => <a key={contact.phone} href={`tel:${contact.phone}`} aria-label={`Call ${contact.name} on ${contact.displayPhone}`}><span className="contact-name">{contact.name}</span><span className="contact-number">{contact.displayPhone}</span></a>)}</div>
      </section>
    </main>
    <footer className="footer"><span>{wedding.couple.names}</span><span>{wedding.dateNumeric}</span></footer>
    <Experience/>
  </>;
}
