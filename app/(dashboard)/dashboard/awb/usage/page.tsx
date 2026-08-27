"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { BarChart3, Download, Loader2, RefreshCw, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

type UsageRow = {
  id: string;
  seriesName: string;
  seriesCode?: string;
  formattedStart: string;
  formattedEnd: string;
  allocatedToType: string;
  allocatedToName: string;
  allocatedToCode?: string;
  capacity: number;
  used: number;
  available: number;
  utilizationRate: number;
  status: string;
};

type UsageSummary = {
  totalSeries: number;
  activeSeries: number;
  totalAllocations: number;
  allocated: number;
  used: number;
  available: number;
  utilizationRate: number;
  activeBranches: number;
  activePartners: number;
};

const emptySummary: UsageSummary = { totalSeries: 0, activeSeries: 0, totalAllocations: 0, allocated: 0, used: 0, available: 0, utilizationRate: 0, activeBranches: 0, activePartners: 0 };
const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const AWBUsagePage = () => {
  const [rows, setRows] = useState<UsageRow[]>([]);
  const [summary, setSummary] = useState<UsageSummary>(emptySummary);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadUsage = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE}/api/awb-series/usage`, { headers: { Authorization: `Bearer ${token}` } });
      const payload = response.data || {};
      setSummary({ ...emptySummary, ...(payload.summary || {}) });
      setRows(Array.isArray(payload.allocations) ? payload.allocations : []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load AWB usage");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsage(); }, [loadUsage]);

  const filteredRows = useMemo(() => rows.filter((row) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = !query || [row.seriesName, row.seriesCode, row.formattedStart, row.formattedEnd, row.allocatedToName, row.allocatedToCode].some((value) => String(value || "").toLowerCase().includes(query));
    return matchesSearch && (typeFilter === "all" || row.allocatedToType === typeFilter);
  }), [rows, searchTerm, typeFilter]);

  const exportCsv = () => {
    const rowsToExport = [["Series", "Range start", "Range end", "Target", "Target code", "Type", "Allocated", "Used", "Available", "Utilization"], ...filteredRows.map((row) => [row.seriesName, row.formattedStart, row.formattedEnd, row.allocatedToName, row.allocatedToCode, row.allocatedToType, row.capacity, row.used, row.available, `${row.utilizationRate}%`])];
    const url = URL.createObjectURL(new Blob([rowsToExport.map((row) => row.map(csvCell).join(",")).join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "awb-usage.csv"; link.click(); URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-2"><BarChart3 className="h-6 w-6 text-blue-600" /></div><div><h1 className="text-3xl font-bold">AWB Usage</h1><p className="text-muted-foreground">Live usage of persisted AWB allocations; no shipment consumes an AWB until booking succeeds.</p></div></div><div className="flex gap-2"><Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />Export CSV</Button><Button variant="outline" size="icon" title="Refresh" onClick={loadUsage}><RefreshCw className="h-4 w-4" /></Button></div></div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "Allocated", value: summary.allocated }, { label: "Used", value: summary.used }, { label: "Available", value: summary.available }, { label: "Utilization", value: `${summary.utilizationRate}%` }].map((item) => <Card key={item.label}><CardContent className="p-5"><p className="text-sm text-muted-foreground">{item.label}</p><p className="text-2xl font-bold">{typeof item.value === "number" ? item.value.toLocaleString() : item.value}</p></CardContent></Card>)}</div>

      <Card><CardContent className="flex flex-col gap-3 p-4 lg:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search series, range, branch, or code" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></div><Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="lg:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All target types</SelectItem><SelectItem value="branch">Branch</SelectItem><SelectItem value="partner">Partner</SelectItem><SelectItem value="customer">Customer</SelectItem></SelectContent></Select></CardContent></Card>

      <Card><CardContent className="grid gap-4 p-5 sm:grid-cols-3"><div><p className="text-sm text-muted-foreground">Series</p><p className="font-semibold">{summary.totalSeries} total / {summary.activeSeries} active</p></div><div><p className="text-sm text-muted-foreground">Allocations</p><p className="font-semibold">{summary.totalAllocations.toLocaleString()}</p></div><div><p className="text-sm text-muted-foreground">Active targets</p><p className="flex items-center gap-2 font-semibold"><Users className="h-4 w-4" />{summary.activeBranches} branches · {summary.activePartners} partners</p></div></CardContent></Card>

      <div className="space-y-3">{filteredRows.map((row) => <Card key={row.id}><CardContent className="grid gap-4 p-5 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] md:items-center"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{row.seriesName}</p><Badge variant="outline" className="capitalize">{row.allocatedToType}</Badge><Badge variant={row.status === "active" ? "success" : row.status === "near_exhaustion" ? "warning" : "error"}>{row.status.replace("_", " ")}</Badge></div><p className="mt-1 break-all font-mono text-sm">{row.formattedStart} through {row.formattedEnd}</p><p className="text-sm text-muted-foreground">Target: {row.allocatedToName}{row.allocatedToCode ? ` (${row.allocatedToCode})` : ""}</p></div><div className="text-sm"><p><span className="text-muted-foreground">Allocated:</span> {row.capacity.toLocaleString()}</p><p><span className="text-muted-foreground">Used:</span> {row.used.toLocaleString()}</p><p className="font-semibold text-green-700"><span className="text-muted-foreground">Available:</span> {row.available.toLocaleString()}</p></div><div className="text-right"><p className="text-2xl font-bold">{row.utilizationRate}%</p><p className="text-xs text-muted-foreground">utilized</p></div></CardContent></Card>)}{!filteredRows.length && <Card><CardContent className="p-12 text-center"><BarChart3 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" /><p className="font-semibold">No usage records found</p><p className="text-sm text-muted-foreground">Usage appears here after an AWB range is allocated.</p></CardContent></Card>}</div>
    </div>
  );
};

export default AWBUsagePage;
