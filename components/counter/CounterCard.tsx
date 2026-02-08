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

  const valueFontSize = mergedStyles.fonts.valueFontSize;
  const titleFontSize = mergedStyles.fonts.titleFontSize;
  const labelFontSize = mergedStyles.fonts.labelFontSize;

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
          {/* 1. Header Label (e.g. "KUMITE") */}
          {card.label && (
            <h2
              className="counter-card__label w-full"
              style={{
                color: mergedStyles.colors.text,
                fontWeight: mergedStyles.fonts.labelWeight,
                fontFamily: mergedStyles.fonts.family,
                textTransform: "uppercase",
                WebkitTextStroke: `1px ${mergedStyles.colors.secondary}`,
                paintOrder: "stroke fill",
                margin: 0,
              }}
            >
              {card.label}
            </h2>
          )}

          {/* Logo - sized to match blue text block */}
          {card.icon && (
            <div className="counter-card__logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.icon}
                alt=""
                className="counter-card__logo-img"
                style={{ objectFit: "contain" }}
              />
            </div>
          )}

          {/* 2. Animated Value / Prize Amount - bold italic green */}
          <p
            className="counter-card__value tabular-nums transition-colors duration-300 break-words w-full"
            style={{
              color: valueColor,
              fontWeight: mergedStyles.fonts.valueWeight,
              fontStyle: "italic",
              fontFamily: mergedStyles.fonts.family,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {counter.displayValue}
          </p>

          {/* 3. Title as blue event details text */}
          {card.title && (
            <h3
              className="counter-card__title break-words w-full"
              style={{
                color: mergedStyles.colors.primary,
                fontWeight: 700,
                fontFamily: mergedStyles.fonts.family,
                textTransform: "uppercase",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {card.title}
            </h3>
          )}

          {/* Description (additional info) */}
          {card.description && (
            <div
              className="counter-card__description w-full"
              style={{
                color: mergedStyles.colors.primary,
                fontWeight: 600,
                fontFamily: mergedStyles.fonts.family,
                textTransform: "uppercase",
                textAlign: "left",
                whiteSpace: "pre-line",
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {card.description}
            </div>
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
        .counter-card__label {
          font-size: ${labelFontSize};
        }
        .counter-card__value {
          font-size: ${valueFontSize};
        }
        .counter-card__title {
          font-size: ${titleFontSize};
        }
        .counter-card__description {
          font-size: ${mergedStyles.fonts.descriptionFontSize};
        }
        .counter-card__logo-img {
          width: auto;
          height: ${titleFontSize};
          max-height: 200px;
          min-height: 80px;
        }
        @media (max-width: 640px) {
          .counter-card {
            padding: 1rem;
            min-height: 140px;
          }
          .counter-card__label {
            font-size: clamp(0.75rem, 4vw, ${labelFontSize});
          }
          .counter-card__value {
            font-size: clamp(2rem, 12vw, ${valueFontSize});
          }
          .counter-card__title {
            font-size: clamp(1.2rem, 7vw, ${titleFontSize});
          }
          .counter-card__description {
            font-size: clamp(0.75rem, 3vw, ${mergedStyles.fonts.descriptionFontSize});
          }
          .counter-card__logo-img {
            height: clamp(60px, 15vw, 120px);
          }
        }
      `}</style>
    </>
  );
}

export default CounterCard;
