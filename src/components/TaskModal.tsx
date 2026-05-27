"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { PHASES, TAGS, STATUSES } from "@/lib/utils";
import type { Task, TaskFormData } from "@/types";

interface TaskModalProps {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (data: TaskFormData) => Promise<void>;
}

const DEFAULT_FORM: TaskFormData = {
  title: "",
  description: "",
  phase: PHASES[0],
  tag: TAGS[0],
  status: "Not Started",
  steps: [""],
  notes: "",
};

export function TaskModal({ open, task, onClose, onSave }: TaskModalProps) {
  const [form, setForm] = useState<TaskFormData>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        phase: task.phase,
        tag: task.tag,
        status: task.status,
        steps: (() => {
          try {
            const p = JSON.parse(task.steps);
            return Array.isArray(p) && p.length > 0 ? p : [""];
          } catch { return [""]; }
        })(),
        notes: task.notes ?? "",
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setError("");
  }, [task, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({ ...form, steps: form.steps.filter((s) => s.trim()) });
      onClose();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const addStep = () => setForm((f) => ({ ...f, steps: [...f.steps, ""] }));
  const removeStep = (i: number) => setForm((f) => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));
  const updateStep = (i: number, val: string) =>
    setForm((f) => ({ ...f, steps: f.steps.map((s, idx) => (idx === i ? val : s)) }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white z-10"
          style={{ borderBottom: "1px solid rgba(209,216,228,0.5)", borderRadius: "20px 20px 0 0" }}
        >
          <div>
            <h2 className="font-serif font-semibold text-[19px]" style={{ color: "var(--dark-neutral)" }}>
              {task ? "Edit Task" : "Add New Task"}
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: "#9ba8bb" }}>
              {task ? "Update task details" : "Create a new task for the launch tracker"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer"
            style={{ color: "#9ba8bb" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(209,216,228,0.4)";
              (e.currentTarget as HTMLButtonElement).style.color = "#4e5f73";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#9ba8bb";
            }}
            aria-label="Close modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <Field label="Task Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="input-base w-full px-3.5 py-2.5 text-[13.5px]"
              placeholder="e.g. Deploy landing page to Shopify"
            />
          </Field>

          {/* Description */}
          <Field label="Description" required>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="input-base w-full px-3.5 py-2.5 text-[13.5px] resize-none"
              placeholder="What needs to be done and why…"
            />
          </Field>

          {/* Phase + Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Phase">
              <select
                value={form.phase}
                onChange={(e) => setForm((f) => ({ ...f, phase: e.target.value }))}
                className="input-base w-full px-3.5 py-2.5 text-[13.5px] bg-white cursor-pointer"
              >
                {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Tag">
              <select
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                className="input-base w-full px-3.5 py-2.5 text-[13.5px] bg-white cursor-pointer"
              >
                {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          {/* Status */}
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="input-base w-full px-3.5 py-2.5 text-[13.5px] bg-white cursor-pointer"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          {/* Steps */}
          <Field label="Steps">
            <div className="space-y-2">
              {form.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-bold w-5 text-center shrink-0 rounded-full w-4 h-4 flex items-center justify-center"
                    style={{ background: "rgba(214,188,138,0.2)", color: "var(--gold-dark, #C4A870)" }}
                  >
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    className="input-base flex-1 px-3 py-2 text-[13px]"
                    placeholder={`Step ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    disabled={form.steps.length === 1}
                    className="w-6 h-6 rounded flex items-center justify-center transition-colors duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: "#c0cad8" }}
                    onMouseEnter={(e) => { if (form.steps.length > 1) (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#c0cad8"; }}
                    aria-label="Remove step"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors duration-150 cursor-pointer"
              style={{ color: "var(--accent-blue)" }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Step
            </button>
          </Field>

          {/* Notes */}
          <Field label="Notes" hint="optional">
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={2}
              className="input-base w-full px-3.5 py-2.5 text-[13.5px] resize-none"
              placeholder="Any internal notes, blockers, or context…"
            />
          </Field>

          {/* Error */}
          {error && (
            <div
              className="text-[13px] px-4 py-2.5 rounded-xl"
              style={{ background: "rgba(239,68,68,0.06)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              {error}
            </div>
          )}

          {/* Footer actions */}
          <div
            className="flex gap-3 justify-end pt-3"
            style={{ borderTop: "1px solid rgba(209,216,228,0.5)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-150 cursor-pointer"
              style={{
                background: "rgba(246,247,249,0.8)",
                color: "#4e5f73",
                border: "1px solid rgba(209,216,228,0.6)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-navy px-6 py-2.5 text-[13px]"
              style={{ opacity: saving ? 0.65 : 1 }}
            >
              {saving ? "Saving…" : task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider mb-1.5"
        style={{ color: "#7a8fa8" }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}>*</span>}
        {hint && (
          <span className="normal-case tracking-normal font-normal ml-1" style={{ color: "#b0bec9" }}>
            ({hint})
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
