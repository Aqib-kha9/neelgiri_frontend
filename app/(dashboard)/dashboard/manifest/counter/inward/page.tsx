"use client";

import { useState, useEffect, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, ArrowDownLeft, ChevronDown, ChevronUp, CheckCircle2, Eye } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrackingDialog } from "@/components/shared/TrackingDialog";

export default function InwardProcessingPage() {
  console.log('🔍 [INWARD PAGE] Component Mounted!');

  const [manifests, setManifests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedManifestId, setExpandedManifestId] = useState<string | null>(null);
  const [confirmingShipments, setConfirmingShipments] = useState<Set<string>>(new Set());

  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingShipment, setTrackingShipment] = useState<any>(null);

  const handleViewTracking = (shipment: any) => {
    setTrackingShipment(shipment);
    setTrackingOpen(true);
  };

  useEffect(() => {
    console.log('🔍 [INWARD PAGE] useEffect triggered');
    fetchManifests();
  }, []);

  const fetchManifests = async () => {
    try {
      console.log('🔍 [INWARD PAGE] Starting fetch...');
      setLoading(true);

      const url = '/api/manifests?type=inward&status=in_transit';
      console.log('🔍 [INWARD PAGE] Fetching from:', url);

      const token = localStorage.getItem('token');
      console.log('🔍 [INWARD PAGE] Token exists:', !!token);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('🔍 [INWARD PAGE] Response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('✅ [INWARD PAGE] Success! Manifests:', data);
        console.log('✅ [INWARD PAGE] Count:', data.length);
        setManifests(data);
      } else {
        console.error('❌ [INWARD PAGE] API Error:', res.status);
        toast.error(`Failed to load manifests: ${res.status}`);
      }
    } catch (error) {
      console.error('❌ [INWARD PAGE] Fetch Error:', error);
      toast.error("Failed to load inward manifests");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmInward = async (shipmentId: string, manifestId: string) => {
    try {
      setConfirmingShipments(prev => new Set(prev).add(shipmentId));

      const res = await fetch('/api/shipments/confirm-inward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ shipmentId, manifestId })
      });

      if (res.ok) {
        toast.success("Shipment inward confirmed!");
        // Refresh manifests to update status
        fetchManifests();
      } else {
        toast.error("Failed to confirm inward");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error confirming inward");
    } finally {
      setConfirmingShipments(prev => {
        const newSet = new Set(prev);
        newSet.delete(shipmentId);
        return newSet;
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inward Processing</h1>
          <p className="text-muted-foreground">Monitor manifests arriving at your branch.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchManifests} disabled={loading}>
          <Truck className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ArrowDownLeft className="h-5 w-5 text-primary" />
            Incoming Manifests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : manifests.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold">No incoming manifests</p>
              <p className="text-sm">When other branches send manifests to you, they will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Manifest ID</TableHead>
                  <TableHead>From Branch</TableHead>
                  <TableHead>Shipments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manifests.map((m) => {
                  const isExpanded = expandedManifestId === m._id;

                  return (
                    <Fragment key={m._id}>
                      <TableRow className={cn("hover:bg-primary/5 transition-colors group", isExpanded && "bg-muted/30")}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedManifestId(isExpanded ? null : m._id)}
                            className="h-8 w-8 p-0"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-mono font-semibold text-primary">
                          {m.manifestId}
                        </TableCell>
                        <TableCell>{m.sourceBranch?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{m.shipments?.length || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{m.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>

                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/20 p-0">
                            <div className="p-4">
                              <h4 className="font-semibold mb-3 text-sm">Shipments in this Manifest:</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>AWB</TableHead>
                                    <TableHead>Receiver</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {m.shipments && m.shipments.length > 0 ? (
                                    m.shipments.map((shipment: any) => {
                                      const isConfirming = confirmingShipments.has(shipment._id);
                                      // STRICT RULE: Show "Confirm Inward" button ONLY when status is "in_transit"
                                      // Once confirmed, status changes to "received" or "not_scheduled"
                                      // After that, even if status becomes "scheduled", "in_progress", etc. due to DRS,
                                      // we should NEVER show the Confirm Inward button again
                                      const isInwardPending = shipment.status === 'in_transit';
                                      const isInwardCompleted = !isInwardPending;

                                      return (
                                        <TableRow key={shipment._id}>
                                          <TableCell className="font-mono text-sm">
                                            {shipment.awb}
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex flex-col">
                                              <span className="font-medium">{shipment.receiver?.name || 'N/A'}</span>
                                              <span className="text-xs text-muted-foreground">{shipment.receiver?.phone}</span>
                                            </div>
                                          </TableCell>
                                          <TableCell>{shipment.weight || 0} kg</TableCell>
                                          <TableCell>
                                            <Badge variant={isInwardCompleted ? "default" : "secondary"}>
                                              {shipment.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => handleViewTracking(shipment)}
                                                title="View Tracking Details"
                                              >
                                                <Eye className="h-4 w-4" />
                                              </Button>

                                              {isInwardCompleted ? (
                                                <Button variant="ghost" size="sm" disabled>
                                                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                                  Inward Completed
                                                </Button>
                                              ) : (
                                                <Button
                                                  variant="default"
                                                  size="sm"
                                                  onClick={() => handleConfirmInward(shipment._id, m._id)}
                                                  disabled={isConfirming}
                                                >
                                                  {isConfirming ? 'Confirming...' : 'Confirm Inward'}
                                                </Button>
                                              )}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No shipments in this manifest
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
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

      <TrackingDialog
        open={trackingOpen}
        onOpenChange={setTrackingOpen}
        shipment={trackingShipment}
      />
    </div>
  );
}
