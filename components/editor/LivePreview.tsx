"use client";

import { useEditor } from "@/context/EditorContext";
import { CounterWidget } from "@/components/counter";

export function LivePreview() {
  const { state } = useEditor();

  return (
    <div className="flex flex-col h-full">
      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-gray-950 p-2 sm:p-6">
        <CounterWidget config={state.widget} />
      </div>
    </div>
  );
}

export default LivePreview;
