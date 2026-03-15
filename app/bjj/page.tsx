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
            const base: BjjConfig = {
              ...parsed,
              attacks: parsed.attacks?.length ? parsed.attacks : DEFAULT_BJJ_CONFIG.attacks,
            };

            // Auto-detect which event is currently active (between its start and expiry).
            // Sort descending by start time so the most recently started event wins
            // when multiple events overlap.
            const now = Date.now();
            const events: {
              label: string;
              amount: string;
              eventDateTime: string;
              expiresAt: string;
              attackName: string;
              attacks: string[];
            }[] = Array.isArray(data.events) ? data.events : [];

            const active = [...events]
              .sort((a, b) => new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime())
              .find(
                (e) => new Date(e.eventDateTime).getTime() <= now && now < new Date(e.expiresAt).getTime()
              );

            if (active) {
              // Active event overrides everything — loop stops, event details shown.
              // Clear stoppedAttack so a previous event's manual stop can't bleed in.
              setStoppedAttack(undefined);
              setConfig({
                ...base,
                amount:           active.amount,
                eventLabel:       active.label,
                eventDateTime:    active.eventDateTime,
                expiresAt:        active.expiresAt,
                activeAttackName: active.attackName,
                attacks:          active.attacks?.length ? active.attacks : base.attacks,
              });
            } else {
              // No active event — loop freely, clear any stale event fields.
              // Only then honour a persisted stoppedAttack (manual loop-stop feature).
              setConfig({
                ...base,
                eventDateTime:    "",
                expiresAt:        "",
                activeAttackName: "",
              });
              if (data?.stoppedAttack) {
                setStoppedAttack(data.stoppedAttack);
              }
            }
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

  const handleResume = useCallback(() => {
    setStoppedAttack(undefined);
    fetch("/api/bjj", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stoppedAttack: null }),
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
      <BjjWidget config={config} initialAttack={stoppedAttack} onStop={handleStop} onResume={handleResume} />
    </div>
  );
}
