"use client"

import { useState } from "react"
import { useDashboardStore } from "@/lib/store"
import { CardWidget } from "./card-widget"
import { TableWidget } from "./table-widget"
import { CandleChartWidget } from "./candle-chart-widget"
import { WidgetShell } from "./widget-shell"
import { WidgetConfigDialog } from "@/components/widget-config-dialog"
import { Button } from "@/components/ui/button"
import type { Widget } from "@/lib/types"

export default function WidgetGrid() {
  const widgets = useDashboardStore((s) => s.widgets ?? [])
  const removeWidget = useDashboardStore((s) => s.removeWidget)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [configWidget, setConfigWidget] = useState<Widget | null>(null)

  const handleConfig = (widget: Widget) => {
    setConfigWidget(widget)
    setConfigDialogOpen(true)
  }

  if (!widgets.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">No widgets yet</p>
        <Button
          className="mt-3"
          onClick={() => window.dispatchEvent(new CustomEvent("open-add-widget"))}
        >
          Add Widget
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {widgets.map((w: any) => (
          <WidgetShell
            key={w.id}
            widget={w}
            onRemove={() => removeWidget(w.id)}
            onConfig={() => handleConfig(w)}
          >
            {w.type === "card" && <CardWidget widget={w} />}
            {w.type === "table" && <TableWidget widget={w} />}
            {(w.type === "candle") && (
              <CandleChartWidget widget={w} />
            )}
          </WidgetShell>
        ))}
      </div>
      <WidgetConfigDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        widget={configWidget}
      />
    </>
  )
}
