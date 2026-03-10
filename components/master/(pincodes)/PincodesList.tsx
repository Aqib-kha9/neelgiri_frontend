
import {
  Edit,
  Trash2,
  MoreHorizontal,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpFromLine,
  Coins,
  AlertTriangle,
  Building2,
  Store,
  CheckSquare,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Pincode } from "./types";

interface PincodesListProps {
  pincodes: Pincode[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onEditPincode: (pincode: Pincode) => void;
  onDeletePincode: (pincodeId: string) => void;
  onToggleStatus: (pincodeId: string) => void; // This will now toggle isServiceable
  onBulkDelete: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
}

const PincodesList = ({
  pincodes,
  selectedIds,
  onSelectId,
  onSelectAll,
  onEditPincode,
  onDeletePincode,
  onToggleStatus,
  onBulkDelete,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
}: PincodesListProps) => {

  const allSelected = pincodes.length > 0 && selectedIds.length === pincodes.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < pincodes.length;

  const handleSelectAllClick = () => {
    if (allSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(pincodes.map(p => p._id));
    }
  };

  if (pincodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-border/60 bg-card/50 border-dashed">
        <div className="p-4 rounded-full bg-muted/50 mb-4">
          <MapPin className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No pincodes found</h3>
        <p className="text-muted-foreground max-w-sm mt-1">
          Try adjusting your search filters or check your connection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <span className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{pincodes.length}</span> of <span className="font-medium text-foreground">{totalCount}</span> pincodes
        </span>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/95 shadow-sm overflow-hidden relative">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent border-border/60">
              <TableHead className="w-[40px] pl-4">
                <Checkbox
                  checked={allSelected || isIndeterminate}
                  onCheckedChange={handleSelectAllClick}
                />
              </TableHead>
              <TableHead className="w-[120px] font-semibold text-muted-foreground">Pincode</TableHead>
              <TableHead className="font-semibold text-muted-foreground">Location</TableHead>
              <TableHead className="w-[120px] font-semibold text-muted-foreground font-medium">Mapped Branch</TableHead>
              <TableHead className="w-[110px] font-semibold text-muted-foreground text-center">Branch Activity</TableHead>
              <TableHead className="w-[80px] font-semibold text-muted-foreground">Transit</TableHead>
              <TableHead className="w-[120px] font-semibold text-muted-foreground text-center">Global Service</TableHead>
              <TableHead className="w-[60px] text-right font-semibold text-muted-foreground font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pincodes.map((pincode) => (
              <TableRow key={pincode._id} className="group hover:bg-muted/30 border-border/50">
                <TableCell className="pl-4">
                  <Checkbox
                    checked={selectedIds.includes(pincode._id)}
                    onCheckedChange={() => onSelectId(pincode._id)}
                  />
                </TableCell>
                <TableCell className="font-medium font-mono text-base text-foreground">
                  <span>{pincode.pincode}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{pincode.officeName}</span>
                    <span className="text-xs text-muted-foreground">
                      {pincode.district}, {pincode.state}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80 mt-0.5 uppercase">
                      Zone: {pincode.zone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {pincode.branchId ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{pincode.branchId.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">Code: {pincode.branchId.code}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Not Mapped</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {pincode.branchId ? (
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase transition-all ${pincode.isActiveForBranch
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-orange-50 text-orange-600 border-orange-200'
                        }`}
                    >
                      {pincode.isActiveForBranch ? 'Active' : 'Off'}
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-muted-foreground uppercase">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center font-mono text-sm text-muted-foreground">
                  {pincode.transitDays ?? 3}d
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${pincode.isServiceable
                      ? 'bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200/50'
                      : 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200/50'
                      }`}
                  >
                    {pincode.isServiceable ? 'Active' : 'Disabled'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px] rounded-xl">
                      <DropdownMenuLabel>Global Serviceability</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleStatus(pincode._id)}>
                        {pincode.isServiceable ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4 text-orange-600" /> Disable Service
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Enable Service
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditPincode(pincode)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDeletePincode(pincode._id)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-xl border-border/60 h-9"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1 mx-2">
            <span className="text-sm font-medium">Page {currentPage}</span>
            <span className="text-sm text-muted-foreground">of {totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-xl border-border/60 h-9"
          >
            Next
          </Button>
        </div>
      )}

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="flex items-center gap-3 border-r border-background/20 pr-6">
            <div className="bg-background text-foreground text-xs font-bold h-6 w-6 rounded-full flex items-center justify-center">
              {selectedIds.length}
            </div>
            <span className="text-sm font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hover:bg-background/20 hover:text-white rounded-full h-8 text-xs gap-2">
              <CheckSquare className="h-3.5 w-3.5" />
              Toggle Serviceability
            </Button>
            <div className="h-4 w-[1px] bg-background/20 mx-1"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkDelete}
              className="hover:bg-red-500/20 hover:text-red-400 text-red-400 rounded-full h-8 text-xs gap-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Records
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodesList;
