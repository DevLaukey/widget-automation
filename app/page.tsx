"use client";

import { useState } from "react";
import { EditorProvider } from "@/context/EditorContext";
import { EditorShell } from "@/components/editor";
import { BjjEditorShell } from "@/components/bjj";

type WidgetType = "counter" | "bjj";

const WIDGET_OPTIONS: { key: WidgetType; label: string; sub: string }[] = [
  { key: "counter", label: "Counter Widget", sub: "Animated stat cards" },
  { key: "bjj", label: "BJJ Submission Bonus", sub: "Fight night scoreboard" },
];

export default function Home() {
  const [widgetType, setWidgetType] = useState<WidgetType | null>(null);

  if (widgetType === "counter") {
    return (
      <EditorProvider>
        <EditorShell onBack={() => setWidgetType(null)} />
      </EditorProvider>
    );
  }

  if (widgetType === "bjj") {
    return <BjjEditorShell onBack={() => setWidgetType(null)} />;
  }

  // Landing — widget picker
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
        Widget Builder
      </h1>
      <p className="text-gray-400 text-sm mb-10">Choose a widget to build</p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
        {WIDGET_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setWidgetType(opt.key)}
            className="flex-1 flex flex-col items-start gap-1 p-6 rounded-2xl bg-gray-900 border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all text-left group"
          >
            <span className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
              {opt.label}
            </span>
            <span className="text-xs text-gray-500">{opt.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
