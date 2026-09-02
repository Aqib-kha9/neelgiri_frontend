"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Package2, TruckIcon, RefreshCw, Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tripApi, masterApi } from "@/lib/api-services";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DispatchConsolePage() {
  const router = useRouter();
  const [manifests, setManifests] = useState<any[]>([]);
  const [bags, setBags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("own");
  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [marketVehicleNumber, setMarketVehicleNumber] = useState("");
  const [marketDriverName, setMarketDriverName] = useState("");
  const [marketDriverPhone, setMarketDriverPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Master Data states
  const [masterVehicles, setMasterVehicles] = useState<any[]>([]);
  const [masterDrivers, setMasterDrivers] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [manifestsRes, bagsRes, vehiclesRes, driversRes] = await Promise.all([
        fetch('/api/manifests?status=open&status=closed&status=vehicle_assigned&status=in_transit', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/bags?status=open&status=sealed&status=dispatched', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        masterApi.getVehicles().catch(() => ({ data: [] })),
        masterApi.getDrivers().catch(() => ({ data: [] }))
      ]);

      if (manifestsRes.ok) {
        const data = await manifestsRes.json();
        setManifests(data);
      }
      if (bagsRes.ok) {
        const data = await bagsRes.json();
        setBags(data);
      }
      
      setMasterVehicles(Array.isArray(vehiclesRes) ? vehiclesRes : (vehiclesRes as any).data || []);
      setMasterDrivers(Array.isArray(driversRes) ? driversRes : (driversRes as any).data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to refresh dispatch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManifest) return;
    
    if (activeTab === "own" && !vehicleId) {
      toast.error("Please select a vehicle from the fleet.");
      return;
    }
    if (activeTab === "market" && !marketVehicleNumber) {
      toast.error("Please enter the market vehicle number.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        originBranchId: selectedManifest.sourceBranch?._id || selectedManifest.sourceBranch,
        destinationBranchId: selectedManifest.destinationBranch?._id || selectedManifest.destinationBranch,
        manifestIds: [selectedManifest._id],
      };

      if (activeTab === "own") {
        payload.vehicleId = vehicleId;
        payload.driverId = driverId || undefined;
      } else {
        payload.marketVehicleNumber = marketVehicleNumber;
        payload.marketDriverName = marketDriverName || undefined;
        payload.marketDriverPhone = marketDriverPhone || undefined;
      }

      await tripApi.create(payload);
      toast.success("Vehicle assigned and Trip created successfully!");
      setDispatchModalOpen(false);
      setVehicleId("");
      setDriverId("");
      setMarketVehicleNumber("");
      setMarketDriverName("");
      setMarketDriverPhone("");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to assign vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispatch Console</h1>
          <p className="text-muted-foreground">Central control panel for monitoring active shipments and bags in transit.</p>
        </div>
        <Button variant="outline" onClick={fetchData} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Console
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Active Manifests</p>
                <p className="text-3xl font-bold text-blue-900">{manifests.length}</p>
              </div>
              <TruckIcon className="h-10 w-10 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Active Bags</p>
                <p className="text-3xl font-bold text-orange-900">{bags.length}</p>
              </div>
              <Package2 className="h-10 w-10 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="manifests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="manifests" className="gap-2">
            <TruckIcon className="h-4 w-4" />
            Active Manifests
          </TabsTrigger>
          <TabsTrigger value="bags" className="gap-2">
            <Package2 className="h-4 w-4" />
            Active Bags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manifests" className="mt-6">
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-lg">Outbound Manifests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-20 text-muted-foreground animate-pulse">Scanning manifests...</div>
              ) : manifests.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active manifests found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Manifest ID</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manifests.map((m) => (
                      <TableRow key={m._id} className="hover:bg-primary/5 cursor-pointer transition-colors">
                        <TableCell className="font-mono font-medium text-primary">{m.manifestId}</TableCell>
                        <TableCell>{m.sourceBranch?.name || "N/A"}</TableCell>
                        <TableCell>{m.destinationBranch?.name || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{m.stats?.totalShipments || 0} Units</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-600 uppercase text-[10px]">{m.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {['open', 'closed'].includes(m.status) ? (
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => {
                                setSelectedManifest(m);
                                setDispatchModalOpen(true);
                              }}
                              className="bg-primary"
                            >
                              Assign to Trip
                            </Button>
                          ) : (
                            <Button size="sm" variant="secondary" disabled>
                              Assigned
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bags" className="mt-6">
          <Card>
            <CardHeader className="bg-muted/50">
              <CardTitle className="text-lg">Active Bag Movements</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-20 text-muted-foreground animate-pulse">Scanning bags...</div>
              ) : bags.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Package2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active bags found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bag ID</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>AWBs</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bags.map((bag) => (
                      <TableRow key={bag._id} className="hover:bg-primary/5 cursor-pointer transition-colors">
                        <TableCell className="font-mono font-medium text-primary">{bag.bagId}</TableCell>
                        <TableCell>{bag.destinationBranch?.name || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{bag.shipments?.length || 0} AWBs</Badge>
                        </TableCell>
                        <TableCell>{bag.weight} kg</TableCell>
                        <TableCell>
                          <Badge className="bg-blue-600 uppercase text-[10px]">{bag.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {['open', 'sealed'].includes(bag.status) ? (
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => {
                                setSelectedManifest(bag);
                                setDispatchModalOpen(true);
                              }}
                              className="bg-primary"
                            >
                              Assign to Trip
                            </Button>
                          ) : (
                            <Button size="sm" variant="secondary" disabled>
                              Assigned
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dispatch Modal */}
      <Dialog open={dispatchModalOpen} onOpenChange={setDispatchModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Vehicle</DialogTitle>
            <DialogDescription>
              Create a trip and dispatch Manifest {selectedManifest?.manifestId || selectedManifest?.bagId} immediately.
            </DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="own">Own Fleet</TabsTrigger>
              <TabsTrigger value="market">Market Vehicle</TabsTrigger>
            </TabsList>
            <form onSubmit={handleDispatchSubmit}>
              <TabsContent value="own" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleSelect">Select Vehicle (Required)</Label>
                  <Select value={vehicleId} onValueChange={setVehicleId}>
                    <SelectTrigger id="vehicleSelect">
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterVehicles.length === 0 ? (
                        <SelectItem value="none" disabled>No vehicles available</SelectItem>
                      ) : (
                        masterVehicles.map(v => (
                          <SelectItem key={v._id} value={v._id}>{v.vehicleNumber} ({v.type || 'Truck'})</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverSelect">Select Driver (Optional)</Label>
                  <Select value={driverId} onValueChange={setDriverId}>
                    <SelectTrigger id="driverSelect">
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterDrivers.length === 0 ? (
                        <SelectItem value="none" disabled>No drivers available</SelectItem>
                      ) : (
                        masterDrivers.map(d => (
                          <SelectItem key={d._id} value={d._id}>{d.name} {d.phone ? `(${d.phone})` : ''}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="market" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="marketVehicleNumber">Truck Number (Required)</Label>
                  <Input 
                    id="marketVehicleNumber" 
                    value={marketVehicleNumber} 
                    onChange={(e) => setMarketVehicleNumber(e.target.value)} 
                    placeholder="e.g. MH04X1234" 
                    required={activeTab === 'market'} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketDriverName">Driver Name (Optional)</Label>
                  <Input 
                    id="marketDriverName" 
                    value={marketDriverName} 
                    onChange={(e) => setMarketDriverName(e.target.value)} 
                    placeholder="e.g. Raju Bhai" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketDriverPhone">Driver Phone (Optional)</Label>
                  <Input 
                    id="marketDriverPhone" 
                    value={marketDriverPhone} 
                    onChange={(e) => setMarketDriverPhone(e.target.value)} 
                    placeholder="e.g. 9876543210" 
                  />
                </div>
              </TabsContent>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setDispatchModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Dispatch
                </Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
