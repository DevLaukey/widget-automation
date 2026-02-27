"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  CardData,
  WidgetConfig,
  StyleConfig,
  LayoutConfig,
} from "@/types/counter";
import type { EditorState, EditorAction } from "@/types/editor";

// =============================================================================
// Default Widget with sample cards
// =============================================================================

function createDefaultWidget(): WidgetConfig {
  const now = new Date().toISOString();
  return {
    id: "widget-1",
    name: "My Counter Widget",
    cards: [
      {
        id: "card-1",
        label: "",
        title: "Total Revenue",
        description: "",
        animation: {
          startValue: 0,
          endValue: 54000,
          duration: 2000,
          easing: "easeOut",
          decimalPlaces: 0,
          prefix: "$",
          suffix: "",
          triggerOnScroll: false,
          threshold: 0.3,
        },
      },
      {
        id: "card-2",
        label: "",
        title: "Active Users",
        description: "",
        animation: {
          startValue: 0,
          endValue: 12500,
          duration: 2000,
          easing: "easeOut",
          decimalPlaces: 0,
          prefix: "",
          suffix: "+",
          triggerOnScroll: false,
          threshold: 0.3,
        },
      },
      {
        id: "card-3",
        label: "",
        title: "Growth Rate",
        description: "",
        animation: {
          startValue: 0,
          endValue: 127,
          duration: 2000,
          easing: "easeOut",
          decimalPlaces: 1,
          prefix: "",
          suffix: "%",
          triggerOnScroll: false,
          threshold: 0.3,
        },
      },
    ],
    styles: {
      colors: {
        primary: "#0080FF",
        secondary: "#000000",
        background: "transparent",
        text: "#ffffff",
        label: "#ffffff",
        positive: "#00FF00",
        negative: "#6b7280",
        neutral: "#ffffff",
      },
      fonts: {
        family: "'Orbitron', sans-serif",
        valueFontSize: "110px",
        labelFontSize: "1.5rem",
        titleFontSize: "28px",
        descriptionFontSize: "0.875rem",
        valueWeight: 700,
        labelWeight: 700,
        titleWeight: 600,
      },
      borderRadius: 0,
      boxShadow: "none",
      padding: "2.5rem",
      gap: "1.5rem",
      cardMinHeight: "200px",
      overlay: {
        enabled: false,
        color: "#000000",
        opacity: 0.5,
      },
    },
    layout: {
      columns: { desktop: 3, tablet: 2, mobile: 1 },
      maxWidth: "100%",
      containerPadding: "2rem",
    },
    apiUrl: "https://ugia-mmeab.ondigitalocean.app/api/groups/b13bd078",
    createdAt: now,
    updatedAt: now,
  };
}

