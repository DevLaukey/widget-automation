"use client";

import { useEditor } from "@/context/EditorContext";
import { ColorPicker } from "./ColorPicker";

export function StylesTab() {
  const { state, updateStyles, resetStyles } = useEditor();
  const { styles } = state.widget;

  return (
    <div className="flex flex-col gap-6">
      {/* Colors Section */}
      <Section title="Colors">
        <div className="flex flex-col gap-3">
          <ColorPicker
            label="Background"
            value={styles.colors.background}
            onChange={(c) => updateStyles({ colors: { ...styles.colors, background: c } })}
          />
          <ColorPicker
            label="Text"
            value={styles.colors.text}
            onChange={(c) => updateStyles({ colors: { ...styles.colors, text: c } })}
          />
          <ColorPicker
            label="Label"
            value={styles.colors.label}
            onChange={(c) => updateStyles({ colors: { ...styles.colors, label: c } })}
          />
          <ColorPicker
            label="Primary"
            value={styles.colors.primary}
            onChange={(c) => updateStyles({ colors: { ...styles.colors, primary: c } })}
          />
          <ColorPicker
            label="Secondary"
            value={styles.colors.secondary}
            onChange={(c) => updateStyles({ colors: { ...styles.colors, secondary: c } })}
          />
          <ColorPicker
            label="Positive Value"
            value={styles.colors.positive}
            onChange={(c) => updateStyles({ colors: { ...styles.colors, positive: c } })}
          />
          <ColorPicker
            label="Negative Value"
            value={styles.colors.negative}
            onChange={(c) => updateStyles({ colors: { ...styles.colors, negative: c } })}
          />
          <ColorPicker
            label="Neutral Value"
            value={styles.colors.neutral}
            onChange={(c) => updateStyles({ colors: { ...styles.colors, neutral: c } })}
          />
        </div>
      </Section>

      {/* Typography Section */}
      <Section title="Typography">
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Font Family
            </label>
            <input
              type="text"
              value={styles.fonts.family}
              onChange={(e) =>
                updateStyles({ fonts: { ...styles.fonts, family: e.target.value } })
              }
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SizeField
              label="Value Size"
              value={styles.fonts.valueFontSize}
              onChange={(v) =>
                updateStyles({ fonts: { ...styles.fonts, valueFontSize: v } })
              }
            />
            <SizeField
              label="Label Size"
              value={styles.fonts.labelFontSize}
              onChange={(v) =>
                updateStyles({ fonts: { ...styles.fonts, labelFontSize: v } })
              }
            />
            <SizeField
              label="Title Size"
              value={styles.fonts.titleFontSize}
              onChange={(v) =>
                updateStyles({ fonts: { ...styles.fonts, titleFontSize: v } })
              }
            />
            <SizeField
              label="Description Size"
              value={styles.fonts.descriptionFontSize}
              onChange={(v) =>
                updateStyles({
                  fonts: { ...styles.fonts, descriptionFontSize: v },
                })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <WeightField
              label="Value Weight"
              value={styles.fonts.valueWeight}
              onChange={(v) =>
                updateStyles({ fonts: { ...styles.fonts, valueWeight: v } })
              }
            />
            <WeightField
              label="Label Weight"
              value={styles.fonts.labelWeight}
              onChange={(v) =>
                updateStyles({ fonts: { ...styles.fonts, labelWeight: v } })
              }
            />
            <WeightField
              label="Title Weight"
              value={styles.fonts.titleWeight}
              onChange={(v) =>
                updateStyles({ fonts: { ...styles.fonts, titleWeight: v } })
              }
            />
          </div>
        </div>
      </Section>

      {/* Card Appearance Section */}
      <Section title="Card Appearance">
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Border Radius: {styles.borderRadius}px
            </label>
            <input
              type="range"
              min={0}
              max={32}
              value={styles.borderRadius}
              onChange={(e) =>
                updateStyles({ borderRadius: Number(e.target.value) })
              }
              className="w-full accent-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Box Shadow
            </label>
            <input
              type="text"
              value={styles.boxShadow}
              onChange={(e) => updateStyles({ boxShadow: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SizeField
              label="Padding"
              value={styles.padding}
              onChange={(v) => updateStyles({ padding: v })}
            />
            <SizeField
              label="Gap"
              value={styles.gap}
              onChange={(v) => updateStyles({ gap: v })}
            />
          </div>
          <SizeField
            label="Card Min Height"
            value={styles.cardMinHeight}
            onChange={(v) => updateStyles({ cardMinHeight: v })}
          />
        </div>
      </Section>

      {/* Overlay Section */}
      <Section title="Overlay">
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={styles.overlay.enabled}
              onChange={(e) =>
                updateStyles({
                  overlay: { ...styles.overlay, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 rounded accent-blue-500"
            />
            <span className="text-sm text-gray-300">Enable Overlay</span>
          </label>
          {styles.overlay.enabled && (
            <>
              <ColorPicker
                label="Overlay Color"
                value={styles.overlay.color}
                onChange={(c) =>
                  updateStyles({
                    overlay: { ...styles.overlay, color: c },
                  })
                }
              />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Opacity: {styles.overlay.opacity.toFixed(2)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={styles.overlay.opacity}
                  onChange={(e) =>
                    updateStyles({
                      overlay: {
                        ...styles.overlay,
                        opacity: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </Section>

      {/* Reset Button */}
      <button
        onClick={resetStyles}
        className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-gray-600"
      >
        Reset to Defaults
      </button>
    </div>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SizeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
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
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function WeightField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value={300}>Light (300)</option>
        <option value={400}>Regular (400)</option>
        <option value={500}>Medium (500)</option>
        <option value={600}>Semi-Bold (600)</option>
        <option value={700}>Bold (700)</option>
        <option value={800}>Extra Bold (800)</option>
      </select>
    </div>
  );
}

export default StylesTab;
