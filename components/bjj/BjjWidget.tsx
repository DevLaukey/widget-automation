"use client";

import { useState, useEffect, useRef, useCallback } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BjjConfig {
  amount: string;
  eventLabel: string;
  eventDateTime: string;    // ISO / datetime-local string — when to freeze
  expiresAt?: string;       // ISO — when to resume looping (11 PM of event date)
  activeAttackName?: string; // the attack to display while the event is active
  attacks?: string[];        // custom attacks list; falls back to DEFAULT_BJJ_ATTACKS
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LOOP_INTERVAL = 200;

export const DEFAULT_BJJ_ATTACKS = [
  "Figure 4 Knee Bar",
  "Cryangle",
  "Back CNTRL + Buggy Choke",
  "RDLR + KOTD + Crab Ride + Back + Arm Bar",
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
  "Buggy Choke from Top Side Control",
];

export const DEFAULT_BJJ_CONFIG: BjjConfig = {
  amount: "",
  eventLabel: "SUBMISSION BONUS — FIGHT NIGHT",
  eventDateTime: "",
  attacks: [...DEFAULT_BJJ_ATTACKS],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseAmountForCounter(
  amount: string
): { prefix: string; value: number; suffix: string } | null {
  const match = amount.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/);
  if (!match) return null;
  const value = parseFloat(match[2].replace(/,/g, ""));
  if (isNaN(value) || value === 0) return null;
  return { prefix: match[1], value, suffix: match[3] };
}

// ─── Widget ───────────────────────────────────────────────────────────────────

export function BjjWidget({
  config,
  initialAttack,
  onStop,
  onResume,
}: {
  config: BjjConfig;
  initialAttack?: string;
  onStop?: (attack: string) => void;
  onResume?: () => void;
}) {
  const { amount, eventLabel, eventDateTime, expiresAt, activeAttackName } = config;

  const [isLooping, setIsLooping] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const [displayAttack, setDisplayAttack] = useState(initialAttack ?? "");
  const [displayAmount, setDisplayAmount] = useState(amount);

  // Counter animation for amount
  useEffect(() => {
    const parsed = parseAmountForCounter(amount);
    if (!parsed) { setDisplayAmount(amount); return; }
    const { prefix, value, suffix } = parsed;
    const duration = 1500;
    let startTime: number | null = null;
    let raf: number;
    function step(ts: number) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ep = 1 - Math.pow(1 - p, 3); // easeOut cubic
      const current = Math.round(ep * value);
      setDisplayAmount(prefix + current.toLocaleString("en-US") + suffix);
      if (p < 1) { raf = requestAnimationFrame(step); }
      else { setDisplayAmount(amount); }
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [amount]);

  const attacksRef = useRef<string[]>(
    config.attacks?.length ? [...config.attacks] : [...DEFAULT_BJJ_ATTACKS]
  );
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isEndedRef = useRef(false);
  const currentAttackRef = useRef(initialAttack ?? "");
  const onStopRef   = useRef(onStop);
  const onResumeRef = useRef(onResume);
  onStopRef.current   = onStop;
  onResumeRef.current = onResume;

  // Keep attacks ref in sync with config
  useEffect(() => {
    attacksRef.current = config.attacks?.length ? [...config.attacks] : [...DEFAULT_BJJ_ATTACKS];
  }, [config.attacks]);

  const startLoop = useCallback(() => {
    if (loopRef.current) return;
    loopRef.current = setInterval(() => {
      const list = attacksRef.current;
      if (!list.length) return;
      const attack = list[Math.floor(Math.random() * list.length)];
      currentAttackRef.current = attack;
      setDisplayAttack(attack);
    }, LOOP_INTERVAL);
  }, []);

  const stopLoop = useCallback(() => {
    if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; }
  }, []);

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  useEffect(() => {
    isEndedRef.current = false;
    setIsEnded(false);
    setIsLooping(true);

    const now = Date.now();
    const eventEnd    = eventDateTime ? new Date(eventDateTime) : null;
    const eventExpiry = expiresAt     ? new Date(expiresAt)     : null;

    const alreadyExpired = eventExpiry ? now >= eventExpiry.getTime() : false;
    const alreadyFrozen  = !alreadyExpired && eventEnd ? now >= eventEnd.getTime() : false;

    let endTimer:    ReturnType<typeof setTimeout> | null = null;
    let expiryTimer: ReturnType<typeof setTimeout> | null = null;

    function scheduleResume(delay: number) {
      expiryTimer = setTimeout(() => {
        isEndedRef.current = false;
        setIsEnded(false);
        setIsLooping(true);
        onResumeRef.current?.();
        startLoop();
      }, delay);
    }

    if (alreadyFrozen) {
      // Event time has passed but expiry hasn't — show the event's attack
      isEndedRef.current = true;
      setIsEnded(true);
      setIsLooping(false);
      const attack = activeAttackName || "";
      currentAttackRef.current = attack;
      setDisplayAttack(attack);
      if (eventExpiry) scheduleResume(eventExpiry.getTime() - now);
    } else {
      startLoop();
      if (eventEnd && !alreadyExpired) {
        endTimer = setTimeout(() => {
          isEndedRef.current = true;
          setIsEnded(true);
          setIsLooping(false);
          stopLoop();
          const attack = activeAttackName || currentAttackRef.current;
          currentAttackRef.current = attack;
          setDisplayAttack(attack);
          onStopRef.current?.(attack);
          if (eventExpiry) scheduleResume(eventExpiry.getTime() - Date.now());
        }, eventEnd.getTime() - now);
      }
    }

    return () => {
      stopLoop();
      if (endTimer)    clearTimeout(endTimer);
      if (expiryTimer) clearTimeout(expiryTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startLoop, stopLoop, eventDateTime, expiresAt, activeAttackName]);

  // ── Derived styles ────────────────────────────────────────────────────────────

  const attackColor = isLooping ? "rgb(255,105,180)" : "rgb(244,176,245)";
  const attackGlow = isLooping
    ? "0 0 15px rgba(255,20,147,0.8), 0 0 30px rgba(218,112,214,0.6)"
    : "0 0 20px rgba(255,20,147,0.9), 0 0 40px rgba(255,105,180,0.7)";
  const labelColor = isLooping ? "#f9b8d8" : "#e8c8f8";
  const labelGlow = isLooping
    ? "0 0 8px rgba(255,105,180,0.4)"
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
      {/* Logo */}
      <div className={isEnded ? "" : isLooping ? "bjj-logo-spark" : "bjj-logo-rgb"}>
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
        {displayAmount}
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
        {eventLabel}
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
