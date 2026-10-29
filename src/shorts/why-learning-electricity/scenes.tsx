import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Breaker, HouseCircuit, Schematic, glow } from "../../components/circuit";
import { Chip, Label, PopWord, Stage, usePop } from "../../components/stage";
import { color } from "../../theme";
import { slug } from "./script";
import type { SceneId } from "./script";

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  // A failing neon: the first line flickers before it holds.
  const flicker = frame < 14 ? (random(`n${frame}`) > 0.45 ? 1 : 0.15) : 1;
  const bolt = interpolate(frame, [18, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(frame, [30, 33, 42], [0, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <AbsoluteFill style={{ background: color.foreground, opacity: flash }} />
      <Stage>
        <svg width={260} height={360} viewBox="0 0 260 360">
          <path
            d="M 150 10 L 40 200 L 120 200 L 90 350 L 220 140 L 140 140 L 190 10 Z"
            fill={glow}
            fillOpacity={interpolate(bolt, [0.7, 1], [0, 1], { extrapolateLeft: "clamp" })}
            stroke={glow}
            strokeWidth={10}
            strokeLinejoin="round"
            strokeDasharray={1200}
            strokeDashoffset={1200 * (1 - bolt)}
            style={{ filter: `drop-shadow(0 0 ${30 * bolt}px ${glow})` }}
          />
        </svg>
        <div style={{ fontSize: 108, fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}>
          <div style={{ opacity: flicker }}>NO ELECTRICIAN</div>
          <PopWord delay={14}>WANTS TO</PopWord>
          <br />
          <PopWord delay={19}>
            <span style={{ color: glow }}>TOUCH IT.</span>
          </PopWord>
        </div>
      </Stage>
    </>
  );
};

const Cabinet: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zero = usePop(Math.round(durationInFrames * 0.5), 9);
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(`${slug}/cabinet.jpg`)}
        style={{ width: 1080, height: 1920, objectFit: "cover", scale: String(interpolate(frame, [0, durationInFrames], [1.05, 1.2])) }}
      />
      <AbsoluteFill
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.9) 75%)" }}
      />
      <AbsoluteFill style={{ top: 180, alignItems: "center", color: color.foreground }}>
        <Label style={{ color: color.foreground }}>Quotes received</Label>
        <div
          style={{
            fontSize: 300,
            fontWeight: 700,
            lineHeight: 1,
            color: color.danger,
            scale: String(zero),
            textShadow: "0 10px 60px rgba(0,0,0,0.8)",
          }}
        >
          0
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FACTS = ["PHC home automation", "≈ 20 years old", "No plan"];

const Legacy: React.FC = () => (
  <Stage>
    <Schematic closeAt={30} />
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, padding: "0 60px" }}>
      {FACTS.map((fact, i) => (
        <Fact key={fact} delay={36 + i * 10}>
          {fact}
        </Fact>
      ))}
    </div>
  </Stage>
);

const Fact: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const pop = usePop(delay, 14);
  return <Chip style={{ fontSize: 44, scale: String(pop) }}>{children}</Chip>;
};

const STEPS = [
  "Understand what exists",
  "Find what is broken",
  "List every circuit",
  "Write everything down",
  "Plan the changes",
];

const Developer: React.FC = () => (
  <Stage>
    <Label>Like a developer</Label>
    <div
      style={{
        width: 900,
        padding: "36px 44px",
        borderRadius: 28,
        border: `2px solid ${color.border}`,
        background: "oklch(0.18 0 0 / 0.92)",
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      <div style={{ fontSize: 36, color: color.mutedForeground }}>{"// house.legacy – nobody maintains it"}</div>
      {STEPS.map((step, i) => (
        <Step key={step} n={i + 1} delay={8 + i * 7}>
          {step}
        </Step>
      ))}
    </div>
  </Stage>
);

const Step: React.FC<{ n: number; delay: number; children: React.ReactNode }> = ({ n, delay, children }) => {
  const pop = usePop(delay, 16);
  return (
    <div
      style={{
        display: "flex",
        gap: 28,
        fontSize: 54,
        fontWeight: 700,
        opacity: pop,
        translate: `${interpolate(pop, [0, 1], [-80, 0])}px 0px`,
      }}
    >
      <span style={{ color: color.accent }}>{n}.</span>
      <span>{children}</span>
    </div>
  );
};

const Basics: React.FC = () => {
  const title = usePop(0, 16);
  const formula = usePop(6, 14);
  return (
    <Stage>
      <div style={{ fontSize: 110, fontWeight: 700, scale: String(title) }}>BASICS FIRST.</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <Breaker offAt={24} />
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: color.accent,
            textShadow: `0 0 30px ${color.accent}`,
            opacity: formula,
            translate: `0px ${interpolate(formula, [0, 1], [40, 0])}px`,
          }}
        >
          U = R × I
        </div>
      </div>
    </Stage>
  );
};

const End: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const title = usePop(0, 18);
  const url = usePop(Math.round(durationInFrames * 0.4), 10);
  return (
    <Stage>
      <div
        style={{
          fontSize: 90,
          fontWeight: 700,
          opacity: title,
          translate: `0px ${interpolate(title, [0, 1], [50, 0])}px`,
        }}
      >
        Step by step.
      </div>
      <HouseCircuit />
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
  cabinet: Cabinet,
  legacy: Legacy,
  developer: Developer,
  basics: Basics,
  end: End,
};
