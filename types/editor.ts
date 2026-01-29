// =============================================================================
// Editor Types
// =============================================================================

import type {
  CardData,
  WidgetConfig,
  StyleConfig,
  AnimationConfig,
  LayoutConfig,
} from "./counter";

// =============================================================================
// Editor State
// =============================================================================

export type EditorTab = "cards" | "styles" | "layout" | "preview";

export type PreviewMode = "desktop" | "tablet" | "mobile";

export interface EditorState {
  widget: WidgetConfig;
  selectedCardId: string | null;
  activeTab: EditorTab;
  previewMode: PreviewMode;
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
  undoStack: WidgetConfig[];
  redoStack: WidgetConfig[];
}

// =============================================================================
// Action Types
// =============================================================================

export type EditorAction =
  // Card Actions
  | { type: "ADD_CARD"; payload: CardData }
  | { type: "UPDATE_CARD"; payload: { id: string; updates: Partial<CardData> } }
  | { type: "DELETE_CARD"; payload: { id: string } }
  | { type: "DUPLICATE_CARD"; payload: { id: string } }
  | { type: "REORDER_CARDS"; payload: { fromIndex: number; toIndex: number } }
  | { type: "SELECT_CARD"; payload: { id: string | null } }

  // Animation Actions
  | {
      type: "UPDATE_CARD_ANIMATION";
      payload: { cardId: string; animation: Partial<AnimationConfig> };
    }

  // Style Actions
  | { type: "UPDATE_STYLES"; payload: Partial<StyleConfig> }
  | { type: "UPDATE_CARD_STYLES"; payload: { cardId: string; styles: Partial<StyleConfig> } }
  | { type: "RESET_STYLES" }

  // Layout Actions
  | { type: "UPDATE_LAYOUT"; payload: Partial<LayoutConfig> }

  // Widget Actions
  | { type: "SET_WIDGET"; payload: WidgetConfig }
  | { type: "UPDATE_WIDGET_NAME"; payload: { name: string } }
  | { type: "RESET_WIDGET" }

  // Editor UI Actions
  | { type: "SET_ACTIVE_TAB"; payload: EditorTab }
  | { type: "SET_PREVIEW_MODE"; payload: PreviewMode }
  | { type: "SET_ERROR"; payload: string | null }

  // Save Actions
  | { type: "SAVE_START" }
  | { type: "SAVE_SUCCESS" }
  | { type: "SAVE_ERROR"; payload: string }
  | { type: "MARK_CLEAN" }

  // Undo/Redo Actions
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "CLEAR_HISTORY" };

// =============================================================================
// Editor Context Type
// =============================================================================

export interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;

  // Card helpers
  addCard: (card?: Partial<CardData>) => void;
  updateCard: (id: string, updates: Partial<CardData>) => void;
  deleteCard: (id: string) => void;
  duplicateCard: (id: string) => void;
  reorderCards: (fromIndex: number, toIndex: number) => void;
  selectCard: (id: string | null) => void;

  // Style helpers
  updateStyles: (styles: Partial<StyleConfig>) => void;
  resetStyles: () => void;

  // Layout helpers
  updateLayout: (layout: Partial<LayoutConfig>) => void;

  // Widget helpers
  saveWidget: () => Promise<void>;
  loadWidget: (id: string) => Promise<void>;
  resetWidget: () => void;

  // Undo/Redo helpers
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

// =============================================================================
// Default Editor State
// =============================================================================

export const DEFAULT_EDITOR_STATE: Omit<EditorState, "widget"> = {
  selectedCardId: null,
  activeTab: "cards",
  previewMode: "desktop",
  isDirty: false,
  isSaving: false,
  error: null,
  undoStack: [],
  redoStack: [],
};
