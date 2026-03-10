"use client";

import { useState, useEffect, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Package, Calendar, Search, Filter, History, Download, Eye, Clock, Tag, User, Truck, MoreHorizontal, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { ManifestDetailsDialog } from "@/components/manifest/history/ManifestDetailsDialog";
import { TrackingDialog } from "@/components/shared/TrackingDialog";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function ManifestForwardingHistoryPage() {
  const { session } = useAuth();
  const [manifests, setManifests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBagTag, setSelectedBagTag] = useState("all");

  // Row Expansion State
  const [expandedManifestId, setExpandedManifestId] = useState<string | null>(null);

  // Details View State
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<any>(null);

  // Shipment Tracking State
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingShipment, setTrackingShipment] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const manifestsRes = await fetch('/api/manifests?type=outward', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (manifestsRes.ok) {
        const data = await manifestsRes.json();
        setManifests(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading manifest history");
    } finally {
      setLoading(false);
    }
  };

  // Get unique destination branches from manifests
  const destinationBranches = Array.from(
    new Map(
      manifests
        .filter(m => m.destinationBranch)
        .map(m => [m.destinationBranch._id, m.destinationBranch])
    ).values()
  );

  // Get unique source branches from manifests
  const sourceBranches = Array.from(
    new Map(
      manifests
        .filter(m => m.sourceBranch)
        .map(m => [m.sourceBranch._id, m.sourceBranch])
    ).values()
  );

  // Get unique bag tags
  const allBagTags = Array.from(
    new Set(manifests.flatMap(m => m.bagTags || []).filter(Boolean))
  );

  const filteredManifests = manifests.filter(m => {
    const matchesSearch = m.manifestId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === "all" || m.destinationBranch?._id === selectedBranch;
    const matchesSource = selectedSource === "all" || m.sourceBranch?._id === selectedSource;
    const matchesStatus = selectedStatus === "all" || m.status === selectedStatus;
    const matchesBagTag = selectedBagTag === "all" || (m.bagTags || []).includes(selectedBagTag);
    return matchesSearch && matchesBranch && matchesSource && matchesStatus && matchesBagTag;
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manifest History</h1>
          <p className="text-muted-foreground">Complete archive of all forwarding and bag manifests.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export All Records
        </Button>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Manifest ID (MF...)"
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto flex-wrap">
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2 opacity-50" />
                  <SelectValue placeholder="Source Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sourceBranches.map((b: any) => (
                    <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2 opacity-50" />
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  {destinationBranches.map((b: any) => (
                    <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {allBagTags.length > 0 && (
                <Select value={selectedBagTag} onValueChange={setSelectedBagTag}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <Tag className="h-4 w-4 mr-2 opacity-50" />
                    <SelectValue placeholder="Bag Tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bag Tags</SelectItem>
                    {allBagTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Manifest Records
            </CardTitle>
            <Badge variant="outline">{filteredManifests.length} Matches</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse">Loading archive...</div>
          ) : filteredManifests.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No records match your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Manifest ID</TableHead>
                  <TableHead>Origin → Destination</TableHead>
                  <TableHead>Shipments</TableHead>
                  <TableHead>Bag Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processed On</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManifests.map((m) => {
                  // Date Logic
                  const historyEvents = m.history || [];
                  const forwardedEvent = historyEvents.find((h: any) => h.status === 'complete');
                  const validDate = forwardedEvent?.forwarded_at || forwardedEvent?.timestamp || m.createdAt;
                  const dateTime = formatDateTime(validDate);

                  // Shipment Count Logic
                  let count = 0;
                  if (m.shipments && Array.isArray(m.shipments) && m.shipments.length > 0) {
                    count = m.shipments.length;
                  } else if (m.stats && m.stats.totalShipments) {
                    count = m.stats.totalShipments;
                  }

                  // Status Badge Logic
                  const statusLabel = m.status === 'in_transit' ? 'In Transit' : 'Received';
                  const badgeClass = m.status === 'in_transit' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700';
                  const isExpanded = expandedManifestId === m._id;

                  return (
                    <Fragment key={m._id}>
                      <TableRow key={m._id} className={cn("hover:bg-primary/5 transition-colors group", isExpanded && "bg-muted/30")}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => setExpandedManifestId(isExpanded ? null : m._id)}
                          >
                            <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded ? "rotate-180 text-primary" : "")} />
                          </Button>
                        </TableCell>
                        <TableCell className="font-mono font-medium text-primary">
                          {m.manifestId}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="font-medium">{m.sourceBranch?.name || "N/A"}</span>
                            <span className="text-muted-foreground text-xs">→ {m.destinationBranch?.name || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono">
                            {count} items
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {m.bagTags && m.bagTags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {m.bagTags.slice(0, 1).map((tag: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-[10px] font-mono">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs font-mono">Direct</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={`uppercase text-[10px] shadow-sm ${badgeClass}`}>
                            {statusLabel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{dateTime.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <Clock className="h-3 w-3" />
                              <span>{dateTime.time}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 font-medium">
                              <User className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>
                                {m.createdBy?._id === session?.user?.id || m.createdBy === session?.user?.id
                                  ? "Created by You"
                                  : m.createdBy?.name || "System"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedManifest(m);
                                setDetailsOpen(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4" /> View Full Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setExpandedManifestId(isExpanded ? null : m._id)}>
                                <Package className="mr-2 h-4 w-4" /> {isExpanded ? 'Hide' : 'Show'} Shipments
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {/* EXPANDED ROW */}
                      {isExpanded && (
                        <TableRow className="bg-muted/10 hover:bg-muted/10 bg-slate-50/50">
                          <TableCell colSpan={9} className="p-4">
                            <div className="rounded-lg border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                              <div className="mb-3 flex items-center justify-between border-b pb-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <Package className="h-4 w-4 text-primary" />
                                  Shipment Contents ({count})
                                </h4>
                              </div>
                              <div className="max-h-[300px] overflow-y-auto">
                                <Table>
                                  <TableHeader className="bg-muted/50">
                                    <TableRow>
                                      <TableHead className="h-8 text-xs">AWB</TableHead>
                                      <TableHead className="h-8 text-xs">Weight</TableHead>
                                      <TableHead className="h-8 text-xs hidden sm:table-cell">Sent At</TableHead>
                                      <TableHead className="h-8 text-xs hidden sm:table-cell">From</TableHead>
                                      <TableHead className="h-8 text-xs hidden sm:table-cell">To</TableHead>
                                      <TableHead className="h-8 text-xs">Status</TableHead>
                                      <TableHead className="h-8 text-xs text-right">History</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {m.shipments && m.shipments.length > 0 ? (
                                      m.shipments.map((s: any) => {
                                        const isConfirmed = s.status === 'not_scheduled' || s.status === 'received' || s.status === 'scheduled' || s.status === 'in_progress' || s.status === 'complete';
                                        return (
                                          <TableRow key={s._id} className="h-10 hover:bg-transparent border-b-0">
                                            <TableCell className="text-sm font-medium font-mono">
                                              {typeof s === 'string' ? s : s.awb}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                              {s.weight ? `${s.weight} kg` : '-'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                                              {dateTime.date} <span className="text-[10px] opacity-70">{dateTime.time}</span>
                                            </TableCell>
                                            <TableCell className="text-xs hidden sm:table-cell">
                                              <Badge variant="outline" className="font-normal text-[10px]">
                                                {m.sourceBranch?.name || "N/A"}
                                              </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs hidden sm:table-cell">
                                              <Badge variant="outline" className="font-normal text-[10px]">
                                                {m.destinationBranch?.name || "N/A"}
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              <Badge
                                                variant="outline"
                                                className={cn("text-[10px] h-5", isConfirmed ? "text-green-600 bg-green-50 border-green-200" : "text-amber-600 bg-amber-50 border-amber-200")}
                                              >
                                                {isConfirmed ? "Received" : "Pending"}
                                              </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                              {typeof s !== 'string' && (
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTrackingShipment(s);
                                                    setTrackingOpen(true);
                                                  }}
                                                  title="Track Shipment"
                                                >
                                                  <Eye className="h-4 w-4" />
                                                </Button>
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })
                                    ) : (
                                      <TableRow>
                                        <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-4">
                                          No individual shipments data available
                                        </TableCell>
                                      </TableRow>
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ManifestDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        manifest={selectedManifest}
      />

      <TrackingDialog
        open={trackingOpen}
        onOpenChange={setTrackingOpen}
        shipment={trackingShipment}
      />
    </div>
  );
}
