import { 
  Navigation, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";

export const outForDeliveryData = [
  {
    id: "OFD-001",
    awbNumber: "HJD292412504",
    sender: {
      name: "Aqib",
      phone: "8601677140",
      city: "Delhi",
      pincode: "110094",
    },
    receiver: {
      name: "Aqib Khan",
      phone: "8601677140",
      address: "123 MG Road, Brigade Road",
      city: "Bangalore",
      pincode: "560001",
      landmark: "Near UB City",
      instructions: "Call before delivery - Office building",
    },
    package: {
      type: "Parcel",
      weight: "5 kg",
      description: "Electronics items - Mobile Phone",
      declaredValue: "₹15,000",
      codAmount: "₹500",
    },
    service: {
      type: "Standard",
      payment: "COD",
      charges: "₹462.56",
    },
    currentStatus: "out_for_delivery",
    rider: {
      id: "RDR-001",
      name: "Raj Kumar",
      phone: "9876543210",
      vehicle: "Bike - KA01AB1234",
      status: "active",
      rating: 4.8,
      deliveriesToday: 12,
    },
    deliveryInfo: {
      assignedTime: "2024-12-11 09:00",
      estimatedDelivery: "2024-12-11 14:00",
      currentLocation: "Indiranagar, Bangalore",
      distanceToDestination: "2.3 km",
      timeToDestination: "15 mins",
      deliveryAttempt: 1,
      lastUpdated: "5 mins ago",
    },
    priority: "high",
    specialInstructions: "Office delivery - Reception on 3rd floor",
    proofRequired: ["Signature", "Photo"],
    qrCode: "HJD292412504",
    temperature: "Normal",
  },
  // ... include all other mock data objects exactly as in original
] as const;

export const statusConfig = {
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: Navigation,
  },
  delivery_attempted: {
    label: "Delivery Attempted",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: Clock,
  },
  delivered: {
    label: "Delivered",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: CheckCircle2,
  },
  failed: {
    label: "Delivery Failed",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
} as const;

export const priorityConfig = {
  high: { label: "High", color: "bg-red-100 text-red-800 border-red-200" },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: { label: "Low", color: "bg-blue-100 text-blue-800 border-blue-200" },
} as const;

export const riderStatusConfig = {
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  available: {
    label: "Available",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  on_break: {
    label: "On Break",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  offline: {
    label: "Offline",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
} as const;