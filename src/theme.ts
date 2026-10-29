import { loadFont } from "@remotion/google-fonts/GoogleSansCode";

// The Site's dark tokens (mehmetcinar.com, src/styles/theme.css).
export const color = {
  background: "oklch(0.145 0 0)",
  foreground: "oklch(0.985 0 0)",
  accent: "oklch(0.7 0.222 259)",
  muted: "oklch(0.24 0 0)",
  mutedForeground: "oklch(0.76 0 0)",
  border: "oklch(0.325 0 0)",
  // Only for the NO stamps.
  danger: "oklch(0.65 0.24 25)",
};

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});
