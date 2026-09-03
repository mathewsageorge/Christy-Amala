'use client';

import {
  type CSSProperties,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

const weddingDate = new Date('2027-01-03T16:00:00+05:30').getTime();
const calendarEvent = `data:text/calendar;charset=utf-8,${encodeURIComponent(`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:20270103T160000\nDTEND:20270103T213000\nSUMMARY:Wedding of Christy & Amala\nLOCATION:St. Peter's Malankara Syrian Catholic Cathedral\, Pathanamthitta\nDESCRIPTION:Wedding ceremony at 4:00 PM. Reception at St. Peter's Auditorium\, Saint Peters Junction\, Chittoor\, Pathanamthitta\, Kerala 689645 from 6:00 PM to 9:30 PM.\nEND:VEVENT\nEND:VCALENDAR`)}`;
const celebrationParticles = Array.from({ length: 22 }, (_, index) => ({
  left: `${(index * 37 + 4) % 96}%`,
  delay: `${(index % 7) * 0.11}s`,
  duration: `${2.1 + (index % 5) * 0.16}s`,
  drift: `${(index % 2 ? 1 : -1) * (22 + (index % 4) * 9)}px`,
  symbol: index % 4 === 0 ? '♡' : index % 3 === 0 ? '✦' : '✦',
}));
const ambientPetals = Array.from({ length: 15 }, (_, index) => ({
  left: `${(index * 29 + 3) % 98}%`,
  delay: `${(index % 8) * -1.25}s`,
  duration: `${10 + (index % 5) * 1.8}s`,
  drift: `${index % 2 ? 38 : -32}px`,
  symbol: index % 3 === 0 ? '♡' : '✦',
}));

function Countdown() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, weddingDate - Date.now());
      setTime({
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining / 3600000) % 24),
        minutes: Math.floor((remaining / 60000) % 60),
        seconds: Math.floor((remaining / 1000) % 60),
      });
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);
  return (
    <div className="countdown" aria-label="Countdown to the wedding">
      {Object.entries(time).map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [attendance, setAttendance] = useState('yes');
  const [rsvpStatus, setRsvpStatus] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [showCelebration, setShowCelebration] = useState(false);
  const [rsvpGuestName, setRsvpGuestName] = useState('');
  const [showLoveNote, setShowLoveNote] = useState(false);
  const [tapSparkles, setTapSparkles] = useState<
    Array<{ id: number; left: number; top: number }>
  >([]);
  const heroPhotoRef = useRef<HTMLDivElement>(null);
  const sparkleTimers = useRef<number[]>([]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let resumeOnReturn = false;
    const attemptPlay = () =>
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    const handleVisibility = () => {
      if (document.hidden) {
        resumeOnReturn = !audio.paused;
        audio.pause();
        setIsPlaying(false);
      } else if (resumeOnReturn) {
        resumeOnReturn = false;
        attemptPlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && entry.target.classList.add('is-visible'),
        ),
      { threshold: 0.16 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [isInvitationOpen]);

  useEffect(
    () => () => sparkleTimers.current.forEach((timer) => window.clearTimeout(timer)),
    [],
  );

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused)
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const openInvitation = () => {
    const audio = audioRef.current;
    setIsInvitationOpen(true);
    if (audio)
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
  };

  const addTapSparkle = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isInvitationOpen || event.pointerType === 'mouse') return;
    const id = Date.now() + Math.random();
    setTapSparkles((sparkles) => [
      ...sparkles.slice(-11),
      { id, left: event.clientX, top: event.clientY },
    ]);
    sparkleTimers.current.push(
      window.setTimeout(
        () => setTapSparkles((sparkles) => sparkles.filter((sparkle) => sparkle.id !== id)),
        780,
      ),
    );
  };

  const movePhoto = (event: ReactPointerEvent<HTMLDivElement>) => {
    const photo = heroPhotoRef.current;
    if (!photo || event.pointerType === 'touch' && event.isPrimary === false) return;
    const bounds = photo.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    photo.style.setProperty('--photo-tilt-x', `${y * -2.2}deg`);
    photo.style.setProperty('--photo-tilt-y', `${x * 2.2}deg`);
    photo.style.setProperty('--photo-shift-x', `${x * 4}px`);
    photo.style.setProperty('--photo-shift-y', `${y * 4}px`);
  };

  const resetPhoto = () => {
    const photo = heroPhotoRef.current;
    if (!photo) return;
    photo.style.setProperty('--photo-tilt-x', '0deg');
    photo.style.setProperty('--photo-tilt-y', '0deg');
    photo.style.setProperty('--photo-shift-x', '0px');
    photo.style.setProperty('--photo-shift-y', '0px');
  };

  const submitRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setRsvpStatus('submitting');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: '',
          attending: attendance,
          guests: attendance === 'yes' ? formData.get('guestCount') : 0,
          message: formData.get('message'),
        }),
      });
      if (!response.ok) throw new Error('RSVP could not be saved.');
      setRsvpGuestName(String(formData.get('name') || '').trim());
      form.reset();
      setAttendance('yes');
      setRsvpStatus('success');
      setShowCelebration(true);
    } catch {
      setRsvpStatus('error');
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/wedding-music.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isInvitationOpen && (
        <section
          className="invitation-gate"
          aria-label="Wedding invitation cover"
        >
          <div className="gate-content">
            <div className="floating-envelope" aria-hidden="true">
              ✉
            </div>
            <p className="gate-kicker">You are invited</p>
            <h1>
              <span className="gate-name">Christy</span>{' '}
              <span>&amp;</span> <span className="gate-name">Amala</span>
            </h1>
            <div className="gate-rule">✦</div>
            <p className="gate-note">A beautiful beginning awaits.</p>
            <button
              className="open-invitation"
              type="button"
              onClick={openInvitation}
            >
              <span>✦</span> Open the invitation
            </button>
          </div>
        </section>
      )}
      <main
        className={`site-content${isInvitationOpen ? ' is-open' : ''}`}
        onPointerDown={addTapSparkle}
      >
        <div className="ambient-petals" aria-hidden="true">
          {ambientPetals.map((petal, index) => (
            <span
              key={index}
              style={
                {
                  '--petal-left': petal.left,
                  '--petal-delay': petal.delay,
                  '--petal-duration': petal.duration,
                  '--petal-drift': petal.drift,
                } as CSSProperties
              }
            >
              {petal.symbol}
            </span>
          ))}
        </div>
        <div className="tap-sparkles" aria-hidden="true">
          {tapSparkles.map((sparkle) => (
            <span
              key={sparkle.id}
              style={{ left: sparkle.left, top: sparkle.top }}
            >
              ✦
            </span>
          ))}
        </div>
        <button
          className="music-toggle"
          type="button"
          onClick={toggleMusic}
          aria-label={
            isPlaying ? 'Pause background music' : 'Play background music'
          }
        >
          {isPlaying ? '❚❚ Pause music' : '▶ Play music'}
        </button>
        <nav className="nav" aria-label="Main navigation">
          <a className="nav-mark" href="#top">
            C <span>♡</span> A
          </a>
          <div className="nav-links">
            <a href="#celebration">Celebrate with us</a>
            <a href="#details">The details</a>
            <a href="#families">Our families</a>
            <a href="#rsvp">RSVP</a>
          </div>
        </nav>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">
              With joyful hearts, we invite you to celebrate
            </p>
            <p className="date-line">Sunday · 03 January 2027</p>
            <h1>
              Christy <em>&amp;</em> Amala
            </h1>
            <p className="hero-note">Two hearts, one beautiful beginning.</p>
            <a className="button" href="#details">
              Join our celebration <span>↓</span>
            </a>
          </div>
          <div
            className="hero-photo-wrap"
            ref={heroPhotoRef}
            onPointerMove={movePhoto}
            onPointerLeave={resetPhoto}
            onPointerUp={resetPhoto}
          >
            <div className="arch-photo">
              <img src="/christy-amala.jpg" alt="Christy and Amala together" />
            </div>
            <div className="photo-caption">
              Forever starts here <span>✦</span>
            </div>
          </div>
          <div className="hero-blossom" aria-hidden="true">
            ✦
          </div>
        </section>
        <section className="welcome" id="celebration">
          <p className="eyebrow">Save the date</p>
          <h2>
            A day made for love,
            <br />
            <em>faith &amp; celebration.</em>
          </h2>
          <p className="section-intro">
            We would be honoured by your presence as we begin our new life
            together, surrounded by the people we love.
          </p>
          <Countdown />
          <a
            className="calendar-link"
            href={calendarEvent}
            download="christy-amala-wedding.ics"
          >
            Add to calendar <span>+</span>
          </a>
        </section>
        <section className="details" id="details">
          <div className="details-intro">
            <p className="eyebrow">Mark your calendar</p>
            <h2>
              The wedding <em>day</em>
            </h2>
            <p>
              Come share in a beautiful evening of blessings, laughter, and
              love.
            </p>
            <div className="gold-rule">✦</div>
          </div>
          <div className="schedule">
            <article className="schedule-card reveal-on-scroll">
              <div className="card-number">01</div>
              <p className="eyebrow">Wedding ceremony</p>
              <h3>4:00 PM</h3>
              <p className="schedule-date">Sunday, 03 January 2027</p>
              <div className="card-rule" />
              <h4>St. Peter&apos;s Malankara Syrian Catholic Cathedral</h4>
              <p>
                St. Peter&apos;s Junction,
                <br />
                Pathanamthitta
              </p>
              <a
                className="text-link"
                target="_blank"
                rel="noreferrer"
                href="https://www.google.com/maps/search/?api=1&query=St.+Peter%27s+Malankara+Syrian+Catholic+Cathedral%2C+Pathanamthitta"
              >
                Get directions ↗
              </a>
            </article>
            <article className="schedule-card reception reveal-on-scroll">
              <div className="card-number">02</div>
              <p className="eyebrow">Reception</p>
              <h3>6:00–9:30 PM</h3>
              <p className="schedule-date">Following the ceremony</p>
              <div className="card-rule" />
              <h4>St. Peter&apos;s Auditorium</h4>
              <p>
                Saint Peters Junction, Chittoor,
                <br />
                Pathanamthitta, Kerala 689645
              </p>
              <a
                className="text-link"
                target="_blank"
                rel="noreferrer"
                href="https://www.google.com/maps/search/?api=1&query=St.+Peter%27s+Auditorium%2C+Saint+Peters+Junction%2C+Chittoor%2C+Pathanamthitta%2C+Kerala+689645"
              >
                Get directions ↗
              </a>
            </article>
          </div>
        </section>
        <section className="families" id="families">
          <div className="family-heading">
            <p className="eyebrow">Celebrating with our families</p>
            <h2>
              Rooted in <em>love</em>
            </h2>
          </div>
          <div className="family-grid">
            <article>
              <p className="family-label">The groom</p>
              <h3>Christy</h3>
              <p>Son of</p>
              <h4>
                Bikash Babu
                <br />
                &amp; Aswathy Bikash
              </h4>
              <p className="address">
                Kattukallil, Mekozhoor,
                <br />
                Pathanamthitta
              </p>
            </article>
            <button
              className={`family-heart${showLoveNote ? ' is-surprise-open' : ''}`}
              type="button"
              aria-label="A little love note from Christy and Amala"
              aria-expanded={showLoveNote}
              onClick={() => setShowLoveNote((shown) => !shown)}
            >
              <span aria-hidden="true">♡</span>
              {showLoveNote && (
                <span className="love-note" role="status">
                  Made with love by Christy &amp; Amala ✦
                </span>
              )}
            </button>
            <article>
              <p className="family-label">The bride</p>
              <h3>Amala</h3>
              <p>Daughter of</p>
              <h4>
                Binu K. Thomas
                <br />
                &amp; Jisa Binu
              </h4>
              <p className="address">
                Kummannooparambil (Mekat),
                <br />
                Edappally, Ernakulam
              </p>
            </article>
          </div>
        </section>
        <section className="rsvp" id="rsvp">
          <div className="rsvp-intro">
            <p className="eyebrow">Kindly reply</p>
            <h2>
              Will you celebrate <em>with us?</em>
            </h2>
            <p>
              Please let us know if you can join us. Your response will help us
              prepare a warm welcome for everyone.
            </p>
          </div>
          {showCelebration ? (
            <div className="rsvp-success-inline" role="status">
              <div className="rsvp-particles" aria-hidden="true">
                {celebrationParticles.map((particle, index) => (
                  <span
                    key={index}
                    style={
                      {
                        '--particle-left': particle.left,
                        '--particle-delay': particle.delay,
                        '--particle-duration': particle.duration,
                        '--particle-drift': particle.drift,
                      } as CSSProperties
                    }
                  >
                    {particle.symbol}
                  </span>
                ))}
              </div>
              <div className="rsvp-thanks">
                <p className="eyebrow">With grateful hearts</p>
                <div className="thanks-mark" aria-hidden="true">
                  ✦
                </div>
                <h2>Thank you{rsvpGuestName ? `, ${rsvpGuestName}` : ''}!</h2>
                <p>
                  Yay! We saved you a place at the celebration. We are so happy
                  to celebrate this beautiful day with you ✨
                </p>
                <p className="thanks-signoff">With love, Christy &amp; Amala</p>
              </div>
            </div>
          ) : (
            <form
              className={`rsvp-form reveal-on-scroll${rsvpStatus === 'success' ? ' is-complete' : ''}`}
              onSubmit={submitRsvp}
            >
              <div className="rsvp-form-mark" aria-hidden="true">
                C <span>&amp;</span> A
              </div>
              <label>
                Full name
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                />
              </label>
              <label>
                Phone number <span className="optional">optional</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Your phone number"
                />
              </label>
              <fieldset>
                <legend>Will you be attending?</legend>
                <div className="attendance-options">
                  <label>
                    <input
                      type="radio"
                      name="attendance"
                      value="yes"
                      checked={attendance === 'yes'}
                      onChange={() => setAttendance('yes')}
                    />
                    Joyfully accepts
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="attendance"
                      value="no"
                      checked={attendance === 'no'}
                      onChange={() => setAttendance('no')}
                    />
                    Regretfully declines
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="attendance"
                      value="maybe"
                      checked={attendance === 'maybe'}
                      onChange={() => setAttendance('maybe')}
                    />
                    Maybe
                  </label>
                </div>
              </fieldset>
              <label className={attendance === 'yes' ? '' : 'is-disabled'}>
                Number of guests
                <select
                  name="guestCount"
                  defaultValue="1"
                  disabled={attendance !== 'yes'}
                >
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                </select>
              </label>
              <label>
                Your message <span className="optional">optional</span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="A note for the couple"
                />
              </label>
              <button
                className="rsvp-submit"
                type="submit"
                disabled={rsvpStatus === 'submitting'}
              >
                {rsvpStatus === 'submitting'
                  ? 'Sending your reply…'
                  : 'Send RSVP'}{' '}
                <span>✦</span>
              </button>
              <p className={`rsvp-status ${rsvpStatus}`} aria-live="polite">
                {rsvpStatus === 'submitting' &&
                  'One moment — we’re saving your RSVP.'}
                {rsvpStatus === 'error' &&
                  'We could not send your RSVP. Please try again.'}
              </p>
            </form>
          )}
        </section>
        <section className="verse">
          <p className="eyebrow">A blessing for our beginning</p>
          <blockquote>
            “What God has joined together, let no one separate.”
          </blockquote>
          <cite>Matthew 19:6</cite>
        </section>
        <section className="closing">
          <div className="closing-copy">
            <p className="eyebrow">A gentle reminder</p>
            <h2>
              Your presence will make our day <em>complete.</em>
            </h2>
            <p>
              We cannot wait to welcome you and celebrate the beginning of our
              forever.
            </p>
            <a className="button" href="#top">
              Back to top <span>↑</span>
            </a>
          </div>
        </section>
        <footer>
          Made with love for the wedding of <strong>Christy &amp; Amala</strong>{' '}
          <span>✦</span> 03.01.2027
        </footer>
      </main>
    </>
  );
}
