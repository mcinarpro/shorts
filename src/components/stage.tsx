import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color } from "../theme";

// Scene content stays between y=140 and y=1240; the captions sit below, clear of the
// Shorts interface at the bottom.
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ top: 140, height: 1100, overflow: "hidden", alignItems: "center", justifyContent: "center", gap: 48, color: color.foreground }}
  >
    {children}
  </AbsoluteFill>
);

export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 40, letterSpacing: 6, textTransform: "uppercase", color: color.mutedForeground, ...style }}>
    {children}
  </div>
);

// 0 → 1 with a bounce, starting at `delay` frames.
export function usePop(delay = 0, damping = 12) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 200 } });
}


export const PopWord: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const pop = usePop(delay);
  return (
    <span style={{ display: "inline-block", scale: String(pop), translate: `0px ${interpolate(pop, [0, 1], [80, 0])}px` }}>
      {children}
    </span>
  );
};

export const Chip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
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
