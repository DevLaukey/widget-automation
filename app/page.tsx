"use client";

import { EditorProvider } from "@/context/EditorContext";
import { EditorShell } from "@/components/editor";

export default function Home() {
  return (
    <EditorProvider>
      <EditorShell />
    </EditorProvider>
  );
}
