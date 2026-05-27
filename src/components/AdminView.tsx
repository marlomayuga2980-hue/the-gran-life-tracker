"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PhaseGroup } from "./PhaseGroup";
import { TaskModal } from "./TaskModal";
import { PHASES } from "@/lib/utils";
import type { Task, TaskFormData } from "@/types";

interface AdminViewProps {
  tasks: Task[];
  onTasksChange: (updater: (tasks: Task[]) => Task[]) => void;
}

export function AdminView({ tasks, onTasksChange }: AdminViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    onTasksChange((prev) =>
      prev.map((t) => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)
    );
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const handleNotesChange = async (id: string, notes: string) => {
    onTasksChange((prev) =>
      prev.map((t) => t.id === id ? { ...t, notes, updatedAt: new Date().toISOString() } : t)
    );
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
  };

  const handleDelete = async (id: string) => {
    onTasksChange((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  };

  const handleSave = async (data: TaskFormData) => {
    const payload = { ...data, steps: JSON.stringify(data.steps) };
    if (editingTask) {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated: Task = await res.json();
      onTasksChange((prev) => prev.map((t) => t.id === updated.id ? { ...t, ...updated } : t));
    } else {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created: Task = await res.json();
      onTasksChange((prev) => [...prev, created]);
    }
  };

  const openEdit = (task: Task) => { setEditingTask(task); setModalOpen(true); };
  const openAdd = () => { setEditingTask(null); setModalOpen(true); };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif font-semibold text-[22px]" style={{ color: "var(--navy)", letterSpacing: "-0.02em" }}>
            Task Board
          </h2>
          <p className="text-[13px] mt-0.5" style={{ color: "#9ba8bb" }}>
            {tasks.length} tasks across {PHASES.length} phases
          </p>
        </div>
        <button
          onClick={openAdd}
          className="btn-navy flex items-center gap-2 px-4 py-2.5 text-[13px]"
          aria-label="Add new task"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Phases */}
      <div className="space-y-12">
        {PHASES.map((phase) => (
          <PhaseGroup
            key={phase}
            phase={phase}
            tasks={tasks.filter((t) => t.phase === phase)}
            mode="admin"
            onStatusChange={handleStatusChange}
            onEdit={openEdit}
            onDelete={handleDelete}
            onNotesChange={handleNotesChange}
          />
        ))}
      </div>

      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
