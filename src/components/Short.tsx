import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { color, fontFamily } from "../theme";
import { Captions } from "./Captions";

// Written by scripts/voice.ts into public/<slug>/timeline.json.
export type Timeline = {
  voice: boolean;
  durationMs: number;
  scenes: { id: string; startMs: number }[];
  captions: Caption[];
};

// A Short: its scenes timed from the voice-over over an optional backdrop, a whoosh on each
// cut, the captions on top.
export const Short: React.FC<{
  slug: string;
  timeline: Timeline;
  scenes: Record<string, React.FC>;
  backdrop?: React.FC;
}> = ({ slug, timeline, scenes, backdrop: Backdrop }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);

  return (
    <AbsoluteFill style={{ background: color.background, fontFamily }}>
      {Backdrop && <Backdrop />}
      {timeline.scenes.map((scene, i) => {
        const from = toFrame(scene.startMs);
        const next = timeline.scenes[i + 1];
        const Scene = scenes[scene.id];
        return (
          <Sequence
            key={scene.id}
            name={scene.id}
            from={from}
            durationInFrames={(next ? toFrame(next.startMs) : durationInFrames) - from}
          >
            <Scene />
            {i > 0 && <Audio src="https://remotion.media/whoosh.wav" volume={0.35} />}
          </Sequence>
        );
      })}
      <Captions captions={timeline.captions} top={1300} />
      {timeline.voice && <Audio src={staticFile(`${slug}/voice.mp3`)} />}
    </AbsoluteFill>
  );
};
