"use client";

import { useState } from "react";
import { resolveBrand, type BrandTarget } from "@/lib/branding";

type Props = {
  target: BrandTarget;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
} as const;

const gradients = [
  "from-amber-200 to-amber-50",
  "from-cyan-200 to-cyan-50",
  "from-emerald-200 to-emerald-50",
  "from-sky-200 to-sky-50",
  "from-violet-200 to-violet-50",
  "from-rose-200 to-rose-50",
];

const toneFor = (key: string) => {
  const hash = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

export function BrandLogo({ target, size = "md", className = "" }: Props) {
  const brand = resolveBrand(target);
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-gradient-to-br ${toneFor(
        brand.key,
      )} ${sizeClass[size]} ${className}`}
      title={`${brand.name} logo`}
      aria-label={`${brand.name} logo`}
    >
      <span className="absolute inset-0 bg-white/75" />
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logoPath}
          alt={`${brand.name} logo`}
          className="absolute inset-0 z-[2] h-full w-full bg-white p-1 object-contain"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : null}
      <span className="relative z-[1] font-semibold tracking-tight text-neutral-800">
        {brand.monogram}
      </span>
    </span>
  );
}
