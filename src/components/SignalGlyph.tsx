import type { CSSProperties } from "react";

type Props = {
  seed: string;
  size?: number;
};

const hash = (value: string) =>
  value.split("").reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);

const toHue = (seed: string, shift: number) => (hash(seed + shift) % 360 + 360) % 360;

export function SignalGlyph({ seed, size = 40 }: Props) {
  const hueA = toHue(seed, 11);
  const hueB = toHue(seed, 29);
  const hueC = toHue(seed, 47);
  const safeId = seed.replace(/[^a-z0-9-_]/gi, "_");

  const style = {
    "--hue-a": `${hueA}`,
    "--hue-b": `${hueB}`,
    "--hue-c": `${hueC}`,
  } as CSSProperties;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      style={style}
      className="rounded-xl border border-neutral-200 bg-neutral-50"
      aria-hidden
    >
      <defs>
        <linearGradient id={`g-${safeId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hueA} 85% 58%)`} />
          <stop offset="55%" stopColor={`hsl(${hueB} 80% 56%)`} />
          <stop offset="100%" stopColor={`hsl(${hueC} 78% 52%)`} />
        </linearGradient>
      </defs>

      <rect x="8" y="8" width="84" height="84" rx="16" fill={`url(#g-${safeId})`} opacity="0.18" />
      <circle cx="34" cy="34" r="16" fill={`hsl(${hueA} 86% 52%)`} opacity="0.85" />
      <circle cx="66" cy="66" r="20" fill={`hsl(${hueB} 84% 52%)`} opacity="0.72" />
      <path
        d="M20 66 C38 42, 60 52, 80 28"
        stroke={`hsl(${hueC} 88% 35%)`}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
