# Shorts

Vertical videos (1080×1920, YouTube Shorts) that present Mehmet's Posts on mehmetcinar.com,
built with Remotion. One folder per Short in `src/shorts/<slug>/`; shared pieces in
`src/components/`; the Site's dark tokens and font in `src/theme.ts`.

- **The narration is Mehmet's words.** Every line in a Short's `script.ts` comes from its Post.
  Never invent a fact, a number or an opinion.
- **Voice**: `bun scripts/voice.ts estimate | samples | <voice>` (ElevenLabs, key in `.env`,
  never committed, never printed). It writes `public/<slug>/voice.mp3` and `timeline.json`;
  scenes and captions are timed from that file.
- **Animations** use `useCurrentFrame()`, `interpolate()` and `spring()` – CSS transitions and
  Tailwind animation classes do not render. The Remotion skills in `.claude/skills/` hold the
  details.
- `bun run dev` opens the Studio; `bun run render <slug>` writes `out/<slug>.mp4`.
- Free ElevenLabs plan: credit "Voice: ElevenLabs" in the YouTube description.
