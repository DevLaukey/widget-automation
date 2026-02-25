"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface BjjConfig {
  amount: string;
  eventLabel: string;
  mode: "looping" | "event";
  attackName: string;
  attacks: string[];
}

export const DEFAULT_BJJ_ATTACKS = [
  "REAR NAKED CHOKE",
  "TRIANGLE",
  "ARMBAR",
  "GUILLOTINE",
  "HEEL HOOK",
  "KIMURA",
  "ANACONDA CHOKE",
  "DARCE CHOKE",
  "BOW & ARROW CHOKE",
  "EZEKIEL CHOKE",
  "OMOPLATA",
  "NORTH-SOUTH CHOKE",
];

export const DEFAULT_BJJ_CONFIG: BjjConfig = {
  amount: "$5,000",
  eventLabel: "SUBMISSION BONUS — FIGHT NIGHT",
  mode: "looping",
  attackName: "REAR NAKED CHOKE",
  attacks: DEFAULT_BJJ_ATTACKS,
};

interface BjjWidgetProps {
  config: BjjConfig;
}

export function BjjWidget({ config }: BjjWidgetProps) {
  const { amount, eventLabel, mode, attackName, attacks } = config;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (mode !== "looping" || attacks.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % attacks.length);
    }, 200);
    return () => clearInterval(interval);
  }, [mode, attacks]);

  const displayAttack = mode === "looping"
    ? (attacks[currentIndex] ?? "")
    : attackName;

  const isLooping = mode === "looping";

  // Attack name: blue in looping, pink in event
  const attackColor = isLooping ? "#2ea4ff" : "#f4b0f5";
  const attackGlow = isLooping
    ? "0 0 12px #2ea4ff, 0 0 28px #00ffff, 0 0 50px #ff00ff"
    : "0 0 12px #f4b0f5, 0 0 28px #4444ff, 0 0 50px #ff0044";

  // Event label: subtle tint matching mode
  const labelColor = isLooping ? "#a0cfff" : "#e8c8f8";
  const labelGlow = isLooping
    ? "0 0 8px #2ea4ff44, 0 0 20px #00ffff22"
    : "0 0 8px #f4b0f544, 0 0 20px #ff006622";

  return (
    <div
      style={{
        maxWidth: "680px",
        width: "100%",
        margin: "0 auto",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 24px 48px",
        boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <div className={isLooping ? "bjj-logo-spark" : "bjj-logo-rgb"}>
        <Image
          src="/images/logo-widget 2.png"
          alt="Widget Logo"
          width={220}
          height={220}
          style={{ display: "block" }}
          priority
        />
      </div>

      {/* Dollar Amount */}
      <div
        style={{
          fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: "clamp(72px, 20vw, 148px)",
          lineHeight: 1,
          color: "#00ff41",
          textShadow: "0 0 8px #00ff41, 0 0 20px #00cc33",
          textTransform: "uppercase",
          marginTop: "24px",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        {amount}
      </div>

      {/* Event Label */}
      <div
        style={{
          fontFamily: "var(--font-rajdhani), 'Rajdhani', sans-serif",
          fontWeight: 600,
          fontSize: "clamp(13px, 2.2vw, 18px)",
          color: labelColor,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          textShadow: labelGlow,
          marginTop: "10px",
          textAlign: "center",
          opacity: 0.88,
          transition: "color 0.3s ease, text-shadow 0.3s ease",
        }}
      >
        {eventLabel}
      </div>

      {/* Attack Name */}
      <div
        style={{
          fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: "clamp(32px, 8vw, 72px)",
          lineHeight: 1,
          color: attackColor,
          textShadow: attackGlow,
          textTransform: "uppercase",
          marginTop: "20px",
          textAlign: "center",
          letterSpacing: "0.02em",
          transition: mode === "event" ? "color 0.3s ease" : "none",
          minHeight: "1em",
        }}
      >
        {displayAttack}
      </div>
    </div>
  );
}
