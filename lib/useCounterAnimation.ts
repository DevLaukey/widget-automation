"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type EasingType = "linear" | "easeOut" | "easeInOut" | "smooth";

export interface CounterAnimationOptions {
  startValue: number;
  endValue: number;
  duration?: number; // in milliseconds
  easing?: EasingType;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  triggerOnScroll?: boolean; // Use Intersection Observer
  threshold?: number; // Intersection threshold (0-1)
}

export interface CounterAnimationResult {
  displayValue: string;
  rawValue: number;
  isAnimating: boolean;
  isComplete: boolean;
  reset: () => void;
  start: () => void;
  ref: React.RefObject<HTMLElement | null>;
}

// Easing functions
const easingFunctions: Record<EasingType, (t: number) => number> = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  smooth: (t) => t * t * (3 - 2 * t), // Smoothstep
};

export function useCounterAnimation(
  options: CounterAnimationOptions
): CounterAnimationResult {
  const {
    startValue,
    endValue,
    duration = 2000,
    easing = "easeOut",
    decimalPlaces = 0,
    prefix = "",
    suffix = "",
    triggerOnScroll = true,
    threshold = 0.3,
  } = options;

  const [rawValue, setRawValue] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const elementRef = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Format the display value with prefix, suffix, and decimal places
  const formatValue = useCallback(
    (value: number): string => {
      const formattedNumber = value.toLocaleString("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      });
      return `${prefix}${formattedNumber}${suffix}`;
    },
    [prefix, suffix, decimalPlaces]
  );

  // Animation loop
  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFunctions[easing](progress);

      const currentValue =
        startValue + (endValue - startValue) * easedProgress;
      setRawValue(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setRawValue(endValue);
        setIsAnimating(false);
        setIsComplete(true);
      }
    },
    [startValue, endValue, duration, easing]
  );

  // Start animation
  const start = useCallback(() => {
    if (isAnimating) return;

    // Cancel any existing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setRawValue(startValue);
    setIsAnimating(true);
    setIsComplete(false);
    setHasTriggered(true);
    startTimeRef.current = null;

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isAnimating, startValue, animate]);

  // Reset animation
  const reset = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setRawValue(startValue);
    setIsAnimating(false);
    setIsComplete(false);
    setHasTriggered(false);
    startTimeRef.current = null;
  }, [startValue]);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    if (!triggerOnScroll || hasTriggered) return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            start();
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [triggerOnScroll, threshold, hasTriggered, start]);

  // Auto-start on mount if not using scroll trigger
  useEffect(() => {
    if (!triggerOnScroll && !hasTriggered) {
      start();
    }
  }, [triggerOnScroll, hasTriggered, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    displayValue: formatValue(rawValue),
    rawValue,
    isAnimating,
    isComplete,
    reset,
    start,
    ref: elementRef,
  };
}

// Utility function to determine if value is positive/negative for styling
export function getValueColor(value: number): "positive" | "negative" | "neutral" {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}
