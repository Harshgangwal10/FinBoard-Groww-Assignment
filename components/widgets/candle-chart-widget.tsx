"use client"

import useSWR from "swr"
import type { Widget } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-moment';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  CandlestickController,
  CandlestickElement,
);

interface CandleData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export function CandleChartWidget({ widget }: { widget: Widget }) {
  const [interval, setInterval] = useState<string>(
    (widget.params && (widget.params.interval as string)) || "daily",
  )

  const { data, error, isLoading } = useSWR(
    ["widget", widget.id, widget.provider, widget.endpoint, widget.params, interval],
    () =>
      fetch("/api/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: widget.provider,
          endpoint: widget.endpoint,
          params: { ...(widget.params || {}), interval },
        }),
      }).then((r) => r.json()),
    { refreshInterval: widget.refreshMs, dedupingInterval: 5_000 },
  )

  // Parse OHLC data from API response
  function extractCandleData(apiData: any) {
    if (!apiData) return []

    // Check for Finnhub candle format
    if (apiData.t && Array.isArray(apiData.t) && Array.isArray(apiData.c)) {
      const t: number[] = apiData.t
      const o: number[] = apiData.o || []
      const h: number[] = apiData.h || []
      const l: number[] = apiData.l || []
      const c: number[] = apiData.c || []
      const v: number[] = apiData.v || []

      return t
        .map((ts, i) => ({
          x: new Date(ts * 1000),
          o: Number(o[i]) || Number(c[i]),
          h: Number(h[i]) || Number(c[i]),
          l: Number(l[i]) || Number(c[i]),
          c: Number(c[i]),
        }))
        .slice(0, 100) // Last 100 candles
    }

    // Check for Alpha Vantage time series format
    const seriesKey = Object.keys(apiData).find((k) =>
      k.toLowerCase().includes("time series"),
    )
    if (seriesKey && apiData[seriesKey]) {
      const obj = apiData[seriesKey]
      return Object.entries<any>(obj)
        .map(([time, ohlc]) => {
          const get = (keys: string[]) => {
            for (const k of keys) {
              if (ohlc[k] != null) return Number(ohlc[k])
            }
            return 0
          }
          return {
            x: new Date(time),
            o: get(["1. open", "open"]),
            h: get(["2. high", "high"]),
            l: get(["3. low", "low"]),
            c: get(["4. close", "close"]),
          }
        })
        .reverse()
        .slice(0, 100)
    }

    return []
  }

  const candles = extractCandleData(data)

  const chartData = {
    datasets: [{
      label: 'Candlestick',
      data: candles,
      color: {
        up: '#22c55e',
        down: '#ef4444',
        unchanged: '#6b7280',
      },
    }],
  }

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        position: 'right',
      },
    },
  }

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading
      </div>
    )
  if (error) return <div className="text-sm text-destructive">Error loading</div>
  if (!data) return <div className="text-sm text-muted-foreground">No data</div>

  return (
    <div className="w-full h-56 bg-background rounded p-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-muted-foreground">Interval:</span>
        <Button
          size="sm"
          variant={interval === "daily" ? "default" : "ghost"}
          onClick={() => setInterval("daily")}
        >
          Daily
        </Button>
        <Button
          size="sm"
          variant={interval === "weekly" ? "default" : "ghost"}
          onClick={() => setInterval("weekly")}
        >
          Weekly
        </Button>
        <Button
          size="sm"
          variant={interval === "monthly" ? "default" : "ghost"}
          onClick={() => setInterval("monthly")}
        >
          Monthly
        </Button>
      </div>

      <div className="w-full h-[calc(100%-2.5rem)]">
        <Chart type="candlestick" data={chartData} options={options} />
      </div>
    </div>
  )
}
