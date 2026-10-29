import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color } from "../theme";
import { Label, Stage } from "./stage";

// A clock running from `from` for `minutes`, then a "live" pill, and a commit counter.
export const Clock: React.FC<{ from: string; minutes: number; commits: number; live: string }> = ({
  from,
  minutes: span,
  commits: count,
  live: liveText,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // The clock runs over the first 60 % of the scene.
  const minutes = Math.round(
    interpolate(frame, [6, durationInFrames * 0.6], [0, span], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const [h, m] = from.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const time = `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  const commits = Math.round(
    interpolate(frame, [6, durationInFrames * 0.75], [0, count], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const live = spring({ frame: frame - Math.round(durationInFrames * 0.6), fps, config: { damping: 10 } });
  return (
    <Stage>
      <Label>{minutes < span ? "First commit" : "Live"}</Label>
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
        {liveText}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 64px)", gap: 16, marginTop: 40 }}>
        {Array.from({ length: count }, (_, i) => (
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
