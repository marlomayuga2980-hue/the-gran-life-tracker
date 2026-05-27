"use client";

const TAG_CONFIG: Record<string, { bg: string; color: string; border: string; dot: string }> = {
  Shopify: {
    bg: "rgba(16, 185, 129, 0.08)",
    color: "#059669",
    border: "rgba(16, 185, 129, 0.22)",
    dot: "#10b981",
  },
  "Go High Level": {
    bg: "rgba(139, 92, 246, 0.08)",
    color: "#7c3aed",
    border: "rgba(139, 92, 246, 0.22)",
    dot: "#8b5cf6",
  },
  "Claude Design": {
    bg: "rgba(245, 158, 11, 0.08)",
    color: "#b45309",
    border: "rgba(245, 158, 11, 0.22)",
    dot: "#f59e0b",
  },
  QA: {
    bg: "rgba(14, 165, 233, 0.08)",
    color: "#0284c7",
    border: "rgba(14, 165, 233, 0.22)",
    dot: "#0ea5e9",
  },
};

export function TagBadge({ tag }: { tag: string }) {
  const cfg = TAG_CONFIG[tag] ?? {
    bg: "rgba(107, 114, 128, 0.08)",
    color: "#4b5563",
    border: "rgba(107, 114, 128, 0.2)",
    dot: "#9ca3af",
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11px] font-semibold leading-none"
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        letterSpacing: "0.01em",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
        style={{ background: cfg.dot }}
      />
      {tag}
    </span>
  );
}

/** Returns the top-border gradient color for a given tag (for card accents). */
export function tagAccentColor(tag: string): string {
  const colors: Record<string, string> = {
    Shopify: "#10b981",
    "Go High Level": "#8b5cf6",
    "Claude Design": "#f59e0b",
    QA: "#0ea5e9",
  };
  return colors[tag] ?? "#8BA7C9";
}
