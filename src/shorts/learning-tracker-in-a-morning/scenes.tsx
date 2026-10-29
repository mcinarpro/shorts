import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Clock } from "../../components/Clock";
import { Phone } from "../../components/Phone";
import { Chip, Label, PopWord, Stage, usePop } from "../../components/stage";
import { color } from "../../theme";
import { slug } from "./script";
import type { SceneId } from "./script";

const Hook: React.FC = () => {
  const own = usePop(30);
  const phone = usePop(44, 15);
  return (
    <Stage>
      <div style={{ fontSize: 120, fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}>
        <PopWord delay={0}>
          <Struck from={14}>NO COURSE</Struck>
        </PopWord>
        <br />
        <PopWord delay={5}>
          <Struck from={20}>FIT MY LIFE.</Struck>
        </PopWord>
      </div>
      <div
        style={{
          fontSize: 80,
          fontWeight: 700,
          whiteSpace: "nowrap",
          padding: "4px 32px",
          background: color.foreground,
          color: color.background,
          scale: String(own),
          rotate: `${interpolate(own, [0, 1], [-12, -3])}deg`,
        }}
      >
        SO I BUILT MY OWN.
      </div>
      <Phone
        src={`${slug}/site-learn-path.png`}
        width={360}
        style={{
          translate: `0px ${interpolate(phone, [0, 1], [900, 0])}px`,
          rotate: `${interpolate(phone, [0, 1], [12, 4])}deg`,
          marginBottom: -460,
        }}
      />
    </Stage>
  );
};

// A line drawn through the middle of the text, left to right, from frame `from`.
const Struck: React.FC<{ from: number; children: React.ReactNode }> = ({ from, children }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ position: "relative" }}>
      {children}
      <span
        style={{
          position: "absolute",
          left: -12,
          top: "50%",
          height: 14,
          marginTop: -7,
          width: `calc(${interpolate(frame, [from, from + 8], [0, 100], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}% + 24px)`,
          background: color.danger,
          borderRadius: 7,
        }}
      />
    </span>
  );
};

const COUNTS = [
  { value: 28, label: "courses" },
  { value: 208, label: "parts" },
  { value: 5, label: "stages" },
];

const Curriculum: React.FC = () => (
  <Stage>
    <Label>A curriculum made to measure</Label>
    {COUNTS.map((count, i) => (
      <Count key={count.label} delay={8 + i * 14} {...count} />
    ))}
    <Label style={{ fontSize: 34 }}>YouTube · PDF courses · and more</Label>
  </Stage>
);

const Count: React.FC<{ delay: number; value: number; label: string }> = ({ delay, value, label }) => {
  const frame = useCurrentFrame();
  const pop = usePop(delay, 16);
  const shown = Math.round(
    interpolate(frame, [delay, delay + 18], [0, value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 32,
        opacity: pop,
        translate: `${interpolate(pop, [0, 1], [-140, 0])}px 0px`,
      }}
    >
      <span style={{ fontSize: 170, lineHeight: 1, fontWeight: 700, fontVariantNumeric: "tabular-nums", minWidth: 380, textAlign: "right" }}>
        {shown}
      </span>
      <span style={{ fontSize: 64, fontWeight: 700, color: color.mutedForeground, minWidth: 300 }}>{label}</span>
    </div>
  );
};

const STACK = [
  { title: "git push", note: "every push deploys" },
  { title: "Worker", note: "the app and its API" },
  { title: "KV", note: "my progress" },
];

const Cloud: React.FC = () => {
  const free = usePop(56, 10);
  return (
    <Stage>
      <Label>The back end, on Cloudflare</Label>
      {STACK.map((step, i) => (
        <StackStep key={step.title} delay={6 + i * 12} last={i === STACK.length - 1} {...step} />
      ))}
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          padding: "8px 36px",
          background: color.foreground,
          color: color.background,
          scale: String(free),
          rotate: "-3deg",
        }}
      >
        $0 · FREE PLAN
      </div>
    </Stage>
  );
};

const StackStep: React.FC<{ delay: number; title: string; note: string; last: boolean }> = ({
  delay,
  title,
  note,
  last,
}) => {
  const pop = usePop(delay, 15);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: pop }}>
      <Chip style={{ width: 860, display: "flex", gap: 32, justifyContent: "space-between", scale: String(interpolate(pop, [0, 1], [0.7, 1])) }}>
        <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{title}</span>
        <span style={{ color: color.mutedForeground, fontSize: 40, alignSelf: "center", whiteSpace: "nowrap" }}>{note}</span>
      </Chip>
      {!last && <div style={{ fontSize: 48, color: color.mutedForeground, marginBottom: -36 }}>↓</div>}
    </div>
  );
};

const Public: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const see = usePop(10, 14);
  const tick = usePop(26, 14);
  return (
    <Stage>
      <div style={{ display: "flex", gap: 24 }}>
        <Chip style={{ scale: String(see), fontSize: 44 }}>Anyone can see</Chip>
        <Chip style={{ scale: String(tick), fontSize: 44, borderColor: color.foreground }}>Only I can tick</Chip>
      </div>
      <Phone
        src={`${slug}/site-learn-path.png`}
        width={340}
        scroll={interpolate(frame, [0, durationInFrames], [0, 0.9])}
      />
    </Stage>
  );
};

const End: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const title = usePop(0, 18);
  const url = usePop(Math.round(durationInFrames * 0.4), 10);
  return (
    <Stage>
      <div
        style={{
          fontSize: 84,
          fontWeight: 700,
          textAlign: "center",
          opacity: title,
          translate: `0px ${interpolate(title, [0, 1], [50, 0])}px`,
        }}
      >
        Learning in public.
      </div>
      <Phone
        src={`${slug}/site-post.png`}
        width={300}
        scroll={interpolate(frame, [10, durationInFrames], [0, 1.4], { extrapolateLeft: "clamp" })}
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
  curriculum: Curriculum,
  clock: () => <Clock from="09:35" minutes={165} commits={13} live="learn.mehmetcinar.com" />,
  cloud: Cloud,
  public: Public,
  end: End,
};
