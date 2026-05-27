"use client";

import { formatHours } from "@/lib/utils";
import type { TimeEntry } from "@/types";

interface WeekSummaryProps {
  entries: TimeEntry[];
}

export function WeekSummary({ entries }: WeekSummaryProps) {
  const byTask = entries.reduce<Record<string, { title: string; tag: string; hours: number }>>(
    (acc, e) => {
      if (!acc[e.taskId]) {
        acc[e.taskId] = { title: e.task?.title ?? "Unknown Task", tag: e.task?.tag ?? "", hours: 0 };
      }
      acc[e.taskId].hours += e.hours;
      return acc;
    },
    {}
  );

  const rows = Object.entries(byTask).sort((a, b) => b[1].hours - a[1].hours);
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  const tagColors: Record<string, string> = {
    Shopify: "#10b981",
    "Go High Level": "#8b5cf6",
    "Claude Design": "#f59e0b",
    QA: "#0ea5e9",
  };

  if (rows.length === 0) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: "white",
          border: "1px solid rgba(201,217,244,0.5)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "rgba(201,217,244,0.3)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8BA7C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--dark-neutral)" }}>No time logged</p>
        <p className="text-[12px]" style={{ color: "#9ba8bb" }}>Add entries on the left to see your week summary here.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "white",
        border: "1px solid rgba(201,217,244,0.5)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{
          background: "linear-gradient(135deg, #1e2d53 0%, var(--navy) 100%)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(201,217,244,0.6)" }}>
            Week Summary
          </span>
          <span className="font-serif font-bold text-white text-lg">
            {formatHours(totalHours)}
          </span>
        </div>
        <p className="text-[12px] mt-0.5" style={{ color: "rgba(201,217,244,0.45)" }}>
          total this week
        </p>
      </div>

      {/* Task rows */}
      <div className="p-4 space-y-3.5">
        {rows.map(([taskId, { title, tag, hours }]) => {
          const pct = totalHours > 0 ? (hours / totalHours) * 100 : 0;
          const dotColor = tagColors[tag] ?? "#8BA7C9";
          return (
            <div key={taskId}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: dotColor }}
                  />
                  <span
                    className="text-[12.5px] font-medium truncate"
                    style={{ color: "var(--dark-neutral)" }}
                    title={title}
                  >
                    {title}
                  </span>
                </div>
                <span
                  className="text-[12px] font-bold shrink-0 ml-2 tabular-nums"
                  style={{ color: "var(--accent-blue)" }}
                >
                  {formatHours(hours)}
                </span>
              </div>
              <div
                className="h-[5px] rounded-full overflow-hidden"
                style={{ background: "rgba(209,216,228,0.35)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: dotColor, opacity: 0.7 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total footer */}
      <div
        className="mx-4 mb-4 px-4 py-3 rounded-xl flex items-center justify-between"
        style={{ background: "rgba(44,62,107,0.05)", border: "1px solid rgba(44,62,107,0.08)" }}
      >
        <span className="text-[11.5px] font-bold uppercase tracking-wider" style={{ color: "var(--navy)" }}>
          Total
        </span>
        <span className="font-serif font-bold text-[16px]" style={{ color: "var(--navy)" }}>
          {formatHours(totalHours)}
        </span>
      </div>
    </div>
  );
}
