"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Search,
  Plus,
  X,
  Building,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { branches, pincodes, serviceAreas } from "./mockData";
import { Branch, Pincode, ServiceArea } from "./types";

const ServiceAreas = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [pincodeSearch, setPincodeSearch] = useState("");
  const [assignedPincodes, setAssignedPincodes] = useState<string[]>([]);
  const [branchFilter, setBranchFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  // Filtered branches based on status
  const filteredBranches = useMemo(() => {
    return branches.filter(
      (branch) => branchFilter === "all" || branch.status === branchFilter
    );
  }, [branchFilter]);

  // Filtered pincodes based on search and city
  const filteredPincodes = useMemo(() => {
    let filtered = pincodes;

    if (cityFilter !== "all") {
      filtered = filtered.filter((p) => p.city.toLowerCase() === cityFilter);
    }

    if (pincodeSearch) {
      filtered = filtered.filter(
        (p) =>
          p.pincode.includes(pincodeSearch) ||
          p.city.toLowerCase().includes(pincodeSearch.toLowerCase()) ||
          p.district.toLowerCase().includes(pincodeSearch.toLowerCase())
      );
    }

    return filtered.slice(0, 10); // Limit to 10 suggestions
  }, [pincodeSearch, cityFilter]);

  // Get selected branch details
  const selectedBranchDetails = useMemo(() => {
    return branches.find((branch) => branch.id === selectedBranch);
  }, [selectedBranch]);

  // Get assigned pincodes for selected branch
  const assignedPincodesDetails = useMemo(() => {
    return pincodes.filter((p) => assignedPincodes.includes(p.pincode));
  }, [assignedPincodes]);

  // Get all service areas for display
  const allServiceAreas = useMemo(() => {
    return serviceAreas.map((sa) => ({
      ...sa,
      branch: branches.find((b) => b.id === sa.branchId),
      pincodeDetails: pincodes.filter((p) => sa.pincodes.includes(p.pincode)),
    }));
  }, []);

  const handleAddPincode = (pincode: string) => {
    if (!assignedPincodes.includes(pincode)) {
      setAssignedPincodes((prev) => [...prev, pincode]);
    }
    setPincodeSearch("");
  };

  const handleRemovePincode = (pincode: string) => {
    setAssignedPincodes((prev) => prev.filter((p) => p !== pincode));
  };

  const handleSaveServiceArea = () => {
    if (!selectedBranch || assignedPincodes.length === 0) return;

    // In real app, this would save to backend
    console.log("Saving service area:", {
      branchId: selectedBranch,
      pincodes: assignedPincodes,
    });

    alert("Service area assigned successfully!");
    setSelectedBranch("");
    setAssignedPincodes([]);
    setPincodeSearch("");
  };

  const cities = useMemo(() => {
    return [...new Set(pincodes.map((p) => p.city))].sort();
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-2">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Service Areas
              </h1>
              <p className="text-muted-foreground">
                Manage branch service areas and delivery pincodes
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-border/70"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Branches
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {branches.length}
                  </span>
                  <Badge variant="success" className="rounded-full text-xs">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Delivery network
                </p>
              </div>
              <div className="rounded-2xl bg-blue-100 p-3">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Service Areas
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {serviceAreas.length}
                  </span>
                  <Badge variant="success" className="rounded-full text-xs">
                    Configured
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Active assignments
                </p>
              </div>
              <div className="rounded-2xl bg-green-100 p-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-orange-50/50 shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Pincodes
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {pincodes.length}
                  </span>
                  <Badge variant="warning" className="rounded-full text-xs">
                    Covered
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Service coverage
                </p>
              </div>
              <div className="rounded-2xl bg-orange-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-purple-50/50 shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Cities Covered
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {cities.length}
                  </span>
                  <Badge variant="info" className="rounded-full text-xs">
                    Cities
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Across India</p>
              </div>
              <div className="rounded-2xl bg-purple-100 p-3">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Panel - Assign Service Areas */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="h-5 w-5 text-primary" />
                Assign Service Area
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Branch Selection */}
              <div className="space-y-2">
                <Label htmlFor="branch">Select Branch *</Label>
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Choose a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {filteredBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        <div className="flex items-center gap-2">
                          <span>{branch.name}</span>
                          <Badge
                            variant={
                              branch.status === "active"
                                ? "success"
                                : "secondary"
                            }
                            className="rounded-full text-xs"
                          >
                            {branch.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBranch && (
                <>
                  {/* Pincode Search */}
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Search Pincodes</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by pincode, city, or district..."
                          value={pincodeSearch}
                          onChange={(e) => setPincodeSearch(e.target.value)}
                          className="pl-10 rounded-lg"
                        />
                      </div>

                      {/* City Filter */}
                      <Select value={cityFilter} onValueChange={setCityFilter}>
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Filter by city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city.toLowerCase()}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pincode Suggestions */}
                  {pincodeSearch && filteredPincodes.length > 0 && (
                    <Card className="rounded-lg border-border/60">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            Suggestions
                          </p>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {filteredPincodes.map((pincode) => (
                              <div
                                key={pincode.pincode}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                                onClick={() =>
                                  handleAddPincode(pincode.pincode)
                                }
                              >
                                <div>
                                  <p className="text-sm font-medium">
                                    {pincode.pincode}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {pincode.city}, {pincode.district},{" "}
                                    {pincode.state}
                                  </p>
                                </div>
                                <Plus className="h-4 w-4 text-muted-foreground" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Assigned Pincodes */}
                  {assignedPincodes.length > 0 && (
                    <div className="space-y-2">
                      <Label>
                        Assigned Pincodes ({assignedPincodes.length})
                      </Label>
                      <div className="rounded-lg border border-border/60 p-3">
                        <div className="flex flex-wrap gap-2">
                          {assignedPincodesDetails.map((pincode) => (
                            <Badge
                              key={pincode.pincode}
                              variant="outline"
                              className="rounded-full pl-3 pr-2 py-1 flex items-center gap-1"
                            >
                              {pincode.pincode}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() =>
                                  handleRemovePincode(pincode.pincode)
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <Button
                    className="w-full gap-2 rounded-lg bg-green-600 hover:bg-green-700"
                    onClick={handleSaveServiceArea}
                    disabled={assignedPincodes.length === 0}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Assign Service Area
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Current Service Areas */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5 text-primary" />
                Current Service Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allServiceAreas.length > 0 ? (
                  allServiceAreas.map((serviceArea) => (
                    <Card
                      key={serviceArea.branchId}
                      className="rounded-xl border-border/60"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-primary/10 p-2">
                                <Building className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {serviceArea.branch?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {serviceArea.branch?.city},{" "}
                                  {serviceArea.branch?.state}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="success"
                              className="rounded-full text-xs"
                            >
                              {serviceArea.pincodes.length} pincodes
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {serviceArea.pincodeDetails.map((pincode) => (
                              <Badge
                                key={pincode.pincode}
                                variant="outline"
                                className="rounded-full text-xs"
                              >
                                {pincode.pincode}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Assigned by: {serviceArea.assignedBy}</span>
                            <span>
                              {new Date(
                                serviceArea.assignedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      No service areas assigned yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Start by assigning pincodes to branches
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-5 w-5 text-primary" />
                Coverage Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cities.slice(0, 5).map((city) => {
                  const cityPincodes = pincodes.filter((p) => p.city === city);
                  const coveredPincodes = serviceAreas.flatMap(
                    (sa) => sa.pincodes
                  );
                  const coveredCount = cityPincodes.filter((p) =>
                    coveredPincodes.includes(p.pincode)
                  ).length;

                  return (
                    <div
                      key={city}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-foreground">{city}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {coveredCount}/{cityPincodes.length}
                        </span>
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (coveredCount / cityPincodes.length) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreas;
