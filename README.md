# Christy & Amala — our wedding invitation

A complete mobile-first invitation for 03 January 2027 in Pathanamthitta, Kerala. Built with Next.js App Router, TypeScript, Tailwind CSS and Motion for React. All pages and calendars are statically exported; RSVP submissions go directly to your Google Apps Script web app and private Google Sheet. There is no site server or analytics.

## Run locally

Use Node.js 22 or 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Fonts, portrait and ribbon artwork are local assets; there are no third-party asset requests during a guest visit.

```sh
npm run lint
npm run type-check
npm test
npm run build
npm start
```

`npm start` serves the production export in `out/`. The lockfile pins compatible dependencies. ESLint 9 is retained because the React rules bundled with the current Next.js configuration do not support ESLint 10 yet.

## Update the invitation

Edit **`src/config/wedding.ts`** for the couple's names, family details, event dates and times, venue addresses, map links, photograph, music source and canonical site URL. Rebuild and redeploy after changes.

- Dates use ISO 8601 with the explicit `+05:30` offset. Keep `timezone: "Asia/Kolkata"`. The ceremony starts at 16:00 on 03 January 2027; no ceremony end time is asserted.
- Venue buttons currently use Google Maps searches with the full venue name and address. Set each `mapUrl` to a confirmed venue pin if desired; no coordinates have been invented.
- The three calendar downloads are generated from this config during the build: ceremony, reception, and both events. They use an embedded Asia/Kolkata timezone definition. Reception ends at 21:30.
- Replace `public/images/couple.webp` with an optimized real photograph; set `photo.src`, dimensions and alt text. The supplied unaltered JPG is preserved at `public/images/couple.jpg`. The arched crop is controlled by `.portrait-frame img` in `src/app/globals.css`.
- Colors, layout and motion are in `src/app/globals.css`. The ribbon entrance’s native `method="dialog"` form works before JavaScript or media has loaded, so guests can always enter. JavaScript upgrades it to a modal and adds the animated transition. The invitation content itself is server-rendered and stays available if animation code fails.

## Add your music

Your supplied music.mp3.mp3 is included as public/audio/wedding-music.mp3 and configured at restrained volume. The steps below explain replacement.

1. Add an audio file you have permission to use to `public/audio/` (MP3 is a practical cross-browser option).
2. Set `music.src` to `/audio/your-file.mp3` in the config and add any necessary credit.
3. Keep the volume restrained, rebuild, and check the final file on an iPhone and Android phone.

There is one HTML audio element, created only when a source exists, with no preload before intent. Opening the invitation requests playback; browser restrictions may instead require the labelled resume button. Visibility, pagehide/pageshow and freeze/resume events pause and restore playback from its current position. Manual pause or mute is preserved. A BroadcastChannel and storage fallback hand playback between tabs, with an exclusive Web Lock where supported. The music bars animate only after the audio element reports playback. Local preferences use session storage; the cross-tab owner marker uses local storage. No preference leaves the device.

The entrance is remembered for the current browser tab/session. Merely switching apps or tabs never replays it. To review the entrance afresh, open the URL in a new tab without an opener or a fresh private session. Escape also opens the invitation; keyboard focus then moves to the couple's names.

## GitHub

Intended repository: https://github.com/mathewsageorge/Christy-Amala

The project is its own Git repository. If the initial push has not already been completed in the delivery notes, authenticate GitHub and run from this folder:

```sh
git remote -v
git push -u origin main
```

Do not commit `node_modules`, `.next`, `out`, credentials or `.env` files. No environment variables are required. The optional `sites` remote and `.openai/hosting.json` identify the separate private Sites review copy; Vercel does not depend on them.

## Deploy to Vercel with Git integration

1. Sign in to the intended Vercel account/team and choose **Add New → Project**.
2. Import **mathewsageorge/Christy-Amala** from GitHub. Grant access only to this repository if GitHub integration is not already connected.
3. Use the **Next.js** framework preset, repository root, `npm ci`, and `npm run build`. The checked-in `vercel.json` includes calendar response headers. No secrets or environment variables are needed.
4. Set the production branch to **main**. Vercel's Git integration then deploys pushes to main automatically; other branches and pull requests produce preview deployments.
5. Once Vercel assigns the real production domain, set `siteUrl` in `src/config/wedding.ts` to that HTTPS origin (no trailing slash), commit and push. This updates the canonical URL and absolute Open Graph/X image URLs.
6. Review a branch preview before merging later changes into main. Verify the final production URL in a logged-out/private window and confirm it opens without a Vercel account. If deployment protection is enabled for production, adjust that project's protection according to the intended guest audience.

The current `siteUrl` identifies a **private Sites review copy**, not a public guest invitation. Replace it with the verified public Vercel URL before sharing. Do not share the private review URL with guests.

## Sharing image and assets

`public/og.png` is a 1200 × 630 matching invitation card, with page title, description, Open Graph/X metadata, SVG favicon and Apple touch icon. Fonts are Cormorant Garamond and Manrope, self-hosted through Fontsource and distributed under the SIL Open Font License. See `ASSETS.md` for provenance and the image-generation prompts.

See `QA.md` for checks performed and the remaining real-device music verification. The RSVP form is connected and browser-tested. See GOOGLE-SHEETS.md for the script, column headings and deployment steps. Scripture: 1 Corinthians 13:13, World English Bible (public domain).


The current entrance uses Motion (`useAnimate`) for a scoped timeline: release the center knot, slide the two satin ends away, then fade the stationery into the invitation. It uses the existing Motion dependency. Reduced motion replaces this with a short fade. The opening button remains a native dialog form without JavaScript. Library reference: https://motion.dev/docs/react-use-animate.
