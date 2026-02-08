"use client";

import { useState, useMemo, useEffect } from "react";
import { useEditor } from "@/context/EditorContext";
import type { WidgetConfig } from "@/types/counter";

function generateEmbedCode(config: WidgetConfig, proxyBase: string): string {
  const { cards, styles, layout } = config;
  const widgetId = `cw-${config.id}`;

  const cardHtml = cards
    .map((card) => {
      // Make image paths absolute for cross-origin embedding
      const iconSrc = card.icon
        ? card.icon.startsWith("data:") ? card.icon : `${proxyBase}${card.icon}`
        : "";
      const iconHtml = iconSrc
        ? `<img src="${iconSrc}" alt="" style="width:48px;height:48px;object-fit:contain;" />`
        : "";

      // 1. Header label (e.g. "KUMITE")
      const labelHtml = card.label
        ? `<h2 style="margin:0;color:${styles.colors.text};font-size:${styles.fonts.labelFontSize};font-weight:${styles.fonts.labelWeight};font-family:${styles.fonts.family};text-transform:uppercase;-webkit-text-stroke:1px ${styles.colors.secondary};paint-order:stroke fill;">${card.label}</h2>`
        : "";

      // 2. Title / heading
      const titleHtml = card.title
        ? `<h3 style="margin:0;color:${styles.colors.text};font-size:${styles.fonts.titleFontSize};font-weight:${styles.fonts.titleWeight};font-family:${styles.fonts.family};">${card.title}</h3>`
        : "";

      // 3. Description / event details (blue text, multi-line)
      const descLines = card.description
        ? card.description.split("\n").map((l: string) => l.trim()).filter(Boolean).join("<br>")
        : "";
      const descHtml = descLines
        ? `<div style="margin:0;color:${styles.colors.primary};font-size:${styles.fonts.descriptionFontSize};font-weight:600;font-family:${styles.fonts.family};text-transform:uppercase;text-align:left;line-height:1.4;width:100%;">${descLines}</div>`
        : "";

      // Show formatted end value as default so it works even without JS
      const formattedEnd = card.animation.endValue.toLocaleString("en-US", {
        minimumFractionDigits: card.animation.decimalPlaces,
        maximumFractionDigits: card.animation.decimalPlaces,
      });
      const endColor = card.animation.endValue > 0 ? styles.colors.positive
        : card.animation.endValue < 0 ? styles.colors.negative
        : styles.colors.neutral;

      return `    <div class="${widgetId}-card" style="position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:12px;padding:${styles.padding};min-height:${styles.cardMinHeight};">
      ${labelHtml}
      ${iconHtml}
      <p class="${widgetId}-value" data-start="${card.animation.startValue}" data-end="${card.animation.endValue}" data-duration="${card.animation.duration}" data-easing="${card.animation.easing}" data-decimals="${card.animation.decimalPlaces}" data-prefix="${card.animation.prefix}" data-suffix="${card.animation.suffix}" style="margin:0;font-variant-numeric:tabular-nums;color:${endColor};font-size:${styles.fonts.valueFontSize};font-weight:${styles.fonts.valueWeight};font-style:italic;font-family:${styles.fonts.family};line-height:1.1;transition:color 0.3s;">${card.animation.prefix}${formattedEnd}${card.animation.suffix}</p>
      ${titleHtml}
      ${descHtml}
    </div>`;
    })
    .join("\n");

  const apiUrlEscaped = config.apiUrl ? config.apiUrl.replace(/"/g, '\\"') : "";

  return `<!-- Counter Widget - Embed Code -->
<div id="${widgetId}" style="max-width:${layout.maxWidth};margin:0 auto;padding:${layout.containerPadding};">
  <style>
    #${widgetId} .${widgetId}-grid {
      display:grid;gap:${styles.gap};
      grid-template-columns:repeat(${layout.columns.mobile},minmax(0,1fr));
    }
    @media(min-width:768px){
      #${widgetId} .${widgetId}-grid{grid-template-columns:repeat(${layout.columns.tablet},minmax(0,1fr));}
    }
    @media(min-width:1024px){
      #${widgetId} .${widgetId}-grid{grid-template-columns:repeat(${layout.columns.desktop},minmax(0,1fr));}
    }
    #${widgetId} .${widgetId}-card{word-break:break-word;overflow-wrap:break-word;}
    @media(max-width:640px){
      #${widgetId} .${widgetId}-card{padding:1rem;min-height:140px;}
      #${widgetId} .${widgetId}-value{font-size:clamp(1.5rem,6vw,${styles.fonts.valueFontSize})!important;}
      #${widgetId} .${widgetId}-card h3{font-size:clamp(0.85rem,3.5vw,${styles.fonts.titleFontSize})!important;}
      #${widgetId} .${widgetId}-card img{width:36px!important;height:36px!important;}
    }
  </style>
  <div class="${widgetId}-grid">
${cardHtml}
  </div>
</div>
<script>
(function(){
  var API_URL="${apiUrlEscaped}";
  var PROXY_BASE="${proxyBase}";
  var easings={
    linear:function(t){return t},
    easeOut:function(t){return 1-Math.pow(1-t,3)},
    easeInOut:function(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2},
    smooth:function(t){return t*t*(3-2*t)}
  };
  function fmt(v,d,pre,suf){
    return pre+v.toLocaleString("en-US",{minimumFractionDigits:d,maximumFractionDigits:d})+suf;
  }
  function animateEl(el){
    var start=parseFloat(el.dataset.start),end=parseFloat(el.dataset.end),
        dur=parseInt(el.dataset.duration),easing=el.dataset.easing||"easeOut",
        dec=parseInt(el.dataset.decimals),pre=el.dataset.prefix||"",suf=el.dataset.suffix||"",
        easeFn=easings[easing]||easings.easeOut,startTime=null;
    function step(ts){
      if(!startTime)startTime=ts;
      var p=Math.min((ts-startTime)/dur,1),ep=easeFn(p),val=start+(end-start)*ep;
      el.textContent=fmt(val,dec,pre,suf);
      if(val>0)el.style.color="${styles.colors.positive}";
      else if(val<0)el.style.color="${styles.colors.negative}";
      else el.style.color="${styles.colors.neutral}";
      if(p<1)requestAnimationFrame(step);
      else el.textContent=fmt(end,dec,pre,suf);
    }
    requestAnimationFrame(step);
  }
  function startAnimations(){
    var els=document.querySelectorAll("#${widgetId} .${widgetId}-value");
    if("IntersectionObserver" in window){
      var obs=new IntersectionObserver(function(entries){
        entries.forEach(function(e){if(e.isIntersecting){animateEl(e.target);obs.unobserve(e.target);}});
      },{threshold:0.3});
      els.forEach(function(el){obs.observe(el);});
    }else{
      els.forEach(animateEl);
    }
  }
  if(API_URL&&PROXY_BASE){
    fetch(PROXY_BASE+"/api/proxy?url="+encodeURIComponent(API_URL))
      .then(function(r){return r.json();})
      .then(function(data){
        var apiCards=data&&data.cards?data.cards:[];
        var els=document.querySelectorAll("#${widgetId} .${widgetId}-value");
        var max=Math.min(els.length,apiCards.length);
        for(var i=0;i<max;i++){
          if(apiCards[i].endValue!=null)els[i].dataset.end=apiCards[i].endValue;
          if(apiCards[i].prefix)els[i].dataset.prefix=apiCards[i].prefix;
          if(apiCards[i].postfix)els[i].dataset.suffix=apiCards[i].postfix;
        }
        startAnimations();
      })
      .catch(function(){startAnimations();});
  }else{
    startAnimations();
  }
})();
</script>`;
}

export function ExportTab() {
  const { state } = useEditor();
  const [copied, setCopied] = useState(false);
  const [proxyBase, setProxyBase] = useState("");

  useEffect(() => {
    setProxyBase(window.location.origin);
  }, []);

  const embedCode = useMemo(
    () => generateEmbedCode(state.widget, proxyBase),
    [state.widget, proxyBase]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = embedCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Embed Code
        </h3>
        <p className="text-sm text-gray-400 mb-3">
          Copy the code below and paste it into any HTML page. The widget is
          fully self-contained with no dependencies.
        </p>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className={`w-full py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${
          copied
            ? "bg-green-600 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {copied ? "Copied!" : "Copy Embed Code"}
      </button>

      {/* Code Preview */}
      <div className="relative">
        <pre className="p-4 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-300 overflow-auto max-h-96 whitespace-pre-wrap break-all font-mono leading-relaxed">
          {embedCode}
        </pre>
      </div>

      {/* Info */}
      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
        <h4 className="text-sm font-medium text-white mb-2">Features</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>- Fully self-contained (no external dependencies)</li>
          <li>- Responsive grid layout (mobile, tablet, desktop)</li>
          <li>- Smooth count-up animation with easing</li>
          <li>- Scroll-triggered via IntersectionObserver</li>
          <li>- Hover effects on cards</li>
          <li>- Value color coding (positive/negative)</li>
        </ul>
      </div>
    </div>
  );
}

export default ExportTab;
