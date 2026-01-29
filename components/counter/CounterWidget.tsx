"use client";

import { CounterCard } from "./CounterCard";
import type { WidgetConfig } from "@/types";

// =============================================================================
// Props Interface
// =============================================================================

export interface CounterWidgetProps {
  config: WidgetConfig;
  className?: string;
}

// =============================================================================
// Counter Widget Component
// =============================================================================

export function CounterWidget({ config, className = "" }: CounterWidgetProps) {
  const { cards, styles, layout } = config;

  // Generate responsive grid columns CSS
  const gridTemplateColumns = {
    "--columns-desktop": layout.columns.desktop,
    "--columns-tablet": layout.columns.tablet,
    "--columns-mobile": layout.columns.mobile,
  } as React.CSSProperties;

  return (
    <section
      className={`counter-widget w-full ${className}`}
      style={{
        maxWidth: layout.maxWidth,
        margin: "0 auto",
        padding: layout.containerPadding,
      }}
      data-widget-id={config.id}
    >
      <div
        className="counter-widget__grid"
        style={{
          display: "grid",
          gap: styles.gap,
          ...gridTemplateColumns,
        }}
      >
        {cards.map((card) => (
          <CounterCard key={card.id} card={card} styles={styles} />
        ))}
      </div>

      {/* Responsive Grid Styles */}
      <style jsx>{`
        .counter-widget__grid {
          grid-template-columns: repeat(
            var(--columns-mobile, 1),
            minmax(0, 1fr)
          );
        }

        @media (min-width: 768px) {
          .counter-widget__grid {
            grid-template-columns: repeat(
              var(--columns-tablet, 2),
              minmax(0, 1fr)
            );
          }
        }

        @media (min-width: 1024px) {
          .counter-widget__grid {
            grid-template-columns: repeat(
              var(--columns-desktop, 3),
              minmax(0, 1fr)
            );
          }
        }
      `}</style>
    </section>
  );
}

export default CounterWidget;
