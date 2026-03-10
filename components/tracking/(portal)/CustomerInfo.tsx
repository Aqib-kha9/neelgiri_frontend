import { Button } from "@/components/ui/button";
import { User, MapPin, Phone, MessageCircle, Mail } from "lucide-react";

interface CustomerInfoProps {
  customer: any;
}

const CustomerInfo = ({ customer }: CustomerInfoProps) => {
  const handleContactCustomer = () => {
    console.log("Contact customer:", customer.name);
  };

  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-semibold text-foreground">
          Customer Information
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground">{customer.name}</p>
          <p className="text-xs text-muted-foreground">{customer.phone}</p>
          <p className="text-xs text-muted-foreground">{customer.email}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span>{customer.address}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {customer.city} - {customer.pincode}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2 rounded-lg border-border/70"
            onClick={handleContactCustomer}
          >
            <Phone className="h-3 w-3" />
            Call
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2 rounded-lg border-border/70"
          >
            <MessageCircle className="h-3 w-3" />
            SMS
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-2 rounded-lg border-border/70"
          >
            <Mail className="h-3 w-3" />
            Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
