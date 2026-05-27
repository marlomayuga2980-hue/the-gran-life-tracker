"use client";

import { PhaseGroup } from "./PhaseGroup";
import { OverallProgress } from "./OverallProgress";
import { PHASES } from "@/lib/utils";
import type { Task } from "@/types";

export function ClientView({ tasks }: { tasks: Task[] }) {
  return (
    <div>
      {/* Hero banner */}
      <div
        className="rounded-2xl overflow-hidden mb-8 relative"
        style={{
          background: "linear-gradient(135deg, #1e2d53 0%, var(--navy) 50%, #2a3f72 100%)",
          boxShadow: "0 8px 32px rgba(44,62,107,0.25)",
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(201,217,244,0.06) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative px-7 py-8">
          {/* Live badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full inline-block animate-pulse"
                style={{ background: "#22c55e" }}
              />
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: "rgba(201,217,244,0.65)" }}
              >
                Live Dashboard
              </span>
            </span>
          </div>

          <h1
            className="font-serif font-semibold text-white mb-2"
            style={{ fontSize: "clamp(20px, 4vw, 28px)", letterSpacing: "-0.02em" }}
          >
            The Gran Life — Project Dashboard
          </h1>
          <p className="text-[13.5px]" style={{ color: "rgba(201,217,244,0.65)" }}>
            Updated in real time by Marlo · All phases and progress shown below
          </p>

          {/* Inline progress in banner */}
          <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <ClientBannerProgress tasks={tasks} />
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-12">
        {PHASES.map((phase) => (
          <PhaseGroup
            key={phase}
            phase={phase}
            tasks={tasks.filter((t) => t.phase === phase)}
            mode="client"
          />
        ))}
      </div>

      {/* Watermark */}
      <div className="client-watermark">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Client View
      </div>
    </div>
  );
}

function ClientBannerProgress({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "Done").length;
  const inProg = tasks.filter((t) => t.status === "In Progress").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "rgba(201,217,244,0.55)" }}>
            Overall Progress
          </span>
          <span className="font-serif text-xl font-semibold text-white">{pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div
            className="h-full progress-gold-fill rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="flex gap-4 text-[12px]" style={{ color: "rgba(201,217,244,0.6)" }}>
        <span><strong className="text-white">{done}</strong> done</span>
        <span><strong className="text-white">{inProg}</strong> in progress</span>
        <span><strong className="text-white">{total}</strong> total</span>
      </div>
    </div>
  );
}
