"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRef, useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function DashboardHeader({
  theme,
  onToggleTheme,
  onAddWidget,
  onExport,
  onImport,
}: {
  theme: string
  onToggleTheme: () => void
  onAddWidget: () => void
  onExport: () => void
  onImport: (file: File) => void
}) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="finboard-header sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="size-8 sm:size-10 rounded-lg bg-linear-to-br from-accent to-accent/80 flex items-center justify-center shrink-0">
            <div className="size-4 sm:size-6 rounded bg-white/20" aria-hidden />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-base sm:text-lg finboard-text-balance truncate">FinBoard</h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden xs:block">Real-time Finance Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Separator orientation="vertical" className="h-4 sm:h-6 hidden sm:block" />

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="finboard-focus text-accent"
          >
            {!mounted ? (
              <span className="block size-4 sm:size-5" aria-hidden />
            ) : theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          <Separator orientation="vertical" className="h-4 sm:h-6 hidden sm:block" />

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop: Show all buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onExport} className="finboard-focus bg-transparent border-accent/40 text-accent">
                <span className="hidden md:inline">Export</span>
                <span className="md:hidden">Exp</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="finboard-focus border-accent/40 text-accent">
                <span className="hidden md:inline">Import</span>
                <span className="md:hidden">Imp</span>
              </Button>
            </div>

            {/* Mobile: Compact export/import */}
            <div className="flex sm:hidden items-center gap-1">
              <Button variant="ghost" size="sm" onClick={onExport} className="finboard-focus text-xs px-2 text-accent">
                Exp
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileRef.current?.click()}
                className="finboard-focus text-xs px-2 text-accent"
              >
                Imp
              </Button>
            </div>

            <Button onClick={onAddWidget} className="finboard-focus text-xs sm:text-sm px-2 sm:px-4 bg-accent text-accent-foreground hover:bg-accent/90">
              <span className="hidden sm:inline">Add Widget</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onImport(f)
          if (fileRef.current) fileRef.current.value = ""
        }}
      />
    </header>
  )
}
