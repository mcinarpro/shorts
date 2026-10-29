// The narration, one entry per scene. Every line comes from the Post:
// https://mehmetcinar.com/posts/why-a-software-developer-is-learning-electricity/
export const slug = "why-learning-electricity";

export const scenes = [
  { id: "hook", text: "No electrician wants to touch our old home automation." },
  { id: "cabinet", text: "They looked at the cabinet and left. None of them sent a quote." },
  { id: "legacy", text: "About twenty years old. Nobody maintains it. And no plan." },
  { id: "developer", text: "It's a legacy codebase. So I'll work on it like a developer." },
  { id: "basics", text: "First, the basics. I won't touch anything before that." },
  { id: "end", text: "I'll write about it step by step, on mehmetcinar.com." },
] as const;

export type SceneId = (typeof scenes)[number]["id"];
