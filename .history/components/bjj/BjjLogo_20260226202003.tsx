"use client";

export function BjjLogo() {
  return (
    <svg
      width="420"
      height="420"
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        {/* Clip left semicircle */}
        <clipPath id="bjjLeft">
          <path d="M110,3 A107,107 0 0,0 110,217 Z" />
        </clipPath>
        {/* Clip right semicircle */}
        <clipPath id="bjjRight">
          <path d="M110,3 A107,107 0 0,1 110,217 Z" />
        </clipPath>
        {/* Blue glow filter */}
        <filter id="bjjGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Node dot glow */}
        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Background circle ── */}
      <circle cx="110" cy="110" r="107" fill="#0c0c1e" />

      {/* ═══════════════════════════════════════
          LEFT HALF — Faceted Crystal / Gem
          ═══════════════════════════════════════ */}
      <g clipPath="url(#bjjLeft)">
        <circle cx="110" cy="110" r="107" fill="#111128" />

        {/* Crystal facets — varied grey shades */}
        {/* Top crown highlight */}
        <polygon points="110,10 88,34 100,50 110,42" fill="#e8e8f8" />
        {/* Upper crown */}
        <polygon points="88,34 68,52 82,66 100,50" fill="#c0c0d8" />
        {/* Crown-to-shoulder */}
        <polygon points="110,10 68,52 38,76 62,96 110,78" fill="#8888a0" />
        {/* Left upper shoulder */}
        <polygon points="38,76 14,108 38,130 62,96" fill="#9898b4" />
        {/* Center upper face */}
        <polygon points="110,78 62,96 58,144 110,132" fill="#606078" />
        {/* Left middle face */}
        <polygon points="62,96 38,130 52,158 58,144" fill="#7878908" />
        {/* Left lower face */}
        <polygon points="38,130 14,108 26,160 52,158" fill="#888898" />
        {/* Lower crown */}
        <polygon points="52,158 26,160 44,184 72,178 58,144" fill="#707088" />
        {/* Bottom center */}
        <polygon points="58,144 72,178 110,210 110,168" fill="#5c5c70" />
        {/* Bottom left edge */}
        <polygon points="44,184 72,178 110,210" fill="#484858" />
        {/* Center lower face */}
        <polygon points="110,132 58,144 110,168" fill="#505064" />

        {/* Specular highlights */}
        <polygon
          points="110,10 92,26 100,42 110,34"
          fill="#f0f0ff"
          opacity="0.5"
        />
        <polygon points="14,108 28,100 38,130" fill="#c8c8e0" opacity="0.25" />

        {/* Facet edge lines */}
        <line
          x1="110"
          y1="10"
          x2="68"
          y2="52"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="68"
          y1="52"
          x2="38"
          y2="76"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="68"
          y1="52"
          x2="82"
          y2="66"
          stroke="#080818"
          strokeWidth="0.7"
        />
        <line
          x1="82"
          y1="66"
          x2="100"
          y2="50"
          stroke="#080818"
          strokeWidth="0.7"
        />
        <line
          x1="38"
          y1="76"
          x2="14"
          y2="108"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="38"
          y1="76"
          x2="62"
          y2="96"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="14"
          y1="108"
          x2="38"
          y2="130"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="62"
          y1="96"
          x2="110"
          y2="78"
          stroke="#080818"
          strokeWidth="0.7"
        />
        <line
          x1="62"
          y1="96"
          x2="58"
          y2="144"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="110"
          y1="78"
          x2="110"
          y2="132"
          stroke="#080818"
          strokeWidth="0.7"
        />
        <line
          x1="58"
          y1="144"
          x2="110"
          y2="132"
          stroke="#080818"
          strokeWidth="0.7"
        />
        <line
          x1="38"
          y1="130"
          x2="52"
          y2="158"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="38"
          y1="130"
          x2="14"
          y2="108"
          stroke="#080818"
          strokeWidth="0.5"
        />
        <line
          x1="52"
          y1="158"
          x2="58"
          y2="144"
          stroke="#080818"
          strokeWidth="0.7"
        />
        <line
          x1="52"
          y1="158"
          x2="26"
          y2="160"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="26"
          y1="160"
          x2="44"
          y2="184"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="44"
          y1="184"
          x2="72"
          y2="178"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="72"
          y1="178"
          x2="110"
          y2="210"
          stroke="#080818"
          strokeWidth="0.9"
        />
        <line
          x1="110"
          y1="132"
          x2="110"
          y2="168"
          stroke="#080818"
          strokeWidth="0.7"
        />
        <line
          x1="58"
          y1="144"
          x2="72"
          y2="178"
          stroke="#080818"
          strokeWidth="0.7"
        />
        <line
          x1="110"
          y1="168"
          x2="72"
          y2="178"
          stroke="#080818"
          strokeWidth="0.7"
        />
      </g>

      {/* ═══════════════════════════════════════
          RIGHT HALF — Hex Circuit Board
          ═══════════════════════════════════════ */}
      <g clipPath="url(#bjjRight)">
        <circle cx="110" cy="110" r="107" fill="#050514" />

        {/* Hexagonal grid cells (flat-top hexagons, r≈20) */}
        {/* Row A */}
        <polygon
          points="135,22 155,22 165,39 155,56 135,56 125,39"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />
        <polygon
          points="165,39 185,39 195,56 185,73 165,73 155,56"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />
        {/* Row B */}
        <polygon
          points="115,56 135,56 145,73 135,90 115,90 105,73"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />
        <polygon
          points="145,73 165,73 175,90 165,107 145,107 135,90"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />
        <polygon
          points="175,90 195,90 205,107 195,124 175,124 165,107"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />
        {/* Row C (center) */}
        <polygon
          points="115,107 135,107 145,124 135,141 115,141 105,124"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />
        <polygon
          points="145,124 165,124 175,141 165,158 145,158 135,141"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />
        <polygon
          points="175,141 195,141 205,158 195,175 175,175 165,158"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />
        {/* Row D */}
        <polygon
          points="115,158 135,158 145,175 135,192 115,192 105,175"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />
        <polygon
          points="145,175 165,175 175,192 165,209 145,209 135,192"
          fill="none"
          stroke="#163256"
          strokeWidth="1"
        />

        {/* Slightly lit cells */}
        <polygon
          points="145,73 165,73 175,90 165,107 145,107 135,90"
          fill="#0a1a30"
          stroke="#1e5080"
          strokeWidth="1.2"
        />
        <polygon
          points="145,124 165,124 175,141 165,158 145,158 135,141"
          fill="#0a1a30"
          stroke="#1e5080"
          strokeWidth="1.2"
        />

        {/* Circuit traces */}
        <path
          d="M145,39 L165,39"
          stroke="#2ea4ff"
          strokeWidth="2"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M165,39 L175,56 L165,73"
          stroke="#2ea4ff"
          strokeWidth="1.8"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M145,73 L125,73 L115,90"
          stroke="#2ea4ff"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M165,73 L175,90 L165,107"
          stroke="#2ea4ff"
          strokeWidth="2"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M145,107 L165,107"
          stroke="#2ea4ff"
          strokeWidth="2.5"
          fill="none"
          opacity="1"
        />
        <path
          d="M165,107 L175,124 L165,141"
          stroke="#2ea4ff"
          strokeWidth="2"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M145,124 L125,124 L115,141"
          stroke="#2ea4ff"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M165,141 L175,158 L165,175"
          stroke="#2ea4ff"
          strokeWidth="1.8"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M145,175 L165,175"
          stroke="#2ea4ff"
          strokeWidth="2"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M195,56 L195,90"
          stroke="#2ea4ff"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M195,107 L195,141"
          stroke="#2ea4ff"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />

        {/* Node dots */}
        <circle
          cx="145"
          cy="39"
          r="3.5"
          fill="#2ea4ff"
          filter="url(#nodeGlow)"
        />
        <circle cx="165" cy="39" r="4" fill="#00ffff" filter="url(#nodeGlow)" />
        <circle cx="175" cy="56" r="2.5" fill="#2ea4ff" opacity="0.8" />
        <circle
          cx="165"
          cy="73"
          r="4.5"
          fill="#2ea4ff"
          filter="url(#nodeGlow)"
        />
        <circle cx="145" cy="73" r="2.5" fill="#2ea4ff" opacity="0.7" />
        <circle cx="125" cy="73" r="2" fill="#2ea4ff" opacity="0.6" />
        <circle cx="115" cy="90" r="3" fill="#2ea4ff" opacity="0.75" />
        <circle
          cx="175"
          cy="90"
          r="3.5"
          fill="#00ffff"
          filter="url(#nodeGlow)"
        />
        <circle cx="195" cy="90" r="2.5" fill="#2ea4ff" opacity="0.65" />
        {/* Center star node */}
        <circle cx="165" cy="107" r="7" fill="#2ea4ff" opacity="0.15" />
        <circle cx="165" cy="107" r="5" fill="#2ea4ff" opacity="0.5" />
        <circle
          cx="165"
          cy="107"
          r="3"
          fill="#00ffff"
          filter="url(#nodeGlow)"
        />
        <circle cx="165" cy="107" r="1.5" fill="#ffffff" opacity="0.95" />
        <circle
          cx="145"
          cy="107"
          r="3.5"
          fill="#00ffff"
          filter="url(#nodeGlow)"
        />
        <circle cx="195" cy="107" r="2" fill="#2ea4ff" opacity="0.6" />
        <circle cx="175" cy="124" r="3" fill="#2ea4ff" opacity="0.8" />
        <circle
          cx="165"
          cy="141"
          r="4.5"
          fill="#2ea4ff"
          filter="url(#nodeGlow)"
        />
        <circle cx="145" cy="124" r="2.5" fill="#2ea4ff" opacity="0.7" />
        <circle cx="125" cy="124" r="2" fill="#2ea4ff" opacity="0.6" />
        <circle
          cx="175"
          cy="158"
          r="3.5"
          fill="#00ffff"
          filter="url(#nodeGlow)"
        />
        <circle
          cx="165"
          cy="175"
          r="4"
          fill="#2ea4ff"
          filter="url(#nodeGlow)"
        />
        <circle cx="145" cy="175" r="3" fill="#2ea4ff" opacity="0.85" />
        <circle cx="195" cy="141" r="2.5" fill="#2ea4ff" opacity="0.55" />
      </g>

      {/* ── Center dividing line ── */}
      <line
        x1="110"
        y1="6"
        x2="110"
        y2="214"
        stroke="#1e3a5a"
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* ── Outer glow ring ── */}
      <circle
        cx="110"
        cy="110"
        r="107"
        fill="none"
        stroke="#2ea4ff"
        strokeWidth="2"
        opacity="0.4"
        filter="url(#bjjGlow)"
      />
      <circle
        cx="110"
        cy="110"
        r="105"
        fill="none"
        stroke="#2ea4ff"
        strokeWidth="0.6"
        opacity="0.55"
      />
    </svg>
  );
}
