# Asset provenance

- `public/images/couple.jpg`: the user's supplied PHOTO-2026-09-03-12-09-43 (2).jpg, preserved unaltered. The WebP is a compressed format conversion, with no identity or scene edits. The page applies a responsive CSS crop.
- `public/images/ivory-curtain.webp`: created with the built-in OpenAI image-generation tool for this invitation; compressed from the generated 1024 × 1536 PNG.
- `public/og.png`: created with the built-in OpenAI image-generation tool, then resized to 1200 × 630 for social sharing. Inspected for the exact couple's names, date and location.
- `public/icon.svg` and `public/apple-touch-icon.png`: simple C&A monogram, authored for this invitation.
- Cormorant Garamond and Manrope: self-hosted via Fontsource, SIL Open Font License. License text is preserved in `licenses/`.
- public/audio/wedding-music.mp3: copied without modification from the user-supplied music.mp3.mp3 (4,807,033 bytes).

The full image-generation prompts are recorded in `imagegen-attribution.json`.

- `public/images/royal-frame.webp`: custom ivory and embossed gold ornamental stationery, generated using built-in imagegen; optimized to 900 × 1350 WebP (154 KB). Text is rendered in HTML, not baked into the artwork. Prompt is included in `imagegen-attribution.json`.

- `public/images/satin-ribbon.webp`: generated with built-in imagegen for the modern ribbon entrance; 1400 × 933 WebP, 168 KB, with transparency. The three visible ribbon pieces use the same artwork with complementary clips, animated using Motion.

- `public/images/love-petal.webp`: one blush rose petal created with built-in imagegen, optimized to a 96 × 96 transparent WebP (3.7 KB), retained as an unused historical asset; the petal feature has been removed. Full prompt in `imagegen-attribution.json`.
