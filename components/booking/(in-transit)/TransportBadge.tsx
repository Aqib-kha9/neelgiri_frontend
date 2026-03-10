import { Badge } from "@/components/ui/badge";
import { transportConfig } from "./InTransit";
import { AlertCircle } from "lucide-react";

// Define valid transport types
type TransportType = "Surface" | "Air" | "Rail";

interface TransportBadgeProps {
  transport: TransportType | string;
}

export const TransportBadge = ({ transport }: TransportBadgeProps) => {
  // Check if transport is valid
  const validTransport = Object.keys(transportConfig).includes(transport)
    ? (transport as TransportType)
    : null;

  if (!validTransport) {
    return (
      <Badge className="rounded-full border bg-gray-100 text-gray-700 border-gray-200 px-2 py-1 text-xs">
        <AlertCircle className="h-3 w-3 mr-1" />
        Unknown
      </Badge>
    );
  }

  const config = transportConfig[validTransport];

  return (
    <Badge className={`rounded-full border ${config.color} px-2 py-1 text-xs`}>
      {config.label}
    </Badge>
  );
};
