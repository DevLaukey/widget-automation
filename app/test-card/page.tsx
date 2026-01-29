"use client";

import { CounterCard } from "@/components/counter";
import {
  DEFAULT_STYLE_CONFIG,
  DEFAULT_ANIMATION_CONFIG,
  type CardData,
  type StyleConfig,
} from "@/types";

// Sample cards for testing
const sampleCards: CardData[] = [
  {
    id: "1",
    label: "Total Revenue",
    title: "Annual Earnings",
    description: "Combined revenue from all product lines and services",
    animation: {
      ...DEFAULT_ANIMATION_CONFIG,
      endValue: 1250000,
      duration: 2500,
      prefix: "$",
      triggerOnScroll: false,
    },
  },
  {
    id: "2",
    label: "Expenses",
    title: "Operating Costs",
    description: "Total operational expenditure for the fiscal year",
    animation: {
      ...DEFAULT_ANIMATION_CONFIG,
      endValue: -45000,
      duration: 2000,
      prefix: "$",
      easing: "smooth",
      triggerOnScroll: false,
    },
  },
  {
    id: "3",
    label: "Success Rate",
    title: "Conversion",
    description: "Percentage of successful customer conversions",
    animation: {
      ...DEFAULT_ANIMATION_CONFIG,
      endValue: 99.99,
      duration: 1500,
      suffix: "%",
      decimalPlaces: 2,
      easing: "easeInOut",
      triggerOnScroll: false,
    },
  },
  {
    id: "4",
    label: "Active Users",
    title: "Monthly Active",
    description: "Users who logged in at least once this month",
    animation: {
      ...DEFAULT_ANIMATION_CONFIG,
      endValue: 52847,
      duration: 2000,
      triggerOnScroll: false,
    },
  },
  {
    id: "5",
    label: "Growth Rate",
    title: "Year over Year",
    description: "Compared to the same period last year",
    animation: {
      ...DEFAULT_ANIMATION_CONFIG,
      endValue: 127.5,
      duration: 1800,
      suffix: "%",
      decimalPlaces: 1,
      prefix: "+",
      triggerOnScroll: false,
    },
  },
  {
    id: "6",
    label: "Net Loss",
    title: "Q4 Results",
    description: "Quarterly financial performance",
    animation: {
      ...DEFAULT_ANIMATION_CONFIG,
      endValue: -8750,
      duration: 2200,
      prefix: "$",
      easing: "easeOut",
      triggerOnScroll: false,
    },
  },
];

// Custom styles for testing
const customStyles: StyleConfig = {
  ...DEFAULT_STYLE_CONFIG,
  colors: {
    ...DEFAULT_STYLE_CONFIG.colors,
    background: "#1f2937",
    text: "#ffffff",
    label: "#9ca3af",
    positive: "#22c55e",
    negative: "#6b7280",
    secondary: "#9ca3af",
  },
  fonts: {
    ...DEFAULT_STYLE_CONFIG.fonts,
    valueFontSize: "3rem",
  },
  borderRadius: 12,
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
};

export default function TestCardPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-2">
        Module 3: Counter Card Component Test
      </h1>
      <p className="text-gray-400 mb-8">
        Testing CounterCard with various configurations
      </p>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {sampleCards.map((card) => (
          <CounterCard key={card.id} card={card} styles={customStyles} />
        ))}
      </div>

      {/* Features List */}
      <div className="mt-12 p-6 bg-gray-800 rounded-lg max-w-2xl">
        <h2 className="text-xl font-bold text-white mb-4">
          CounterCard Features:
        </h2>
        <ul className="text-gray-300 space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Top label/category display
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Large animated numeric value
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Title and multi-line description
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Optional background image with overlay
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Optional icon/logo support
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Positive values = green color
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Negative values = gray color
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Prefix and suffix display
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Responsive sizing
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Hover animations (scale + shadow)
          </li>
        </ul>
      </div>
    </div>
  );
}
