"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  taskTitle: string;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({ taskTitle, onConfirm }: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer"
        style={{ color: "#9ba8bb" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
          (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#9ba8bb";
        }}
        aria-label="Delete task"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-panel max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(239,68,68,0.1)" }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: "#ef4444" }} />
              </div>

              <h3 className="font-serif text-[18px] font-semibold mb-2" style={{ color: "var(--dark-neutral)" }}>
                Delete Task
              </h3>
              <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: "#5e6f85" }}>
                Are you sure you want to delete{" "}
                <span className="font-semibold" style={{ color: "var(--dark-neutral)" }}>
                  &ldquo;{taskTitle}&rdquo;
                </span>
                ? This also removes all logged time entries for this task.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-150 cursor-pointer"
                  style={{
                    background: "rgba(246,247,249,0.8)",
                    color: "#4e5f73",
                    border: "1px solid rgba(209,216,228,0.6)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onConfirm(); setOpen(false); }}
                  className="flex-1 px-4 py-2.5 text-[13px] font-semibold text-white rounded-xl transition-all duration-150 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
                  }}
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
