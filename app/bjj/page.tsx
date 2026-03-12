"use client";

import { useEffect, useState, useCallback } from "react";
import { BjjWidget, DEFAULT_BJJ_CONFIG } from "@/components/bjj/BjjWidget";
import type { BjjConfig } from "@/components/bjj/BjjWidget";

export default function BjjEmbedPage() {
  const [config, setConfig] = useState<BjjConfig>(DEFAULT_BJJ_CONFIG);
  const [stoppedAttack, setStoppedAttack] = useState<string | undefined>(undefined);

  useEffect(() => {
    function fetchConfig() {
      fetch("/api/bjj")
        .then((res) => res.json())
        .then((data) => {
          if (data?.config) {
            const parsed: BjjConfig = data.config;
            setConfig({
              ...parsed,
              attacks: parsed.attacks?.length ? parsed.attacks : DEFAULT_BJJ_CONFIG.attacks,
            });
          }
          if (data?.stoppedAttack) {
            setStoppedAttack(data.stoppedAttack);
          }
        })
        .catch(() => {});
    }

    fetchConfig();
    const poll = setInterval(fetchConfig, 5000);
    return () => clearInterval(poll);
  }, []);

  const handleStop = useCallback((attack: string) => {
    setStoppedAttack(attack);
    fetch("/api/bjj", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stoppedAttack: attack }),
    }).catch(() => {});
  }, []);

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
      <BjjWidget config={config} initialAttack={stoppedAttack} onStop={handleStop} />
    </div>
  );
}
