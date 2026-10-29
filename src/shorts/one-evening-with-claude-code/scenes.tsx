import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Phone } from "../../components/Phone";
import { color } from "../../theme";
import { slug } from "./script";
import type { SceneId } from "./script";

// Scene content stays between y=140 and y=1240; the captions sit below, clear of the
// Shorts interface at the bottom.
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ top: 140, height: 1100, overflow: "hidden", alignItems: "center", justifyContent: "center", gap: 48, color: color.foreground }}
  >
    {children}
  </AbsoluteFill>
);

const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 40, letterSpacing: 6, textTransform: "uppercase", color: color.mutedForeground, ...style }}>
    {children}
  </div>
);

// 0 → 1 with a bounce, starting at `delay` frames.
function usePop(delay = 0, damping = 12) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 200 } });
}

const Hook: React.FC = () => {
  const words = ["ONE", "EVENING."];
  const ai = usePop(14);
  const phone = usePop(30, 15);
  return (
    <Stage>
      <div style={{ display: "flex", gap: 36, fontSize: 150, fontWeight: 700 }}>
        {words.map((word, i) => (
          <PopWord key={word} delay={i * 5}>
            {word}
          </PopWord>
        ))}
      </div>
      <div
        style={{
          fontSize: 130,
          fontWeight: 700,
          padding: "4px 36px",
          background: color.foreground,
          color: color.background,
          scale: String(ai),
          rotate: `${interpolate(ai, [0, 1], [-12, -3])}deg`,
        }}
      >
        WITH AI.
      </div>
      <Phone
        src={`${slug}/site-home.png`}
        width={360}
        style={{
          translate: `0px ${interpolate(phone, [0, 1], [900, 0])}px`,
          rotate: `${interpolate(phone, [0, 1], [12, 4])}deg`,
          marginBottom: -420,
        }}
      />
    </Stage>
  );
};

const PopWord: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const pop = usePop(delay);
  return (
    <span style={{ display: "inline-block", scale: String(pop), translate: `0px ${interpolate(pop, [0, 1], [80, 0])}px` }}>
      {children}
    </span>
  );
};

