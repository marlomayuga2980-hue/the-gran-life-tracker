"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronRight, Pencil, Clock } from "lucide-react";
import { TagBadge, tagAccentColor } from "./TagBadge";
import { StatusBadge } from "./StatusBadge";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { formatRelative } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  mode: "admin" | "client";
  index?: number;
  onStatusChange?: (id: string, status: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onNotesChange?: (id: string, notes: string) => void;
}

export function TaskCard({
  task,
  mode,
  index = 0,
  onStatusChange,
  onEdit,
  onDelete,
  onNotesChange,
}: TaskCardProps) {
  const [stepsOpen, setStepsOpen] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  let steps: string[] = [];
  try {
    const parsed = JSON.parse(task.steps);
    steps = Array.isArray(parsed) ? parsed : [];
  } catch {
    steps = [];
  }

  const totalHours = (task.timeEntries ?? []).reduce((sum, e) => sum + e.hours, 0);
  const accentColor = tagAccentColor(task.tag);

  const handleNoteBlur = () => {
    if (onNotesChange && notesRef.current) {
      onNotesChange(task.id, notesRef.current.value);
    }
  };

  return (
    <article
      className="task-card animate-fade-up flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
      aria-label={task.title}
    >
      {/* Tag-colored top accent strip */}
      <div
        className="h-[3px] w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}88 100%)`,
        }}
      />

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Header row: title + actions */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <TagBadge tag={task.tag} />
              <StatusBadge
                status={task.status}
                clickable={mode === "admin"}
                onCycle={
                  mode === "admin" && onStatusChange
                    ? (next) => onStatusChange(task.id, next)
                    : undefined
                }
              />
            </div>
            {/* Title */}
            <h3
              className="font-serif font-semibold leading-snug line-clamp-2"
              style={{
                fontSize: "15px",
                color: "var(--dark-neutral)",
                letterSpacing: "-0.01em",
              }}
            >
              {task.title}
            </h3>
          </div>

          {/* Admin actions */}
          {mode === "admin" && (
            <div className="flex items-center gap-0.5 shrink-0 -mt-0.5">
              <button
                onClick={() => onEdit?.(task)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer"
                style={{ color: "#9ba8bb" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,111,165,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#4A6FA5";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#9ba8bb";
                }}
                aria-label="Edit task"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <DeleteConfirmDialog
                taskTitle={task.title}
                onConfirm={() => onDelete?.(task.id)}
              />
            </div>
          )}
        </div>

        {/* Description */}
        <p
          className="text-[13px] leading-relaxed line-clamp-3"
          style={{ color: "#5e6f85" }}
        >
          {task.description}
        </p>

        {/* Steps toggle */}
        {steps.length > 0 && (
          <div>
            <button
              onClick={() => setStepsOpen((v) => !v)}
              className="flex items-center gap-1.5 text-[12px] font-semibold transition-colors duration-150 cursor-pointer"
              style={{ color: stepsOpen ? "var(--accent-blue)" : "#8ba7c9" }}
              aria-expanded={stepsOpen}
            >
              <span
                className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                style={{
                  background: stepsOpen ? "rgba(74,111,165,0.1)" : "rgba(139,167,201,0.1)",
                  transform: stepsOpen ? "rotate(0deg)" : "",
                }}
              >
                {stepsOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </span>
              {steps.length} step{steps.length !== 1 ? "s" : ""}
            </button>

            <div className={stepsOpen ? "steps-expanded" : "steps-collapsed"}>
              <ol className="mt-2.5 space-y-1.5">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[12.5px]" style={{ color: "#4e5f73" }}>
                    <span
                      className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ background: "rgba(214,188,138,0.2)", color: "var(--gold-dark, #C4A870)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Notes */}
        {mode === "admin" ? (
          <div>
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: "#9ba8bb" }}
            >
              Notes
            </label>
            <textarea
              ref={notesRef}
              defaultValue={task.notes ?? ""}
              onBlur={handleNoteBlur}
              rows={2}
              placeholder="Add notes…"
              className="input-base w-full px-3 py-2 text-[12.5px] resize-none"
              style={{ background: "rgba(246,247,249,0.7)" }}
            />
          </div>
        ) : task.notes ? (
          <div
            className="rounded-xl px-3.5 py-2.5"
            style={{ background: "rgba(201,217,244,0.18)", border: "1px solid rgba(201,217,244,0.5)" }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--soft-blue)" }}>
              Notes
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--dark-neutral)" }}>
              {task.notes}
            </p>
          </div>
        ) : null}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-2.5 mt-auto"
          style={{ borderTop: "1px solid rgba(209,216,228,0.4)" }}
        >
          <span className="text-[11.5px]" style={{ color: "#9ba8bb" }}>
            Updated {formatRelative(task.updatedAt)}
          </span>
          {totalHours > 0 && (
            <span
              className="flex items-center gap-1 text-[11.5px] font-semibold"
              style={{ color: "var(--accent-blue)" }}
            >
              <Clock className="w-3 h-3" />
              {totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)}h
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
