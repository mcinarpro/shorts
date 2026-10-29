// Generates the voice-over and its word timings for a Short.
//
//   bun scripts/voice.ts estimate    placeholder timings, no audio (to work on the visuals)
//   bun scripts/voice.ts samples     the hook line in each candidate voice, in out/samples/
//   bun scripts/voice.ts <voice-id>  the full narration → public/<slug>/voice.mp3 + timeline.json
//
// Reads ELEVENLABS_API_KEY from .env (bun loads it).
import { mkdirSync, writeFileSync } from "node:fs";
import type { Caption } from "@remotion/captions";
import { scenes, slug } from "../src/shorts/one-evening-with-claude-code/script";

const CANDIDATES = {
  brian: "nPczCjzI2devNBz1zQrb",
  liam: "TX3LPaxmHKxFdv7VOQHJ",
  george: "JBFqnCBsd6RMkjVDRZzb",
};

type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

export type Timeline = {
  voice: boolean;
  durationMs: number;
  scenes: { id: string; startMs: number }[];
  captions: Caption[];
};

const text = scenes.map((scene) => scene.text).join(" ");
// Character offset where each scene starts in the joined text.
const sceneOffsets = scenes.map((_, i) =>
  scenes.slice(0, i).reduce((sum, scene) => sum + scene.text.length + 1, 0),
);

async function speak(voiceId: string, input: string) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is missing from .env");
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`,
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        text: input,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.4, similarity_boost: 0.75, style: 0.4 },
      }),
    },
  );
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${await response.text()}`);
  const body = (await response.json()) as { audio_base64: string; alignment: Alignment };
  return { audio: Buffer.from(body.audio_base64, "base64"), alignment: body.alignment };
}

// Groups characters into words; each word but the first keeps its leading space,
// as Remotion captions expect.
function toCaptions(alignment: Alignment) {
  const words: { text: string; startMs: number; endMs: number; offset: number }[] = [];
  let current: (typeof words)[number] | null = null;
  alignment.characters.forEach((char, i) => {
    if (char === " ") {
      current = null;
      return;
    }
    const startMs = Math.round(alignment.character_start_times_seconds[i] * 1000);
    const endMs = Math.round(alignment.character_end_times_seconds[i] * 1000);
    if (current) {
      current.text += char;
      current.endMs = endMs;
    } else {
      current = { text: char, startMs, endMs, offset: i };
      words.push(current);
    }
  });
  return words.map(({ text, startMs, endMs, offset }, i) => ({
    caption: { text: (i === 0 ? "" : " ") + text, startMs, endMs, timestampMs: startMs, confidence: null } as Caption,
    offset,
  }));
}

function timelineFrom(words: ReturnType<typeof toCaptions>, voice: boolean): Timeline {
  const sceneStarts = sceneOffsets.map((offset) => {
    const first = words.find((word) => word.offset >= offset);
    return first ? first.caption.startMs : 0;
  });
  return {
    voice,
    durationMs: words[words.length - 1].caption.endMs,
    scenes: scenes.map((scene, i) => ({ id: scene.id, startMs: i === 0 ? 0 : sceneStarts[i] })),
    captions: words.map((word) => word.caption),
  };
}

// About 2.6 words a second, with a short pause after each sentence.
function estimate(): Alignment {
  const starts: number[] = [];
  const ends: number[] = [];
  let t = 0;
  for (const char of text) {
    starts.push(t);
    t += char === " " ? 0.06 : /[.!?]/.test(char) ? 0.35 : 0.055;
    ends.push(t);
  }
  return { characters: [...text], character_start_times_seconds: starts, character_end_times_seconds: ends };
}

const dir = `public/${slug}`;
const arg = process.argv[2];
mkdirSync(dir, { recursive: true });

if (arg === "estimate") {
  writeFileSync(`${dir}/timeline.json`, JSON.stringify(timelineFrom(toCaptions(estimate()), false), null, 2));
  console.log(`${dir}/timeline.json (estimated, no audio)`);
} else if (arg === "samples") {
  mkdirSync("out/samples", { recursive: true });
  for (const [name, id] of Object.entries(CANDIDATES)) {
    const { audio } = await speak(id, scenes[0].text);
    writeFileSync(`out/samples/${name}.mp3`, audio);
    console.log(`out/samples/${name}.mp3`);
  }
} else if (arg) {
  const voiceId = CANDIDATES[arg as keyof typeof CANDIDATES] ?? arg;
  const { audio, alignment } = await speak(voiceId, text);
  writeFileSync(`${dir}/voice.mp3`, audio);
  writeFileSync(`${dir}/timeline.json`, JSON.stringify(timelineFrom(toCaptions(alignment), true), null, 2));
  console.log(`${dir}/voice.mp3 + timeline.json`);
} else {
  console.log("Usage: bun scripts/voice.ts estimate | samples | <voice name or id>");
}
