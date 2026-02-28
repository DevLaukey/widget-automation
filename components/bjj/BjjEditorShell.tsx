"use client";

import { useState, useEffect } from "react";
import {
  BjjWidget,
  DEFAULT_BJJ_CONFIG,
  DEFAULT_BJJ_ATTACKS,
} from "./BjjWidget";
import type { BjjConfig } from "./BjjWidget";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SavedEvent {
  id: string;
  label: string;
  amount: string;
  eventDateTime: string;
  attacks: string[];
  expiresAt: string; // ISO — 11 PM of event date
  createdAt: string;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const KEY_EVENTS = "bjj_saved_events";
const KEY_CONFIG  = "bjj_config";

function expiryAt(eventDateTime: string): string {
  const base = eventDateTime ? new Date(eventDateTime) : new Date();
  const d = new Date(base);
  d.setHours(23, 0, 0, 0); // 11 PM
  return d.toISOString();
}

function loadStoredEvents(): SavedEvent[] {
  try {
    const raw = localStorage.getItem(KEY_EVENTS);
    if (!raw) return [];
    const all: SavedEvent[] = JSON.parse(raw);
    return all.filter((e) => new Date(e.expiresAt).getTime() > Date.now());
  } catch {
    return [];
  }
}

function persistEvents(events: SavedEvent[]) {
  localStorage.setItem(KEY_EVENTS, JSON.stringify(events));
}

function downloadTxt(events: SavedEvent[]) {
  const lines: string[] = [
    "BJJ SUBMISSION BONUS — SAVED EVENTS",
    "=====================================",
    `Exported : ${new Date().toLocaleString()}`,
    `Active   : ${events.length} event(s)`,
    "",
  ];
  if (events.length === 0) {
    lines.push("No active events.");
  } else {
    events.forEach((evt, i) => {
      lines.push(`──── Event ${i + 1} ────────────────────────`);
      lines.push(`Label    : ${evt.label}`);
      lines.push(`Amount   : ${evt.amount}`);
      lines.push(`Date/Time: ${evt.eventDateTime || "Not set"}`);
      lines.push(`Created  : ${new Date(evt.createdAt).toLocaleString()}`);
      lines.push(`Expires  : ${new Date(evt.expiresAt).toLocaleString()}`);
      lines.push(`Attacks  : ${evt.attacks.length} moves`);
      evt.attacks.forEach((a, j) => lines.push(`  ${j + 1}. ${a}`));
      lines.push("");
    });
  }
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `bjj_events_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Embed code generator ─────────────────────────────────────────────────────

function generateEmbedCode(config: BjjConfig, origin: string): string {
  const attacks = config.attacks?.length ? config.attacks : DEFAULT_BJJ_ATTACKS;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BJJ Submission Bonus Widget</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@1,900&family=Rajdhani:wght@600&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: transparent; }

.bjj-widget {
  max-width: 680px; width: 100%; margin: 0 auto;
  background: transparent; display: flex; flex-direction: column;
  align-items: center; padding: 40px 24px 48px; position: relative;
}

@keyframes electricSpark {
  0%   { transform: scale(1);    filter: drop-shadow(0 0 8px #ff69b4) drop-shadow(0 0 15px #ff1493); }
  12%  { transform: scale(1.08); filter: drop-shadow(0 0 12px #da70d6) drop-shadow(0 0 25px #da70d6) drop-shadow(0 0 35px #ff69b4); }
  25%  { transform: scale(1.12); filter: drop-shadow(0 0 18px #ff69b4) drop-shadow(0 0 30px #ff69b4) drop-shadow(0 0 45px #ffe0f0); }
  37%  { transform: scale(1.06); filter: drop-shadow(0 0 14px #da70d6) drop-shadow(0 0 28px #da70d6) drop-shadow(0 0 40px #ff69b4); }
  50%  { transform: scale(1.15); filter: drop-shadow(0 0 22px #ffe0f0) drop-shadow(0 0 35px #ffb6c1) drop-shadow(0 0 50px #ff69b4); }
  62%  { transform: scale(1.04); filter: drop-shadow(0 0 16px #ff69b4) drop-shadow(0 0 32px #ff1493) drop-shadow(0 0 42px #da70d6); }
  75%  { transform: scale(1.10); filter: drop-shadow(0 0 20px #da70d6) drop-shadow(0 0 38px #da70d6) drop-shadow(0 0 55px #ffb6c1); }
  87%  { transform: scale(1.02); filter: drop-shadow(0 0 10px #ff69b4) drop-shadow(0 0 20px #ff1493) drop-shadow(0 0 30px #da70d6); }
  100% { transform: scale(1);    filter: drop-shadow(0 0 8px #ff69b4) drop-shadow(0 0 15px #ff1493); }
}
@keyframes brainThrobIntense {
  0%   { transform: scale(1);    filter: drop-shadow(0 0 15px #ff1493) drop-shadow(0 0 30px #ff69b4); }
  25%  { transform: scale(1.12); filter: drop-shadow(0 0 25px #ff69b4) drop-shadow(0 0 50px #da70d6) drop-shadow(0 0 70px #ffb6c1); }
  50%  { transform: scale(1.18); filter: drop-shadow(0 0 35px #ff1493) drop-shadow(0 0 70px #ff69b4) drop-shadow(0 0 90px #ffe0f0); }
  75%  { transform: scale(1.12); filter: drop-shadow(0 0 25px #da70d6) drop-shadow(0 0 50px #ff1493); }
  100% { transform: scale(1);    filter: drop-shadow(0 0 15px #ff1493) drop-shadow(0 0 30px #ff69b4); }
}
.bjj-logo-spark { animation: electricSpark 0.7s ease-in-out infinite; transform-origin: center; }
.bjj-logo-rgb   { animation: brainThrobIntense 0.7s ease-in-out infinite; transform-origin: center; }

.bjj-amount {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-style: italic;
  font-size: clamp(72px, 20vw, 148px); line-height: 1; color: #00ff41;
  text-shadow: 0 0 8px #00ff41, 0 0 20px #00cc33; text-transform: uppercase;
  margin-top: 24px; letter-spacing: -0.02em; white-space: nowrap;
}
.bjj-label {
  font-family: 'Rajdhani', sans-serif; font-weight: 600;
  font-size: clamp(13px, 2.2vw, 18px); text-transform: uppercase;
  letter-spacing: 0.22em; margin-top: 10px; text-align: center; opacity: 0.88;
  transition: color 0.4s ease, text-shadow 0.4s ease;
}
.bjj-attack {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-style: italic;
  font-size: clamp(28px, 7vw, 64px); line-height: 1.1; text-transform: uppercase;
  margin-top: 20px; text-align: center; letter-spacing: 0.02em; min-height: 1.1em;
  transition: color 0.4s ease, text-shadow 0.4s ease;
}
.mode-loop .bjj-label  { color: #f9b8d8; text-shadow: 0 0 8px rgba(255,105,180,0.4); }
.mode-event .bjj-label { color: #e8c8f8; text-shadow: 0 0 8px rgba(244,176,245,0.3); }
.mode-loop .bjj-attack  { color: rgb(255,105,180); text-shadow: 0 0 15px rgba(255,20,147,0.8), 0 0 30px rgba(218,112,214,0.6); }
.mode-event .bjj-attack { color: rgb(244,176,245); text-shadow: 0 0 20px rgba(255,20,147,0.9), 0 0 40px rgba(255,105,180,0.7); }
</style>
</head>
<body>
<div class="bjj-widget mode-loop" id="bjj-root">
  <div class="bjj-logo-spark" id="bjj-logo-wrap">
    <img src="${origin}/logo-widget.svg" alt="Widget Logo" width="660" height="660" style="display:block;">
  </div>
  <div class="bjj-amount">${config.amount}</div>
  <div class="bjj-label" id="bjj-label">${config.eventLabel}</div>
  <div class="bjj-attack" id="bjj-attack"></div>
</div>

<script>
(function () {
  var API_STATUS    = 'https://ugia-mmeab.ondigitalocean.app/api/aras25/status';
  var API_TEXT      = 'https://ugia-mmeab.ondigitalocean.app/api/aras25/attack/text';
  var EVENT_END     = ${config.eventDateTime ? `new Date('${config.eventDateTime}')` : "null"};
  var SYNC_INTERVAL = 3000;
  var LOOP_INTERVAL = 200;

  var defaultAttacks = ${JSON.stringify(attacks)};

  var localAttacks  = defaultAttacks.slice();
  var isLooping     = true;
  var isEnded       = false;
  var currentAttack = '';
  var loopTimer     = null;
  var isSyncing     = false;

  var root     = document.getElementById('bjj-root');
  var logoWrap = document.getElementById('bjj-logo-wrap');
  var attackEl = document.getElementById('bjj-attack');

  function endEvent() {
    if (isEnded) return;
    isEnded   = true;
    isLooping = false;
    stopLoop();
    root.className     = 'bjj-widget mode-event';
    logoWrap.className = '';
  }

  function setMode(loop) {
    if (isEnded) return;
    isLooping          = loop;
    root.className     = 'bjj-widget ' + (loop ? 'mode-loop' : 'mode-event');
    logoWrap.className = loop ? 'bjj-logo-spark' : 'bjj-logo-rgb';
  }

  function startLoop() {
    if (loopTimer || isEnded) return;
    loopTimer = setInterval(function () {
      if (!localAttacks.length) return;
      var atk = localAttacks[Math.floor(Math.random() * localAttacks.length)];
      currentAttack = atk;
      attackEl.textContent = atk;
    }, LOOP_INTERVAL);
  }

  function stopLoop() {
    if (loopTimer) { clearInterval(loopTimer); loopTimer = null; }
  }

  function showAttack(atk) {
    currentAttack = atk || '';
    attackEl.textContent = currentAttack;
  }

  async function syncWithServer() {
    if (isSyncing) return;
    isSyncing = true;
    try {
      var data = null;
      try {
        var res = await fetch(API_STATUS, { cache: 'no-cache' });
        if (res.ok) data = await res.json();
      } catch (e) {
        try {
          var res2 = await fetch(API_TEXT, { cache: 'no-cache' });
          if (res2.ok) data = { isLooping: true, currentAttack: (await res2.text()).trim() };
        } catch (e2) {}
      }
      if (!data) return;
      if (Array.isArray(data.attacks) && data.attacks.length > 0) localAttacks = data.attacks;
      if (isEnded) { stopLoop(); return; }
      var shouldLoop = !!data.isLooping;
      if (shouldLoop !== isLooping) {
        setMode(shouldLoop);
        if (shouldLoop) { startLoop(); }
        else { stopLoop(); showAttack(data.selectedAttackOnStop || data.currentAttack || currentAttack); }
      } else if (!shouldLoop) {
        var atk = data.selectedAttackOnStop || data.currentAttack || currentAttack;
        if (atk && atk !== currentAttack) showAttack(atk);
      }
    } finally { isSyncing = false; }
  }

  if (EVENT_END && Date.now() >= EVENT_END.getTime()) {
    endEvent();
  } else {
    startLoop();
    if (EVENT_END) setTimeout(endEvent, EVENT_END.getTime() - Date.now());
  }

  syncWithServer();
  setInterval(syncWithServer, SYNC_INTERVAL);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') syncWithServer();
  });
})();
</script>
</body>
</html>`;
}

// ─── Editor shell ─────────────────────────────────────────────────────────────

type Tab = "config" | "attacks" | "events" | "export";

export function BjjEditorShell({ onBack }: { onBack?: () => void }) {
  const [config, setConfig] = useState<BjjConfig>({
    ...DEFAULT_BJJ_CONFIG,
    attacks: [...DEFAULT_BJJ_ATTACKS],
  });
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [newAttack, setNewAttack]     = useState("");
  const [activeTab, setActiveTab]     = useState<Tab>("config");
  const [mobileView, setMobileView]   = useState<"editor" | "preview">("editor");
  const [origin, setOrigin]           = useState("");
  const [copied, setCopied]           = useState(false);
  const [toast, setToast]             = useState("");

  // ── Load from localStorage ────────────────────────────────────────────────

  useEffect(() => {
    setOrigin(window.location.origin);
    try {
      const storedConfig = localStorage.getItem(KEY_CONFIG);
      if (storedConfig) {
        const parsed: BjjConfig = JSON.parse(storedConfig);
        setConfig({
          ...parsed,
          attacks: parsed.attacks?.length ? parsed.attacks : [...DEFAULT_BJJ_ATTACKS],
        });
      }
      setSavedEvents(loadStoredEvents());
    } catch {}
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const update = (patch: Partial<BjjConfig>) =>
    setConfig((c) => ({ ...c, ...patch }));

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  // ── Config save ──────────────────────────────────────────────────────────

  function saveConfig() {
    localStorage.setItem(KEY_CONFIG, JSON.stringify(config));
    showToast("Config saved!");
  }

  // ── Attacks ──────────────────────────────────────────────────────────────

  function addAttack() {
    const t = newAttack.trim();
    if (!t || config.attacks?.includes(t)) return;
    update({ attacks: [...(config.attacks ?? []), t] });
    setNewAttack("");
  }

  function removeAttack(a: string) {
    update({ attacks: (config.attacks ?? []).filter((x) => x !== a) });
  }

  function resetAttacks() {
    update({ attacks: [...DEFAULT_BJJ_ATTACKS] });
  }

  function saveAttacks() {
    const updated = { ...config };
    localStorage.setItem(KEY_CONFIG, JSON.stringify(updated));
    showToast(`Attacks saved! (${config.attacks?.length ?? 0} moves)`);
  }

  // ── Events ────────────────────────────────────────────────────────────────

  function saveAsEvent() {
    const id  = `evt_${Date.now()}`;
    const evt: SavedEvent = {
      id,
      label:         config.eventLabel,
      amount:        config.amount,
      eventDateTime: config.eventDateTime,
      attacks:       [...(config.attacks ?? DEFAULT_BJJ_ATTACKS)],
      expiresAt:     expiryAt(config.eventDateTime),
      createdAt:     new Date().toISOString(),
    };
    const updated = [...loadStoredEvents(), evt];
    setSavedEvents(updated);
    persistEvents(updated);
    showToast(`Event "${config.eventLabel}" saved — expires 11 PM`);
  }

  function loadEvent(evt: SavedEvent) {
    setConfig({
      amount:        evt.amount,
      eventLabel:    evt.label,
      eventDateTime: evt.eventDateTime,
      attacks:       evt.attacks,
    });
    setActiveTab("config");
    showToast(`Loaded "${evt.label}"`);
  }

  function deleteEvent(id: string) {
    const updated = savedEvents.filter((e) => e.id !== id);
    setSavedEvents(updated);
    persistEvents(updated);
  }

  // ── Export ────────────────────────────────────────────────────────────────

  function copyEmbed() {
    navigator.clipboard.writeText(generateEmbedCode(config, origin)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const attacks      = config.attacks ?? DEFAULT_BJJ_ATTACKS;
  const activeEvents = savedEvents.filter(
    (e) => new Date(e.expiresAt).getTime() > Date.now()
  );

  const tabLabels: { key: Tab; label: string }[] = [
    { key: "config",  label: "Configure" },
    { key: "attacks", label: `Attacks (${attacks.length})` },
    { key: "events",  label: `Events (${activeEvents.length})` },
    { key: "export",  label: "Export" },
  ];

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden">

      {/* ── Mobile Toggle Bar ── */}
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
              ? "text-pink-400 border-b-2 border-pink-400 bg-gray-800"
              : "text-gray-400"
          }`}
        >
          Editor
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobileView === "preview"
              ? "text-pink-400 border-b-2 border-pink-400 bg-gray-800"
              : "text-gray-400"
          }`}
        >
          Preview
        </button>
      </div>

      {/* ── Sidebar ── */}
      <div
        className={`w-full md:w-[420px] shrink-0 flex flex-col border-r border-gray-700 bg-gray-900 ${
          mobileView === "editor" ? "flex" : "hidden md:flex"
        }`}
        style={{ minHeight: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-700 shrink-0">
          {onBack && (
            <button
              onClick={onBack}
              className="hidden md:block px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-gray-700 transition-colors shrink-0"
            >
              ← Back
            </button>
          )}
          <span className="flex-1 px-1 py-1.5 text-sm font-medium text-white truncate">
            BJJ Submission Bonus Widget
          </span>
          {toast && (
            <span className="text-xs text-pink-400 font-semibold shrink-0 animate-pulse">
              {toast}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 shrink-0 overflow-x-auto">
          {tabLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize whitespace-nowrap px-2 transition-colors ${
                activeTab === key
                  ? "text-pink-400 border-b-2 border-pink-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ── CONFIGURE ── */}
          {activeTab === "config" && (
            <>
              <div className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-xs text-gray-400 space-y-1">
                <p className="font-semibold text-gray-300">Server-driven mode</p>
                <p>Attack cycling and mode (loop / event) are controlled live via:</p>
                <code className="block text-pink-400 break-all mt-1">
                  ugia-mmeab.ondigitalocean.app/api/aras25/status
                </code>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                  Bonus Amount
                </label>
                <input
                  type="text"
                  value={config.amount}
                  onChange={(e) => update({ amount: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="$5,000"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                  Event Label
                </label>
                <input
                  type="text"
                  value={config.eventLabel}
                  onChange={(e) => update({ eventLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="SUBMISSION BONUS — FIGHT NIGHT"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                  Event End Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={config.eventDateTime}
                  onChange={(e) => update({ eventDateTime: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 [color-scheme:dark]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  When this time is reached the loop stops and animations freeze. Leave blank for manual control.
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveConfig}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-pink-700 hover:bg-pink-600 text-white transition-colors"
                >
                  Save Config
                </button>
                <button
                  onClick={saveAsEvent}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-purple-700 hover:bg-purple-600 text-white transition-colors"
                >
                  Save as Event
                </button>
              </div>

              <p className="text-xs text-gray-500">
                "Save as Event" stores a snapshot that auto-expires at 11 PM on the event date. Find saved events in the Events tab.
              </p>
            </>
          )}

          {/* ── ATTACKS ── */}
          {activeTab === "attacks" && (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAttack}
                  onChange={(e) => setNewAttack(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAttack()}
                  placeholder="New attack name..."
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={addAttack}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-pink-700 hover:bg-pink-600 text-white transition-colors"
                >
                  Add
                </button>
              </div>

              <p className="text-xs text-gray-500">
                {attacks.length} attack{attacks.length !== 1 ? "s" : ""} in the list. Changes are live in the preview.
              </p>

              <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                {attacks.map((atk) => (
                  <div
                    key={atk}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 group"
                  >
                    <span className="flex-1 text-xs text-gray-300 truncate">{atk}</span>
                    <button
                      onClick={() => removeAttack(atk)}
                      className="text-gray-600 hover:text-red-400 text-sm font-bold transition-colors shrink-0"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={resetAttacks}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={saveAttacks}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-pink-700 hover:bg-pink-600 text-white transition-colors"
                >
                  Save Attacks
                </button>
              </div>
            </>
          )}

          {/* ── EVENTS ── */}
          {activeTab === "events" && (
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadTxt(activeEvents)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  Download Events as TXT
                </button>
              </div>

              {activeEvents.length === 0 ? (
                <div className="rounded-lg bg-gray-800 border border-gray-700 p-4 text-center">
                  <p className="text-xs text-gray-500">No active events.</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Go to Configure → Save as Event to create one.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeEvents.map((evt) => {
                    const expiry = new Date(evt.expiresAt);
                    const created = new Date(evt.createdAt);
                    return (
                      <div
                        key={evt.id}
                        className="rounded-lg bg-gray-800 border border-gray-700 p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {evt.label}
                            </p>
                            <p className="text-xs text-pink-400 font-medium">{evt.amount}</p>
                          </div>
                          <button
                            onClick={() => deleteEvent(evt.id)}
                            className="text-gray-600 hover:text-red-400 text-lg font-bold shrink-0 transition-colors"
                            title="Delete event"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 space-y-0.5">
                          <p>Created : {created.toLocaleString()}</p>
                          <p>Expires : {expiry.toLocaleString()}</p>
                          <p>Attacks : {evt.attacks.length} moves</p>
                          {evt.eventDateTime && (
                            <p>Date    : {new Date(evt.eventDateTime).toLocaleString()}</p>
                          )}
                        </div>
                        <button
                          onClick={() => loadEvent(evt)}
                          className="w-full py-1.5 rounded-md text-xs font-semibold bg-purple-700 hover:bg-purple-600 text-white transition-colors"
                        >
                          Load into Editor
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="text-xs text-gray-600">
                Events auto-expire at 11 PM on their event date and are removed from this list.
              </p>
            </>
          )}

          {/* ── EXPORT ── */}
          {activeTab === "export" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Use the direct embed URL for OBS/streaming or copy the standalone HTML.
              </p>

              <div className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-xs space-y-1">
                <p className="text-gray-400 font-medium">Direct embed URL (iframe / OBS Browser Source)</p>
                <code className="block text-pink-400 break-all">{origin}/bjj</code>
              </div>

              <button
                onClick={copyEmbed}
                className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-pink-700 hover:bg-pink-600 text-white"
                }`}
              >
                {copied ? "✓ Copied!" : "Copy Embed HTML"}
              </button>

              <pre className="text-xs text-gray-400 bg-gray-800 rounded-lg p-3 overflow-auto max-h-80 whitespace-pre-wrap break-all border border-gray-700">
                {generateEmbedCode(config, origin)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div
        className={`flex-1 min-w-0 min-h-0 flex-col bg-gray-950 overflow-auto ${
          mobileView === "preview" ? "flex" : "hidden md:flex"
        }`}
      >
        <div className="shrink-0 px-4 py-2 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-widest">
          Live Preview — fetching from server
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            style={{
              background: "#0a0a12",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "700px",
            }}
          >
            <BjjWidget config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}