const Clock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // 20:41 → 00:01 is 200 minutes, run over the first 60 % of the scene.
  const minutes = Math.round(
    interpolate(frame, [6, durationInFrames * 0.6], [0, 200], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const total = 20 * 60 + 41 + minutes;
  const time = `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  const commits = Math.round(
    interpolate(frame, [6, durationInFrames * 0.75], [0, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const live = spring({ frame: frame - Math.round(durationInFrames * 0.6), fps, config: { damping: 10 } });
  return (
    <Stage>
      <Label>{minutes < 200 ? "First commit" : "Live"}</Label>
      <div style={{ fontSize: 260, fontWeight: 700, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{time}</div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          padding: "10px 32px",
          borderRadius: 999,
          background: color.accent,
          color: color.background,
          scale: String(live),
        }}
      >
        mehmetcinar.com is live
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 64px)", gap: 16, marginTop: 40 }}>
        {Array.from({ length: 18 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: i < commits ? color.foreground : "transparent",
              border: `3px solid ${i < commits ? color.foreground : color.border}`,
            }}
          />
        ))}
      </div>
      <Label style={{ color: color.foreground, fontSize: 48 }}>{commits} commits</Label>
    </Stage>
  );
};

const LINES = [
  { text: "> add an About page", tone: color.foreground },
  { text: "● Writing src/content/pages/about.md", tone: color.mutedForeground },
  { text: "● Writing src/styles/theme.css", tone: color.mutedForeground },
  { text: "  Apply this change?", tone: color.mutedForeground },
  { text: "  ✓ Reviewed. Yes.", tone: color.accent },
];

const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const chars = Math.max(0, frame - 4) * 2.2;
  let left = chars;
  const claude = usePop(40);
  const me = usePop(62);
  return (
    <Stage>
      <div
        style={{
          width: 940,
          borderRadius: 28,
          border: `2px solid ${color.border}`,
          background: "oklch(0.18 0 0)",
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", gap: 14, padding: "22px 28px", borderBottom: `2px solid ${color.border}` }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 22, height: 22, borderRadius: 999, background: color.border }} />
          ))}
        </div>
        <div style={{ padding: "28px 32px", fontSize: 34, lineHeight: 1.6, minHeight: 330 }}>
          {LINES.map((line) => {
            const shown = line.text.slice(0, Math.max(0, Math.floor(left)));
            left -= line.text.length;
            return (
              <div key={line.text} style={{ color: line.tone, whiteSpace: "pre" }}>
                {shown || " "}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignSelf: "stretch", padding: "0 70px" }}>
        <Role pop={claude} who="Claude" what="writes the code" />
        <Role pop={me} who="Me" what="makes every decision" strong />
      </div>
    </Stage>
  );
};

const Role: React.FC<{ pop: number; who: string; what: string; strong?: boolean }> = ({ pop, who, what, strong }) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      gap: 28,
      fontSize: 64,
      fontWeight: 700,
      opacity: pop,
      translate: `${interpolate(pop, [0, 1], [-120, 0])}px 0px`,
    }}
  >
    <span style={{ minWidth: 250, color: strong ? color.foreground : color.mutedForeground }}>{who}</span>
    <span style={{ fontSize: 50, color: strong ? color.foreground : color.mutedForeground }}>{what}</span>
  </div>
);

const Wrong: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [18, 30], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fix = usePop(38);
  const lesson = usePop(60, 20);
  return (
    <Stage>
      <Label>Where the AI was wrong</Label>
      <Chip>
        <span style={{ opacity: interpolate(strike, [0, 100], [1, 0.45]) }}>wrangler versions upload</span>
        <div
          style={{
            position: "absolute",
            left: 24,
            top: "50%",
            height: 8,
            width: `calc(${strike}% - 48px)`,
            background: color.danger,
            borderRadius: 4,
          }}
        />
      </Chip>
      <Chip style={{ scale: String(fix), borderColor: color.foreground }}>
        <span>wrangler preview</span>
        <span style={{ color: color.accent, marginLeft: 24 }}>✓</span>
      </Chip>
      <div
        style={{
          marginTop: 40,
          fontSize: 72,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.2,
          opacity: lesson,
          translate: `0px ${interpolate(lesson, [0, 1], [40, 0])}px`,
        }}
      >
        An AI's knowledge
        <br />
        has a date.
      </div>
    </Stage>
  );
};

const Chip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      position: "relative",
      fontSize: 52,
      padding: "24px 40px",
      borderRadius: 20,
      border: `2px solid ${color.border}`,
      background: color.muted,
      ...style,
    }}
  >
    {children}
  </div>
);

const NO_CARDS = [
  { title: "Geist font", note: "I kept my own" },
  { title: "2 tools for commit messages", note: "one line in a guide does it" },
];

const No: React.FC = () => (
  <Stage>
    <Label>Where I said no</Label>
    {NO_CARDS.map((card, i) => (
      <NoCard key={card.title} delay={6 + i * 22} {...card} />
    ))}
  </Stage>
);

const NoCard: React.FC<{ delay: number; title: string; note: string }> = ({ delay, title, note }) => {
  const card = usePop(delay - 6, 18);
  const stamp = usePop(delay + 8, 9);
  return (
    <div
      style={{
        position: "relative",
        width: 880,
        padding: "44px 240px 44px 48px",
        borderRadius: 28,
        border: `2px solid ${color.border}`,
        background: color.muted,
        opacity: card,
        translate: `0px ${interpolate(card, [0, 1], [60, 0])}px`,
      }}
    >
      <div style={{ fontSize: 60, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 38, color: color.mutedForeground, marginTop: 12 }}>{note}</div>
      <div
        style={{
          position: "absolute",
          right: 40,
          top: 34,
          fontSize: 96,
          fontWeight: 700,
          padding: "0 24px",
          color: color.danger,
          border: `8px solid ${color.danger}`,
          borderRadius: 16,
          opacity: interpolate(stamp, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
          scale: String(interpolate(stamp, [0, 1], [2.4, 1])),
          rotate: "-12deg",
        }}
      >
        NO
      </div>
    </div>
  );
};

const End: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const title = usePop(0, 18);
  const url = usePop(Math.round(durationInFrames * 0.45), 10);
  return (
    <Stage>
      <div
        style={{
          fontSize: 76,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.15,
          padding: "0 60px",
          opacity: title,
          translate: `0px ${interpolate(title, [0, 1], [50, 0])}px`,
        }}
      >
        A fast pair programmer,
        <br />
        <span style={{ color: color.mutedForeground }}>not an autopilot.</span>
      </div>
      <Phone
        src={`${slug}/site-post.png`}
        width={280}
        scroll={interpolate(frame, [10, durationInFrames], [0, 1.6], { extrapolateLeft: "clamp" })}
      />
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          padding: "18px 44px",
          borderRadius: 999,
          background: color.accent,
          color: color.background,
          scale: String(url),
        }}
      >
        mehmetcinar.com
      </div>
    </Stage>
  );
};

export const SCENES: Record<SceneId, React.FC> = {
  hook: Hook,
  clock: Clock,
  split: Split,
  wrong: Wrong,
  no: No,
  end: End,
};
