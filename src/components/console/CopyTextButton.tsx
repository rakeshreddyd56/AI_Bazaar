"use client";

import { useState } from "react";

type Props = {
  value: string;
  label?: string;
};

export function CopyTextButton({ value, label = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded-lg border border-white/15 bg-black/25 px-2 py-1 text-[11px] font-medium text-neutral-200 hover:bg-black/45"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
