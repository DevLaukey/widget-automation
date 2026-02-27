"use client";

import { useState } from "react";
import { useEditor } from "@/context/EditorContext";
import { CardsTab } from "./CardsTab";
import { StylesTab } from "./StylesTab";
import { LayoutTab } from "./LayoutTab";
import { ExportTab } from "./ExportTab";
import { LivePreview } from "./LivePreview";
import type { EditorTab } from "@/types/editor";

const TABS: { key: EditorTab; label: string }[] = [
  { key: "cards", label: "Cards" },
  { key: "styles", label: "Styles" },
  { key: "layout", label: "Layout" },
  { key: "preview", label: "Export" },
];

export function EditorShell({ onBack }: { onBack?: () => void }) {
  const { state, dispatch, undo, redo, canUndo, canRedo, save, isDirty, isSaving } = useEditor();
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");

  const renderTab = () => {
    switch (state.activeTab) {
      case "cards":
        return <CardsTab />;
      case "styles":
        return <StylesTab />;
      case "layout":
        return <LayoutTab />;
      case "preview":
        return <ExportTab />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden">
      {/* Mobile Toggle Bar */}
      <div className="flex md:hidden border-b border-gray-700 shrink-0 items-center">
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-2.5 text-xs text-gray-400 hover:text-white border-r border-gray-700 shrink-0"
          >
            ←
          </button>
        )}
        <button
          onClick={() => setMobileView("editor")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobileView === "editor"
              ? "text-blue-400 border-b-2 border-blue-400 bg-gray-800"
              : "text-gray-400"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobileView === "preview"
              ? "text-blue-400 border-b-2 border-blue-400 bg-gray-800"
              : "text-gray-400"
          }`}
        >
          Preview
        </button>
      </div>

      {/* Sidebar - full width on mobile, fixed width on desktop */}
      <div
        className={`w-full md:w-[400px] shrink-0 flex flex-col border-r border-gray-700 bg-gray-900 ${
          mobileView === "editor" ? "flex" : "hidden md:flex"
        }`}
        style={{ minHeight: 0 }}
      >
        {/* Top Bar */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-700 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="hidden md:block px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-700 transition-colors shrink-0"
            >
              ← Back
            </button>
          )}
          <input
            type="text"
            value={state.widget.name}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_WIDGET_NAME",
                payload: { name: e.target.value },
              })
            }
            className="flex-1 min-w-0 px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            ↩
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            ↪
          </button>
          <button
            onClick={save}
            disabled={isSaving || !isDirty}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              isSaving
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : isDirty
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-gray-800 text-gray-500 cursor-default border border-gray-600"
            }`}
          >
            {isSaving ? "Saving…" : isDirty ? "Save" : "Saved"}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                dispatch({ type: "SET_ACTIVE_TAB", payload: tab.key })
              }
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                state.activeTab === tab.key
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">{renderTab()}</div>
      </div>

      {/* Live Preview - hidden on mobile when editor is shown */}
      <div
        className={`flex-1 min-w-0 min-h-0 ${
          mobileView === "preview" ? "flex flex-col" : "hidden md:flex md:flex-col"
        }`}
      >
        <LivePreview />
      </div>
    </div>
  );
}

export default EditorShell;
