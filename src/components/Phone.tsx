import { Img, staticFile } from "remotion";
import { color } from "../theme";

// A phone frame showing a screenshot; `scroll` moves the screenshot up, in screen heights.
export const Phone: React.FC<{ src: string; width: number; scroll?: number; style?: React.CSSProperties }> = ({
  src,
  width,
  scroll = 0,
  style,
}) => {
  const height = width * (2532 / 1170);
  return (
    <div
      style={{
        width: width + 28,
        height: height + 28,
        padding: 14,
        borderRadius: 64,
        background: "oklch(0.2 0 0)",
        border: `2px solid ${color.border}`,
        boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
        ...style,
      }}
    >
      <div style={{ width, height, borderRadius: 50, overflow: "hidden", background: "white" }}>
        <Img src={staticFile(src)} style={{ width, display: "block", translate: `0px ${-scroll * height}px` }} />
      </div>
    </div>
  );
};
