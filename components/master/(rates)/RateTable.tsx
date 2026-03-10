// components/master/rates/RateTable.tsx
import { RateRule } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";

interface RateTableProps {
  rates: RateRule[];
  onEdit: (rate: RateRule) => void;
  onDelete: (id: string) => void;
}

const RateTable = ({ rates, onEdit, onDelete }: RateTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3">Customer</th>
            <th className="text-left p-3">Type</th>
            <th className="text-left p-3">Service</th>
            <th className="text-left p-3">Weight Slabs</th>
            <th className="text-left p-3">Min Charge</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="font-medium">
                  {rate.customerName || "Default"}
                </div>
                <div className="text-sm text-muted-foreground">{rate.id}</div>
              </td>
              <td className="p-3">
                <Badge
                  variant={
                    rate.customerType === "CUSTOMER"
                      ? "default"
                      : rate.customerType === "AGENT"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {rate.customerType}
                </Badge>
              </td>
              <td className="p-3">
                <div>{rate.serviceType}</div>
                <div className="text-sm text-muted-foreground">
                  {rate.paymentMode}
                </div>
              </td>
              <td className="p-3">
                <div className="text-sm">{rate.slabs.length} slabs</div>
                <div className="text-xs text-muted-foreground">
                  0-{rate.slabs[rate.slabs.length - 1]?.maxWeight}kg
                </div>
              </td>
              <td className="p-3">₹{rate.minCharge.amount}</td>
              <td className="p-3">
                <Badge variant={rate.isActive ? "success" : "secondary"}>
                  {rate.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(rate)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(rate.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RateTable;
