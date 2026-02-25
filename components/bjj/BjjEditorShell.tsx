"use client";

import { useState } from "react";
import { BjjWidget, DEFAULT_BJJ_CONFIG } from "./BjjWidget";
import type { BjjConfig } from "./BjjWidget";

function generateEmbedCode(config: BjjConfig): string {
  const attacks = JSON.stringify(config.attacks);
  const isLooping = config.mode === "looping";

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
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px 48px;
}
@keyframes bjjSparkLoop {
  0%   { filter: drop-shadow(0 0 6px gold) drop-shadow(0 0 3px silver); }
  15%  { filter: drop-shadow(3px -3px 14px #ffd700) drop-shadow(-1px 1px 7px silver) drop-shadow(0 0 20px gold); }
  30%  { filter: drop-shadow(-3px 2px 8px silver) drop-shadow(2px -2px 18px #ffd700); }
  45%  { filter: drop-shadow(2px 3px 18px gold) drop-shadow(-3px -1px 5px silver); }
  60%  { filter: drop-shadow(-2px -3px 6px silver) drop-shadow(3px 2px 14px gold) drop-shadow(0 0 10px #fffacd); }
  75%  { filter: drop-shadow(1px -2px 12px #ffd700) drop-shadow(-2px 3px 8px silver) drop-shadow(0 0 18px gold); }
  100% { filter: drop-shadow(0 0 6px gold) drop-shadow(0 0 3px silver); }
}
@keyframes bjjRgbShift {
  0%   { filter: drop-shadow(0 0 18px #f4b0f5) drop-shadow(0 0 8px #ff00aa); }
  33%  { filter: drop-shadow(0 0 18px #00ff41) drop-shadow(0 0 8px #00cc33); }
  66%  { filter: drop-shadow(0 0 18px #2ea4ff) drop-shadow(0 0 8px #0044ff); }
  100% { filter: drop-shadow(0 0 18px #f4b0f5) drop-shadow(0 0 8px #ff00aa); }
}
.bjj-logo-spark { animation: bjjSparkLoop 0.7s steps(5) infinite; }
.bjj-logo-rgb   { animation: bjjRgbShift 0.7s linear infinite; }
.bjj-amount {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: clamp(72px, 20vw, 148px);
  line-height: 1;
  color: #00ff41;
  text-shadow: 0 0 8px #00ff41, 0 0 20px #00cc33;
  text-transform: uppercase;
  margin-top: 24px;
  letter-spacing: -0.02em;
  white-space: nowrap;
}
.bjj-label {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: clamp(13px, 2.2vw, 18px);
  text-transform: uppercase;
  letter-spacing: 0.22em;
  margin-top: 10px;
  text-align: center;
  opacity: 0.88;
}
.bjj-label-loop  { color: #a0cfff; text-shadow: 0 0 8px #2ea4ff44, 0 0 20px #00ffff22; }
.bjj-label-event { color: #e8c8f8; text-shadow: 0 0 8px #f4b0f544, 0 0 20px #ff006622; }
.bjj-attack {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: clamp(32px, 8vw, 72px);
  line-height: 1;
  text-transform: uppercase;
  margin-top: 20px;
  text-align: center;
  letter-spacing: 0.02em;
  min-height: 1em;
}
.bjj-attack-loop  { color: #2ea4ff; text-shadow: 0 0 12px #2ea4ff, 0 0 28px #00ffff, 0 0 50px #ff00ff; }
.bjj-attack-event { color: #f4b0f5; text-shadow: 0 0 12px #f4b0f5, 0 0 28px #4444ff, 0 0 50px #ff0044; }
</style>
</head>
<body>
<div class="bjj-widget">
  <div class="${isLooping ? "bjj-logo-spark" : "bjj-logo-rgb"}">
    <img src="/images/logo-widget%202.png" alt="Widget Logo" width="220" height="220" style="display:block;">
  </div>

  <div class="bjj-amount">${config.amount}</div>
  <div class="bjj-label ${isLooping ? "bjj-label-loop" : "bjj-label-event"}">${config.eventLabel}</div>
  <div class="bjj-attack ${isLooping ? "bjj-attack-loop" : "bjj-attack-event"}" id="bjj-attack-name">${isLooping ? config.attacks[0] ?? "" : config.attackName}</div>
</div>
${
  isLooping
    ? `<script>
(function(){
  var attacks = ${attacks};
  var i = 0;
  var el = document.getElementById('bjj-attack-name');
  setInterval(function(){ el.textContent = attacks[i++ % attacks.length]; }, 200);
})();
</script>`
    : ""
}
</body>
</html>`;
}

export function BjjEditorShell() {
  const [config, setConfig] = useState<BjjConfig>(DEFAULT_BJJ_CONFIG);
  const [copied, setCopied] = useState(false);
  const [newAttack, setNewAttack] = useState("");
  const [activeTab, setActiveTab] = useState<"config" | "export">("config");

  const update = (patch: Partial<BjjConfig>) =>
    setConfig((c) => ({ ...c, ...patch }));

  const addAttack = () => {
    const val = newAttack.trim().toUpperCase();
    if (!val) return;
    update({ attacks: [...config.attacks, val] });
    setNewAttack("");
  };

  const removeAttack = (idx: number) =>
    update({ attacks: config.attacks.filter((_, i) => i !== idx) });

  const copyEmbed = () => {
    navigator.clipboard.writeText(generateEmbedCode(config)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-[400px] shrink-0 flex flex-col border-r border-gray-700 bg-gray-900">
        {/* Header */}
        <div className="flex items-center gap-2 p-3 border-b border-gray-700 shrink-0">
          <span className="flex-1 px-3 py-1.5 text-sm font-medium text-white">
            BJJ Submission Bonus Widget
          </span>
        </div>

        {/* Tab bar */}
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

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {activeTab === "config" && (
            <>
              {/* Mode toggle */}
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                  Mode
                </label>
                <div className="flex gap-2">
                  {(["looping", "event"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => update({ mode: m })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        config.mode === m
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {m === "looping" ? "⚡ Looping" : "🔒 Event"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {config.mode === "looping"
                    ? "Cycles through attacks every 200ms — gold spark logo"
                    : "Fixed attack shown — slow RGB logo"}
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

              {/* Event mode: fixed attack name */}
              {config.mode === "event" && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">
                    Attack Name (locked)
                  </label>
                  <input
                    type="text"
                    value={config.attackName}
                    onChange={(e) =>
                      update({ attackName: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="REAR NAKED CHOKE"
                  />
                </div>
              )}

              {/* Looping mode: attacks list */}
              {config.mode === "looping" && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                    Attacks List ({config.attacks.length})
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto mb-2">
                    {config.attacks.map((atk, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700 text-sm"
                      >
                        <span className="flex-1 text-gray-200 font-mono text-xs">
                          {atk}
                        </span>
                        <button
                          onClick={() => removeAttack(idx)}
                          className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAttack}
                      onChange={(e) => setNewAttack(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && addAttack()}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ADD ATTACK..."
                    />
                    <button
                      onClick={addAttack}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "export" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Copy the embed code below and paste it anywhere — the widget
                is fully self-contained with no external dependencies.
              </p>
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
                {generateEmbedCode(config)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-gray-950 overflow-auto">
        <div className="shrink-0 px-4 py-2 border-b border-gray-800 text-xs text-gray-500 uppercase tracking-widest">
          Live Preview
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
