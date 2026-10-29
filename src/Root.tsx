import "./index.css";
import { Composition } from "remotion";
import { Video, durationMs } from "./shorts/one-evening-with-claude-code/Video";
import { slug } from "./shorts/one-evening-with-claude-code/script";

const FPS = 30;
// Hold the end card after the last word.
const TAIL_MS = 1500;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={slug}
      component={Video}
      durationInFrames={Math.ceil(((durationMs + TAIL_MS) / 1000) * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};
