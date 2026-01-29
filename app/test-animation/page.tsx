"use client";

import { useCounterAnimation, getValueColor } from "@/lib/useCounterAnimation";

export default function TestAnimationPage() {
  // Test different configurations
  const counter1 = useCounterAnimation({
    startValue: 0,
    endValue: 1250000,
    duration: 2500,
    easing: "easeOut",
    prefix: "$",
    decimalPlaces: 0,
    triggerOnScroll: false,
  });

  const counter2 = useCounterAnimation({
    startValue: 0,
    endValue: -45000,
    duration: 2000,
    easing: "smooth",
    prefix: "$",
    decimalPlaces: 0,
    triggerOnScroll: false,
  });

  const counter3 = useCounterAnimation({
    startValue: 0,
    endValue: 99.99,
    duration: 1500,
    easing: "easeInOut",
    suffix: "%",
    decimalPlaces: 2,
    triggerOnScroll: false,
  });

  const colorClasses = {
    positive: "text-green-500",
    negative: "text-gray-600",
    neutral: "text-white",
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Module 1: Counter Animation Hook Test
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Counter 1 - Positive Money */}
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400 text-sm mb-2">TOTAL REVENUE</p>
          <p
            className={`text-5xl font-bold ${
              colorClasses[getValueColor(counter1.rawValue)]
            }`}
          >
            {counter1.displayValue}
          </p>
          <p className="text-gray-500 mt-2">
            {counter1.isAnimating ? "Animating..." : "Complete"}
          </p>
          <button
            onClick={counter1.reset}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reset
          </button>
        </div>

        {/* Counter 2 - Negative Money */}
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400 text-sm mb-2">EXPENSES</p>
          <p
            className={`text-5xl font-bold ${
              colorClasses[getValueColor(counter2.rawValue)]
            }`}
          >
            {counter2.displayValue}
          </p>
          <p className="text-gray-500 mt-2">
            {counter2.isAnimating ? "Animating..." : "Complete"}
          </p>
          <button
            onClick={counter2.reset}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reset
          </button>
        </div>

        {/* Counter 3 - Percentage */}
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400 text-sm mb-2">SUCCESS RATE</p>
          <p
            className={`text-5xl font-bold ${
              colorClasses[getValueColor(counter3.rawValue)]
            }`}
          >
            {counter3.displayValue}
          </p>
          <p className="text-gray-500 mt-2">
            {counter3.isAnimating ? "Animating..." : "Complete"}
          </p>
          <button
            onClick={counter3.reset}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">Hook Features:</h2>
        <ul className="text-gray-300 space-y-2">
          <li>✓ Configurable start/end values</li>
          <li>✓ Multiple easing functions (linear, easeOut, easeInOut, smooth)</li>
          <li>✓ Prefix and suffix support</li>
          <li>✓ Decimal precision control</li>
          <li>✓ Animation duration control</li>
          <li>✓ Reset functionality</li>
          <li>✓ Positive (green) / Negative (gray) color detection</li>
          <li>✓ Number formatting with commas</li>
        </ul>
      </div>
    </div>
  );
}
