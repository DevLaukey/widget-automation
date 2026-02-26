"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BjjConfig {
  amount: string;
  eventLabel: string;
}

interface ServerState {
  isLooping?: boolean;
  currentAttack?: string;
  selectedAttackOnStop?: string;
  attacks?: string[];
  currentEvent?: { id: string; name: string };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_STATUS = "https://ugia-mmeab.ondigitalocean.app/api/aras25/status";
const API_TEXT = "https://ugia-mmeab.ondigitalocean.app/api/aras25/attack/text";
const SYNC_INTERVAL = 3000;
const LOOP_INTERVAL = 200;

export const DEFAULT_BJJ_ATTACKS = [
  "Figure 4 Knee Bar",
  "Cryangle",
  "Back CNTRL + Buggy Choke",
  "RDLR + KOTD+ Crab Ride + Back + Arm Bar",
  "Shin-bolo + Saddle + Heelhook",
  "Inside Heel Hook + Game Over Position",
  "Caveman Necktie from Back Mount",
  "Backside - Outside heel hook",
  "K Guard + Arm Saddle + Tarikoplata",
  "Reverse X + 411 + Heel Hook",
  "Z lock",
  "Clover Leaf",
  "50/50 + Arm Bar",
  "Octopus GUARD + Calf Slicer",
  "Bow & Arrow (Gi or Nogi)",
  "Caveman Necktie from Front Head Lock",
  "Kosovo Cradle",
  "K Guard Triangle",
  "Scythe Arm Bar",
  "BOTTOM HALF GUARD + KNEE BAR (on opposite knee)",
  "WAITER SWEEP + BACK + RNC",
  "Deep Half + ROLL + Dog Bar",
  "Octopus Guard (bottom) + Arm Bar",
  "Reverse DLR + Knee Bar",
  "Bicep Slicer",
  "Buggy Choke from Back",
  "Bolo + Body lock + RNC",
  "Dog Fight + Rolling Knee Bar",
  "50/50 + Darce Choke",
  "Wrist lock (top side control)",
  "Lapel guard + Arm bar",
  "Baseball bat choke",
  "Closed Guard + Arm Bar (shot gun)",
  "Nogi Baseball Bat Choke",
  "Flying Triangle",
  "K Guard + Arm Bar",
  "Wrist lock (bottom position)",
  "Butterfly guard + Arm bar",
  "Choi Bar (complete w/ arm saddle)",
  "Lasso Guard + Spinning Triangle",
  "Side control + step over arm bar",
  "Flying Guillotine",
  "Kimura Trap + Arm Bar",
  "Double Arm Bar from Closed Guard",
  "Squid guard + RNC",
  "Tarikoplata",
  "Baratoplata",
  "Knee On Belly + Mothers Milk",
  "Wheelchair Omoplata",
  "Gogoplata",
  "Triangle (no arm variation)",
  "Japanese necktie",
  "Peruvian neck tie",
  "Guillotine (Arm in)",
  "Body Triangle + Ezekiel Choke",
  "Octopus guard + back + rnc",
  "Crucifix + wrist lock",
  "Reverse Triangle",
  "Squid Guard + Knee bar",
  "K Guard + Knee Bar",
  "Knee On Belly + Nearside Arm Bar",
  "Banana Split",
  "Knee On Belly Far Side Arm Bar",
  "Crucifix + Choke",
  "5050 + Darce Choke",
  "Dog Fight + Gator roll + Dog Bar",
  "Buggy Choke from bottom",
  "Bow & Arrow",
  "Buggy choke from back",
  "Bicep Slicer from Top Side Control",
  "Octopus Guard + Calf Slicer",
  "Rolling Bow & Arrow",
  "Lapel set up + Wristlock",
  "Crucifix Wrist Lock",
  "Head & Arm Choke + Buggy Choke",
  "5050 + Wristlock",
  "Buggy Choke from Top Side",
];

export const DEFAULT_BJJ_CONFIG: BjjConfig = {
  amount: "$5,000",
  eventLabel: "SUBMISSION BONUS — FIGHT NIGHT",
};

// ─── Widget ───────────────────────────────────────────────────────────────────

export function BjjWidget({ config }: { config: BjjConfig }) {
  const { amount, eventLabel } = config;

  const [isLooping, setIsLooping] = useState(true);
  const [displayAttack, setDisplayAttack] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [displayEventLabel, setDisplayEventLabel] = useState(eventLabel);

  // Refs so interval callbacks always see fresh values
  const localAttacksRef = useRef<string[]>([...DEFAULT_BJJ_ATTACKS]);
  const isLoopingRef = useRef(true);
  const currentAttackRef = useRef("");
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSyncingRef = useRef(false);

  // ── Loop control ────────────────────────────────────────────────────────────

  const startLoop = useCallback(() => {
    if (loopRef.current) return;
    loopRef.current = setInterval(() => {
      const list = localAttacksRef.current;
      if (!list.length) return;
      const attack = list[Math.floor(Math.random() * list.length)];
      currentAttackRef.current = attack;
      setDisplayAttack(attack);
    }, LOOP_INTERVAL);
  }, []);

  const stopLoop = useCallback(() => {
    if (loopRef.current) {
      clearInterval(loopRef.current);
      loopRef.current = null;
    }
  }, []);

  // ── Server sync ─────────────────────────────────────────────────────────────

  const syncWithServer = useCallback(async () => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    try {
      let data: ServerState | null = null;

      // Primary endpoint
      try {
        const res = await fetch(API_STATUS, { cache: "no-cache" });
        if (res.ok) {
          data = await res.json();
          setIsConnected(true);
        }
      } catch {
        // Fallback to legacy text endpoint
        try {
          const res = await fetch(API_TEXT, { cache: "no-cache" });
          if (res.ok) {
            const text = await res.text();
            data = { isLooping: true, currentAttack: text.trim() };
            setIsConnected(true);
          }
        } catch {
          setIsConnected(false);
        }
      }

      if (!data) {
        setIsConnected(false);
        return;
      }

      // Update attacks list if server provides one
      if (Array.isArray(data.attacks) && data.attacks.length > 0) {
        localAttacksRef.current = data.attacks;
      }

      // Update event label if server provides one
      if (data.currentEvent?.name) {
        setDisplayEventLabel(data.currentEvent.name);
      }

      const shouldLoop = !!data.isLooping;

      if (shouldLoop !== isLoopingRef.current) {
        // Mode changed
        isLoopingRef.current = shouldLoop;
        setIsLooping(shouldLoop);

        if (shouldLoop) {
          startLoop();
        } else {
          stopLoop();
          const attack =
            data.selectedAttackOnStop ||
            data.currentAttack ||
            currentAttackRef.current;
          currentAttackRef.current = attack ?? "";
          setDisplayAttack(attack ?? "");
        }
      } else if (!shouldLoop) {
        // Still in event mode — update attack if it changed
        const attack =
          data.selectedAttackOnStop ||
          data.currentAttack ||
          currentAttackRef.current;
        if (attack && attack !== currentAttackRef.current) {
          currentAttackRef.current = attack;
          setDisplayAttack(attack);
        }
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, [startLoop, stopLoop]);

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  useEffect(() => {
    // Boot: start looping immediately with defaults, then let server correct
    startLoop();
    syncWithServer();

    const syncTimer = setInterval(syncWithServer, SYNC_INTERVAL);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") syncWithServer();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopLoop();
      clearInterval(syncTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [startLoop, stopLoop, syncWithServer]);

  // ── Derived styles ────────────────────────────────────────────────────────────

  const attackColor = isLooping ? "rgb(46,164,255)" : "rgb(244,176,245)";
  const attackGlow = isLooping
    ? "0 0 15px rgba(0,255,255,0.8), 0 0 30px rgba(255,0,255,0.6)"
    : "0 0 20px rgba(0,153,255,0.9), 0 0 40px rgba(255,0,102,0.7)";
  const labelColor = isLooping ? "#a0cfff" : "#e8c8f8";
  const labelGlow = isLooping
    ? "0 0 8px rgba(46,164,255,0.3)"
    : "0 0 8px rgba(244,176,245,0.3)";

  // ── Render ────────────────────────────────────────────────────────────────────

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
        position: "relative",
      }}
    >
      {/* Connection dot */}
      <div
        title={
          isConnected
            ? "Live — connected to server"
            : "Offline — using defaults"
        }
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: isConnected ? "#00ff41" : "#666",
          boxShadow: isConnected ? "0 0 6px #00ff41" : "none",
        }}
      />

      {/* Logo */}
      <div className={isLooping ? "bjj-logo-spark" : "bjj-logo-rgb"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-widget.svg"
          alt="Widget Logo"
          width={920}
          height={920}
          style={{ display: "block" }}
        />
      </div>

      {/* Dollar Amount */}
      <div
        style={{
          fontFamily:
            "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
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
          transition: "color 0.4s ease, text-shadow 0.4s ease",
        }}
      >
        {displayEventLabel}
      </div>

      {/* Attack Name */}
      <div
        style={{
          fontFamily:
            "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: "clamp(28px, 7vw, 64px)",
          lineHeight: 1.1,
          color: attackColor,
          textShadow: attackGlow,
          textTransform: "uppercase",
          marginTop: "20px",
          textAlign: "center",
          letterSpacing: "0.02em",
          transition: "color 0.4s ease, text-shadow 0.4s ease",
          minHeight: "1.1em",
        }}
      >
        {displayAttack}
      </div>
    </div>
  );
}
