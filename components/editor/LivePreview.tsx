"use client";

import { useEditor } from "@/context/EditorContext";
import { CounterWidget } from "@/components/counter";
import type { PreviewMode } from "@/types/editor";

const PREVIEW_WIDTHS: Record<PreviewMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export function LivePreview() {
  const { state, dispatch } = useEditor();
  const { previewMode } = state;

  return (
    <div className="flex flex-col h-full">
      {/* Preview Mode Toggle */}
      <div className="flex items-center justify-center gap-2 p-3 border-b border-gray-700 bg-gray-900 shrink-0">
        {(["desktop", "tablet", "mobile"] as PreviewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() =>
              dispatch({ type: "SET_PREVIEW_MODE", payload: mode })
            }
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              previewMode === mode
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-950 p-2 sm:p-6 flex justify-center">
        <div
          className="transition-all duration-300"
          style={{
            width: PREVIEW_WIDTHS[previewMode],
            maxWidth: "100%",
          }}
        >
          <CounterWidget config={state.widget} />
        </div>
      </div>
    </div>
  );
}

export default LivePreview;
