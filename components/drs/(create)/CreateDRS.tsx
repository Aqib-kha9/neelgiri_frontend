"use client";

import { useState, useEffect, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  FileText,
  Edit,
  Trash2,
  User,
  Calendar,
  Truck,
  Package,
  Check,
  Plus,
  Scan,
  X,
  List,
  Pause,
  Play,
  ChevronDown,
  Zap,
} from "lucide-react";
import { QuickDRSDialog } from "../shared/ActionDialogs";
import { EditDRSDialog } from "../shared/EditDRSDialog";
import { toast } from "sonner";
import DRSHeader from "./DRSHeader";
import DRSStats from "./DRSStats";
import { DirectCompleteTable } from "../shared/DirectCompleteTable";
import { cn } from "@/lib/utils";
import { TrackingDialog } from "@/components/shared/TrackingDialog";

// Mock data for created DRS
const mockCreatedDRS = [
  {
    id: "DRS-001",
    drsNumber: "DRS-001",
    rider: { name: "Rahul Kumar", phone: "+91 98765 43210" },
    vehicleMode: "Bike",
    pincodes: ["110001", "110002"],
    shipments: ["AWB12345", "AWB12346", "AWB12347"],
    stats: { totalShipments: 3, totalCOD: 4500 },
    status: "draft",
    date: new Date().toLocaleDateString(),
  },
];

import ShipmentSelection from "./ShipmentSelection";

const ShipmentSelectionContainer = ({ onOpenQuickDRS, shipments, onRefresh }: { onOpenQuickDRS: (shipments: string[]) => void, shipments: any[], onRefresh: () => void }) => {
  const [selected, setSelected] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = shipments.filter(s =>
    s.awb.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.receiver?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="mt-6">
      <ShipmentSelection
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedShipments={selected}
        onToggleShipment={(s) => {
          if (selected.find(x => x.awb === s.awb)) {
            setSelected(selected.filter(x => x.awb !== s.awb));
          } else {
            setSelected([...selected, s]);
          }
        }}
        filteredShipments={filtered}
        onRefresh={onRefresh}
      />
      {selected.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <Button
            size="lg"
            className="shadow-xl rounded-full px-8 h-14 text-lg font-semibold gap-2 transition-all hover:scale-105"
            onClick={() => onOpenQuickDRS(selected.map(s => s.awb))}
          >
            <Truck className="h-5 w-5" />
            Create DRS ({selected.length})
          </Button>
        </div>
      )}
    </div>
  );
};

