"use client";

import { useState, useRef } from "react";
import { useEditor } from "@/context/EditorContext";
import type { EasingType } from "@/types/counter";

export function CardsTab() {
  const { state, addCard, updateCard, deleteCard, duplicateCard, selectCard, dispatch } =
    useEditor();
  const { cards, apiUrl } = state.widget;
  const selectedId = state.selectedCardId;
  const selectedCard = cards.find((c) => c.id === selectedId);
  const [fetching, setFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<string>("");

  const handleFetchApi = async () => {
    if (!apiUrl) return;
    setFetching(true);
    setFetchStatus("");
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(apiUrl)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();
      const apiCards = data?.cards || [];
      if (!apiCards.length) {
        setFetchStatus("No cards returned from API");
        return;
      }
      const maxCards = Math.min(cards.length, apiCards.length);
      for (let i = 0; i < maxCards; i++) {
        const apiCard = apiCards[i];
        dispatch({
          type: "UPDATE_CARD_ANIMATION",
          payload: {
            cardId: cards[i].id,
            animation: {
              endValue: apiCard.endValue ?? cards[i].animation.endValue,
            },
          },
        });
      }
      setFetchStatus(`Updated ${maxCards} card(s) from API`);
    } catch {
      setFetchStatus("Failed to fetch from API");
    } finally {
      setFetching(false);
      setTimeout(() => setFetchStatus(""), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Data Source */}
      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col gap-2">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Data Source (API)
        </h4>
        <p className="text-xs text-gray-500">
          Card values are fetched from this API. The response should return
          {" {cards: [{endValue, ...}]}"}
        </p>
        <input
          type="text"
          value={apiUrl}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_API_URL",
              payload: { apiUrl: e.target.value },
            })
          }
          placeholder="https://your-api.com/endpoint"
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleFetchApi}
          disabled={fetching || !apiUrl}
          className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {fetching ? "Fetching..." : "Fetch Values from API"}
        </button>
        {fetchStatus && (
          <p className={`text-xs ${fetchStatus.includes("Failed") || fetchStatus.includes("No cards") ? "text-red-400" : "text-green-400"}`}>
            {fetchStatus}
          </p>
        )}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => addCard()}
        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        + Add Card
      </button>

      {/* Card List */}
      <div className="flex flex-col gap-2">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              selectedId === card.id
                ? "border-blue-500 bg-gray-700"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            }`}
            onClick={() => selectCard(selectedId === card.id ? null : card.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-gray-500 font-mono w-5 shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {card.title || "Untitled"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {card.animation.prefix}
                    {card.animation.endValue.toLocaleString()}
                    {card.animation.suffix}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {/* Move Up */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (index > 0)
                      dispatch({
                        type: "REORDER_CARDS",
                        payload: { fromIndex: index, toIndex: index - 1 },
                      });
                  }}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-white disabled:opacity-30 text-xs"
                  title="Move up"
                >
                  ↑
                </button>
                {/* Move Down */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (index < cards.length - 1)
                      dispatch({
                        type: "REORDER_CARDS",
                        payload: { fromIndex: index, toIndex: index + 1 },
                      });
                  }}
                  disabled={index === cards.length - 1}
                  className="p-1 text-gray-400 hover:text-white disabled:opacity-30 text-xs"
                  title="Move down"
                >
                  ↓
                </button>
                {/* Duplicate */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateCard(card.id);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-400 text-xs"
                  title="Duplicate"
                >
                  ⧉
                </button>
                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCard(card.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-400 text-xs"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card Editor Form */}
      {selectedCard && (
        <div className="mt-2 p-4 bg-gray-800 rounded-lg border border-gray-700 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white border-b border-gray-700 pb-2">
            Edit Card
          </h3>

          {/* Header Label */}
          <Field
            label="Header Label"
            value={selectedCard.label}
            onChange={(v) => updateCard(selectedCard.id, { label: v })}
            placeholder="e.g. KUMITE"
          />

          {/* Logo Upload */}
          <ImageUpload
            label="Logo"
            value={selectedCard.icon || ""}
            onChange={(v) =>
              updateCard(selectedCard.id, { icon: v || undefined })
            }
          />

          {/* Heading */}
          <Field
            label="Heading"
            value={selectedCard.title}
            onChange={(v) => updateCard(selectedCard.id, { title: v })}
            placeholder="e.g. Total Revenue"
          />

          {/* Description / Event Details */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={selectedCard.description}
              onChange={(e) =>
                updateCard(selectedCard.id, { description: e.target.value })
              }
              placeholder={"e.g. Winter Classic\nGP KUMITE\nPRIZE NOGI"}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* Value / Money Settings */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Value
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="End Value"
                value={selectedCard.animation.endValue}
                onChange={(v) =>
                  dispatch({
                    type: "UPDATE_CARD_ANIMATION",
                    payload: {
                      cardId: selectedCard.id,
                      animation: { endValue: v },
                    },
                  })
                }
              />
              <NumberField
                label="Decimals"
                value={selectedCard.animation.decimalPlaces}
                onChange={(v) =>
                  dispatch({
                    type: "UPDATE_CARD_ANIMATION",
                    payload: {
                      cardId: selectedCard.id,
                      animation: { decimalPlaces: v },
                    },
                  })
                }
                min={0}
                max={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Prefix"
                value={selectedCard.animation.prefix}
                onChange={(v) =>
                  dispatch({
                    type: "UPDATE_CARD_ANIMATION",
                    payload: {
                      cardId: selectedCard.id,
                      animation: { prefix: v },
                    },
                  })
                }
                placeholder="e.g. $"
              />
              <Field
                label="Suffix"
                value={selectedCard.animation.suffix}
                onChange={(v) =>
                  dispatch({
                    type: "UPDATE_CARD_ANIMATION",
                    payload: {
                      cardId: selectedCard.id,
                      animation: { suffix: v },
                    },
                  })
                }
                placeholder="e.g. %"
              />
            </div>
          </div>

          {/* Animation Settings */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Animation
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Duration (ms)"
                value={selectedCard.animation.duration}
                onChange={(v) =>
                  dispatch({
                    type: "UPDATE_CARD_ANIMATION",
                    payload: {
                      cardId: selectedCard.id,
                      animation: { duration: v },
                    },
                  })
                }
                min={100}
                max={10000}
                step={100}
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Easing
                </label>
                <select
                  value={selectedCard.animation.easing}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_CARD_ANIMATION",
                      payload: {
                        cardId: selectedCard.id,
                        animation: { easing: e.target.value as EasingType },
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="linear">Linear</option>
                  <option value="easeOut">Ease Out</option>
                  <option value="easeInOut">Ease In Out</option>
                  <option value="smooth">Smooth</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {cards.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-8">
          No cards yet. Click &quot;Add Card&quot; to get started.
        </p>
      )}
    </div>
  );
}

// =============================================================================
// Reusable field components
// =============================================================================

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/svg+xml", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large (max 5MB)");
      return;
    }

    setUploading(true);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      onChange(dataUrl);
    } catch {
      setError("Failed to read image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      {value && (
        <div className="flex items-center gap-3 mb-2 p-2 bg-gray-700 rounded-lg">
          <img
            src={value}
            alt="Logo"
            className="w-10 h-10 object-contain rounded"
          />
          <span className="text-xs text-gray-400 truncate flex-1">
            {value.startsWith("data:") ? "Embedded image" : value}
          </span>
          <button
            onClick={() => onChange("")}
            className="text-xs text-red-400 hover:text-red-300 shrink-0"
          >
            Remove
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300 hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export default CardsTab;
