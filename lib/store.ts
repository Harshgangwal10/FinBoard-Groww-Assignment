"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Widget, DashboardExport } from "./types"

type WidgetInput = Omit<Widget, "id"> & { title?: string; name?: string }

type State = {
  widgets: Widget[]
  addWidget: (w: WidgetInput) => void
  updateWidget: (id: string, updates: any) => void
  removeWidget: (id: string) => void
  reorder: (from: number, to: number) => void
  exportConfig: () => DashboardExport
  importConfig: (data: DashboardExport) => void
  hasSeenTour: boolean
  setHasSeenTour: (v: boolean) => void
  getWidget: (id: string) => Widget | undefined
}

function createWidget(w: WidgetInput): Widget {
  const base = {
    id: Date.now().toString(),
    name: w.name || w.title || "Untitled Widget",
    type: w.type,
    provider: w.provider,
    endpoint: w.endpoint,
    params: w.params ?? {},
    refreshMs: w.refreshMs ?? 60000,
  }
  return { ...base, mapping: w.mapping } as Widget
}

export const useDashboardStore = create<State>()(
  persist(
    (set, get) => ({
     
      hasSeenTour: false,
      setHasSeenTour: (v) => set(() => ({ hasSeenTour: v })),
      widgets: [],
      addWidget: (w) =>
        set((state) => ({
          widgets: [...state.widgets, createWidget(w)],
        })),
      updateWidget: (id, updates) =>
        set((state) => ({
          widgets: state.widgets.map((widget) =>
            widget.id === id ? { ...widget, ...updates } : widget
          ),
        })),
      removeWidget: (id) => set((state) => ({ widgets: state.widgets.filter((widget) => widget.id !== id) })),
      reorder: (from, to) => {
        const widgets = get().widgets
        const reorderedWidgets = Array.from(widgets)
        const [widget] = reorderedWidgets.splice(from, 1)
        reorderedWidgets.splice(to, 0, widget)
        set({ widgets: reorderedWidgets })
      },
      exportConfig: () => {
        const widgets = get().widgets
        return { version: 1, widgets }
      },
      importConfig: (data) => {
        set({ widgets: (data?.widgets as any[]) || [] })
      },
      getWidget: (id: string) => get().widgets.find((w) => w.id === id),
    }),
    {
      name: "finboard-dashboard",
      storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined,
   
      onRehydrateStorage: (store) => (persistedState) => {
        try {
          const persisted = (persistedState as any)?.state?.widgets ?? (persistedState as any)?.widgets
          if (Array.isArray(persisted) && persisted.length) {
            const migrated = persisted.map((w: any) => (w?.type === "line" ? { ...w, type: "candle" } : w))
           
            if (persistedState && (persistedState as any).state) (persistedState as any).state.widgets = migrated
        
            if (store && typeof (store as any).setState === "function") (store as any).setState({ widgets: migrated })
          }
        } catch (e) {
          
        }
      },
    },
  ),
)


export const useAppStore = useDashboardStore
export default useDashboardStore
