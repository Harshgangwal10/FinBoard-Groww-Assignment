"use client";

import useSWR from "swr";
import { getByPath, formatField } from "@/lib/json-utils";
import type { WidgetCard, FieldFormat } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card" 
import { JSX } from "react";

export function CardWidget({ widget }: { widget: WidgetCard }) {
  const { data, error, isLoading } = useSWR(
    ["widget", widget.id, widget.provider, widget.endpoint, widget.params],
    () =>
      fetch("/api/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: widget.provider,
          endpoint: widget.endpoint,
          params: widget.params,
        }),
      }).then((r) => r.json()),
    { refreshInterval: widget.refreshMs, dedupingInterval: 5_000 }
  );

 
  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading
      </div>
    );

 
  if (error) return <div className="text-sm text-destructive">Error loading</div>;

  
  if (!data) return <div className="text-sm text-muted-foreground">No data</div>;

  
  const values = (widget.mapping.paths || []).map((p) => {
    const v = getByPath(data, p);
    return { path: p, value: v };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{widget.name|| "Finance Widget"}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {values.map((item) => (
          <div key={item.path} className="flex flex-col gap-1 p-2 bg-muted/20 rounded-md">
            <span className="text-xs text-muted-foreground">{item.path}</span>
            <span className="text-lg font-semibold">{renderValue(item.value, widget.mapping.format)}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <span className="text-xs text-muted-foreground">
          Updated every {widget.refreshMs / 1000}s
        </span>
      </CardFooter>
    </Card>
  );
}


function renderObject(obj: Record<string, any>) {
  return (
    <div className="space-y-1">
      {Object.entries(obj).map(([key, val]) => (
        <div key={key} className="flex justify-between border-b pb-1">
          <span className="font-medium">{key}</span>
          <span>{renderValue(val)}</span>
        </div>
      ))}
    </div>
  );
}


function renderTimeSeries(data: { time: string; value: any }[]) {
  return (
    <div className="overflow-x-auto space-y-2">
      {data.map((row, idx) => (
        <div key={idx} className="border rounded-md p-2 bg-muted/10">
          <div className="font-medium text-sm mb-1">{row.time}</div>
          {typeof row.value === "object" ? (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(row.value).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span>{k}</span>
                  <span>{formatField(v)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm">{row.value}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function renderValue(value: any, format?: string): JSX.Element | string {
  if (value === null || value === undefined) return "-";

  if (Array.isArray(value)) {
    if (value.length > 0 && "time" in value[0] && "value" in value[0]) {
      return renderTimeSeries(value);
    }
    return value.join(", ");
  }

  if (typeof value === "object") return renderObject(value);

  return formatField(value, format as FieldFormat | undefined);
}

export { CardWidget as CardWidgetV2 };
