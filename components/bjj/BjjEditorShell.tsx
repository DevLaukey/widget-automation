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
.bjj-logo { width: 220px; height: 220px; }
.bjj-logo-spark { animation: bjjSparkLoop 0.7s steps(5) infinite; }
.bjj-logo-rgb   { animation: bjjRgbShift 0.7s linear infinite; }
.bjj-amount {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: clamp(72px, 20vw, 148px);
  line-height: 1;
  color: #00ff41;
  text-shadow: 0 0 18px #00ff41, 0 0 40px #00ff41, 0 0 80px #00cc33, 0 0 120px #009922;
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
    <svg class="bjj-logo" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="L"><path d="M110,3 A107,107 0 0,0 110,217 Z"/></clipPath>
        <clipPath id="R"><path d="M110,3 A107,107 0 0,1 110,217 Z"/></clipPath>
        <filter id="G" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="N" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="110" cy="110" r="107" fill="#0c0c1e"/>
      <g clip-path="url(#L)">
        <circle cx="110" cy="110" r="107" fill="#111128"/>
        <polygon points="110,10 88,34 100,50 110,42" fill="#e8e8f8"/>
        <polygon points="88,34 68,52 82,66 100,50" fill="#c0c0d8"/>
        <polygon points="110,10 68,52 38,76 62,96 110,78" fill="#8888a0"/>
        <polygon points="38,76 14,108 38,130 62,96" fill="#9898b4"/>
        <polygon points="110,78 62,96 58,144 110,132" fill="#606078"/>
        <polygon points="62,96 38,130 52,158 58,144" fill="#787890"/>
        <polygon points="38,130 14,108 26,160 52,158" fill="#888898"/>
        <polygon points="52,158 26,160 44,184 72,178 58,144" fill="#707088"/>
        <polygon points="58,144 72,178 110,210 110,168" fill="#5c5c70"/>
        <polygon points="44,184 72,178 110,210" fill="#484858"/>
        <polygon points="110,132 58,144 110,168" fill="#505064"/>
        <polygon points="110,10 92,26 100,42 110,34" fill="#f0f0ff" opacity="0.5"/>
        <line x1="110" y1="10" x2="68" y2="52" stroke="#080818" stroke-width="0.9"/><line x1="68" y1="52" x2="38" y2="76" stroke="#080818" stroke-width="0.9"/><line x1="68" y1="52" x2="82" y2="66" stroke="#080818" stroke-width="0.7"/><line x1="38" y1="76" x2="14" y2="108" stroke="#080818" stroke-width="0.9"/><line x1="38" y1="76" x2="62" y2="96" stroke="#080818" stroke-width="0.9"/><line x1="14" y1="108" x2="38" y2="130" stroke="#080818" stroke-width="0.9"/><line x1="62" y1="96" x2="110" y2="78" stroke="#080818" stroke-width="0.7"/><line x1="62" y1="96" x2="58" y2="144" stroke="#080818" stroke-width="0.9"/><line x1="58" y1="144" x2="110" y2="132" stroke="#080818" stroke-width="0.7"/><line x1="38" y1="130" x2="52" y2="158" stroke="#080818" stroke-width="0.9"/><line x1="52" y1="158" x2="26" y2="160" stroke="#080818" stroke-width="0.9"/><line x1="26" y1="160" x2="44" y2="184" stroke="#080818" stroke-width="0.9"/><line x1="44" y1="184" x2="72" y2="178" stroke="#080818" stroke-width="0.9"/><line x1="72" y1="178" x2="110" y2="210" stroke="#080818" stroke-width="0.9"/>
      </g>
      <g clip-path="url(#R)">
        <circle cx="110" cy="110" r="107" fill="#050514"/>
        <polygon points="135,22 155,22 165,39 155,56 135,56 125,39" fill="none" stroke="#163256" stroke-width="1"/><polygon points="165,39 185,39 195,56 185,73 165,73 155,56" fill="none" stroke="#163256" stroke-width="1"/><polygon points="115,56 135,56 145,73 135,90 115,90 105,73" fill="none" stroke="#163256" stroke-width="1"/><polygon points="145,73 165,73 175,90 165,107 145,107 135,90" fill="#0a1a30" stroke="#1e5080" stroke-width="1.2"/><polygon points="175,90 195,90 205,107 195,124 175,124 165,107" fill="none" stroke="#163256" stroke-width="1"/><polygon points="115,107 135,107 145,124 135,141 115,141 105,124" fill="none" stroke="#163256" stroke-width="1"/><polygon points="145,124 165,124 175,141 165,158 145,158 135,141" fill="#0a1a30" stroke="#1e5080" stroke-width="1.2"/><polygon points="175,141 195,141 205,158 195,175 175,175 165,158" fill="none" stroke="#163256" stroke-width="1"/><polygon points="115,158 135,158 145,175 135,192 115,192 105,175" fill="none" stroke="#163256" stroke-width="1"/><polygon points="145,175 165,175 175,192 165,209 145,209 135,192" fill="none" stroke="#163256" stroke-width="1"/>
        <path d="M145,39 L165,39" stroke="#2ea4ff" stroke-width="2" fill="none" opacity="0.95"/><path d="M165,39 L175,56 L165,73" stroke="#2ea4ff" stroke-width="1.8" fill="none" opacity="0.8"/><path d="M165,73 L175,90 L165,107" stroke="#2ea4ff" stroke-width="2" fill="none" opacity="0.95"/><path d="M145,107 L165,107" stroke="#2ea4ff" stroke-width="2.5" fill="none" opacity="1"/><path d="M165,107 L175,124 L165,141" stroke="#2ea4ff" stroke-width="2" fill="none" opacity="0.95"/><path d="M165,141 L175,158 L165,175" stroke="#2ea4ff" stroke-width="1.8" fill="none" opacity="0.8"/><path d="M145,175 L165,175" stroke="#2ea4ff" stroke-width="2" fill="none" opacity="0.95"/><path d="M145,73 L125,73 L115,90" stroke="#2ea4ff" stroke-width="1.5" fill="none" opacity="0.6"/>
        <circle cx="145" cy="39" r="3.5" fill="#2ea4ff" filter="url(#N)"/><circle cx="165" cy="39" r="4" fill="#00ffff" filter="url(#N)"/><circle cx="165" cy="73" r="4.5" fill="#2ea4ff" filter="url(#N)"/><circle cx="175" cy="90" r="3.5" fill="#00ffff" filter="url(#N)"/><circle cx="165" cy="107" r="7" fill="#2ea4ff" opacity="0.15"/><circle cx="165" cy="107" r="5" fill="#2ea4ff" opacity="0.5"/><circle cx="165" cy="107" r="3" fill="#00ffff" filter="url(#N)"/><circle cx="165" cy="107" r="1.5" fill="#ffffff" opacity="0.95"/><circle cx="145" cy="107" r="3.5" fill="#00ffff" filter="url(#N)"/><circle cx="165" cy="141" r="4.5" fill="#2ea4ff" filter="url(#N)"/><circle cx="175" cy="158" r="3.5" fill="#00ffff" filter="url(#N)"/><circle cx="165" cy="175" r="4" fill="#2ea4ff" filter="url(#N)"/><circle cx="145" cy="175" r="3" fill="#2ea4ff" opacity="0.85"/>
      </g>
      <line x1="110" y1="6" x2="110" y2="214" stroke="#1e3a5a" stroke-width="1.5" opacity="0.9"/>
      <circle cx="110" cy="110" r="107" fill="none" stroke="#2ea4ff" stroke-width="2" opacity="0.4" filter="url(#G)"/>
      <circle cx="110" cy="110" r="105" fill="none" stroke="#2ea4ff" stroke-width="0.6" opacity="0.55"/>
    </svg>
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
