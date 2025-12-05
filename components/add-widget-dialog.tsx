"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { JSONExplorer } from "@/components/json-explorer"
import { useDashboardStore } from "@/lib/store"
import type { ProviderId, WidgetType, FieldFormat } from "@/lib/types"

type Props = { open: boolean; onOpenChange: (v: boolean) => void }

export function AddWidgetDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState("")
  const [type, setType] = useState<WidgetType>("card")
  const [provider, setProvider] = useState<ProviderId>("alphaVantage")
  const [endpoint, setEndpoint] = useState("TIME_SERIES_DAILY")
  const [symbol, setSymbol] = useState("AAPL")
  const [refreshMs, setRefreshMs] = useState(60_000)
  const [preview, setPreview] = useState<any>(null)
  const [paths, setPaths] = useState<string[]>([]) 
  const [interval, setInterval] = useState<string>("daily")
  const [format, setFormat] = useState<FieldFormat>("number")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const addWidget = useDashboardStore((s) => s.addWidget)


  async function doPreview() {
    setError(null)
    setPreviewError(null)
    setIsLoading(true)
    setPreview(null)
    try {
      const body = {
        provider,
        endpoint,
        params: { ...(symbol ? { symbol } : {}), ...(type === "candle" ? { interval } : {}) },
        intent: "preview",
      }
      const res = await fetch("/api/fetch/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) {
        setPreviewError(typeof json?.error === "string" ? json.error : "API fetch failed")
      } else {
        setPreview(json)
      }
    } catch (e: any) {
      setPreviewError(e?.message || "Network error")
    } finally {
      setIsLoading(false)
    }
  }

  function onAdd() {
    let hasError = false

    if (!name.trim()) {
      setNameError("Widget name is required")
      hasError = true
    } else {
      setNameError(null)
    }

    if (!preview) {
      setPreviewError("You must fetch API data before adding widget")
      hasError = true
    } else {
      setPreviewError(null)
    }

    if (hasError) return

    const params: Record<string, any> = { ...(symbol ? { symbol } : {}) }
    if (type === "candle") params.interval = interval

    const common = {
      title: name,
      name,
      provider,
      endpoint,
      params,
      refreshMs,
    }

    if (type === "card") {
      addWidget({ type, ...common, mapping: { paths, format } } as any)
    } else if (type === "table") {
      addWidget({ type, ...common, mapping: { columns: paths } } as any)
    } else {
      addWidget({ type, ...common, mapping: {} } as any)
    }

    onOpenChange(false)
    setPreview(null)
    setPaths([])
    setName("")
    setInterval("daily")
    setNameError(null)
    setPreviewError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/*  Widget Name & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Widget Name</Label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (nameError && e.target.value.trim()) setNameError(null)
                }}
                placeholder="AAPL Daily Close"
              />
              {nameError && <p className="text-xs text-destructive">{nameError}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as WidgetType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="candle">Candlestick Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Provider, Endpoint, Symbol, Interval -*/}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Provider</Label>
              <Select value={provider} onValueChange={(v) => setProvider(v as ProviderId)}>
                <SelectTrigger>
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alphaVantage">Alpha Vantage</SelectItem>
                  <SelectItem value="finnhub">Finnhub</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Endpoint</Label>
              <Select value={endpoint} onValueChange={(v) => setEndpoint(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {provider === "alphaVantage" && (
                    <>
                      <SelectItem value="TIME_SERIES_DAILY">Daily Series</SelectItem>
                      <SelectItem value="TIME_SERIES_INTRADAY">Intraday</SelectItem>
                      <SelectItem value="GLOBAL_QUOTE">Quote</SelectItem>
                    </>
                  )}
                  {provider === "finnhub" && (
                    <>
                      <SelectItem value="/quote">Quote</SelectItem>
                      <SelectItem value="/stock/candle">Candles</SelectItem>
                      <SelectItem value="/news">News</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Symbol</Label>
              <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="AAPL" />
            </div>

            {type === "candle" && (
              <div className="space-y-1.5">
                <Label>Interval</Label>
                <Select value={interval} onValueChange={(v) => setInterval(v)}>
                  <SelectTrigger><SelectValue placeholder="Interval" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/*  Refresh & Format  */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Auto Refresh (ms)</Label>
              <Input
                type="number"
                min={0}
                value={refreshMs}
                onChange={(e) => setRefreshMs(Number.parseInt(e.target.value || "0", 10))}
              />
            </div>
            {type === "card" && (
              <div className="space-y-1.5">
                <Label>Format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as FieldFormat)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="currency">Currency</SelectItem>
                    <SelectItem value="percent">Percent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Test Fetch  */}
          <div className="flex items-center gap-2">
            <Button type="button" onClick={doPreview} disabled={isLoading}>
              {isLoading ? "Testing…" : "Test Fetch"}
            </Button>
          </div>
          {previewError && <p className="text-xs text-destructive">{previewError}</p>}
          {error && <p className="text-xs text-destructive">{error}</p>}

          {/* Tabs for JSON Explorer & Field Mapping */}
          <Tabs defaultValue="explore" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="explore">JSON Explorer</TabsTrigger>
              <TabsTrigger value="map">Field Mapping</TabsTrigger>
            </TabsList>
            <TabsContent value="explore">
              <div className="border rounded p-2 max-h-72 overflow-auto">
                {preview ? (
                  <JSONExplorer
                    data={preview}
                    onPickPath={(p) => setPaths((prev) => Array.from(new Set([...prev, p])))}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? "Loading preview…" : 'Click "Test Fetch" to preview API response.'}
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="map">
              <div className="space-y-2">
                <Label className="text-xs">Selected fields</Label>
                <Textarea
                  value={paths.join(", ")}
                  onChange={(e) =>
                    setPaths(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                  placeholder="Add JSON paths separated by comma, e.g. meta.symbol, latest.close"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Buttons for adding widget and for cancel */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-accent/40 text-accent hover:bg-accent/10">
              Cancel
            </Button>
            <Button onClick={onAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Add Widget
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
