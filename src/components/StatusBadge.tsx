"use client";

import { STATUS_CYCLE } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { cls: string; label: string }> = {
  "Not Started": { cls: "status-not-started", label: "Not Started" },
  "In Progress": { cls: "status-in-progress", label: "In Progress" },
  Done:          { cls: "status-done",         label: "Done" },
  Blocked:       { cls: "status-blocked",      label: "Blocked" },
};

interface StatusBadgeProps {
  status: string;
  clickable?: boolean;
  onCycle?: (next: string) => void;
}

export function StatusBadge({ status, clickable = false, onCycle }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? { cls: "status-not-started", label: status };

  const handleClick = () => {
    if (clickable && onCycle) {
      onCycle(STATUS_CYCLE[status] ?? "Not Started");
    }
  };

  return (
    <span
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? `Status: ${status}. Click to change to ${STATUS_CYCLE[status] ?? "Not Started"}` : undefined}
      onKeyDown={clickable ? (e) => { if (e.key === "Enter" || e.key === " ") handleClick(); } : undefined}
      onClick={clickable ? handleClick : undefined}
      className={[
        cfg.cls,
        "inline-flex items-center gap-1 px-2.5 py-[3px] rounded-full text-[11px] font-semibold leading-none select-none",
        clickable ? "cursor-pointer transition-opacity duration-150 hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-navy/40" : "",
      ].join(" ")}
      style={{ letterSpacing: "0.01em" }}
      title={clickable ? `→ ${STATUS_CYCLE[status] ?? "Not Started"}` : undefined}
    >
      {/* Status dot */}
      <span
        className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
        style={{
          background:
            status === "Not Started" ? "#94a3b8"
            : status === "In Progress" ? "#4A6FA5"
            : status === "Done" ? "#22c55e"
            : "#ef4444",
        }}
      />
      {cfg.label}
    </span>
  );
}
