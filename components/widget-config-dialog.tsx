"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboardStore } from "@/lib/store"
import type { Widget, ProviderId, WidgetType, FieldFormat } from "@/lib/types"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  widget: Widget | null
}

export function WidgetConfigDialog({ open, onOpenChange, widget }: Props) {
  const [name, setName] = useState("")
  const [type, setType] = useState<WidgetType>("card")
  const [provider, setProvider] = useState<ProviderId>("alphaVantage")
  const [endpoint, setEndpoint] = useState("")
  const [symbol, setSymbol] = useState("")
  const [refreshMs, setRefreshMs] = useState(60000)
  const [interval, setInterval] = useState<string>("daily")
  const [format, setFormat] = useState<FieldFormat>("number")

  const updateWidget = useDashboardStore((s) => s.updateWidget)

  useEffect(() => {
    if (widget) {
      setName(widget.name)
      setType(widget.type)
      setProvider(widget.provider)
      setEndpoint(widget.endpoint)
      setSymbol(widget.params.symbol || "")
      setRefreshMs(widget.refreshMs)
      setInterval(widget.params.interval || "daily")
      if (widget.type === "card" && widget.mapping && "format" in widget.mapping) {
        setFormat(widget.mapping.format)
      }
    }
  }, [widget])

  function onSave() {
    if (!widget) return

    const params: Record<string, any> = { ...(symbol ? { symbol } : {}) }
    if (type === "candle") params.interval = interval

    const updates: Partial<Widget> = {
      name,
      type,
      provider,
      endpoint,
      params,
      refreshMs,
    }

    if (type === "card") {
      updates.mapping = { ...widget.mapping, format }
    } else if (type === "table") {
      updates.mapping = widget.mapping
    } else if (type === "candle") {
      updates.mapping = {}
    }

    updateWidget(widget.id, updates)
    onOpenChange(false)
  }

  if (!widget) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Widget</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Widget Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as WidgetType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="candle">Candlestick Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Provider</Label>
              <Select value={provider} onValueChange={(v) => setProvider(v as ProviderId)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alphaVantage">Alpha Vantage</SelectItem>
                  <SelectItem value="finnhub">Finnhub</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Endpoint</Label>
              <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Symbol</Label>
              <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
            </div>
          </div>

          {type === "candle" && (
            <div className="space-y-1.5">
              <Label>Interval</Label>
              <Select value={interval} onValueChange={(v) => setInterval(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "card" && (
            <div className="space-y-1.5">
              <Label>Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as FieldFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="percent">Percent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Auto Refresh (ms)</Label>
            <Input
              type="number"
              min={0}
              value={refreshMs}
              onChange={(e) => setRefreshMs(Number.parseInt(e.target.value || "0", 10))}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
