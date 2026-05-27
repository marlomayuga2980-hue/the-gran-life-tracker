"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Trash2, Play, Pause, Square, Timer, Loader2 } from "lucide-react";
import { getWeekStart, nextWeek, prevWeek, formatWeekRange, formatHours } from "@/lib/utils";
import { WeekSummary } from "./WeekSummary";
import { tagAccentColor } from "./TagBadge";
import { format, isToday, isYesterday } from "date-fns";
import type { Task, TimeEntry } from "@/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

type TimerState = "idle" | "running" | "paused";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function friendlyDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return `Today · ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday · ${format(d, "h:mm a")}`;
  return format(d, "MMM d · h:mm a");
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function TimeTrackerPanel({ tasks }: { tasks: Task[] }) {
  // Timer
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [elapsed, setElapsed] = useState(0); // seconds
  const [activeTaskId, setActiveTaskId] = useState(tasks[0]?.id ?? "");
  const [activeNotes, setActiveNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const accumulatedRef = useRef(0);   // seconds accumulated before last pause
  const startRef = useRef(0);          // Date.now() when last started/resumed
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Entries / week
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart());
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const weekStartISO = weekStart.toISOString();

  // Cleanup on unmount
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  // Fetch entries for selected week
  const fetchEntries = useCallback(async () => {
    setLoadingEntries(true);
    try {
      const res = await fetch(`/api/time-entries?weekStart=${encodeURIComponent(weekStartISO)}`);
      const data: TimeEntry[] = await res.json();
      setEntries(data);
    } catch (e) { console.error(e); }
    finally { setLoadingEntries(false); }
  }, [weekStartISO]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  // ─── Timer controls ─────────────────────────────────────────────────────

  const tick = useCallback(() => {
    setElapsed(accumulatedRef.current + Math.floor((Date.now() - startRef.current) / 1000));
  }, []);

  const start = () => {
    startRef.current = Date.now();
    intervalRef.current = setInterval(tick, 1000);
    setTimerState("running");
  };

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    accumulatedRef.current = elapsed;
    setTimerState("paused");
  };

  const resume = () => {
    startRef.current = Date.now();
    intervalRef.current = setInterval(tick, 1000);
    setTimerState("running");
  };

  const stop = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const totalSeconds = elapsed;

    // Reset immediately for snappy UX
    setElapsed(0);
    accumulatedRef.current = 0;
    setTimerState("idle");

    if (totalSeconds < 5 || !activeTaskId) return;

    setSaving(true);
    try {
      const hours = Math.max(0.01, Math.round((totalSeconds / 3600) * 10000) / 10000);
      const res = await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: activeTaskId,
          hours,
          date: new Date().toISOString(),
          weekStart: weekStartISO,
          notes: activeNotes || undefined,
        }),
      });
      const created: TimeEntry = await res.json();
      setEntries((prev) => [created, ...prev]);
      setActiveNotes("");
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const deleteEntry = async (id: string) => {
    await fetch(`/api/time-entries/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);
  const totalWeekHours = entries.reduce((sum, e) => sum + e.hours, 0);
  const isRunning = timerState === "running";
  const isPaused = timerState === "paused";
  const isActive = isRunning || isPaused;

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 animate-fade-up">

      {/* ══ TIMER CARD ══════════════════════════════════════════════════════ */}
      {isActive ? (
        /* ── Active state (running / paused) ── */
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(145deg, #1a2544 0%, #2C3E6B 55%, #283f6e 100%)",
            boxShadow: "0 20px 60px rgba(26,37,68,0.35), 0 8px 20px rgba(26,37,68,0.2)",
          }}
        >
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(201,217,244,0.045) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Subtle top highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
          />

          <div className="relative px-7 py-8">
            {/* Status row */}
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${isRunning ? "animate-pulse" : ""}`}
                  style={{ background: isRunning ? "#22c55e" : "#f59e0b" }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.15em]"
                  style={{ color: isRunning ? "rgba(34,197,94,0.9)" : "rgba(245,158,11,0.9)" }}
                >
                  {isRunning ? "Recording" : "Paused"}
                </span>
              </div>

              {activeTask && (
                <span
                  className="text-[11.5px] font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(201,217,244,0.65)",
                  }}
                >
                  {activeTask.tag}
                </span>
              )}
            </div>

            {/* Timer digits */}
            <div className="text-center mb-4">
              <div
                className="font-mono font-bold text-white select-none"
                style={{
                  fontSize: "clamp(54px, 12vw, 84px)",
                  letterSpacing: "0.06em",
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 4px 30px rgba(0,0,0,0.5)",
                  opacity: isPaused ? 0.45 : 1,
                  transition: "opacity 0.5s ease",
                  lineHeight: 1,
                }}
              >
                {formatTime(elapsed)}
              </div>

              <div className="mt-3 space-y-1">
                {activeTask && (
                  <p className="text-[14px] font-semibold" style={{ color: "rgba(201,217,244,0.72)" }}>
                    {activeTask.title}
                  </p>
                )}
                {activeNotes && (
                  <p className="text-[12.5px] italic" style={{ color: "rgba(201,217,244,0.38)" }}>
                    &ldquo;{activeNotes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="my-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {isRunning ? (
                <button
                  onClick={pause}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all duration-150 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.09)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.88)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.16)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)"; }}
                >
                  <Pause className="w-4 h-4" fill="currentColor" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resume}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all duration-150 cursor-pointer"
                  style={{
                    background: "rgba(34,197,94,0.16)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    color: "rgba(34,197,94,1)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.26)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.16)"; }}
                >
                  <Play className="w-4 h-4" fill="currentColor" />
                  Resume
                </button>
              )}

              <button
                onClick={stop}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all duration-150 cursor-pointer disabled:opacity-60"
                style={{
                  background: "rgba(239,68,68,0.14)",
                  border: "1px solid rgba(239,68,68,0.28)",
                  color: "rgba(239,68,68,0.95)",
                }}
                onMouseEnter={(e) => { if (!saving) (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.24)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.14)"; }}
              >
                {saving
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Square className="w-4 h-4" fill="currentColor" />
                }
                {saving ? "Saving…" : "Stop & Save"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Idle state ── */
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(201,217,244,0.65)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* Idle header strip */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(201,217,244,0.35)", background: "rgba(246,247,249,0.6)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(44,62,107,0.07) 0%, rgba(74,111,165,0.1) 100%)",
                border: "1px solid rgba(44,62,107,0.08)",
              }}
            >
              <Timer className="w-4.5 h-4.5" style={{ color: "var(--navy)" }} />
            </div>
            <div>
              <h2
                className="font-serif font-semibold text-[17px]"
                style={{ color: "var(--navy)", letterSpacing: "-0.02em" }}
              >
                Start a Timer
              </h2>
              <p className="text-[12px] mt-0.5" style={{ color: "#9ba8bb" }}>
                Select a task, hit Start — pause and stop anytime
              </p>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* Task selector */}
              <div>
                <label
                  className="block text-[10.5px] font-bold uppercase tracking-[0.12em] mb-1.5"
                  style={{ color: "#9ba8bb" }}
                >
                  Task
                </label>
                <select
                  value={activeTaskId}
                  onChange={(e) => setActiveTaskId(e.target.value)}
                  className="input-base w-full px-3.5 py-2.5 text-[13.5px] cursor-pointer"
                  style={{ borderRadius: "10px" }}
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label
                  className="block text-[10.5px] font-bold uppercase tracking-[0.12em] mb-1.5"
                  style={{ color: "#9ba8bb" }}
                >
                  Notes <span style={{ color: "rgba(155,168,187,0.6)", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>· optional</span>
                </label>
                <input
                  type="text"
                  value={activeNotes}
                  onChange={(e) => setActiveNotes(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") start(); }}
                  placeholder="What are you working on?"
                  className="input-base w-full px-3.5 py-2.5 text-[13.5px]"
                  style={{ borderRadius: "10px" }}
                />
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={start}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-[14.5px] transition-all duration-200 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "white",
                boxShadow: "0 4px 18px rgba(34,197,94,0.28), 0 2px 6px rgba(34,197,94,0.14)",
                letterSpacing: "0.025em",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.transform = "translateY(-1px)";
                b.style.boxShadow = "0 8px 24px rgba(34,197,94,0.35), 0 2px 8px rgba(34,197,94,0.2)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.transform = "none";
                b.style.boxShadow = "0 4px 18px rgba(34,197,94,0.28), 0 2px 6px rgba(34,197,94,0.14)";
              }}
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Start Timer
            </button>
          </div>
        </div>
      )}

      {/* ══ WEEK NAVIGATOR ══════════════════════════════════════════════════ */}
      <div
        className="flex items-center justify-between rounded-2xl px-5 py-3.5"
        style={{
          background: "white",
          border: "1px solid rgba(201,217,244,0.5)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <button
          onClick={() => setWeekStart((w) => prevWeek(w))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer"
          style={{ color: "var(--navy)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,217,244,0.45)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          aria-label="Previous week"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#9ba8bb" }}>
            Week of
          </p>
          <p className="font-serif font-semibold text-[15px]" style={{ color: "var(--dark-neutral)" }}>
            {formatWeekRange(weekStart)}
          </p>
          {totalWeekHours > 0 && (
            <p className="text-[11.5px] font-bold mt-0.5" style={{ color: "#C4A870" }}>
              {formatHours(totalWeekHours)} logged
            </p>
          )}
        </div>

        <button
          onClick={() => setWeekStart((w) => nextWeek(w))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer"
          style={{ color: "var(--navy)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(201,217,244,0.45)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          aria-label="Next week"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ══ SESSIONS + SUMMARY ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Session history */}
        <div
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(201,217,244,0.5)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-3.5 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(209,216,228,0.4)", background: "rgba(246,247,249,0.7)" }}
          >
            <span className="text-[11.5px] font-bold uppercase tracking-wider" style={{ color: "var(--navy)" }}>
              Recorded Sessions
            </span>
            <div className="flex items-center gap-2">
              {loadingEntries && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#9ba8bb" }} />}
              {entries.length > 0 && (
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(44,62,107,0.07)", color: "var(--navy)" }}
                >
                  {entries.length} {entries.length === 1 ? "session" : "sessions"}
                </span>
              )}
            </div>
          </div>

          {/* Empty state */}
          {entries.length === 0 && !loadingEntries && (
            <div className="py-14 text-center px-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(201,217,244,0.2)", border: "1px solid rgba(201,217,244,0.4)" }}
              >
                <Timer className="w-7 h-7" style={{ color: "#8BA7C9" }} />
              </div>
              <p className="font-serif font-semibold text-[15px] mb-1" style={{ color: "var(--dark-neutral)" }}>
                No sessions this week
              </p>
              <p className="text-[12.5px] max-w-xs mx-auto" style={{ color: "#9ba8bb" }}>
                Hit <strong style={{ color: "#16a34a" }}>Start Timer</strong> above to begin tracking. Sessions save automatically when you stop.
              </p>
            </div>
          )}

          {/* Session rows */}
          {entries.length > 0 && (
            <div>
              {entries.map((entry, idx) => {
                const task = tasks.find((t) => t.id === entry.taskId);
                const accent = task ? tagAccentColor(task.tag) : "#8BA7C9";
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150"
                    style={{
                      borderBottom: idx < entries.length - 1 ? "1px solid rgba(209,216,228,0.3)" : "none",
                      borderLeft: `3px solid ${accent}`,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(246,247,249,0.8)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                  >
                    {/* Task dot */}
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: accent }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--dark-neutral)" }}>
                        {task?.title ?? "Unknown Task"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[11.5px]" style={{ color: "#9ba8bb" }}>
                          {friendlyDate(entry.date)}
                        </span>
                        {entry.notes && (
                          <>
                            <span style={{ color: "rgba(209,216,228,0.9)" }}>·</span>
                            <span className="text-[11.5px] italic truncate max-w-[200px]" style={{ color: "#b0bec9" }}>
                              {entry.notes}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Hours + delete */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span
                        className="font-serif font-bold text-[15px] tabular-nums"
                        style={{ color: "var(--navy)" }}
                      >
                        {formatHours(entry.hours)}
                      </span>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer"
                        style={{ color: "#c8d3dd" }}
                        onMouseEnter={(e) => {
                          const b = e.currentTarget as HTMLButtonElement;
                          b.style.background = "rgba(239,68,68,0.08)";
                          b.style.color = "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                          const b = e.currentTarget as HTMLButtonElement;
                          b.style.background = "transparent";
                          b.style.color = "#c8d3dd";
                        }}
                        aria-label="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Week summary */}
        <div>
          <WeekSummary entries={entries} />
        </div>
      </div>
    </div>
  );
}