const CreateDRS = () => {
  /* State */
  const [createdDRSList, setCreatedDRSList] = useState<any[]>([]);
  const [isQuickDRSOpen, setIsQuickDRSOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showAvailableShipments, setShowAvailableShipments] = useState(false);
  const [editingDRS, setEditingDRS] = useState<any>(null);
  const [initialShipments, setInitialShipments] = useState<string[]>([]);
  // Available Shipments State
  const [availableShipments, setAvailableShipments] = useState<any[]>([]);
  const [expandedDRS, setExpandedDRS] = useState<string | null>(null);
  const [directCompleteRefreshTrigger, setDirectCompleteRefreshTrigger] = useState(0);
  const [showAllDRS, setShowAllDRS] = useState(false);

  // Tracking Dialog State
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingShipment, setTrackingShipment] = useState<any>(null);

  const handleViewTracking = (shipment: any) => {
    setTrackingShipment(shipment);
    setTrackingOpen(true);
  };

  const triggerDirectCompleteRefresh = () => setDirectCompleteRefreshTrigger(prev => prev + 1);

  const fetchAvailableShipments = async () => {
    try {
      const res = await fetch('/api/shipments?status=not_scheduled', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAvailableShipments(data);
      }
    } catch (e) {
      console.error("Failed to fetch shipments", e);
    }
  };

  const handleOpenQuickDRS = (shipments: string[]) => {
    setInitialShipments(shipments);
    setIsQuickDRSOpen(true);
  };

  const fetchDRSList = async () => {
    try {
      const res = await fetch('/api/drs/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((d: any) => ({
          id: d._id,
          drsNumber: d.drsId,
          rider: d.rider || { name: 'Unknown', phone: 'N/A' },
          vehicleMode: d.vehicleMode,
          pincodes: d.pincodes || [],
          shipments: d.shipments, // Pass full array of objects
          stats: d.stats || { totalShipments: 0, totalCOD: 0 },
          status: d.status,
          date: new Date(d.createdAt).toLocaleDateString(),
          scheduledDate: d.scheduledDate // Ensure this is mapped
        }));
        setCreatedDRSList(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch DRS list", e);
      toast.error("Failed to load DRS list");
    }
  };

  useEffect(() => {
    fetchDRSList();
    fetchAvailableShipments();
  }, []);

  // Calculate stats
  const drsStats = {
    totalShipments: createdDRSList.reduce((sum, drs) => sum + drs.stats.totalShipments, 0),
    totalCOD: createdDRSList.reduce((sum, drs) => sum + drs.stats.totalCOD, 0),
    totalWeight: 0,
    priorityShipments: 0,
  };

  const handleEditDRS = (drs: any) => {
    setEditingDRS({ ...drs });
    setIsReadOnly(false);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (drs: any) => {
    setEditingDRS({ ...drs });
    setIsReadOnly(true); // Enable read-only mode
    setIsEditDialogOpen(true);
  };

  const handleDeleteDRS = async (id: string) => {
    if (!confirm('Are you sure you want to delete this DRS? This will remove it from rider\'s dashboard as well.')) return;

    try {
      const res = await fetch(`/api/drs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        toast.success('DRS deleted successfully');
        fetchDRSList(); // Refresh list
        fetchAvailableShipments(); // Refresh available pool
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete DRS');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error');
    }
  };

  const handlePauseDRS = async (id: string) => {
    try {
      const res = await fetch(`/api/drs/${id}/pause`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`DRS paused (${data.pauseType} level)`);
        fetchDRSList();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to pause DRS');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error');
    }
  };

  const handleResumeDRS = async (id: string) => {
    try {
      const res = await fetch(`/api/drs/${id}/resume`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        toast.success('DRS resumed successfully');
        fetchDRSList();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to resume DRS');
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error');
    }
  };

  const handleApproveDelivery = async (drsId: string, awb: string, type: string = 'standard') => {
    try {
      const payload = { awb, type };
      const res = await fetch(`/api/drs/${drsId}/approve-delivery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(type === 'direct' ? "Directly Completed" : "Delivery Approved");
        fetchDRSList();
        triggerDirectCompleteRefresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to approve");
      }
    } catch (error) {
      toast.error("Error approving delivery");
    }
  };

  const handleApproveAll = async (drsId: string, type: string = 'standard') => {
    const msg = type === 'direct'
      ? "DIRECT APPROVE ALL pending shipments? This assumes branch delivery (bypassing rider)."
      : "Approve ALL pending deliveries in this DRS (Rider delivered)?";

    if (!confirm(msg)) return;
    try {
      const res = await fetch(`/api/drs/${drsId}/approve-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ type })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message);
        fetchDRSList();
        triggerDirectCompleteRefresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to approve all");
      }
    } catch (error) {
      toast.error("Error approving deliveries");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <DRSHeader onQuickCreate={() => setIsQuickDRSOpen(true)} />
      <DRSStats stats={drsStats} />

      {/* Created DRS Table */}
      <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Created DRS List
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Manage your delivery run sheets
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAvailableShipments(!showAvailableShipments)}
          >
            <List className="h-4 w-4 mr-2" />
            {showAvailableShipments ? "Hide" : "Show"} Available Shipments
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[180px]">DRS No</TableHead>
                <TableHead>Rider Info</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Pincodes</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {createdDRSList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground">No DRS created yet. Click "Quick DRS" to create one.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (showAllDRS ? createdDRSList : createdDRSList.slice(0, 8)).map((drs) => (
                  <Fragment key={drs.id}>
                    <TableRow className="group hover:bg-muted/20">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => setExpandedDRS(expandedDRS === drs.id ? null : drs.id)}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${expandedDRS === drs.id ? 'rotate-180' : ''}`} />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-primary/10 p-2 text-primary">
                            <Truck className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {drs.drsNumber}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium text-foreground">
                              {drs.rider.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {drs.rider.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {drs.vehicleMode}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {drs.pincodes.slice(0, 2).map((pin: string) => (
                            <Badge key={pin} variant="secondary" className="text-xs">
                              {pin}
                            </Badge>
                          ))}
                          {drs.pincodes.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{drs.pincodes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Package className="h-3 w-3" />
                              {drs.stats.totalShipments}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={drs.status === "completed" ? "success" : "secondary"}
                          className="rounded-full capitalize"
                        >
                          {drs.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {drs.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                          {drs.scheduledDate ? new Date(drs.scheduledDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {drs.status !== 'completed' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary"
                              onClick={() => handleEditDRS(drs)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl">
                              {(() => {
                                const hasPending = drs.shipments?.some((s: any) => s.status !== 'completed' && s.status !== 'delivered');
                                return hasPending && (
                                  <>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 rounded-lg text-blue-600 font-medium"
                                      onClick={() => handleApproveAll(drs.id, 'standard')}
                                    >
                                      <Truck className="h-4 w-4" />
                                      Approve All (Rider)
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="flex items-center gap-2 rounded-lg text-green-600 font-medium"
                                      onClick={() => handleApproveAll(drs.id, 'direct')}
                                    >
                                      <Zap className="h-4 w-4" />
                                      Approve All (Direct)
                                    </DropdownMenuItem>
                                  </>
                                );
                              })()}
                              {drs.status === 'completed' && (
                                <DropdownMenuItem className="flex items-center gap-2 rounded-lg" onClick={() => handleViewDetails(drs)}>
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                              )}
                              {(drs.status === 'in_progress' || drs.status === 'scheduled') && (
                                <DropdownMenuItem
                                  className="flex items-center gap-2 rounded-lg text-orange-600"
                                  onClick={() => handlePauseDRS(drs.id)}
                                >
                                  <Pause className="h-4 w-4" />
                                  Pause DRS
                                </DropdownMenuItem>
                              )}
                              {drs.status === 'paused' && (
                                <DropdownMenuItem
                                  className="flex items-center gap-2 rounded-lg text-green-600"
                                  onClick={() => handleResumeDRS(drs.id)}
                                >
                                  <Play className="h-4 w-4" />
                                  Resume DRS
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                                <FileText className="h-4 w-4" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 rounded-lg text-destructive"
                                onClick={() => handleDeleteDRS(drs.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete DRS
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedDRS === drs.id && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={10} className="p-4">
                          <div className="rounded-lg border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                            <div className="mb-3 flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-foreground">Shipment Details ({drs.shipments?.length || 0})</h4>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                              <Table>
                                <TableHeader className="bg-muted/50">
                                  <TableRow>
                                    <TableHead className="h-8 text-xs">AWB</TableHead>
                                    <TableHead className="h-8 text-xs">Pincode</TableHead>
                                    <TableHead className="h-8 text-xs">Status</TableHead>
                                    <TableHead className="h-8 text-xs">Inward Date</TableHead>
                                    <TableHead className="h-8 text-xs">Completed At</TableHead>
                                    <TableHead className="h-8 text-xs text-right">Action</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {drs.shipments?.map((ship: any, idx: number) => {
                                    const isPending = ship.status === 'pending_for_branch_approval' || ship.status === 'pending_approval';
                                    const isNotCompleted = ship.status !== 'completed' && ship.status !== 'delivered';

                                    return (
                                      <TableRow key={idx} className="h-10 hover:bg-transparent">
                                        <TableCell className="text-sm font-medium">{ship.awb}</TableCell>
                                        <TableCell className="text-xs">{ship.receiver?.pincode || '-'}</TableCell>
                                        <TableCell>
                                          <Badge
                                            variant={ship.status === 'completed' ? 'success' : isPending ? 'outline' : ship.status === 'paused' ? 'destructive' : 'secondary'}
                                            className={cn("text-[10px] h-5", isPending && "border-blue-500 text-blue-600 bg-blue-50")}
                                          >
                                            {isPending ? 'Pending Approval' : ship.status === 'paused' && drs.status === 'paused' ? 'Paused' : (ship.status === 'completed' ? 'Delivered' : ship.status || 'pending')}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                          {ship.createdAt ? new Date(ship.createdAt).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                          {ship.deliveredAt ? new Date(ship.deliveredAt).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex gap-2 justify-end">
                                            {/* Eye Icon */}
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-6 w-6 p-0 text-blue-600"
                                              onClick={() => handleViewTracking(ship)}
                                            >
                                              <Eye className="h-4 w-4" />
                                            </Button>

                                            {isNotCompleted && (
                                              <>
                                                {/* Direct Approve */}
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  className="h-6 w-6 p-0 text-green-600"
                                                  title="Direct Complete"
                                                  onClick={() => handleApproveDelivery(drs.id, ship.awb, 'direct')}
                                                >
                                                  <Zap className="h-4 w-4" />
                                                </Button>

                                                {isPending && (
                                                  <Button
                                                    size="sm"
                                                    className="h-6 text-[10px] bg-blue-600 hover:bg-blue-700 text-white"
                                                    onClick={() => handleApproveDelivery(drs.id, ship.awb, 'standard')}
                                                  >
                                                    Approve (Rider)
                                                  </Button>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                            {(() => {
                              const pendingCount = drs.shipments?.filter((s: any) => s.status === 'pending_for_branch_approval' || s.status === 'pending_approval').length || 0;
                              return pendingCount > 0 && (
                                <div className="mt-3 flex justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                                    onClick={() => handleApproveAll(drs.id)}
                                  >
                                    Approve All Pending ({pendingCount})
                                  </Button>
                                </div>
                              );
                            })()}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                )))}
            </TableBody>
          </Table>
          {createdDRSList.length > 8 && (
            <div className="p-4 flex justify-center border-t border-border/50 bg-muted/5">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 font-medium gap-2"
                onClick={() => setShowAllDRS(!showAllDRS)}
              >
                {showAllDRS ? (
                  <>
                    <ChevronDown className="h-4 w-4 rotate-180" />
                    Show Recent (8)
                  </>
                ) : (
                  <>
                    <List className="h-4 w-4" />
                    Show All DRS ({createdDRSList.length})
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Shipments (Collapsible) */}
      {
        showAvailableShipments && (
          <ShipmentSelectionContainer
            onOpenQuickDRS={handleOpenQuickDRS}
            shipments={availableShipments}
            onRefresh={fetchAvailableShipments}
          />
        )
      }

      {/* Quick DRS Dialog */}
      <QuickDRSDialog
        open={isQuickDRSOpen}
        onOpenChange={setIsQuickDRSOpen}
        onSuccess={() => {
          fetchDRSList();
          fetchAvailableShipments();
          triggerDirectCompleteRefresh();
        }}
        initialShipments={initialShipments}
        availableShipments={availableShipments}
      />

      {/* Edit DRS Dialog - Shared Component */}
      <EditDRSDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        drs={editingDRS}
        onSuccess={() => {
          fetchDRSList();
          fetchAvailableShipments();
          triggerDirectCompleteRefresh();
        }}
        readOnly={isReadOnly}
      />

      {/* Direct Complete Shipments Section */}
      <div className="mt-8 border-t pt-8">
        <DirectCompleteTable onRefreshTrigger={directCompleteRefreshTrigger} />
      </div>

      <TrackingDialog
        open={trackingOpen}
        onOpenChange={setTrackingOpen}
        shipment={trackingShipment}
      />
    </div >
  );
};

export default CreateDRS;
