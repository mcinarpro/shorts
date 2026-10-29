import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { color } from "../theme";

export const glow = "oklch(0.85 0.17 85)";

type Point = [number, number];

const toPath = (points: Point[]) => points.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
const lengthOf = (points: Point[]) =>
  points.slice(1).reduce((sum, [x, y], i) => sum + Math.abs(x - points[i][0]) + Math.abs(y - points[i][1]), 0);

// Right-angled traces on a 90px grid, the same on every render.
const TRACES = Array.from({ length: 18 }, (_, i) => {
  let x = Math.round(random(`x${i}`) * 12) * 90;
  let y = Math.round(random(`y${i}`) * 21) * 90;
  const points: Point[] = [[x, y]];
  for (let s = 0; s < 5; s++) {
    const d = (Math.round(random(`d${i}-${s}`) * 6) - 3) * 90 || 180;
    if (s % 2 === i % 2) x += d;
    else y += d;
    points.push([x, y]);
  }
  return { points, length: lengthOf(points), speed: 8 + random(`s${i}`) * 10, phase: random(`p${i}`) * 2000 };
});

// A circuit board behind the scenes, with pulses of current running along the traces.
export const CircuitBackground: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {TRACES.map(({ points, length, speed, phase }, i) => (
        <g key={i}>
          <path d={toPath(points)} fill="none" stroke={color.border} strokeWidth={3} opacity={0.45} />
          {[points[0], points[points.length - 1]].map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r={9} fill="none" stroke={color.border} strokeWidth={3} opacity={0.6} />
          ))}
          <path
            d={toPath(points)}
            fill="none"
            stroke={color.accent}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={`70 ${length + 70}`}
            strokeDashoffset={-((frame * speed + phase) % (length + 140)) + 70}
            filter="url(#glow)"
            opacity={0.8}
          />
        </g>
      ))}
    </svg>
  );
};

