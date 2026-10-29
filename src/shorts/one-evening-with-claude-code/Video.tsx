import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "../../components/Captions";
import { color, fontFamily } from "../../theme";
import { SCENES } from "./scenes";
import { slug, type SceneId } from "./script";
// Written by scripts/voice.ts.
import timeline from "../../../public/one-evening-with-claude-code/timeline.json";

export const durationMs = timeline.durationMs;

export const Video: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);

  return (
    <AbsoluteFill style={{ background: color.background, fontFamily }}>
      {timeline.scenes.map((scene, i) => {
        const from = toFrame(scene.startMs);
        const next = timeline.scenes[i + 1];
        const Scene = SCENES[scene.id as SceneId];
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
