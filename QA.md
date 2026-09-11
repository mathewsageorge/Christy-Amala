# Verification record

Verified 10–11 September 2026 against the production static export and the local browser preview.

## Completed

- Production build: passed, all page and calendar routes exported.
- ESLint: passed with no errors or warnings.
- TypeScript: passed. `type-check` generates Next.js route types first, so it also works from a clean checkout.
- Twelve automated behavior tests: passed. RSVP checks cover confirmed saves, non-JSON/sign-in responses, server errors and no automatic retry after an uncertain request. Includes calendar timezone/end-time rules, UTF-8 calendar folding, countdown boundary, complete map queries, no autoplay before opening, lifecycle pause/resume, preserved manual pause and mute, blocked playback retry, multiple-tab ownership with Web Locks, and audio error/cleanup.
- Browser layouts checked at 360 × 800, 390 × 844, 430 × 932, and 1440 × 1000. No horizontal overflow was detected. Portrait faces remain visible; long venue names wrap; persistent controls have reserved bottom space.
- Entrance: fresh guest entrance opens, closes, and transfers keyboard focus to the couple's names. Session return/reload does not replay the entrance. The native form can enter before hydration; this choice is preserved once JavaScript loads.
- No-script fixture: removed every script from the actual exported HTML and opened it in the browser. The native opening button closed the curtain successfully; the invitation and event details remained available.
- Directions: two distinct Google Maps search URLs contain each full venue name and address. These are clearly constructed searches, not claimed verified coordinates or venue pins.
- Calendars: all three export files exist. HTTP 200, `text/calendar` and attachment response verified, with correct event contents. The in-app browser's download-event observer timed out, so OS-level file saving was not confirmed through that observer.
- Countdown: ceremony resolves to 03 January 2027 at 10:30 UTC / 16:00 IST. Before, at, and after the boundary are tested; no negative numbers appear.
- Supplied MP3: actual browser playback and manual pause verified, including production export playback through the music control. The audio controller reports playing only after the browser emits its playback event.
- Reduced-motion implementation inspected: simple curtain fade, no hero/image transforms, no looping sound-bar movement, no animated scroll, and section reveals skipped by the media preference.
- All 17 referenced local export assets resolved; the configured MP3 is also included in the export. Canonical and sharing metadata use the configured origin; the 1200 × 630 sharing image was visually inspected.
- Production browser console: no errors observed.

## Still needed before sharing with guests

1. The supplied music is configured. Check actual playback, leaving/returning from another app, manually pausing, blocked resume and two open copies on a physical iPhone/Safari and Android/Chrome. The automated music tests exercise browser-policy scenarios using a controllable audio fixture; they do not substitute for real-device playback of the final file. Physical mobile devices and OS-level reduced-motion settings were not available in this session.
2. Connect the GitHub repository to the intended Vercel account/project, set main as the production branch, and review a Git preview deployment.
3. Set the final public Vercel origin in `src/config/wedding.ts`, redeploy, and verify guest access in a logged-out/private browser. The Sites review copy is private.

These remaining checks depend on physical devices and the hosting account; they are not represented as completed.

## 11 September update

- The royal entrance uses ivory silk and a custom embossed-gold ornamental invitation card. A restrained light sweep plays once across the card. On opening, the card lifts in perspective and fades, followed by silk panels gathering with a slight stagger over about three seconds. Completion follows the CSS transition, with a fallback timer; reduced-motion uses a short fade. Opening and focus transfer were checked in the browser.
- Added 1 Corinthians 13:13 (World English Bible, public domain), with a source link.
- Added the RSVP form and persistent RSVP navigation link. Updated production layouts inspected at 390 × 844 and 1440 × 1000; no horizontal overflow at 360px or 390px.
- Acceptance reveals the guest-count input with minimum 1; decline sends 0. Name/attendance are required, optional phone/email/message are labelled, and input values are retained on failure.
- One real RSVP was sent through the website to the supplied public Apps Script endpoint. The browser read status ok and displayed success. Name: TEST — website connection check — please delete. Attendance No, guests 0, no contact details. The Google Sheet itself was not opened; server acknowledgement is the verification evidence. Remove this test row in the sheet.
- The latest source and ZIP are updated locally. The earlier private Sites deployment has not been republished and GitHub/Vercel push/deployment still requires the user's authenticated terminal/account.

Royal ivory-and-gold entrance revision: production build and ESLint passed. Browser checked at 390 × 844: no overflow, all entrance content fits, opening completes, scroll unlocks, focus moves to the couple names, and the supplied music plays. The session key was versioned so returning reviewers see the redesign once. Reduced motion retains the short fade and the native no-JavaScript opening form remains in place.

Royal artwork and motion: generated one original frame with built-in imagegen and optimized it to a 154 KB WebP. Live HTML names remain readable separately from the artwork. Verified the reveal completes, moves focus to the names, unlocks scrolling, and starts the supplied music in the browser. Reduced motion disables the card arrival, light sweep and perspective effects.

## Current ribbon entrance

- Replaced the curtain and ornate card with modern ivory stationery and transparent champagne satin artwork.
- Motion useAnimate runs the knot release, separate ribbon ends, and final card/overlay fade. No new library was installed; the existing Motion dependency is used. Selectors are scoped to the dialog and animations clean up with the component.
- Opening is guarded against double taps and has a fallback timeout. Reduced-motion requests use only a 150ms fade. The native dialog form still opens with no scripts: verified in the script-stripped export fixture.
- Production build, TypeScript, ESLint, and all 12 existing behavior tests passed. All 17 HTML-referenced export assets resolve; satin-ribbon.webp is included and retains transparency.
- Inspected desktop composition and final 390 × 844 mobile composition. Names, ribbon, action label and date do not overlap. Mobile dialog client height and scroll height both measured 844px.
- Browser ribbon release completed, focused the couple names, unlocked scrolling, and started the supplied music. No additional RSVP test was submitted to the live sheet during this visual revision.
