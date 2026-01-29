"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
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

  return (
    <div
      ref={containerRef}
      className={`
        counter-card
        relative overflow-hidden
        flex flex-col items-center justify-center text-center
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-xl
        ${className}
      `}
      style={{
        backgroundColor: mergedStyles.colors.background,
        borderRadius: `${mergedStyles.borderRadius}px`,
        boxShadow: mergedStyles.boxShadow,
        padding: mergedStyles.padding,
        minHeight: mergedStyles.cardMinHeight,
      }}
    >
      {/* Background Image with Overlay */}
      {card.backgroundImage && (
        <>
          <Image
            src={card.backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {mergedStyles.overlay.enabled && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: mergedStyles.overlay.color,
                opacity: mergedStyles.overlay.opacity,
              }}
            />
          )}
        </>
      )}

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        {/* Icon */}
        {card.icon && (
          <div className="mb-2">
            <Image
              src={card.icon}
              alt=""
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
        )}

        {/* Top Label */}
        <p
          className="uppercase tracking-wider"
          style={{
            color: mergedStyles.colors.label,
            fontSize: mergedStyles.fonts.labelFontSize,
            fontWeight: mergedStyles.fonts.labelWeight,
            fontFamily: mergedStyles.fonts.family,
          }}
        >
          {card.label}
        </p>

        {/* Animated Value */}
        <p
          className="tabular-nums transition-colors duration-300"
          style={{
            color: valueColor,
            fontSize: mergedStyles.fonts.valueFontSize,
            fontWeight: mergedStyles.fonts.valueWeight,
            fontFamily: mergedStyles.fonts.family,
            lineHeight: 1.1,
          }}
        >
          {counter.displayValue}
        </p>

        {/* Title */}
        {card.title && (
          <h3
            className="mt-2"
            style={{
              color: mergedStyles.colors.text,
              fontSize: mergedStyles.fonts.titleFontSize,
              fontWeight: mergedStyles.fonts.titleWeight,
              fontFamily: mergedStyles.fonts.family,
            }}
          >
            {card.title}
          </h3>
        )}

        {/* Description */}
        {card.description && (
          <p
            className="mt-1 max-w-xs"
            style={{
              color: mergedStyles.colors.secondary,
              fontSize: mergedStyles.fonts.descriptionFontSize,
              fontFamily: mergedStyles.fonts.family,
              lineHeight: 1.5,
            }}
          >
            {card.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default CounterCard;
