"use client";

import { BjjWidget, DEFAULT_BJJ_CONFIG } from "@/components/bjj/BjjWidget";

export default function BjjEmbedPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BjjWidget config={DEFAULT_BJJ_CONFIG} />
    </div>
  );
}