// Battery → switch → lamp. The loop draws itself, the switch closes at `closeAt`,
// current flows and the lamp lights up.
export const Schematic: React.FC<{ closeAt: number }> = ({ closeAt }) => {
  const frame = useCurrentFrame();
  const loop: Point[] = [
    [140, 100],
    [860, 100],
    [860, 500],
    [140, 500],
    [140, 100],
  ];
  const perimeter = lengthOf(loop);
  const draw = interpolate(frame, [0, closeAt - 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const closed = interpolate(frame, [closeAt, closeAt + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const parts = interpolate(frame, [closeAt - 14, closeAt - 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lit = interpolate(frame, [closeAt + 4, closeAt + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flicker = lit * (0.85 + 0.15 * random(`f${Math.floor(frame / 2)}`));

  return (
    <svg width={1000} height={600} viewBox="0 0 1000 600" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="lamp">
          <stop offset="0%" stopColor={glow} stopOpacity={0.9} />
          <stop offset="100%" stopColor={glow} stopOpacity={0} />
        </radialGradient>
        <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={860} cy={300} r={220} fill="url(#lamp)" opacity={flicker} />
      <path
        d={toPath(loop)}
        fill="none"
        stroke={color.foreground}
        strokeWidth={8}
        strokeDasharray={perimeter}
        strokeDashoffset={perimeter * (1 - draw)}
      />
      {closed > 0 &&
        [0, 1, 2, 3].map((k) => (
          <path
            key={k}
            d={toPath(loop)}
            fill="none"
            stroke={color.accent}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`40 ${perimeter / 4 - 40}`}
            strokeDashoffset={-(frame - closeAt) * 14 - (k * perimeter) / 4}
            filter="url(#wire-glow)"
            opacity={closed}
          />
        ))}
      <g opacity={parts}>
        {/* Battery */}
        <rect x={90} y={262} width={100} height={76} fill={color.background} />
        <line x1={90} y1={282} x2={190} y2={282} stroke={color.foreground} strokeWidth={8} />
        <line x1={115} y1={318} x2={165} y2={318} stroke={color.foreground} strokeWidth={16} />
        {/* Switch */}
        <rect x={420} y={60} width={160} height={80} fill={color.background} />
        <circle cx={430} cy={100} r={12} fill={color.foreground} />
        <circle cx={570} cy={100} r={12} fill={color.foreground} />
        <line
          x1={430}
          y1={100}
          x2={570}
          y2={100}
          stroke={color.foreground}
          strokeWidth={8}
          strokeLinecap="round"
          style={{ transformOrigin: "430px 100px", rotate: `${interpolate(closed, [0, 1], [-32, 0])}deg` }}
        />
        {/* Lamp */}
        <circle cx={860} cy={300} r={56} fill={color.background} stroke={color.foreground} strokeWidth={8} />
        <circle cx={860} cy={300} r={48} fill={glow} opacity={flicker} />
        <path d="M 822 262 L 898 338 M 898 262 L 822 338" stroke={color.foreground} strokeWidth={8} />
      </g>
    </svg>
  );
};

// A breaker that flips from ON to OFF at `offAt`, then gets a padlock.
export const Breaker: React.FC<{ offAt: number }> = ({ offAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const off = interpolate(frame, [offAt, offAt + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lock = interpolate(frame, [offAt + 10, offAt + 10 + fps / 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <svg width={540} height={560} viewBox="0 0 540 560" style={{ marginRight: -120 }}>
      <rect x={60} y={20} width={300} height={520} rx={28} fill={color.muted} stroke={color.border} strokeWidth={4} />
      <text x={210} y={92} textAnchor="middle" fontSize={44} fontWeight={700} fill={off < 1 ? color.foreground : color.mutedForeground}>
        I · ON
      </text>
      <text x={210} y={500} textAnchor="middle" fontSize={44} fontWeight={700} fill={off < 1 ? color.mutedForeground : color.foreground}>
        O · OFF
      </text>
      <rect x={160} y={130} width={100} height={300} rx={18} fill={color.background} />
      <rect
        x={170}
        y={interpolate(off, [0, 1], [140, 300])}
        width={80}
        height={120}
        rx={14}
        fill={off < 1 ? color.accent : color.foreground}
      />
      <g opacity={lock} style={{ translate: `0px ${interpolate(lock, [0, 1], [-40, 0])}px` }}>
        <path d="M 410 330 v -40 a 40 40 0 0 1 80 0 v 40" fill="none" stroke={color.foreground} strokeWidth={12} />
        <rect x={392} y={326} width={116} height={96} rx={14} fill={color.foreground} />
      </g>
    </svg>
  );
};

// A house drawn as a circuit: the outline, then current running to three lamps.
export const HouseCircuit: React.FC = () => {
  const frame = useCurrentFrame();
  const outline: Point[] = [
    [140, 640],
    [140, 300],
    [400, 80],
    [660, 300],
    [660, 640],
    [140, 640],
  ];
  const outlineLength = lengthOf(outline);
  const draw = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const branches: Point[][] = [
    [
      [220, 580],
      [220, 380],
      [330, 380],
    ],
    [
      [220, 580],
      [470, 580],
      [470, 420],
    ],
    [
      [220, 580],
      [580, 580],
      [580, 340],
    ],
  ];
  return (
    <svg width={800} height={700} viewBox="0 0 800 700">
      <path
        d={toPath(outline)}
        fill="none"
        stroke={color.foreground}
        strokeWidth={10}
        strokeLinejoin="round"
        strokeDasharray={outlineLength}
        strokeDashoffset={outlineLength * (1 - draw)}
      />
      <rect x={196} y={556} width={48} height={48} rx={8} fill={color.foreground} opacity={draw} />
      {branches.map((points, i) => {
        const length = lengthOf(points);
        const start = 22 + i * 8;
        const run = interpolate(frame, [start, start + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const [x, y] = points[points.length - 1];
        return (
          <g key={i}>
            <path
              d={toPath(points)}
              fill="none"
              stroke={color.accent}
              strokeWidth={6}
              strokeDasharray={length}
              strokeDashoffset={length * (1 - run)}
            />
            <circle cx={x} cy={y} r={70} fill={glow} opacity={run * 0.25} />
            <circle cx={x} cy={y} r={22} fill={run === 1 ? glow : color.background} stroke={color.foreground} strokeWidth={6} />
          </g>
        );
      })}
    </svg>
  );
};
