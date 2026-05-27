"use client";

import type { Task } from "@/types";

export function OverallProgress({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const blocked = tasks.filter((t) => t.status === "Blocked").length;
  const notStarted = tasks.filter((t) => t.status === "Not Started").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div
      className="border-b"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f9fafc 100%)",
        borderColor: "rgba(201,217,244,0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

          {/* Label + percentage */}
          <div className="flex items-baseline gap-3 shrink-0">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--navy)", letterSpacing: "0.08em" }}
            >
              Launch Progress
            </span>
            <span
              className="font-serif font-semibold text-2xl leading-none"
              style={{ color: "var(--navy)" }}
            >
              {pct}<span className="text-sm font-sans font-medium ml-0.5" style={{ color: "var(--soft-blue)" }}>%</span>
            </span>
          </div>

          {/* Progress track */}
          <div className="flex-1 min-w-0">
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{ background: "var(--periwinkle)", opacity: 0.6 }}
            >
              {/* Done (gold) */}
              <div
                className="h-full progress-gold-fill rounded-full"
                style={{ width: `${pct}%` }}
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${pct}% of tasks completed`}
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-[12px] shrink-0">
            <Stat dot="#22c55e" label="Done" count={done} />
            <Stat dot="#4A6FA5" label="In Progress" count={inProgress} />
            {blocked > 0 && <Stat dot="#ef4444" label="Blocked" count={blocked} />}
            <Stat dot="#D1D8E4" label="Not Started" count={notStarted} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ dot, label, count }: { dot: string; label: string; count: number }) {
  return (
    <div className="flex items-center gap-1.5" style={{ color: "#6b7280" }}>
      <span
        className="w-2 h-2 rounded-full inline-block shrink-0"
        style={{ background: dot, border: "1px solid rgba(0,0,0,0.08)" }}
      />
      <span className="font-semibold" style={{ color: "var(--dark-neutral)" }}>{count}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