// =============================================================================
// Reducer
// =============================================================================

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  const pushUndo = (s: EditorState): EditorState => ({
    ...s,
    undoStack: [...s.undoStack.slice(-19), s.widget],
    redoStack: [],
    isDirty: true,
  });

  switch (action.type) {
    // -- Card Actions --
    case "ADD_CARD": {
      const s = pushUndo(state);
      return {
        ...s,
        widget: {
          ...s.widget,
          cards: [...s.widget.cards, action.payload],
          updatedAt: new Date().toISOString(),
        },
        selectedCardId: action.payload.id,
      };
    }
    case "UPDATE_CARD": {
      const s = pushUndo(state);
      return {
        ...s,
        widget: {
          ...s.widget,
          cards: s.widget.cards.map((c) =>
            c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    }
    case "DELETE_CARD": {
      const s = pushUndo(state);
      return {
        ...s,
        widget: {
          ...s.widget,
          cards: s.widget.cards.filter((c) => c.id !== action.payload.id),
          updatedAt: new Date().toISOString(),
        },
        selectedCardId:
          s.selectedCardId === action.payload.id ? null : s.selectedCardId,
      };
    }
    case "DUPLICATE_CARD": {
      const s = pushUndo(state);
      const card = s.widget.cards.find((c) => c.id === action.payload.id);
      if (!card) return state;
      const newCard: CardData = {
        ...card,
        id: `card-${Date.now()}`,
        title: `${card.title} (Copy)`,
      };
      const idx = s.widget.cards.findIndex((c) => c.id === action.payload.id);
      const newCards = [...s.widget.cards];
      newCards.splice(idx + 1, 0, newCard);
      return {
        ...s,
        widget: { ...s.widget, cards: newCards, updatedAt: new Date().toISOString() },
        selectedCardId: newCard.id,
      };
    }
    case "REORDER_CARDS": {
      const s = pushUndo(state);
      const cards = [...s.widget.cards];
      const [moved] = cards.splice(action.payload.fromIndex, 1);
      cards.splice(action.payload.toIndex, 0, moved);
      return {
        ...s,
        widget: { ...s.widget, cards, updatedAt: new Date().toISOString() },
      };
    }
    case "SELECT_CARD":
      return { ...state, selectedCardId: action.payload.id };

    // -- Animation --
    case "UPDATE_CARD_ANIMATION": {
      const s = pushUndo(state);
      return {
        ...s,
        widget: {
          ...s.widget,
          cards: s.widget.cards.map((c) =>
            c.id === action.payload.cardId
              ? { ...c, animation: { ...c.animation, ...action.payload.animation } }
              : c
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    // -- Styles --
    case "UPDATE_STYLES": {
      const s = pushUndo(state);
      const mergedStyles = { ...s.widget.styles };
      for (const [key, val] of Object.entries(action.payload)) {
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          (mergedStyles as Record<string, unknown>)[key] = {
            ...(mergedStyles as Record<string, unknown>)[key] as object,
            ...val,
          };
        } else {
          (mergedStyles as Record<string, unknown>)[key] = val;
        }
      }
      return {
        ...s,
        widget: {
          ...s.widget,
          styles: mergedStyles as StyleConfig,
          updatedAt: new Date().toISOString(),
        },
      };
    }
    case "RESET_STYLES": {
      const s = pushUndo(state);
      return {
        ...s,
        widget: {
          ...s.widget,
          styles: createDefaultWidget().styles,
          updatedAt: new Date().toISOString(),
        },
      };
    }

    // -- Layout --
    case "UPDATE_LAYOUT": {
      const s = pushUndo(state);
      const mergedLayout = { ...s.widget.layout };
      for (const [key, val] of Object.entries(action.payload)) {
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          (mergedLayout as Record<string, unknown>)[key] = {
            ...(mergedLayout as Record<string, unknown>)[key] as object,
            ...val,
          };
        } else {
          (mergedLayout as Record<string, unknown>)[key] = val;
        }
      }
      return {
        ...s,
        widget: {
          ...s.widget,
          layout: mergedLayout as LayoutConfig,
          updatedAt: new Date().toISOString(),
        },
      };
    }

    // -- Widget --
    case "SET_WIDGET":
      return { ...state, widget: action.payload, isDirty: false };
    case "UPDATE_WIDGET_NAME": {
      const s = pushUndo(state);
      return {
        ...s,
        widget: { ...s.widget, name: action.payload.name, updatedAt: new Date().toISOString() },
      };
    }
    case "UPDATE_API_URL": {
      const s = pushUndo(state);
      return {
        ...s,
        widget: { ...s.widget, apiUrl: action.payload.apiUrl, updatedAt: new Date().toISOString() },
      };
    }
    case "RESET_WIDGET":
      return {
        ...state,
        widget: createDefaultWidget(),
        selectedCardId: null,
        isDirty: false,
        undoStack: [],
        redoStack: [],
      };

    // -- UI --
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload };
    case "SET_PREVIEW_MODE":
      return { ...state, previewMode: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };

    // -- Save --
    case "SAVE_START":
      return { ...state, isSaving: true };
    case "SAVE_SUCCESS":
      return { ...state, isSaving: false, isDirty: false };
    case "SAVE_ERROR":
      return { ...state, isSaving: false, error: action.payload };
    case "MARK_CLEAN":
      return { ...state, isDirty: false };

    // -- Undo / Redo --
    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        widget: prev,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, state.widget],
        isDirty: true,
      };
    }
    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      return {
        ...state,
        widget: next,
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, state.widget],
        isDirty: true,
      };
    }
    case "CLEAR_HISTORY":
      return { ...state, undoStack: [], redoStack: [] };

    default:
      return state;
  }
}

