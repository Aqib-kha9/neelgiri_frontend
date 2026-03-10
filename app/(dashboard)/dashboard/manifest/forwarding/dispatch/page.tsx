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
import { Package, Package2, TruckIcon, RefreshCw, Layers } from "lucide-react";
import { toast } from "sonner";

export default function DispatchConsolePage() {
  const [manifests, setManifests] = useState<any[]>([]);
  const [bags, setBags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [manifestsRes, bagsRes] = await Promise.all([
        fetch('/api/manifests?status=created,forwarded,in_transit', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/bags?status=open,sealed,dispatched', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (manifestsRes.ok) {
        const data = await manifestsRes.json();
        setManifests(data);
      }
      if (bagsRes.ok) {
        const data = await bagsRes.json();
        setBags(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to refresh dispatch data");
    } finally {
      setLoading(false);
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
                          <Button size="sm" variant="ghost">View</Button>
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
                          <Button size="sm" variant="ghost">View</Button>
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
    </div>
  );
}
