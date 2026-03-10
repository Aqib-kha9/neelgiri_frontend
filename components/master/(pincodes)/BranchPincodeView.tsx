// components/master/(pincodes)/BranchPincodeView.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    MapPin,
    Search,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Building2,
    AlertTriangle,
    Plus,
    Clock,
    Loader2,
    Globe,
    Trash2,
    Edit2
} from "lucide-react";
import { Pincode } from "./types";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Branch {
    _id: string;
    name: string;
    code: string;
}

// ─────────────────────────────────────────────
// BranchPincodeView
// ─────────────────────────────────────────────
const BranchPincodeView = () => {
    const { session } = useAuth();
    const roleName = typeof session?.user?.role === 'string'
        ? session?.user?.role
        : (session?.user?.role as any)?.name || "";
    const isPartnerAdmin = ["partner_admin", "partner"].includes(roleName);

    // My Branch Pincodes
    const [myPincodes, setMyPincodes] = useState<Pincode[]>([]);
    const [loadingMy, setLoadingMy] = useState(true);
    const [myPage, setMyPage] = useState(1);
    const [myTotal, setMyTotal] = useState(0);
    const [myTotalPages, setMyTotalPages] = useState(1);
    const [mySearch, setMySearch] = useState("");

    // Global Search / Claim
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Pincode[]>([]);
    const [searching, setSearching] = useState(false);
    const [claimingId, setClaimingId] = useState<string | null>(null);

    // Global Search Pagination
    const [searchPage, setSearchPage] = useState(1);
    const [searchLimit, setSearchLimit] = useState(100);
    const [searchTotalPages, setSearchTotalPages] = useState(1);
    const [searchTotal, setSearchTotal] = useState(0);

    // Bulk Claim State
    const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>([]);
    const [bulkClaiming, setBulkClaiming] = useState(false);

    // Edit State
    const [editingPincode, setEditingPincode] = useState<Pincode | null>(null);
    const [editTransitDays, setEditTransitDays] = useState<number | string>(3);
    const [editIsODA, setEditIsODA] = useState<boolean>(false);
    const [savingEdit, setSavingEdit] = useState(false);

    // For partner_admin: branch selector
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranchId, setSelectedBranchId] = useState<string>("");

    // Global Search Filters
    const [filterState, setFilterState] = useState("all");
    const [filterDistrict, setFilterDistrict] = useState("all");
    const [distinctStates, setDistinctStates] = useState<string[]>([]);
    const [distinctDistricts, setDistinctDistricts] = useState<string[]>([]);

    // ── Fetch Distinct Locations ──────────────────
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get("/api/pincodes/locations/distinct?global=true", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDistinctStates(data.states || []);
                setDistinctDistricts(data.districts || []);
            } catch {
                console.error("Failed to load locations");
            }
        };
        fetchLocations();
    }, []);

    // ── Fetch branches (partner admin only) ─────
    useEffect(() => {
        if (!isPartnerAdmin) return;
        const fetchBranches = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get("/api/branches?scope=partner", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const list: Branch[] = Array.isArray(data) ? data : data.branches || [];
                setBranches(list);
                if (list.length > 0) setSelectedBranchId(list[0]._id);
            } catch {
                toast.error("Could not load branches");
            }
        };
        fetchBranches();
    }, [isPartnerAdmin]);

    // ── Fetch my branch's pincodes ───────────────
    const fetchMyPincodes = useCallback(async () => {
        setLoadingMy(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("/api/pincodes", {
                // Removed isServiceable: true to show all (Active and Inactive) owned pincodes
                params: { page: myPage, limit: 50, search: mySearch },
                headers: { Authorization: `Bearer ${token}` },
            });
            setMyPincodes(data.pincodes || []);
            setMyTotal(data.total || 0);
            setMyTotalPages(data.pages || 1);
        } catch {
            toast.error("Failed to load pincodes");
        } finally {
            setLoadingMy(false);
        }
    }, [myPage, mySearch]);

    useEffect(() => {
        fetchMyPincodes();
    }, [fetchMyPincodes]);

    // ── Global search (debounced) ────────────────
    useEffect(() => {
        if (searchQuery.length < 3 && filterState === "all" && filterDistrict === "all") {
            setSearchResults([]);
            setSelectedClaimIds([]);
            return;
        }
        const timer = setTimeout(async () => {
            setSearching(true);
            setSelectedClaimIds([]);
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get("/api/pincodes/global-search", {
                    params: {
                        q: searchQuery,
                        state: filterState !== "all" ? filterState : undefined,
                        district: filterDistrict !== "all" ? filterDistrict : undefined,
                        page: searchPage,
                        limit: searchLimit
                    },
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSearchResults(data.pincodes || []);
                setSearchTotalPages(data.pages || 1);
                setSearchTotal(data.total || 0);
            } catch {
                toast.error("Search failed");
            } finally {
                setSearching(false);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, filterState, filterDistrict, searchPage, searchLimit]);

    // ── Claim a pincode ───────────────────────────
    const handleClaim = async (pincode: Pincode) => {
        setClaimingId(pincode._id);
        try {
            const token = localStorage.getItem("token");
            const payload: Record<string, any> = {};
            if (isPartnerAdmin && selectedBranchId) {
                payload.branchId = selectedBranchId;
            }
            await axios.post(`/api/pincodes/${pincode._id}/claim`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(`Pincode ${pincode.pincode} added to your branch!`);
            fetchMyPincodes();
            setSearchResults((prev) => prev.filter((p) => p._id !== pincode._id));
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Claim failed");
        } finally {
            setClaimingId(null);
        }
    };

    // ── Bulk Claim ───────────────────────────
    const handleBulkClaim = async () => {
        if (selectedClaimIds.length === 0) return;
        setBulkClaiming(true);
        try {
            const token = localStorage.getItem("token");
            const payload: Record<string, any> = { pincodeIds: selectedClaimIds };
            if (isPartnerAdmin && selectedBranchId) {
                payload.branchId = selectedBranchId;
            }
            const { data } = await axios.post(`/api/pincodes/bulk-claim`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(data.message || `Successfully claimed ${data.claimedCount} pincodes!`);
            fetchMyPincodes();

            // Remove claimed from search results
            setSearchResults((prev) => prev.filter((p) => !selectedClaimIds.includes(p._id)));
            setSelectedClaimIds([]);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Bulk claim failed");
        } finally {
            setBulkClaiming(false);
        }
    };

    // ── Toggle local activity ───────────────────────
    const handleToggle = async (pincode: Pincode) => {
        try {
            const token = localStorage.getItem("token");
            const newStatus = !pincode.isActiveForBranch;
            const { data } = await axios.put(
                `/api/pincodes/${pincode._id}`,
                { isActiveForBranch: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMyPincodes((prev) => prev.map((p) => (p._id === data._id ? { ...p, isActiveForBranch: data.isActiveForBranch } : p)));
            toast.success(`${pincode.pincode} is now ${newStatus ? "Active" : "Off"} for your branch`);
        } catch {
            toast.error("Update failed");
        }
    };

    // ── Release pincode ──────────────────────────
    const handleRelease = async (pincode: Pincode) => {
        if (!confirm(`Are you sure you want to remove ${pincode.pincode} from your branch's serviceability?`)) return;
        try {
            const token = localStorage.getItem("token");
            await axios.post(`/api/pincodes/${pincode._id}/release`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`${pincode.pincode} removed from your branch`);
            fetchMyPincodes();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to release pincode");
        }
    };

    // ── Header ────────────────────────────────────
    const branchLabel = isPartnerAdmin
        ? (branches.find((b) => b._id === selectedBranchId)?.name || "All Branches")
        : (session?.user?.branchName || "My Branch");

    // ── Edit Pincode ──────────────────────────────
    const handleSaveEdit = async () => {
        if (!editingPincode) return;
        setSavingEdit(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.put(`/api/pincodes/${editingPincode._id}`,
                {
                    transitDays: Number(editTransitDays),
                    isODA: editIsODA
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMyPincodes((prev) => prev.map((p) => (p._id === data._id ? { ...p, transitDays: data.transitDays, isODA: data.isODA } : p)));
            setSearchResults((prev) => prev.map((p) => (p._id === data._id ? { ...p, transitDays: data.transitDays, isODA: data.isODA } : p)));
            setEditingPincode(null);
            toast.success("Pincode updated successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update pincode");
        } finally {
            setSavingEdit(false);
        }
    };

    // Computed for bulk selection
    const claimableIds = searchResults
        .filter(p => {
            const alreadyMine = myPincodes.some(mp => mp._id === p._id);
            const takenByOther = !!p.branchId && !alreadyMine;
            return !alreadyMine && !takenByOther;
        })
        .map(p => p._id);

    return (
        <div className="space-y-6 p-6">
            {/* Edit Pincode Dialog */}
            <Dialog open={!!editingPincode} onOpenChange={() => setEditingPincode(null)}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Pincode: {editingPincode?.pincode}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="transitDays" className="text-right">
                                Transit Days
                            </Label>
                            <Input
                                id="transitDays"
                                type="number"
                                value={editTransitDays}
                                onChange={(e) => setEditTransitDays(e.target.value)}
                                className="col-span-3"
                                min="1"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isODA" className="text-right">
                                ODA (Out of Delivery Area)
                            </Label>
                            <Switch
                                id="isODA"
                                checked={editIsODA}
                                onCheckedChange={setEditIsODA}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPincode(null)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} disabled={savingEdit}>
                            {savingEdit ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Header Section */}
            <section className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/95 p-7 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                            <Building2 className="h-3.5 w-3.5" />
                            {branchLabel}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs text-muted-foreground">
                            Branch Coverage
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">My Pincode Coverage</h1>
                    <p className="text-muted-foreground">
                        Manage which pincodes are serviced by your branch.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-3xl font-bold text-primary">{myTotal}</p>
                        <p className="text-xs text-muted-foreground">Active Areas</p>
                    </div>
                </div>
            </section>

            {/* Partner Admin: Branch Selector */}
            {isPartnerAdmin && branches.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sm text-muted-foreground font-medium">Select Branch:</p>
                    <div className="flex gap-2 flex-wrap">
                        {branches.map((b) => (
                            <button
                                key={b._id}
                                onClick={() => setSelectedBranchId(b._id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${selectedBranchId === b._id
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card border-border/60 text-muted-foreground hover:border-primary/40"
                                    }`}
                            >
                                {b.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Tabs */}
            <Tabs defaultValue="active">
                <TabsList className="rounded-xl">
                    <TabsTrigger value="active" className="gap-2">
                        <CheckCircle2 className="h-4 w-4" /> My Active Pincodes
                    </TabsTrigger>
                    <TabsTrigger value="search" className="gap-2">
                        <Plus className="h-4 w-4" /> Search &amp; Add
                    </TabsTrigger>
                </TabsList>

                {/* ── Tab 1: My Active Pincodes ── */}
                <TabsContent value="active" className="mt-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search pincodes in your branch..."
                                value={mySearch}
                                onChange={(e) => { setMySearch(e.target.value); setMyPage(1); }}
                                className="pl-9 rounded-xl border-border/60"
                            />
                        </div>
                    </div>

                    {loadingMy ? (
                        <div className="flex items-center justify-center py-16 text-muted-foreground animate-pulse gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" /> Loading your pincodes...
                        </div>
                    ) : myPincodes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 rounded-3xl border border-dashed border-border/70 bg-card/50 gap-3">
                            <div className="p-4 bg-muted/50 rounded-full">
                                <MapPin className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <p className="font-semibold text-lg">No pincodes assigned yet</p>
                            <p className="text-muted-foreground text-sm">
                                Use the &quot;Search &amp; Add&quot; tab to claim pincodes for your branch.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-border/60 bg-card/95 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow className="hover:bg-transparent border-border/60">
                                        <TableHead className="font-semibold text-muted-foreground w-[120px]">Pincode</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground">Location</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground w-[110px]">Branch</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground w-[80px]">Zone</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground w-[80px]">Transit</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground w-[120px]">Status</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground w-[60px] text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {myPincodes.map((p) => (
                                        <TableRow key={p._id} className="hover:bg-muted/30 border-border/50 group">
                                            <TableCell className="font-mono font-semibold text-base">{p.pincode}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">{p.officeName || "—"}</span>
                                                    <span className="text-xs text-muted-foreground">{p.district}, {p.state}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {p.branchId ? (
                                                    <div className="flex items-center gap-1.5 text-sm">
                                                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <span className="text-muted-foreground font-medium">{p.branchId.name || "Default"}</span>
                                                    </div>
                                                ) : "—"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs rounded-full">{p.zone}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {p.transitDays ?? 3}d
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {!p.isServiceable ? (
                                                    <Badge variant="outline" className="bg-red-50 text-red-500 border-red-100 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                                        <AlertTriangle className="h-3 w-3" /> Suspended
                                                    </Badge>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={p.isActiveForBranch}
                                                            onCheckedChange={() => handleToggle(p)}
                                                            className="scale-90 data-[state=checked]:bg-green-500"
                                                        />
                                                        <span className={`text-xs font-medium ${p.isActiveForBranch ? "text-green-600" : "text-muted-foreground"}`}>
                                                            {p.isActiveForBranch ? "Active" : "Off"}
                                                        </span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[170px] rounded-xl">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => {
                                                            setEditingPincode(p);
                                                            setEditTransitDays(p.transitDays || 3);
                                                            setEditIsODA(p.isODA || false);
                                                        }} disabled={!p.isServiceable}>
                                                            <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleToggle(p)} disabled={!p.isServiceable}>
                                                            {p.isActiveForBranch ? (
                                                                <><XCircle className="mr-2 h-4 w-4 text-orange-500" /> Deactivate</>
                                                            ) : (
                                                                <><CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Activate</>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleRelease(p)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Remove from Branch
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Pagination */}
                    {myTotalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => setMyPage((p) => p - 1)} disabled={myPage === 1} className="rounded-xl">
                                Previous
                            </Button>
                            <span className="text-sm font-medium">Page {myPage} of {myTotalPages}</span>
                            <Button variant="outline" size="sm" onClick={() => setMyPage((p) => p + 1)} disabled={myPage === myTotalPages} className="rounded-xl">
                                Next
                            </Button>
                        </div>
                    )}
                </TabsContent>

                {/* ── Tab 2: Search & Claim ── */}
                <TabsContent value="search" className="mt-4 space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-card/95 p-5 space-y-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" /> Search All India Pincodes
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Search by pincode or area name, and optionally filter by state and district.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Type pincode or area name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 rounded-xl border-border/60 h-10"
                                />
                                {searching && (
                                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="h-10 px-3 w-[160px] rounded-xl border border-border/60 bg-transparent text-sm"
                                    value={filterState}
                                    onChange={(e) => {
                                        setFilterState(e.target.value);
                                        setFilterDistrict("all"); // Reset district on state change
                                    }}
                                >
                                    <option value="all">All States</option>
                                    {distinctStates.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <select
                                    className="h-10 px-3 w-[160px] rounded-xl border border-border/60 bg-transparent text-sm"
                                    value={filterDistrict}
                                    onChange={(e) => setFilterDistrict(e.target.value)}
                                >
                                    <option value="all">All Districts</option>
                                    {distinctDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Search Results */}
                    {(searchQuery.length >= 3 || filterState !== "all" || filterDistrict !== "all") && (
                        <>
                            {searchResults.length === 0 && !searching ? (
                                <div className="flex items-center justify-center py-10 text-muted-foreground text-sm gap-2">
                                    <MapPin className="h-4 w-4" /> No pincodes found for &quot;{searchQuery}&quot;
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {searchResults.length > 0 && (
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-sm font-medium text-muted-foreground">Found {searchTotal} results</h4>
                                                <select
                                                    className="h-8 px-2 rounded-lg border border-border/60 bg-transparent text-xs"
                                                    value={searchLimit}
                                                    onChange={(e) => {
                                                        setSearchLimit(Number(e.target.value));
                                                        setSearchPage(1);
                                                    }}
                                                >
                                                    <option value={50}>50 / page</option>
                                                    <option value={100}>100 / page</option>
                                                    <option value={200}>200 / page</option>
                                                    <option value={500}>500 / page</option>
                                                </select>
                                            </div>
                                            {selectedClaimIds.length > 0 && (
                                                <Button
                                                    size="sm"
                                                    onClick={handleBulkClaim}
                                                    disabled={bulkClaiming}
                                                    className="h-9 shadow-sm rounded-full px-4"
                                                >
                                                    {bulkClaiming ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                                                    Claim {selectedClaimIds.length} Selected
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                    <div className="rounded-3xl border border-border/60 bg-card/95 shadow-sm overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/40">
                                                <TableRow className="hover:bg-transparent border-border/60">
                                                    <TableHead className="w-[40px] text-center pl-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-muted-foreground/30 bg-card text-primary cursor-pointer accent-primary flex-shrink-0"
                                                            checked={selectedClaimIds.length === claimableIds.length && claimableIds.length > 0}
                                                            onChange={(e) => {
                                                                if (e.target.checked) setSelectedClaimIds(claimableIds);
                                                                else setSelectedClaimIds([]);
                                                            }}
                                                        />
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-muted-foreground w-[120px]">Pincode</TableHead>
                                                    <TableHead className="font-semibold text-muted-foreground">Location</TableHead>
                                                    <TableHead className="font-semibold text-muted-foreground w-[90px]">Zone</TableHead>
                                                    <TableHead className="font-semibold text-muted-foreground w-[160px]">Current Branch</TableHead>
                                                    <TableHead className="font-semibold text-muted-foreground w-[130px] text-right">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {searchResults.map((p) => {
                                                    const alreadyMine = myPincodes.some((mp) => mp._id === p._id);
                                                    const takenByOther = !!p.branchId && !alreadyMine;

                                                    return (
                                                        <TableRow key={p._id} className="hover:bg-muted/30 border-border/50">
                                                            <TableCell className="text-center pl-4">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 rounded border-muted-foreground/30 bg-card text-primary cursor-pointer accent-primary"
                                                                    checked={selectedClaimIds.includes(p._id)}
                                                                    disabled={alreadyMine || takenByOther}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) setSelectedClaimIds(prev => [...prev, p._id]);
                                                                        else setSelectedClaimIds(prev => prev.filter(id => id !== p._id));
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-mono font-semibold">{p.pincode}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{p.officeName || "—"}</span>
                                                                    <span className="text-xs text-muted-foreground">{p.district}, {p.state}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="text-xs rounded-full">{p.zone}</Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                {p.branchId ? (
                                                                    <div className="flex items-center gap-1.5 text-sm">
                                                                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                                        <span className="text-muted-foreground">{p.branchId.name}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-green-600 font-medium">Available</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right pr-4">
                                                                {alreadyMine ? (
                                                                    <Badge className="bg-green-500/15 text-green-700 border-transparent rounded-full text-xs">
                                                                        <CheckCircle2 className="h-3 w-3 mr-1" /> Added
                                                                    </Badge>
                                                                ) : takenByOther ? (
                                                                    <div className="flex items-center justify-end gap-1 text-xs text-orange-600">
                                                                        <AlertTriangle className="h-3 w-3" /> Taken
                                                                    </div>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        className="h-8 rounded-full text-xs px-4"
                                                                        onClick={() => handleClaim(p)}
                                                                        disabled={claimingId === p._id}
                                                                    >
                                                                        {claimingId === p._id ? (
                                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                                        ) : (
                                                                            <><Plus className="h-3 w-3 mr-1" /> Add to Branch</>
                                                                        )}
                                                                    </Button>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Global Search Pagination */}
                                    {searchTotalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 pt-2">
                                            <Button variant="outline" size="sm" onClick={() => setSearchPage((p) => Math.max(1, p - 1))} disabled={searchPage === 1} className="rounded-xl">
                                                Previous
                                            </Button>
                                            <span className="text-sm font-medium text-muted-foreground">Page {searchPage} of {searchTotalPages}</span>
                                            <Button variant="outline" size="sm" onClick={() => setSearchPage((p) => Math.min(searchTotalPages, p + 1))} disabled={searchPage === searchTotalPages} className="rounded-xl">
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {searchQuery.length > 0 && searchQuery.length < 3 && (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            Type at least 3 characters to search...
                        </p>
                    )}
                </TabsContent>
            </Tabs>

            {/* Edit Dialog */}
            <Dialog open={!!editingPincode} onOpenChange={(open) => !open && setEditingPincode(null)}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit2 className="h-5 w-5 text-primary" />
                            Edit Pincode: {editingPincode?.pincode}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="transitDays" className="text-right">
                                Transit Days
                            </Label>
                            <Input
                                id="transitDays"
                                type="number"
                                min={1}
                                max={15}
                                value={editTransitDays}
                                onChange={(e) => setEditTransitDays(e.target.value)}
                                className="col-span-3 rounded-xl"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 mt-2">
                            <Label htmlFor="isODA" className="text-right">
                                ODA (Out of Def. Area)
                            </Label>
                            <div className="col-span-3 flex items-center">
                                <Switch
                                    id="isODA"
                                    checked={editIsODA}
                                    onCheckedChange={setEditIsODA}
                                />
                                <span className={`ml-3 text-sm font-medium ${editIsODA ? 'text-primary' : 'text-muted-foreground'}`}>
                                    {editIsODA ? 'Yes' : 'No'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPincode(null)} className="rounded-xl" disabled={savingEdit}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} className="rounded-xl shadow-md" disabled={savingEdit}>
                            {savingEdit ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BranchPincodeView;
