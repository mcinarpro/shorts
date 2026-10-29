import "./index.css";
import { Composition } from "remotion";
import * as oneEvening from "./shorts/one-evening-with-claude-code/Video";
import { slug as oneEveningSlug } from "./shorts/one-evening-with-claude-code/script";
import * as learningTracker from "./shorts/learning-tracker-in-a-morning/Video";
import { slug as learningTrackerSlug } from "./shorts/learning-tracker-in-a-morning/script";
import * as whyElectricity from "./shorts/why-learning-electricity/Video";
import { slug as whyElectricitySlug } from "./shorts/why-learning-electricity/script";

const FPS = 30;
// Hold the end card after the last word.
const TAIL_MS = 1500;

const SHORTS = [
  { id: oneEveningSlug, ...oneEvening },
  { id: learningTrackerSlug, ...learningTracker },
  { id: whyElectricitySlug, ...whyElectricity },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {SHORTS.map(({ id, Video, durationMs }) => (
        <Composition
          key={id}
          id={id}
          component={Video}
          durationInFrames={Math.ceil(((durationMs + TAIL_MS) / 1000) * FPS)}
          fps={FPS}
          width={1080}
          height={1920}
        />
      ))}
    </>
  );
};
