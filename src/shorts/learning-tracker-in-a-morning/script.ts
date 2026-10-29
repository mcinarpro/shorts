// The narration, one entry per scene. Every line comes from the Post:
// https://mehmetcinar.com/posts/i-built-my-own-learning-tracker-in-a-morning/
export const slug = "learning-tracker-in-a-morning";

export const scenes = [
  { id: "hook", text: "No course fit my life. So I built my own." },
  { id: "curriculum", text: "Claude found the sources. Twenty-eight courses, two hundred and eight parts." },
  { id: "clock", text: "Built in one morning. Thirteen commits." },
  { id: "cloud", text: "The back end runs on Cloudflare. One platform, on the free plan." },
  { id: "public", text: "My progress is public. It keeps me on course." },
  { id: "end", text: "Learning in public. Full story on mehmetcinar.com." },
] as const;

export type SceneId = (typeof scenes)[number]["id"];
