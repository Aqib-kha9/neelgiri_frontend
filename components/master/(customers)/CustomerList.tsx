import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Building2,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Customer } from "./types";

interface CustomerListProps {
  customers: Customer[];
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

const CustomerList = ({
  customers,
  onEditCustomer,
  onDeleteCustomer,
}: CustomerListProps) => {
  const router = useRouter();

  const handleViewProfile = (customerId: string) => {
    router.push(`/dashboard/master/customers/${customerId}`);
  };

  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">
            All Customers
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Complete list of registered customers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-border/70"
          >
            Grid View
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg border-border/70 bg-muted/50"
          >
            Table View
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="pl-6 min-w-[350px]">Customer Details</TableHead>
              <TableHead className="min-w-[250px]">Contact Info</TableHead>
              <TableHead className="min-w-[200px]">Type & GST</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="text-right pr-6 min-w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, idx) => (
              <TableRow key={`${customer.id}-${idx}`} className="group hover:bg-muted/20">
                <TableCell className="pl-6">
                  <div className="flex items-start gap-4 py-2">
                    <div className={`mt-1 rounded-2xl p-2.5 ${customer.customerType === "REGULAR" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600"}`}>
                      {customer.customerType === "REGULAR" ? (
                        <Building2 className="h-5 w-5" />
                      ) : (
                        <Users className="h-5 w-5" />
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <span
                          className="font-semibold text-foreground text-base leading-snug max-w-[240px] cursor-pointer hover:underline hover:text-primary transition-colors"
                          onClick={() => handleViewProfile(customer.id)}
                        >
                          {customer.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="shrink-0 rounded-md border-border text-[10px] font-mono uppercase bg-muted/50 px-1.5 h-5 flex items-center"
                        >
                          {customer.code}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        {customer.customerType === "REGULAR" ? "Corporate Account" : "Individual Account"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                      <span className="truncate max-w-[200px]">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                      {customer.phoneO || customer.mobileNo}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                      <span className="truncate max-w-[200px]">{customer.city}, {customer.station}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <Badge variant="secondary" className="rounded-full px-2.5 font-normal">
                      {customer.customerType}
                    </Badge>
                    {customer.gstin ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">GST</span>
                        <span className="text-xs font-mono text-foreground bg-muted/50 px-1.5 py-0.5 rounded">{customer.gstin}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground italic pl-1">Unregistered</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      customer.status === "active" ? "success" : "secondary"
                    }
                    className="rounded-full px-3 capitalize shadow-sm"
                  >
                    {customer.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-8 w-8 p-0 hover:bg-muted"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-border/60">
                      <DropdownMenuItem
                        className="gap-2 rounded-lg cursor-pointer"
                        onClick={() => handleViewProfile(customer.id)}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 rounded-lg cursor-pointer"
                        onClick={() => onEditCustomer(customer)}
                      >
                        <Edit className="h-4 w-4 text-muted-foreground" />
                        Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 rounded-lg text-error focus:text-error focus:bg-error/10 cursor-pointer"
                        onClick={() => onDeleteCustomer(customer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
