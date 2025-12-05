// Core types for widgets, providers, and mapping

export type ProviderId = "alphaVantage" | "finnhub"
export type WidgetType = "card" | "table" | "candle"
export type FieldFormat = "number" | "currency" | "percent"

export type WidgetBase = {
  id: string
  name: string
  type: WidgetType
  provider: ProviderId
  endpoint: string
  params: Record<string, any>
  refreshMs: number
}

export type WidgetCard = WidgetBase & {
  type: "card"
  mapping: { paths: string[]; format: FieldFormat }
}

export type WidgetTable = WidgetBase & {
  type: "table"
  mapping: { columns: string[] }
}

export type WidgetCandle = WidgetBase & {
  type: "candle"
  mapping: { x?: string; y?: string }
}
export type Widget = WidgetCard | WidgetTable | WidgetCandle

export type DashboardExport = {
  version: 1
  widgets: Widget[]
}
