import { Short } from "../../components/Short";
import { SCENES } from "./scenes";
import { slug } from "./script";
import timeline from "../../../public/one-evening-with-claude-code/timeline.json";

export const durationMs = timeline.durationMs;

export const Video: React.FC = () => <Short slug={slug} timeline={timeline} scenes={SCENES} />;
