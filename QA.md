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

## Send some love

- Added a heart button beneath the couple photograph. A tap fills and pulses the heart, releases 20 blush rose petals, and displays a thank-you message. Repeated taps create another burst, capped at two concurrent bursts.
- Production build (including TypeScript) and ESLint passed for this addition.
- Browser verified pointer and Enter-key activation, repeat activation, 20 particle elements on activation, and removal of the overlay after the animation. No browser console errors were observed.
- Inspected the visible petal burst and 390 × 844 mobile layout. No horizontal overflow was detected at 390px or the default preview width.
- Reduced-motion handling was inspected in code: it skips particle creation and CSS disables the pulse. Physical OS preference testing remains outstanding.
- This is a local visual interaction. It sends no messages, stores no reaction count, and makes no RSVP or Google Sheet requests. No new live RSVP test was sent.

## Contained gold-petal replacement

- Removed Send some love, its heart button, thank-you text, and full-screen particle portal.
- Added a gold C&A monogram interlude below the portrait. Eighteen champagne-tinted petals fall in two clipped side lanes; the central lettering and adjacent sections have reserved clear space.
- Motion starts on entering view and finishes within five seconds, replaying on re-entry. Reduced-motion CSS hides the particles. The entire decoration is non-interactive and hidden from assistive technology.
- Production build and TypeScript passed. Browser verified the old button is absent, the new in-view animation starts, and gold petals are visible. At 390px the page has no horizontal overflow. The portrait, decoration and scripture have separate non-overlapping bounds, and each particle lane clips its contents. No RSVP request was made.

## Petal removal

Removed the falling petals and the decorative C&A interlude at the user's request. The hero now leads directly into the scripture section. Removed the component and its animation styles. Production build and TypeScript passed; the exported HTML contains neither the petal section nor the prior Send some love button.

## 13 September client revisions

- Changed the opening button and accessible label to Click here to open invitation; the existing ribbon animation is preserved.
- Added Mr./Mrs. before all four parent names, retaining Dr. Christy and Dr. Amala in the family introductions.
- Added Best wishes from Cripa Elsa Bikash in the closing section.
- Added the supplied Bikash Babu and Christy Abraham Bikash numbers at the bottom as named tel links, using India's +91 prefix.
- Production build and TypeScript passed. Export content checks verified every requested name, title, button label and both exact call targets. Browser inspected opening text, best-wishes and contact layout at 390 × 844; no horizontal overflow. Call links were inspected without placing calls. No live RSVP submission was made.

## Replacement portrait and contact heading

- Changed the contact heading to Give us a Call.
- Replaced the original couple photo with the supplied Picsart_26-02-07_20-00-55-935.jpg. Preserved the JPEG and optimized a 1200 × 2131 WebP with a new filename to avoid stale photo caching; removed the old WebP.
- Production build and TypeScript passed. At 390 × 844, browser inspection confirmed the new image loaded at 1200px natural width, both faces remain clear within the existing arch, the new contact heading is visible, and there is no horizontal overflow.

## Invitation animation suite

- Added a single gold reflection clipped inside the couple names after opening. The names return to their burgundy finish.
- The new portrait reveals progressively inside its arch when it enters view. The date fades in with a drawn gold underline.
- Reworked section reveals into short staggered entrances, including RSVP and contacts. They wait until the invitation cover closes, observe elements individually, and play once per page load.
- RSVP and call actions have contained inset glows on hover/focus and a gentle press response. No particles or page-wide overlays were added.
- Reduced-motion preferences skip reveals and disable shimmer/movement. A preference change cancels running reveal animations. Keyboard focus cancels current animation; already-focused content is not animated. Observers and animations clean up when unmounted. Content remains visible without JavaScript or animation support.
- Production build and TypeScript passed before browser QA. Browser verified a fresh invitation cover, no photo reveal behind it, then the gold shimmer and active date fade after opening. Inspected the partial arched reveal and final fully visible portrait, settled underline and finished shimmer. No horizontal overflow at desktop width; inspected mobile RSVP layout at 390 × 844. No call was placed and no RSVP submitted.
- Final rebuild passed after the keyboard-focus guard. Script-stripped export fixture verified native opening, fully visible portrait and burgundy names, zero scripts, and no horizontal overflow at 390px.

## RSVP stationery redesign

- Replaced the full-width form with a two-column editorial introduction and an ivory reply card. Mobile stacks the introduction and card, with full-width attendance options at narrow widths.
- Replaced the attendance dropdown with native required radio cards, retaining keyboard controls and an explicit selected state. Acceptance reveals the required guest count (default/minimum 1); declining hides it and keeps the existing zero-guest payload behavior.
- Preserved name/contact/note fields, the Apps Script endpoint, busy guard, confirmed-save requirement, retained values on failure, and no automatic retries. Restyled the confirmation state and added a call link to the existing uncertain-save message.
- Production build, TypeScript and all 12 existing tests passed. Browser inspected 1440 × 1000 and 390 × 844; mobile has no horizontal overflow. Verified accepting, keyboard-switching to decline, and guest-count visibility. Empty-name submission was blocked by native validation with focus on the name field; no live RSVP was sent. Browser console contained no errors.

## Mobile refinement — 14 September 2026

Adjusted opening card sizing to viewport height, kept peripheral text in normal flow, enlarged mobile labels, balanced section spacing and headings, stacked RSVP choices, and equalized bottom navigation. Browser checked at 320×568, 360×640, 390×844, 430×932, 844×390 and 1440×1000: no horizontal overflow in measured headings, controls or page. Visually inspected opening at 320/390/430, RSVP at 320 and venues at 390. Opening works in portrait and short landscape; short landscape scrolls vertically. No live RSVP submitted. Physical devices and OS text enlargement not tested. Production build and TypeScript passed.

New generated sharing artwork is 1200×630 JPEG, 79,362 bytes. OG and Twitter metadata use the public Vercel URL and new image filename. PNG fallback refreshed. Changes require Git push and Vercel deployment before public guests see them.

## Subtle motion update — 14 September 2026

Added once-per-visit section warmth, centre-out gold divider lines, and contained background glow. Softened portrait reveal to opacity plus a 2.5% settling zoom. Headings rise 8px; event title, date, time, venue and actions reveal individually. Extended tap feedback to directions, calendars, discovery, music and navigation. Monogram receives one passing gold highlight on invitation opening. Effects wait for cover dismissal, do not intercept pointer events, and respect reduced motion; changing that preference disconnects observers and restores visible content. No continuous scroll handler or new dependency.

Production build/TypeScript and static asset/calendar verification passed. Browser inspection at 390px confirmed section classes, colour endpoints, divider/glow animations, no horizontal overflow and no console errors. RSVP submission was not exercised. Reduced-motion handling reviewed in code, not emulated on a physical device.
