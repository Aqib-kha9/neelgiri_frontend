"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

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
import {
  Branch,
  Pincode,
  ServiceArea,
  mapBackendBranch,
  mapBackendPincode,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";
const PINCODE_PAGE_SIZE = 500;

const fetchAllMappedPincodes = async (
  headers: Record<string, string>
): Promise<Pincode[]> => {
  const firstResponse = await axios.get(`${API_BASE}/api/pincodes`, {
    params: { mapping: "mapped", page: 1, limit: PINCODE_PAGE_SIZE },
    headers,
  });
  const firstPage = firstResponse.data?.pincodes || [];
  const pageCount = Math.max(Number(firstResponse.data?.pages) || 1, 1);

  const remainingResponses = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      axios.get(`${API_BASE}/api/pincodes`, {
        params: {
          mapping: "mapped",
          page: index + 2,
          limit: PINCODE_PAGE_SIZE,
        },
        headers,
      })
    )
  );

  return [
    ...firstPage,
    ...remainingResponses.flatMap(
      (response) => response.data?.pincodes || []
    ),
  ].map(mapBackendPincode);
};

const ServiceAreas = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [mappedPincodes, setMappedPincodes] = useState<Pincode[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [pincodeSearch, setPincodeSearch] = useState("");
  const [assignedPincodes, setAssignedPincodes] = useState<string[]>([]);
  const [branchFilter, setBranchFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [branchesRes, pincodesRes, allMappedPincodes] = await Promise.all([
        axios.get(`${API_BASE}/api/branches`, { headers }),
        axios.get(`${API_BASE}/api/pincodes`, {
          params: { page: 1, limit: PINCODE_PAGE_SIZE },
          headers,
        }),
        fetchAllMappedPincodes(headers),
      ]);

      const branchList = Array.isArray(branchesRes.data) ? branchesRes.data : [];
      const mappedBranches = branchList.map(mapBackendBranch);
      setBranches(mappedBranches);

      const pincodeList = pincodesRes.data?.pincodes || pincodesRes.data || [];
      const mappedPincodes = (Array.isArray(pincodeList) ? pincodeList : []).map(
        mapBackendPincode
      );
      setPincodes(mappedPincodes);
      setMappedPincodes(allMappedPincodes);

      const codesByBranch = new Map<string, Set<string>>();
      allMappedPincodes.forEach((pincode) => {
        if (!pincode.branchId || !pincode.pincode) return;
        if (!codesByBranch.has(pincode.branchId)) {
          codesByBranch.set(pincode.branchId, new Set());
        }
        codesByBranch.get(pincode.branchId)!.add(pincode.pincode);
      });

      setServiceAreas(
        Array.from(codesByBranch, ([branchId, codes]) => ({
          branchId,
          pincodes: Array.from(codes).sort(),
          assignedAt: new Date().toISOString(),
          assignedBy: "System",
        }))
      );
    } catch (error) {
      console.error("Failed to load service areas data", error);
      toast.error("Failed to load service areas data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered branches based on status
  const filteredBranches = useMemo(() => {
    return branches.filter(
      (branch) => branchFilter === "all" || branch.status === branchFilter
    );
  }, [branches, branchFilter]);

  const selectedBranchDetails = useMemo(() => {
    return branches.find((branch) => branch.id === selectedBranch);
  }, [branches, selectedBranch]);

  // Search the complete pincode master for the selected branch's geography.
  useEffect(() => {
    const search = pincodeSearch.trim();
    if (!selectedBranchDetails || search.length < 2) return;

    const timeoutId = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE}/api/pincodes/global-search`, {
          params: {
            q: search,
            state: selectedBranchDetails.state || undefined,
            limit: 10,
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        const remotePincodes = (response.data?.pincodes || []).map(
          mapBackendPincode
        );
        setPincodes((current) => {
          const byId = new Map(current.map((pincode) => [pincode.id, pincode]));
          remotePincodes.forEach((pincode: Pincode) => {
            if (pincode.id) byId.set(pincode.id, pincode);
          });
          return Array.from(byId.values());
        });
      } catch (error) {
        console.error("Failed to search pincodes", error);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [pincodeSearch, selectedBranchDetails]);

  // Filtered pincodes based on search, selected branch geography, and city filter
  const filteredPincodes = useMemo(() => {
    let filtered = pincodes;
    const branchState = selectedBranchDetails?.state.trim().toLowerCase();

    if (branchState) {
      filtered = filtered.filter((p) => p.state.trim().toLowerCase() === branchState);
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter(
        (p) =>
          p.city.trim().toLowerCase() === cityFilter ||
          p.district.trim().toLowerCase() === cityFilter
      );
    }

    if (pincodeSearch) {
      const search = pincodeSearch.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.pincode.includes(search) ||
          p.city.toLowerCase().includes(search) ||
          p.district.toLowerCase().includes(search)
      );
    }

    return filtered.slice(0, 10);
  }, [pincodes, pincodeSearch, cityFilter, selectedBranchDetails]);

  const allServiceAreas = useMemo(() => {
    return serviceAreas.map((serviceArea) => ({
      ...serviceArea,
      branch: branches.find((branch) => branch.id === serviceArea.branchId),
    }));
  }, [serviceAreas, branches]);

  const coveredPincodeCount = useMemo(
    () => new Set(mappedPincodes.map((pincode) => pincode.pincode)).size,
    [mappedPincodes]
  );

  const handleAddPincode = (pincode: string) => {
    if (!assignedPincodes.includes(pincode)) {
      setAssignedPincodes((prev) => [...prev, pincode]);
    }
    setPincodeSearch("");
  };

  const handleRemovePincode = (pincode: string) => {
    setAssignedPincodes((prev) => prev.filter((p) => p !== pincode));
  };

  const handleSaveServiceArea = async () => {
    if (!selectedBranch || assignedPincodes.length === 0) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Find pincode IDs for the assigned pincodes
      const pincodeIds = pincodes
        .filter((p) => assignedPincodes.includes(p.pincode) && p.id)
        .map((p) => p.id);

      if (pincodeIds.length === 0) {
        toast.error("Could not find pincode records to assign.");
        return;
      }

      // Use bulk-claim endpoint to assign pincodes to the branch
      await axios.post(
        `${API_BASE}/api/pincodes/bulk-claim`,
        {
          pincodeIds,
          branchId: selectedBranch,
        },
        { headers }
      );

      toast.success(
        `Successfully assigned ${assignedPincodes.length} pincodes to branch!`
      );
      setSelectedBranch("");
      setAssignedPincodes([]);
      setPincodeSearch("");
      // Refresh data
      fetchData();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Failed to assign service area";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const cities = useMemo(() => {
    const branchState = selectedBranchDetails?.state.trim().toLowerCase();
    return [
      ...new Set(
        pincodes
          .filter(
            (p) =>
              !branchState || p.state.trim().toLowerCase() === branchState
          )
          .map((p) => p.city || p.district)
          .filter(Boolean)
      ),
    ].sort();
  }, [pincodes, selectedBranchDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">
          Loading service areas...
        </span>
      </div>
    );
  }

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
            onClick={() => fetchData()}
          >
            <Download className="h-4 w-4" />
            Refresh
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
                  Covered Pincodes
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {coveredPincodeCount}
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
                  onValueChange={(branchId) => {
                    setSelectedBranch(branchId);
                    setPincodeSearch("");
                    setCityFilter("all");
                    setAssignedPincodes([]);
                  }}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Choose a branch" />
                  </SelectTrigger>
                  <SelectContent>
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
                  {searchLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching {selectedBranchDetails?.state || "the selected branch area"} pincodes...
                    </div>
                  ) : pincodeSearch && filteredPincodes.length > 0 ? (
                    <Card className="rounded-lg border-border/60">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            Suggestions
                          </p>
                          <div className="space-y-1 max-h-40 overflow-y-auto">
                            {filteredPincodes.map((pincode) => (
                              <div
                                key={pincode.id}
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
                  ) : null}

                  {/* Assigned Pincodes */}
                  {assignedPincodes.length > 0 && (
                    <div className="space-y-2">
                      <Label>
                        Assigned Pincodes ({assignedPincodes.length})
                      </Label>
                      <div className="rounded-lg border border-border/60 p-3">
                        <div className="flex flex-wrap gap-2">
                          {assignedPincodes.map((pincode) => (
                            <Badge
                              key={`${selectedBranch}-${pincode}`}
                              variant="outline"
                              className="rounded-full pl-3 pr-2 py-1 flex items-center gap-1"
                            >
                              {pincode}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => handleRemovePincode(pincode)}
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
                    disabled={assignedPincodes.length === 0 || saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {saving ? "Assigning..." : "Assign Service Area"}
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
                                  {serviceArea.branch?.name || "Unknown Branch"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {serviceArea.branch?.city || "—"},{" "}
                                  {serviceArea.branch?.state || "—"}
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
                            {serviceArea.pincodes.map((pincode) => (
                              <Badge
                                key={`${serviceArea.branchId}-${pincode}`}
                                variant="outline"
                                className="rounded-full text-xs"
                              >
                                {pincode}
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
                  const cityPincodes = pincodes.filter(
                    (p) => p.city === city || p.district === city
                  );
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
                              width: `${cityPincodes.length > 0
                                ? (coveredCount / cityPincodes.length) * 100
                                : 0
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
