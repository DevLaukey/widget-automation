"use client";

import { useEditor } from "@/context/EditorContext";

export function LayoutTab() {
  const { state, updateLayout } = useEditor();
  const { layout } = state.widget;

  return (
    <div className="flex flex-col gap-6">
      {/* Columns per Breakpoint */}
      <Section title="Grid Columns">
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Desktop (1024px+): {layout.columns.desktop} columns
            </label>
            <input
              type="range"
              min={1}
              max={6}
              value={layout.columns.desktop}
              onChange={(e) =>
                updateLayout({
                  columns: {
                    ...layout.columns,
                    desktop: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tablet (768px+): {layout.columns.tablet} columns
            </label>
            <input
              type="range"
              min={1}
              max={4}
              value={layout.columns.tablet}
              onChange={(e) =>
                updateLayout({
                  columns: {
                    ...layout.columns,
                    tablet: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Mobile (&lt;768px): {layout.columns.mobile} columns
            </label>
            <input
              type="range"
              min={1}
              max={3}
              value={layout.columns.mobile}
              onChange={(e) =>
                updateLayout({
                  columns: {
                    ...layout.columns,
                    mobile: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Container Settings */}
      <Section title="Container">
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Max Width
            </label>
            <input
              type="text"
              value={layout.maxWidth}
              onChange={(e) => updateLayout({ maxWidth: e.target.value })}
              placeholder="e.g. 1200px"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Container Padding
            </label>
            <input
              type="text"
              value={layout.containerPadding}
              onChange={(e) =>
                updateLayout({ containerPadding: e.target.value })
              }
              placeholder="e.g. 2rem"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Section>

      {/* Visual Preview of Grid */}
      <Section title="Grid Preview">
        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-500 mb-2">Desktop layout</p>
          <div
            className="gap-2"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${layout.columns.desktop}, 1fr)`,
            }}
          >
            {Array.from({ length: Math.max(layout.columns.desktop, 3) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-600 rounded border border-gray-500"
                />
              )
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

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

export default LayoutTab;
