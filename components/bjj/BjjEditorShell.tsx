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
  attackName: string;  // the attack shown when this event is active
  attacks: string[];
  expiresAt: string; // ISO — 11 PM of event date
  createdAt: string;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

const KEY_EVENTS   = "bjj_saved_events";
const KEY_CONFIG   = "bjj_config";
const KEY_SAVED_AT = "bjj_saved_at";

function expiryAt(eventDateTime: string): string {
  // eventDateTime is a UTC ISO string — set 11 PM in the local (admin) timezone
  const base = eventDateTime ? new Date(eventDateTime) : new Date();
  const d = new Date(base);
  d.setHours(23, 0, 0, 0); // 11 PM local time
  // If the event starts at or after 11 PM, push expiry to 11 PM the next day
  // so the event can actually be live before it expires.
  if (d.getTime() <= base.getTime()) {
    d.setDate(d.getDate() + 1);
  }
  return d.toISOString();
}

/** Convert a UTC ISO string back to the "YYYY-MM-DDTHH:mm" format that
 *  <input type="datetime-local"> expects (always in the user's local time). */
function toDatetimeLocal(isoString: string): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Returns the local timezone abbreviation or offset string (e.g. "EST" or "UTC+5:30"). */
function getLocalTzLabel(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    const offset = -new Date().getTimezoneOffset();
    const sign   = offset >= 0 ? "+" : "-";
    const h      = String(Math.floor(Math.abs(offset) / 60)).padStart(2, "0");
    const m      = String(Math.abs(offset) % 60).padStart(2, "0");
    return `UTC${sign}${h}:${m}`;
  }
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
  var EVENT_EXPIRY  = ${config.expiresAt ? `new Date('${config.expiresAt}')` : "null"};
  var EVENT_ATTACK  = ${config.activeAttackName ? `'${config.activeAttackName.replace(/'/g, "\\'")}'` : "null"};
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

  function scheduleResume(delay) {
    setTimeout(function () {
      isEnded   = false;
      isLooping = true;
      setMode(true);
      startLoop();
    }, delay);
  }

  var now            = Date.now();
  var alreadyExpired = EVENT_EXPIRY && now >= EVENT_EXPIRY.getTime();
  var alreadyFrozen  = !alreadyExpired && EVENT_END && now >= EVENT_END.getTime();

  if (alreadyFrozen) {
    endEvent();
    if (EVENT_ATTACK) showAttack(EVENT_ATTACK);
    if (EVENT_EXPIRY) scheduleResume(EVENT_EXPIRY.getTime() - now);
  } else {
    startLoop();
    if (EVENT_END && !alreadyExpired) {
      setTimeout(function () {
        endEvent();
        if (EVENT_ATTACK) showAttack(EVENT_ATTACK);
        if (EVENT_EXPIRY) scheduleResume(EVENT_EXPIRY.getTime() - Date.now());
      }, EVENT_END.getTime() - now);
    }
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

  // ── Event form state ──────────────────────────────────────────────────────
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({ name: "", date: "", amount: "" });
  const [formErrors, setFormErrors] = useState<{ name?: string; date?: string }>({});

  // ── Load from DB only — localStorage is write-behind cache, never the source ──

  useEffect(() => {
    setOrigin(window.location.origin);

    fetch("/api/bjj")
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.config) {
          // DB is empty — stay on code defaults, wipe stale localStorage
          localStorage.removeItem(KEY_CONFIG);
          localStorage.removeItem(KEY_SAVED_AT);
          return;
        }
        const parsed: BjjConfig = data.config;
        setConfig({ ...parsed, attacks: parsed.attacks?.length ? parsed.attacks : [...DEFAULT_BJJ_ATTACKS] });
        console.log("[load] raw events from server:", data.events?.length ?? 0);
        if (Array.isArray(data.events)) {
          const active = data.events.filter((e: SavedEvent) => new Date(e.expiresAt).getTime() > Date.now());
          console.log("[load] active (non-expired) events:", active.length);
          setSavedEvents(active);
        }
      })
      .catch(() => {
        // Network down — fall back to localStorage cache
        try {
          const raw = localStorage.getItem(KEY_CONFIG);
          if (raw) {
            const parsed: BjjConfig = JSON.parse(raw);
            setConfig({ ...parsed, attacks: parsed.attacks?.length ? parsed.attacks : [...DEFAULT_BJJ_ATTACKS] });
          }
          setSavedEvents(loadStoredEvents());
        } catch {}
      });
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const update = (patch: Partial<BjjConfig>) =>
    setConfig((c) => ({ ...c, ...patch }));

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  }

  // ── Save to file helper ───────────────────────────────────────────────────

  async function saveToFile(updatedConfig: BjjConfig, updatedEvents: SavedEvent[]) {
    console.log("[saveToFile] saving events:", updatedEvents.length, updatedEvents.map(e => e.label));
    // Update localStorage immediately as a fallback cache
    localStorage.setItem(KEY_CONFIG, JSON.stringify(updatedConfig));
    localStorage.setItem(KEY_SAVED_AT, new Date().toISOString());
    persistEvents(updatedEvents);
    // Await the DB write so callers can confirm it succeeded
    const res = await fetch("/api/bjj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: updatedConfig, events: updatedEvents }),
    });
    console.log("[saveToFile] POST status:", res.status);
    if (!res.ok) {
      const body = await res.text();
      console.error("[saveToFile] POST error body:", body);
      throw new Error(`Save failed: ${res.status}`);
    }
    console.log("[saveToFile] success");
  }

  // ── Config save ──────────────────────────────────────────────────────────

  async function saveConfig() {
    try {
      await saveToFile(config, savedEvents);
      showToast("Config saved!");
    } catch {
      showToast("Save failed — please try again");
    }
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

  async function saveAttacks() {
    try {
      await saveToFile(config, savedEvents);
      showToast(`Attacks saved! (${config.attacks?.length ?? 0} moves)`);
    } catch {
      showToast("Save failed — please try again");
    }
  }

  // ── Events CRUD ───────────────────────────────────────────────────────────

  function openCreateForm() {
    setEventForm({ name: "", date: "", amount: config.amount });
    setEditingEventId(null);
    setFormErrors({});
    setShowEventForm(true);
  }

  function openEditForm(evt: SavedEvent) {
    setEventForm({ name: evt.label, date: toDatetimeLocal(evt.eventDateTime), amount: evt.amount });
    setEditingEventId(evt.id);
    setFormErrors({});
    setShowEventForm(true);
  }

  function cancelEventForm() {
    setShowEventForm(false);
    setEditingEventId(null);
    setFormErrors({});
  }

  async function submitEventForm() {
    console.log("[submitEventForm] form:", eventForm);
    const errors: { name?: string; date?: string } = {};
    if (!eventForm.name.trim()) errors.name = "Event name is required";
    if (!eventForm.date.trim()) errors.date = "Event date is required";
    if (Object.keys(errors).length) { setFormErrors(errors); return; }

    const amount = eventForm.amount.trim() || config.amount;
    // Convert the local datetime-local value to a UTC ISO string so that
    // all viewers (regardless of timezone) see the event trigger at the
    // same universal moment.
    const eventDateTimeUTC = new Date(eventForm.date).toISOString();

    try {
      if (editingEventId) {
        // Update existing — keep the original attack name
        const updated = savedEvents.map((e) =>
          e.id === editingEventId
            ? { ...e, label: eventForm.name.trim(), eventDateTime: eventDateTimeUTC, amount, expiresAt: expiryAt(eventDateTimeUTC) }
            : e
        );
        setSavedEvents(updated);
        await saveToFile(config, updated);
        showToast(`Event "${eventForm.name.trim()}" updated`);
      } else {
        // Create new — pick a random attack from the current list
        const list = config.attacks?.length ? config.attacks : DEFAULT_BJJ_ATTACKS;
        const attackName = list[Math.floor(Math.random() * list.length)];
        const evt: SavedEvent = {
          id:            `evt_${Date.now()}`,
          label:         eventForm.name.trim(),
          amount,
          eventDateTime: eventDateTimeUTC,
          attackName,
          attacks:       [...list],
          expiresAt:     expiryAt(eventDateTimeUTC),
          createdAt:     new Date().toISOString(),
        };
        const updated = [...savedEvents, evt];
        setSavedEvents(updated);
        await saveToFile(config, updated);
        showToast(`Event "${evt.label}" created`);
      }
    } catch {
      showToast("Save failed — please try again");
      return;
    }

    setShowEventForm(false);
    setEditingEventId(null);
    setFormErrors({});
  }

  function loadEvent(evt: SavedEvent) {
    setConfig({
      amount:           evt.amount,
      eventLabel:       evt.label,
      eventDateTime:    evt.eventDateTime,
      expiresAt:        evt.expiresAt,
      activeAttackName: evt.attackName,
      attacks:          evt.attacks,
    });
    setActiveTab("config");
    showToast(`Loaded "${evt.label}"`);
  }

  async function deleteEvent(id: string) {
    const toDelete = savedEvents.find((e) => e.id === id);
    const updated = savedEvents.filter((e) => e.id !== id);
    setSavedEvents(updated);

    // If this event's datetime is currently loaded in the config, clear it
    // so the preview widget restarts looping
    const updatedConfig =
      toDelete && toDelete.eventDateTime === config.eventDateTime
        ? { ...config, eventDateTime: "", expiresAt: "", activeAttackName: "" }
        : config;
    if (updatedConfig !== config) setConfig(updatedConfig);

    try {
      await saveToFile(updatedConfig, updated);
      // If we cleared the active event's datetime, also clear the stopped attack
      if (updatedConfig !== config) {
        fetch("/api/bjj", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stoppedAttack: null }),
        }).catch(() => {});
      }
      showToast("Event deleted");
    } catch {
      setSavedEvents(savedEvents);
      setConfig(config);
      showToast("Delete failed — please try again");
    }
  }

  // ── Export ────────────────────────────────────────────────────────────────

  function copyEmbed() {
    navigator.clipboard.writeText(generateEmbedCode(config, origin)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const attacks = config.attacks ?? DEFAULT_BJJ_ATTACKS;

  // Non-expired events sorted chronologically — upcoming first, then live
  const activeEvents = savedEvents
    .filter((e) => new Date(e.expiresAt).getTime() > Date.now())
    .sort((a, b) => new Date(a.eventDateTime).getTime() - new Date(b.eventDateTime).getTime());

  // The live event: most recently started (highest eventDateTime ≤ now, not yet expired)
  const now = Date.now();
  const liveEvent = [...activeEvents]
    .sort((a, b) => new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime())
    .find((e) => new Date(e.eventDateTime).getTime() <= now && now < new Date(e.expiresAt).getTime());

  // Preview config: when a live event exists, freeze the preview on the event's attack
  // (mirrors what the embed page does when it detects an active event)
  const previewConfig: BjjConfig = liveEvent ? {
    ...config,
    amount:           liveEvent.amount,
    eventLabel:       liveEvent.label,
    eventDateTime:    liveEvent.eventDateTime,
    expiresAt:        liveEvent.expiresAt,
    activeAttackName: liveEvent.attackName,
    attacks:          liveEvent.attacks?.length ? liveEvent.attacks : (config.attacks ?? DEFAULT_BJJ_ATTACKS),
  } : config;

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
                  Active Event
                </label>
                <div className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm">
                  {liveEvent ? (
                    <span className="text-green-400 font-medium">{liveEvent.label} — {liveEvent.attackName}</span>
                  ) : (
                    <span className="text-gray-500 italic">none</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveConfig}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-pink-700 hover:bg-pink-600 text-white transition-colors"
                >
                  Save Config
                </button>
              </div>
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
              {/* Create / Edit form */}
              {showEventForm ? (
                <div className="rounded-lg bg-gray-800 border border-pink-700 p-4 space-y-3">
                  <p className="text-sm font-semibold text-white">
                    {editingEventId ? "Edit Event" : "New Event"}
                  </p>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
                      Event Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={eventForm.name}
                      onChange={(e) => setEventForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Fight Night #12"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
                      Event Date &amp; Time <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={eventForm.date}
                      onChange={(e) => setEventForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 [color-scheme:dark]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your timezone: <span className="text-gray-400">{getLocalTzLabel()}</span> — saved as UTC so all viewers see it at the same moment.
                    </p>
                    {formErrors.date && (
                      <p className="text-xs text-red-400 mt-1">{formErrors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
                      Bonus Amount
                    </label>
                    <input
                      type="text"
                      value={eventForm.amount}
                      onChange={(e) => setEventForm((f) => ({ ...f, amount: e.target.value }))}
                      placeholder={config.amount || "$5,000"}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={cancelEventForm}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitEventForm}
                      className="flex-1 py-2 rounded-lg text-sm font-semibold bg-pink-700 hover:bg-pink-600 text-white transition-colors"
                    >
                      {editingEventId ? "Save Changes" : "Create Event"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={openCreateForm}
                    className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-pink-700 hover:bg-pink-600 text-white transition-colors"
                  >
                    + New Event
                  </button>
                  <button
                    onClick={() => downloadTxt(activeEvents)}
                    className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                    title="Download as TXT"
                  >
                    ↓
                  </button>
                </div>
              )}

              {activeEvents.length === 0 && !showEventForm ? (
                <div className="rounded-lg bg-gray-800 border border-gray-700 p-4 text-center">
                  <p className="text-xs text-gray-500">No events yet. Create one above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="rounded-lg bg-gray-800 border border-gray-700 p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white truncate">{evt.label}</p>
                            {(() => {
                              const now = Date.now();
                              const start = new Date(evt.eventDateTime).getTime();
                              const expiry = new Date(evt.expiresAt).getTime();
                              if (start <= now && now < expiry)
                                return <span className="text-xs font-bold text-green-400 shrink-0">● LIVE</span>;
                              return <span className="text-xs text-gray-500 shrink-0">UPCOMING</span>;
                            })()}
                          </div>
                          <p className="text-xs text-pink-400 font-medium">{evt.amount}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditForm(evt)}
                            className="px-2 py-1 rounded text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                            title="Edit event"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteEvent(evt.id)}
                            className="px-2 py-1 rounded text-xs text-gray-600 hover:text-red-400 hover:bg-gray-700 transition-colors font-bold"
                            title="Delete event"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        {evt.attackName && new Date(evt.eventDateTime).getTime() <= Date.now() && (
                          <p className="text-pink-300 font-medium">Attack  : {evt.attackName}</p>
                        )}
                        {evt.eventDateTime && (
                          <p>Date    : {new Date(evt.eventDateTime).toLocaleString()}</p>
                        )}
                        <p>Expires : {new Date(evt.expiresAt).toLocaleString()}</p>
                        <p>Attacks : {evt.attacks.length} moves</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-600">
                Events auto-expire at 11 PM on their event date.
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
        <div className="shrink-0 px-4 py-2 border-b border-gray-800 text-xs uppercase tracking-widest">
          {liveEvent ? (
            <span className="text-green-400 font-semibold">● Live: {liveEvent.label} — {liveEvent.attackName}</span>
          ) : (
            <span className="text-gray-500">Live Preview — no active event</span>
          )}
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
            <BjjWidget config={previewConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
