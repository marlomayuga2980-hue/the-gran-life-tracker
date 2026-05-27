"use client";

import { Clock, LayoutDashboard } from "lucide-react";

type ActiveTab = "board" | "time";

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="header-glass sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center h-[60px]">
          {/* Brand mark */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Gold monogram */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-serif font-bold text-navy text-[15px]"
              style={{
                background: "linear-gradient(135deg, #EDD99E 0%, #D6BC8A 60%, #C4A870 100%)",
                boxShadow: "0 2px 10px rgba(214,188,138,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
            >
              G
            </div>

            <div className="min-w-0">
              <h1
                className="text-white font-serif font-semibold leading-tight truncate"
                style={{ fontSize: "clamp(14px, 2.5vw, 17px)", letterSpacing: "-0.015em" }}
              >
                The Gran Life
              </h1>
              <p
                className="text-[9.5px] leading-none mt-0.5 font-semibold tracking-[0.18em] uppercase hidden sm:block"
                style={{ color: "rgba(201,217,244,0.5)" }}
              >
                Task Tracker
              </p>
            </div>
          </div>
        </div>

        {/* Tab row */}
        <div
          className="flex items-center gap-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <TabButton
            active={activeTab === "board"}
            onClick={() => onTabChange("board")}
            icon={<LayoutDashboard className="w-3.5 h-3.5" />}
            label="Task Board"
          />
          <TabButton
            active={activeTab === "time"}
            onClick={() => onTabChange("time")}
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Time Tracker"
          />
        </div>
      </div>
    </header>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer relative"
      style={{
        color: active ? "#ffffff" : "rgba(255,255,255,0.45)",
        letterSpacing: "0.02em",
      }}
    >
      {icon}
      {label}
      {/* Gold underline indicator */}
      <span
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full transition-all duration-200"
        style={{
          background: active
            ? "linear-gradient(90deg, #D6BC8A, #E8D09F)"
            : "transparent",
          opacity: active ? 1 : 0,
        }}
      />
    </button>
  );
}
