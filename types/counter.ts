// =============================================================================
// Counter Widget Types
// =============================================================================

export type EasingType = "linear" | "easeOut" | "easeInOut" | "smooth";

export type ValueColorType = "positive" | "negative" | "neutral";

// =============================================================================
// Animation Configuration
// =============================================================================

export interface AnimationConfig {
  startValue: number;
  endValue: number;
  duration: number; // in milliseconds
  easing: EasingType;
  decimalPlaces: number;
  prefix: string;
  suffix: string;
  triggerOnScroll: boolean;
  threshold: number; // Intersection threshold (0-1)
}

// =============================================================================
// Style Configuration
// =============================================================================

export interface ColorConfig {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  label: string;
  positive: string;
  negative: string;
  neutral: string;
}

export interface FontConfig {
  family: string;
  valueFontSize: string;
  labelFontSize: string;
  titleFontSize: string;
  descriptionFontSize: string;
  valueWeight: number;
  labelWeight: number;
  titleWeight: number;
}

export interface StyleConfig {
  colors: ColorConfig;
  fonts: FontConfig;
  borderRadius: number;
  boxShadow: string;
  padding: string;
  gap: string;
  cardMinHeight: string;
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
}

// =============================================================================
// Card Data
// =============================================================================

export interface CardData {
  id: string;
  label: string;
  title: string;
  description: string;
  animation: AnimationConfig;
  backgroundImage?: string;
  icon?: string;
  customStyles?: Partial<StyleConfig>;
}

// =============================================================================
// Widget Configuration
// =============================================================================

export interface LayoutConfig {
  columns: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  maxWidth: string;
  containerPadding: string;
}

export interface WidgetConfig {
  id: string;
  name: string;
  cards: CardData[];
  styles: StyleConfig;
  layout: LayoutConfig;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// Default Values
// =============================================================================

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  startValue: 0,
  endValue: 100,
  duration: 2000,
  easing: "easeOut",
  decimalPlaces: 0,
  prefix: "",
  suffix: "",
  triggerOnScroll: true,
  threshold: 0.3,
};

export const DEFAULT_COLOR_CONFIG: ColorConfig = {
  primary: "#3b82f6",
  secondary: "#6b7280",
  background: "#1f2937",
  text: "#ffffff",
  label: "#9ca3af",
  positive: "#22c55e",
  negative: "#6b7280",
  neutral: "#ffffff",
};

export const DEFAULT_FONT_CONFIG: FontConfig = {
  family: "system-ui, -apple-system, sans-serif",
  valueFontSize: "3rem",
  labelFontSize: "0.875rem",
  titleFontSize: "1.25rem",
  descriptionFontSize: "0.875rem",
  valueWeight: 700,
  labelWeight: 500,
  titleWeight: 600,
};

export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  colors: DEFAULT_COLOR_CONFIG,
  fonts: DEFAULT_FONT_CONFIG,
  borderRadius: 8,
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  padding: "1.5rem",
  gap: "1.5rem",
  cardMinHeight: "200px",
  overlay: {
    enabled: false,
    color: "#000000",
    opacity: 0.5,
  },
};

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  columns: {
    desktop: 3,
    tablet: 2,
    mobile: 1,
  },
  maxWidth: "1200px",
  containerPadding: "2rem",
};
