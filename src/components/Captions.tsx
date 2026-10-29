import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { color } from "../theme";

// Word-by-word captions, a few words per page, the spoken word in the accent colour.
export const Captions: React.FC<{ captions: Caption[]; top: number }> = ({ captions, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        // A page never runs across the end of a sentence.
        captions: captions.map((c) => ({ ...c, pageBreakAfter: /[.!?]$/.test(c.text) })),
        combineTokensWithinMilliseconds: 900,
      }),
    [captions],
  );
  const ms = (frame / fps) * 1000;
  const page = pages.find((p) => ms >= p.startMs && ms < p.startMs + p.durationMs);
  if (!page) return null;

  const enter = spring({ frame: frame - Math.round((page.startMs / 1000) * fps), fps, config: { damping: 14, stiffness: 220 } });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 90,
        right: 90,
        textAlign: "center",
        fontSize: 84,
        fontWeight: 700,
        lineHeight: 1.15,
        textTransform: "uppercase",
        color: color.foreground,
        textShadow: "0 6px 24px rgba(0,0,0,0.8)",
        scale: String(interpolate(enter, [0, 1], [0.8, 1])),
        whiteSpace: "pre-wrap",
      }}
    >
      {page.tokens.map((token) => (
        <span key={token.fromMs} style={{ color: ms >= token.fromMs && ms < token.toMs ? color.accent : undefined }}>
          {token.text}
        </span>
      ))}
    </div>
  );
};
