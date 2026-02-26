"use client";

import { useState, useEffect } from "react";
import {
  BjjWidget,
  DEFAULT_BJJ_CONFIG,
  DEFAULT_BJJ_ATTACKS,
} from "./BjjWidget";
import type { BjjConfig } from "./BjjWidget";

// ─── Embed code generator ─────────────────────────────────────────────────────

function generateEmbedCode(config: BjjConfig, origin: string): string {
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
  0%   { transform: scale(1);    filter: drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 15px #FFD700); }
  12%  { transform: scale(1.08); filter: drop-shadow(0 0 12px #C0C0C0) drop-shadow(0 0 25px #C0C0C0) drop-shadow(0 0 35px #FFD700); }
  25%  { transform: scale(1.12); filter: drop-shadow(0 0 18px #FFD700) drop-shadow(0 0 30px #FFD700) drop-shadow(0 0 45px #FFFFFF); }
  37%  { transform: scale(1.06); filter: drop-shadow(0 0 14px #C0C0C0) drop-shadow(0 0 28px #C0C0C0) drop-shadow(0 0 40px #FFD700); }
  50%  { transform: scale(1.15); filter: drop-shadow(0 0 22px #FFFFFF) drop-shadow(0 0 35px #FFFFFF) drop-shadow(0 0 50px #FFD700); }
  62%  { transform: scale(1.04); filter: drop-shadow(0 0 16px #FFD700) drop-shadow(0 0 32px #FFD700) drop-shadow(0 0 42px #C0C0C0); }
  75%  { transform: scale(1.10); filter: drop-shadow(0 0 20px #C0C0C0) drop-shadow(0 0 38px #C0C0C0) drop-shadow(0 0 55px #FFFFFF); }
  87%  { transform: scale(1.02); filter: drop-shadow(0 0 10px #FFD700) drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 30px #C0C0C0); }
  100% { transform: scale(1);    filter: drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 15px #FFD700); }
}
@keyframes brainThrobIntense {
  0%   { transform: scale(1);    filter: drop-shadow(0 0 15px #ff0066) drop-shadow(0 0 30px #ff0066); }
  25%  { transform: scale(1.12); filter: drop-shadow(0 0 25px #66ff00) drop-shadow(0 0 50px #66ff00); }
  50%  { transform: scale(1.18); filter: drop-shadow(0 0 35px #0099ff) drop-shadow(0 0 70px #0099ff); }
  75%  { transform: scale(1.12); filter: drop-shadow(0 0 25px #0099ff) drop-shadow(0 0 50px #0099ff); }
  100% { transform: scale(1);    filter: drop-shadow(0 0 15px #ff0066) drop-shadow(0 0 30px #ff0066); }
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
.mode-loop .bjj-label  { color: #a0cfff; text-shadow: 0 0 8px rgba(46,164,255,0.3); }
.mode-event .bjj-label { color: #e8c8f8; text-shadow: 0 0 8px rgba(244,176,245,0.3); }
.mode-loop .bjj-attack  { color: rgb(46,164,255);   text-shadow: 0 0 15px rgba(0,255,255,0.8), 0 0 30px rgba(255,0,255,0.6); }
.mode-event .bjj-attack { color: rgb(244,176,245); text-shadow: 0 0 20px rgba(0,153,255,0.9), 0 0 40px rgba(255,0,102,0.7); }
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
  var API_STATUS = 'https://ugia-mmeab.ondigitalocean.app/api/aras25/status';
  var API_TEXT   = 'https://ugia-mmeab.ondigitalocean.app/api/aras25/attack/text';
  var SYNC_INTERVAL = 3000;
  var LOOP_INTERVAL = 200;

  var defaultAttacks = ${JSON.stringify(DEFAULT_BJJ_ATTACKS)};

  var localAttacks   = defaultAttacks.slice();
  var isLooping      = true;
  var currentAttack  = '';
  var loopTimer      = null;
  var isSyncing      = false;

  var root       = document.getElementById('bjj-root');
  var logoWrap   = document.getElementById('bjj-logo-wrap');
  var attackEl   = document.getElementById('bjj-attack');

  function setMode(loop) {
    isLooping = loop;
    root.className  = 'bjj-widget ' + (loop ? 'mode-loop' : 'mode-event');
    logoWrap.className = loop ? 'bjj-logo-spark' : 'bjj-logo-rgb';
  }

  function startLoop() {
    if (loopTimer) return;
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

      if (Array.isArray(data.attacks) && data.attacks.length > 0) {
        localAttacks = data.attacks;
      }

      var shouldLoop = !!data.isLooping;

      if (shouldLoop !== isLooping) {
        setMode(shouldLoop);
        if (shouldLoop) {
          startLoop();
        } else {
          stopLoop();
          showAttack(data.selectedAttackOnStop || data.currentAttack || currentAttack);
        }
      } else if (!shouldLoop) {
        var atk = data.selectedAttackOnStop || data.currentAttack || currentAttack;
        if (atk && atk !== currentAttack) showAttack(atk);
      }
    } finally {
      isSyncing = false;
    }
  }

  // Boot
  startLoop();
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

export function BjjEditorShell() {
  const [config, setConfig] = useState<BjjConfig>(DEFAULT_BJJ_CONFIG);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"config" | "export">("config");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const update = (patch: Partial<BjjConfig>) =>
    setConfig((c) => ({ ...c, ...patch }));

  const copyEmbed = () => {
    navigator.clipboard.writeText(generateEmbedCode(config, origin)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden">
      {/* ── Sidebar ── */}
      <div className="w-full md:w-[400px] shrink-0 flex flex-col border-r border-gray-700 bg-gray-900">
        {/* Header */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-700 shrink-0">
          <span className="flex-1 px-3 py-1.5 text-sm font-medium text-white">
            BJJ Submission Bonus Widget
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 shrink-0">
          {(["config", "export"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                activeTab === t
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t === "config" ? "Configure" : "Export"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {activeTab === "config" && (
            <>
              {/* Server info banner */}
              <div className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-xs text-gray-400 space-y-1">
                <p className="font-semibold text-gray-300">
                  Server-driven mode
                </p>
                <p>
                  Attack cycling and mode (loop / event) are controlled live
                  via:
                </p>
                <code className="block text-blue-400 break-all mt-1">
                  ugia-mmeab.ondigitalocean.app/api/aras25/status
                </code>
                <p className="mt-1">
                  The green dot in the preview corner shows connection status.
                  Syncs every 3 seconds.
                </p>
              </div>

              {/* Dollar amount */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                  Bonus Amount
                </label>
                <input
                  type="text"
                  value={config.amount}
                  onChange={(e) => update({ amount: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$5,000"
                />
              </div>

              {/* Event label */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                  Event Label
                </label>
                <input
                  type="text"
                  value={config.eventLabel}
                  onChange={(e) => update({ eventLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="SUBMISSION BONUS — FIGHT NIGHT"
                />
              </div>

              {/* Default attacks info */}
              <div className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-xs text-gray-500">
                <p className="text-gray-400 font-medium mb-1">
                  Default attacks fallback ({DEFAULT_BJJ_ATTACKS.length} moves)
                </p>
                <p>
                  Used until server responds. The server can override this list
                  via the <code className="text-blue-400">attacks</code> field
                  in the status response.
                </p>
              </div>
            </>
          )}

          {activeTab === "export" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                For streaming/OBS, use the direct embed URL below. For
                copy-paste HTML, use the button beneath it.
              </p>

              {/* Direct embed URL */}
              <div className="rounded-lg bg-gray-800 border border-gray-700 p-3 text-xs space-y-1">
                <p className="text-gray-400 font-medium">Direct embed URL (iframe / OBS Browser Source)</p>
                <code className="block text-blue-400 break-all">{origin}/bjj</code>
              </div>

              <button
                onClick={copyEmbed}
                className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
                  copied
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
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
      <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-gray-950 overflow-auto">
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
