"use client"

import useSWR from "swr"
import { getArrayFromData, getByPath } from "@/lib/json-utils"
import type { WidgetTable } from "@/lib/types"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination"
import { useMemo, useState, useEffect } from "react"

export function TableWidget({ widget }: { widget: WidgetTable }) {
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
    { refreshInterval: widget.refreshMs, dedupingInterval: 5_000 },
  )

  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [query])

  const { filteredRows, totalPages } = useMemo(() => {
    const arr = getArrayFromData(data)
    if (!arr) return { filteredRows: [], totalPages: 0 }
    const filtered = query
      ? arr.filter((row: any) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()))
      : arr
    const totalPages = Math.ceil(filtered.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedRows = filtered.slice(startIndex, endIndex)
    return { filteredRows: paginatedRows, totalPages }
  }, [data, query, currentPage, pageSize])

  // --- NEW: Pagination window for max 5 visible buttons ---
  const pageWindowSize = 5
  const { pageStart, pageEnd } = useMemo(() => {
    if (totalPages <= pageWindowSize) return { pageStart: 1, pageEnd: totalPages }

    let start = Math.max(currentPage - Math.floor(pageWindowSize / 2), 1)
    let end = start + pageWindowSize - 1

    if (end > totalPages) {
      end = totalPages
      start = end - pageWindowSize + 1
    }

    return { pageStart: start, pageEnd: end }
  }, [currentPage, totalPages])

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading
      </div>
    )
  if (error) return <div className="text-sm text-destructive">Error loading</div>
  if (!data) return <div className="text-sm text-muted-foreground">No data</div>

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Search className="size-4 text-muted-foreground" />
        <Input
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="overflow-auto w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {widget.mapping.columns.map((c) => (
                <TableHead key={c}>{c}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row: any, idx: number) => (
              <TableRow key={idx}>
                {widget.mapping.columns.map((c) => (
                  <TableCell key={c}>{String(getByPath(row, c) ?? "")}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- Pagination --- */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center mt-2 overflow-x-auto">
          <Pagination className="w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {pageStart > 1 && <PaginationEllipsis />}

              {Array.from({ length: pageEnd - pageStart + 1 }, (_, i) => i + pageStart).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {pageEnd < totalPages && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

export default TableWidget
