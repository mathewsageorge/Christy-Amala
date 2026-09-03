'use client';

import { useEffect, useRef, useState } from 'react';

const weddingDate = new Date('2027-01-03T16:00:00+05:30').getTime();
const calendarEvent = `data:text/calendar;charset=utf-8,${encodeURIComponent(`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:20270103T160000\nDTEND:20270103T213000\nSUMMARY:Wedding of Christy & Amala\nLOCATION:St. Peter's Malankara Syrian Catholic Cathedral\, Pathanamthitta\nDESCRIPTION:Wedding ceremony at 4:00 PM. Reception at St. Peter's Parish Auditorium from 6:00 PM to 9:30 PM.\nEND:VEVENT\nEND:VCALENDAR`)}`;

function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, weddingDate - Date.now());
      setTime({ days: Math.floor(remaining / 86400000), hours: Math.floor((remaining / 3600000) % 24), minutes: Math.floor((remaining / 60000) % 60), seconds: Math.floor((remaining / 1000) % 60) });
    };
    update(); const interval = window.setInterval(update, 1000); return () => window.clearInterval(interval);
  }, []);
  return <div className="countdown" aria-label="Countdown to the wedding">{Object.entries(time).map(([label, value]) => <div className="countdown-unit" key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>;
}

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let resumeOnReturn = false;
    const attemptPlay = () => audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    const handleVisibility = () => {
      if (document.hidden) { resumeOnReturn = !audio.paused; audio.pause(); setIsPlaying(false); }
      else if (resumeOnReturn) { resumeOnReturn = false; attemptPlay(); }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    else { audio.pause(); setIsPlaying(false); }
  };

  const openInvitation = () => {
    const audio = audioRef.current;
    setIsInvitationOpen(true);
    if (audio) audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  return <>
    <audio ref={audioRef} src="/wedding-music.mp3" loop preload="auto" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
    {!isInvitationOpen && <section className="invitation-gate" aria-label="Wedding invitation cover"><div className="gate-content"><p className="gate-kicker">You are invited</p><h1>Christy <span>&amp;</span> Amala</h1><div className="gate-rule">✦</div><p className="gate-note">A beautiful beginning awaits.</p><button className="open-invitation" type="button" onClick={openInvitation}><span>✦</span> Open the invitation</button></div></section>}
    <main className={`site-content${isInvitationOpen ? ' is-open' : ''}`}>
    <button className="music-toggle" type="button" onClick={toggleMusic} aria-label={isPlaying ? 'Pause background music' : 'Play background music'}>{isPlaying ? '❚❚ Pause music' : '▶ Play music'}</button>
    <nav className="nav" aria-label="Main navigation"><a className="nav-mark" href="#top">C <span>♡</span> A</a><div className="nav-links"><a href="#celebration">Celebrate with us</a><a href="#details">The details</a><a href="#families">Our families</a></div></nav>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">With joyful hearts, we invite you to celebrate</p><p className="date-line">Sunday · 03 January 2027</p><h1>Christy <em>&amp;</em> Amala</h1><p className="hero-note">Two hearts, one beautiful beginning.</p><a className="button" href="#details">Join our celebration <span>↓</span></a></div><div className="hero-photo-wrap"><div className="arch-photo"><img src="/christy-amala.jpg" alt="Christy and Amala together" /></div><div className="photo-caption">Forever starts here <span>✦</span></div></div><div className="hero-blossom" aria-hidden="true">✦</div></section>
    <section className="welcome" id="celebration"><p className="eyebrow">Save the date</p><h2>A day made for love,<br /><em>faith &amp; celebration.</em></h2><p className="section-intro">We would be honoured by your presence as we begin our new life together, surrounded by the people we love.</p><Countdown /><a className="calendar-link" href={calendarEvent} download="christy-amala-wedding.ics">Add to calendar <span>+</span></a></section>
    <section className="details" id="details"><div className="details-intro"><p className="eyebrow">Mark your calendar</p><h2>The wedding <em>day</em></h2><p>Come share in a beautiful evening of blessings, laughter, and love.</p><div className="gold-rule">✦</div></div><div className="schedule"><article className="schedule-card"><div className="card-number">01</div><p className="eyebrow">Wedding ceremony</p><h3>4:00 PM</h3><p className="schedule-date">Sunday, 03 January 2027</p><div className="card-rule" /><h4>St. Peter&apos;s Malankara Syrian Catholic Cathedral</h4><p>St. Peter&apos;s Junction,<br />Pathanamthitta</p><a className="text-link" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=St.+Peter%27s+Malankara+Syrian+Catholic+Cathedral%2C+Pathanamthitta">Get directions ↗</a></article><article className="schedule-card reception"><div className="card-number">02</div><p className="eyebrow">Reception</p><h3>6:00–9:30 PM</h3><p className="schedule-date">Following the ceremony</p><div className="card-rule" /><h4>St. Peter&apos;s Parish Auditorium</h4><p>St. Peter&apos;s Junction,<br />Pathanamthitta</p><a className="text-link" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=St.+Peter%27s+Parish+Auditorium%2C+Pathanamthitta">Get directions ↗</a></article></div></section>
    <section className="families" id="families"><div className="family-heading"><p className="eyebrow">Celebrating with our families</p><h2>Rooted in <em>love</em></h2></div><div className="family-grid"><article><p className="family-label">The groom</p><h3>Christy</h3><p>Son of</p><h4>Bikash Babu<br />&amp; Aswathy Bikash</h4><p className="address">Kattukallil, Mekozhoor,<br />Pathanamthitta</p></article><div className="family-heart" aria-hidden="true">♡</div><article><p className="family-label">The bride</p><h3>Amala</h3><p>Daughter of</p><h4>Binu K. Thomas<br />&amp; Jisa Binu</h4><p className="address">Kummannooparambil (Mekat),<br />Edappally, Ernakulam</p></article></div></section>
    <section className="verse"><p className="eyebrow">A blessing for our beginning</p><blockquote>“What God has joined together, let no one separate.”</blockquote><cite>Matthew 19:6</cite></section>
    <section className="closing"><div className="closing-copy"><p className="eyebrow">A gentle reminder</p><h2>Your presence will make our day <em>complete.</em></h2><p>We cannot wait to welcome you and celebrate the beginning of our forever.</p><a className="button" href="#top">Back to top <span>↑</span></a></div></section>
    <footer>Made with love for the wedding of <strong>Christy &amp; Amala</strong> <span>✦</span> 03.01.2027</footer>
    </main>
  </>;
}
