"use client";

import { useRef, useEffect } from "react";
import {
  useCounterAnimation,
  getValueColor,
} from "@/lib/useCounterAnimation";
import type { CardData, StyleConfig } from "@/types";

// =============================================================================
// Props Interface
// =============================================================================

export interface CounterCardProps {
  card: CardData;
  styles: StyleConfig;
  className?: string;
}

// =============================================================================
// Counter Card Component
// =============================================================================

export function CounterCard({ card, styles, className = "" }: CounterCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize counter animation with card config
  const counter = useCounterAnimation({
    startValue: card.animation.startValue,
    endValue: card.animation.endValue,
    duration: card.animation.duration,
    easing: card.animation.easing,
    decimalPlaces: card.animation.decimalPlaces,
    prefix: card.animation.prefix,
    suffix: card.animation.suffix,
    triggerOnScroll: card.animation.triggerOnScroll,
    threshold: card.animation.threshold,
  });

  // Attach ref to container for intersection observer
  useEffect(() => {
    if (containerRef.current && counter.ref) {
      (counter.ref as React.MutableRefObject<HTMLElement | null>).current =
        containerRef.current;
    }
  }, [counter.ref]);

  // Determine value color based on current value
  const valueColorType = getValueColor(counter.rawValue);
  const valueColor =
    valueColorType === "positive"
      ? styles.colors.positive
      : valueColorType === "negative"
        ? styles.colors.negative
        : styles.colors.neutral;

  // Merge card-specific styles with global styles
  const mergedStyles = card.customStyles
    ? { ...styles, ...card.customStyles }
    : styles;

  // Parse font size values for responsive scaling
  const valueFontSize = mergedStyles.fonts.valueFontSize;
  const titleFontSize = mergedStyles.fonts.titleFontSize;

  return (
    <>
      <div
        ref={containerRef}
        className={`
          counter-card
          relative overflow-hidden
          flex flex-col items-center justify-center text-center
          ${className}
        `}
        style={{
          borderRadius: `${mergedStyles.borderRadius}px`,
          boxShadow: mergedStyles.boxShadow,
          padding: mergedStyles.padding,
          minHeight: mergedStyles.cardMinHeight,
        }}
      >
        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3 w-full">
          {/* Logo */}
          {card.icon && (
            <div className="counter-card__logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.icon}
                alt=""
                style={{ width: 48, height: 48, objectFit: "contain" }}
              />
            </div>
          )}

          {/* Animated Value (Money) */}
          <p
            className="counter-card__value tabular-nums transition-colors duration-300 break-words w-full"
            style={{
              color: valueColor,
              fontWeight: mergedStyles.fonts.valueWeight,
              fontFamily: mergedStyles.fonts.family,
              lineHeight: 1.1,
            }}
          >
            {counter.displayValue}
          </p>

          {/* Heading */}
          {card.title && (
            <h3
              className="counter-card__heading break-words w-full"
              style={{
                color: mergedStyles.colors.text,
                fontWeight: mergedStyles.fonts.titleWeight,
                fontFamily: mergedStyles.fonts.family,
              }}
            >
              {card.title}
            </h3>
          )}
        </div>
      </div>

      {/* Responsive card styles */}
      <style jsx>{`
        .counter-card {
          min-height: ${mergedStyles.cardMinHeight};
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .counter-card__value {
          font-size: ${valueFontSize};
        }
        .counter-card__heading {
          font-size: ${titleFontSize};
        }
        .counter-card__logo :global(img) {
          width: 48px;
          height: 48px;
        }
        @media (max-width: 640px) {
          .counter-card {
            padding: 1rem;
            min-height: 140px;
          }
          .counter-card__value {
            font-size: clamp(1.5rem, 6vw, ${valueFontSize});
          }
          .counter-card__heading {
            font-size: clamp(0.85rem, 3.5vw, ${titleFontSize});
          }
          .counter-card__logo :global(img) {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </>
  );
}

export default CounterCard;