// =============================================================================
// Context
// =============================================================================

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, {
    widget: createDefaultWidget(),
    selectedCardId: null,
    activeTab: "cards",
    previewMode: "desktop",
    isDirty: false,
    isSaving: false,
    error: null,
    undoStack: [],
    redoStack: [],
  });

  // Load saved widget data from local file on mount, then auto-fetch API values
  useEffect(() => {
    fetch("/api/widget")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          dispatch({ type: "SET_WIDGET", payload: data });
          return data;
        }
        return null;
      })
      .then((widget) => {
        const apiUrl = widget?.apiUrl || state.widget.apiUrl;
        if (!apiUrl) return;
        return fetch(`/api/proxy?url=${encodeURIComponent(apiUrl)}`)
          .then((res) => res.json())
          .then((data) => {
            const apiCards = data?.cards || [];
            const cards = widget?.cards || state.widget.cards;
            const max = Math.min(cards.length, apiCards.length);
            for (let i = 0; i < max; i++) {
              if (apiCards[i].endValue != null) {
                dispatch({
                  type: "UPDATE_CARD_ANIMATION",
                  payload: {
                    cardId: cards[i].id,
                    animation: { endValue: apiCards[i].endValue },
                  },
                });
              }
            }
          });
      })
      .catch(() => {
        // No saved data or API fetch failed, use defaults
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save when widget changes (debounced)
  useEffect(() => {
    if (!state.isDirty) return;
    const timeout = setTimeout(() => {
      fetch("/api/widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.widget),
      }).catch(() => {
        // Silent fail on auto-save
      });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [state.widget, state.isDirty]);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  const { state, dispatch } = ctx;

  const addCard = useCallback(
    (partial?: Partial<CardData>) => {
      const card: CardData = {
        id: `card-${Date.now()}`,
        label: "",
        title: "New Card",
        description: "",
        animation: {
          startValue: 0,
          endValue: 100,
          duration: 2000,
          easing: "easeOut",
          decimalPlaces: 0,
          prefix: "",
          suffix: "",
          triggerOnScroll: false,
          threshold: 0.3,
        },
        ...partial,
      };
      dispatch({ type: "ADD_CARD", payload: card });
    },
    [dispatch]
  );

  const updateCard = useCallback(
    (id: string, updates: Partial<CardData>) =>
      dispatch({ type: "UPDATE_CARD", payload: { id, updates } }),
    [dispatch]
  );

  const deleteCard = useCallback(
    (id: string) => dispatch({ type: "DELETE_CARD", payload: { id } }),
    [dispatch]
  );

  const duplicateCard = useCallback(
    (id: string) => dispatch({ type: "DUPLICATE_CARD", payload: { id } }),
    [dispatch]
  );

  const selectCard = useCallback(
    (id: string | null) => dispatch({ type: "SELECT_CARD", payload: { id } }),
    [dispatch]
  );

  const updateStyles = useCallback(
    (styles: Partial<StyleConfig>) =>
      dispatch({ type: "UPDATE_STYLES", payload: styles }),
    [dispatch]
  );

  const resetStyles = useCallback(
    () => dispatch({ type: "RESET_STYLES" }),
    [dispatch]
  );

  const updateLayout = useCallback(
    (layout: Partial<LayoutConfig>) =>
      dispatch({ type: "UPDATE_LAYOUT", payload: layout }),
    [dispatch]
  );

  const undo = useCallback(() => dispatch({ type: "UNDO" }), [dispatch]);
  const redo = useCallback(() => dispatch({ type: "REDO" }), [dispatch]);

  const save = useCallback(async () => {
    dispatch({ type: "SAVE_START" });
    try {
      await fetch("/api/widget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.widget),
      });
      dispatch({ type: "SAVE_SUCCESS" });
    } catch {
      dispatch({ type: "SAVE_ERROR", payload: "Failed to save" });
    }
  }, [dispatch, state.widget]);

  return {
    state,
    dispatch,
    addCard,
    updateCard,
    deleteCard,
    duplicateCard,
    selectCard,
    updateStyles,
    resetStyles,
    updateLayout,
    undo,
    redo,
    save,
    canUndo: state.undoStack.length > 0,
    canRedo: state.redoStack.length > 0,
    isDirty: state.isDirty,
    isSaving: state.isSaving,
  };
}
