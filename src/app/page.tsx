"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { OverallProgress } from "@/components/OverallProgress";
import { AdminView } from "@/components/AdminView";
import { TimeTrackerPanel } from "@/components/TimeTrackerPanel";
import type { Task } from "@/types";

type ActiveTab = "board" | "time";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("board");

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((data) => { setTasks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--off-white)" }}>
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-5">
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent"
              style={{
                borderTopColor: "var(--navy)",
                borderRightColor: "var(--gold)",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
          <p className="font-serif font-semibold text-[18px]" style={{ color: "var(--navy)" }}>
            The Gran Life
          </p>
          <p className="text-[13px] mt-1" style={{ color: "#9ba8bb" }}>
            Loading your task tracker…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--off-white)" }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "board" && <OverallProgress tasks={tasks} />}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {activeTab === "time" ? (
          <TimeTrackerPanel tasks={tasks} />
        ) : (
          <AdminView
            tasks={tasks}
            onTasksChange={(updater) => setTasks((prev) => updater(prev))}
          />
        )}
      </main>

      <footer
        className="text-center py-4"
        style={{
          borderTop: "1px solid rgba(209,216,228,0.4)",
          background: "white",
        }}
      >
        <p className="text-[11px] font-medium" style={{ color: "#b0bec9" }}>
          The Gran Life Task Tracker · Built for Marlo
        </p>
      </footer>
    </div>
  );
}
