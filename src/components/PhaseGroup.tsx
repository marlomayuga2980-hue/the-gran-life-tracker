"use client";

import { TaskCard } from "./TaskCard";
import type { Task } from "@/types";

const PHASE_META: Record<string, { num: string; color: string }> = {
  "Phase 1 — This Week":           { num: "01", color: "#4A6FA5" },
  "Phase 2 — Next 1–2 Weeks":     { num: "02", color: "#7c3aed" },
  "Phase 3 — Once Logo is Approved": { num: "03", color: "#b45309" },
};

interface PhaseGroupProps {
  phase: string;
  tasks: Task[];
  mode: "admin" | "client";
  onStatusChange?: (id: string, status: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onNotesChange?: (id: string, notes: string) => void;
}

function PhaseProgressBar({ tasks }: { tasks: Task[] }) {
  const done = tasks.filter((t) => t.status === "Done").length;
  const inProg = tasks.filter((t) => t.status === "In Progress").length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
  const pctProg = tasks.length > 0 ? Math.round((inProg / tasks.length) * 100) : 0;

  return (
    <div className="flex items-center gap-3 flex-1">
      {/* Track */}
      <div
        className="flex-1 h-[6px] rounded-full overflow-hidden"
        style={{ background: "rgba(209,216,228,0.4)" }}
      >
        {/* In-progress (soft blue, behind done) */}
        <div
          className="h-full absolute"
          style={{
            width: `${pct + pctProg}%`,
            background: "rgba(139,167,201,0.35)",
            borderRadius: "99px",
            transition: "width 700ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {/* Done (gold shimmer) */}
        <div
          className="h-full progress-gold-fill"
          style={{ width: `${pct}%`, borderRadius: "99px" }}
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[12px] font-bold" style={{ color: "var(--dark-neutral)" }}>
          {done}/{tasks.length}
        </span>
        {pct > 0 && (
          <span
            className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(214,188,138,0.18)", color: "var(--gold-dark, #C4A870)" }}
          >
            {pct}%
          </span>
        )}
      </div>
    </div>
  );
}

export function PhaseGroup({
  phase,
  tasks,
  mode,
  onStatusChange,
  onEdit,
  onDelete,
  onNotesChange,
}: PhaseGroupProps) {
  if (tasks.length === 0) return null;

  const meta = PHASE_META[phase] ?? { num: "—", color: "#8BA7C9" };

  return (
    <section>
      {/* Phase header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-3">
          {/* Phase number pill */}
          <span
            className="text-[10px] font-bold tabular-nums px-2 py-1 rounded-md"
            style={{
              background: `${meta.color}14`,
              color: meta.color,
              border: `1px solid ${meta.color}22`,
              letterSpacing: "0.04em",
            }}
          >
            {meta.num}
          </span>

          {/* Phase title */}
          <h2
            className="font-serif font-semibold"
            style={{ fontSize: "18px", color: "var(--navy)", letterSpacing: "-0.02em" }}
          >
            {phase}
          </h2>

          {/* Task count */}
          <span className="phase-badge ml-0.5">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Progress bar */}
        <div className="pl-0 relative flex items-center gap-3">
          <PhaseProgressBar tasks={tasks} />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((task, i) => (
          <TaskCard
            key={task.id}
            task={task}
            mode={mode}
            index={i}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
            onNotesChange={onNotesChange}
          />
        ))}
      </div>
    </section>
  );
}
