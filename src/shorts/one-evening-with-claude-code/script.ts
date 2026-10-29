// The narration, one entry per scene. Every line comes from the Post:
// https://mehmetcinar.com/posts/i-built-my-personal-site-in-one-evening-with-claude-code/
export const slug = "one-evening-with-claude-code";

export const scenes = [
  { id: "hook", text: "I built my personal site in one evening. With AI." },
  {
    id: "clock",
    text: "Empty folder at 8:41 PM. Live just after midnight. Eighteen commits.",
  },
  { id: "split", text: "Claude wrote the code. I made every decision." },
  { id: "wrong", text: "It got one thing wrong. An AI's knowledge has a date." },
  { id: "no", text: "And I said no to over-engineering." },
  {
    id: "end",
    text: "A fast pair programmer, not an autopilot. Full story on mehmetcinar.com.",
  },
] as const;

export type SceneId = (typeof scenes)[number]["id"];
