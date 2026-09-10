# Verification record

Verified 10–11 September 2026 against the production static export and the local browser preview.

## Completed

- Production build: passed, all page and calendar routes exported.
- ESLint: passed with no errors or warnings.
- TypeScript: passed. `type-check` generates Next.js route types first, so it also works from a clean checkout.
- Nine automated behavior tests: passed. Includes calendar timezone/end-time rules, UTF-8 calendar folding, countdown boundary, complete map queries, no autoplay before opening, lifecycle pause/resume, preserved manual pause and mute, blocked playback retry, multiple-tab ownership with Web Locks, and audio error/cleanup.
- Browser layouts checked at 360 × 800, 390 × 844, 430 × 932, and 1440 × 1000. No horizontal overflow was detected. Portrait faces remain visible; long venue names wrap; persistent controls have reserved bottom space.
- Curtain: fresh guest entrance opens, closes, and transfers keyboard focus to the couple's names. Session return/reload does not replay the entrance. The native form can enter before hydration; this choice is preserved once JavaScript loads.
- No-script fixture: removed every script from the actual exported HTML and opened it in the browser. The native opening button closed the curtain successfully; the invitation and event details remained available.
- Directions: two distinct Google Maps search URLs contain each full venue name and address. These are clearly constructed searches, not claimed verified coordinates or venue pins.
- Calendars: all three export files exist. HTTP 200, `text/calendar` and attachment response verified, with correct event contents. The in-app browser's download-event observer timed out, so OS-level file saving was not confirmed through that observer.
- Countdown: ceremony resolves to 03 January 2027 at 10:30 UTC / 16:00 IST. Before, at, and after the boundary are tested; no negative numbers appear.
- Music unavailable state: control and explanatory message work; no audio file or substitute track is fetched.
- Reduced-motion implementation inspected: simple curtain fade, no hero/image transforms, no looping sound-bar movement, no animated scroll, and section reveals skipped by the media preference.
- All 15 referenced local export assets resolved. Canonical and sharing metadata use the configured origin; the 1200 × 630 sharing image was visually inspected.
- Production browser console: no errors observed.

## Still needed before sharing with guests

1. Supply the licensed music file, configure its source and then check actual playback, leaving/returning from another app, manually pausing, blocked resume and two open copies on a physical iPhone/Safari and Android/Chrome. The automated music tests exercise browser-policy scenarios using a controllable audio fixture; they do not substitute for real-device playback of the final file. Physical mobile devices and OS-level reduced-motion settings were not available in this session.
2. Connect the GitHub repository to the intended Vercel account/project, set main as the production branch, and review a Git preview deployment.
3. Set the final public Vercel origin in `src/config/wedding.ts`, redeploy, and verify guest access in a logged-out/private browser. The Sites review copy is private.

These remaining checks depend on the final music asset and hosting account; they are not represented as completed.
