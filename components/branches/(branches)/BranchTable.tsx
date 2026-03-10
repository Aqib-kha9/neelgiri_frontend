
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building,
  MapPin,
  Users,
  IndianRupee,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { branchesData } from "./data/mockData";

type Branch = typeof branchesData[0];

interface BranchTableProps {
  branches: Branch[];
  onEditBranch: (branch: Branch) => void;
  onDeleteBranch: (branchId: string) => void;
}

export const BranchTable = ({ branches, onEditBranch, onDeleteBranch }: BranchTableProps) => {
  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            All Branches
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Complete list of branches with performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-border/70"
          >
            Map View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-border/70"
          >
            Grid View
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Branch Details</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Manager & Staff</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id} className="group hover:bg-muted/20">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-2xl p-2 ${branch.type === "company"
                        ? "bg-primary/10 text-primary"
                        : "bg-warning/10 text-warning"
                        }`}
                    >
                      <Building className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {branch.name}
                        </p>
                        <Badge
                          variant={
                            branch.type === "company" ? "secondary" : "warning"
                          }
                          className="rounded-full text-xs"
                        >
                          {branch.type === "company" ? "Company" : "Partner"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Code: {branch.code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Service: {branch.serviceArea}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-foreground">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {branch.city}, {branch.state}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {branch.pincode}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {branch.address}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {branch.manager}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {branch.staffCount} staff
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Since{" "}
                      {new Date(branch.joined).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted/40">
                        <div
                          className={`h-full rounded-full ${branch.performance >= 90
                            ? "bg-success"
                            : branch.performance >= 80
                              ? "bg-warning"
                              : "bg-error"
                            }`}
                          style={{ width: `${branch.performance}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {branch.performance}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Audit:{" "}
                      {new Date(branch.lastAudit).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                      <IndianRupee className="h-3 w-3" />
                      {branch.revenue}L
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Monthly avg.
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      branch.status === "active"
                        ? "success"
                        : branch.status === "maintenance"
                          ? "warning"
                          : "secondary"
                    }
                    className="rounded-full"
                  >
                    {branch.status === "active"
                      ? "Active"
                      : branch.status === "maintenance"
                        ? "Maintenance"
                        : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-lg"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-2 rounded-lg"
                          onClick={() => onEditBranch(branch)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit Branch
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-2 rounded-lg text-error"
                          onClick={() => onDeleteBranch(branch.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
