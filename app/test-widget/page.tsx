"use client";

import { CounterWidget } from "@/components/counter";
import {
  DEFAULT_STYLE_CONFIG,
  DEFAULT_LAYOUT_CONFIG,
  DEFAULT_ANIMATION_CONFIG,
  type WidgetConfig,
} from "@/types";

// =============================================================================
// Sample Widget Configurations
// =============================================================================

const widget1: WidgetConfig = {
  id: "widget-1",
  name: "Revenue Dashboard",
  cards: [
    {
      id: "1-1",
      label: "Total Revenue",
      title: "Annual",
      description: "Combined revenue from all sources",
      animation: {
        ...DEFAULT_ANIMATION_CONFIG,
        endValue: 2450000,
        duration: 2500,
        prefix: "$",
        triggerOnScroll: true,
      },
    },
    {
      id: "1-2",
      label: "Expenses",
      title: "Operating Costs",
      description: "Total operational expenditure",
      animation: {
        ...DEFAULT_ANIMATION_CONFIG,
        endValue: -890000,
        duration: 2200,
        prefix: "$",
        triggerOnScroll: true,
      },
    },
    {
      id: "1-3",
      label: "Net Profit",
      title: "Year to Date",
      description: "After taxes and deductions",
      animation: {
        ...DEFAULT_ANIMATION_CONFIG,
        endValue: 1560000,
        duration: 2800,
        prefix: "$",
        triggerOnScroll: true,
      },
    },
  ],
  styles: {
    ...DEFAULT_STYLE_CONFIG,
    colors: {
      ...DEFAULT_STYLE_CONFIG.colors,
      background: "#1e293b",
    },
    borderRadius: 16,
  },
  layout: DEFAULT_LAYOUT_CONFIG,
  apiUrl: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const widget2: WidgetConfig = {
  id: "widget-2",
  name: "User Metrics",
  cards: [
    {
      id: "2-1",
      label: "Active Users",
      title: "Monthly",
      description: "Users active in the last 30 days",
      animation: {
        ...DEFAULT_ANIMATION_CONFIG,
        endValue: 48293,
        duration: 2000,
        triggerOnScroll: true,
      },
    },
    {
      id: "2-2",
      label: "New Signups",
      title: "This Week",
      description: "New user registrations",
      animation: {
        ...DEFAULT_ANIMATION_CONFIG,
        endValue: 1847,
        duration: 1800,
        triggerOnScroll: true,
      },
    },
    {
      id: "2-3",
      label: "Retention Rate",
      title: "90 Day",
      description: "Users who return after signup",
      animation: {
        ...DEFAULT_ANIMATION_CONFIG,
        endValue: 78.5,
        duration: 2200,
        suffix: "%",
        decimalPlaces: 1,
        triggerOnScroll: true,
      },
    },
    {
      id: "2-4",
      label: "Churn Rate",
      title: "Monthly",
      description: "Users who left this month",
      animation: {
        ...DEFAULT_ANIMATION_CONFIG,
        endValue: -3.2,
        duration: 1500,
        suffix: "%",
        decimalPlaces: 1,
        triggerOnScroll: true,
      },
    },
  ],
  styles: {
    ...DEFAULT_STYLE_CONFIG,
    colors: {
      ...DEFAULT_STYLE_CONFIG.colors,
      background: "#0f172a",
      positive: "#10b981",
      negative: "#64748b",
    },
    borderRadius: 8,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
  },
  layout: {
    ...DEFAULT_LAYOUT_CONFIG,
    columns: {
      desktop: 4,
      tablet: 2,
      mobile: 1,
    },
  },
  apiUrl: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const widget3: WidgetConfig = {
  id: "widget-3",
  name: "Performance Stats",
  cards: [
    {
      id: "3-1",
      label: "Page Views",
      title: "Daily Average",
      description: "",
      animation: {
        ...DEFAULT_ANIMATION_CONFIG,
        endValue: 156789,
        duration: 2500,
        triggerOnScroll: true,
      },
    },
    {
      id: "3-2",
      label: "Bounce Rate",
      title: "All Pages",
      description: "",
      animation: {
        ...DEFAULT_ANIMATION_CONFIG,
        endValue: -42.3,
        duration: 2000,
        suffix: "%",
        decimalPlaces: 1,
        triggerOnScroll: true,
      },
    },
  ],
  styles: {
    ...DEFAULT_STYLE_CONFIG,
    colors: {
      ...DEFAULT_STYLE_CONFIG.colors,
      background: "#18181b",
    },
    fonts: {
      ...DEFAULT_STYLE_CONFIG.fonts,
      valueFontSize: "2.5rem",
    },
    borderRadius: 24,
  },
  layout: {
    ...DEFAULT_LAYOUT_CONFIG,
    columns: {
      desktop: 2,
      tablet: 2,
      mobile: 1,
    },
    maxWidth: "800px",
  },
  apiUrl: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// =============================================================================
// Test Page Component
// =============================================================================

export default function TestWidgetPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-2">
          Module 4: Counter Widget Layout Test
        </h1>
        <p className="text-gray-400 mb-12">
          Testing responsive grid layouts with multiple widgets per page
        </p>

        {/* Widget 1: Standard 3-column */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-4">
            Widget 1: Revenue Dashboard (3 columns desktop)
          </h2>
          <CounterWidget config={widget1} />
        </section>

        {/* Widget 2: 4-column layout */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-4">
            Widget 2: User Metrics (4 columns desktop)
          </h2>
          <CounterWidget config={widget2} />
        </section>

        {/* Widget 3: 2-column layout */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-4">
            Widget 3: Performance Stats (2 columns, 800px max-width)
          </h2>
          <CounterWidget config={widget3} />
        </section>

        {/* Features List */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-4">
            CounterWidget Features:
          </h2>
          <ul className="text-gray-300 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Configurable columns per breakpoint
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> 3 cards/row desktop (default)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> 2 cards/row tablet
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> 1 card/row mobile
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> CSS Grid layout
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Configurable gap spacing
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Container max-width
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Container padding
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Multiple widgets per page
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> data-widget-id attribute for embed support
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
