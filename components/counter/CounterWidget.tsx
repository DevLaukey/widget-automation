"use client";

import { useState, useEffect } from "react";
import { CounterCard } from "./CounterCard";
import type { WidgetConfig, CardData } from "@/types";

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

  // Auto-fetch live values from the API URL (mirrors what the embed code does)
  const [apiValues, setApiValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!config.apiUrl) {
      setApiValues({});
      return;
    }
    const controller = new AbortController();
    fetch(`/api/proxy?url=${encodeURIComponent(config.apiUrl)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        const apiCards: Array<{ endValue?: number }> = data?.cards || [];
        if (!apiCards.length) return;
        const values: Record<string, number> = {};
        config.cards.forEach((card, i) => {
          if (apiCards[i]?.endValue != null) {
            values[card.id] = apiCards[i].endValue as number;
          }
        });
        setApiValues(values);
      })
      .catch(() => {}); // Fall back to config values silently
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiUrl]);

  // Overlay API-fetched endValues onto cards when available
  const resolvedCards: CardData[] = cards.map((card) =>
    apiValues[card.id] != null
      ? { ...card, animation: { ...card.animation, endValue: apiValues[card.id] } }
      : card
  );

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
        {resolvedCards.map((card) => (
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
