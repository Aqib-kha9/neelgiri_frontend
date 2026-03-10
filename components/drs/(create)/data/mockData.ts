// Mock data for available riders
export const availableRiders = [
  {
    id: "RDR-001",
    name: "Raj Kumar",
    phone: "9876543210",
    vehicle: "Bike",
    capacity: 25,
    currentLoad: 12,
  },
  {
    id: "RDR-002",
    name: "Amit Sharma",
    phone: "9876543211",
    vehicle: "Bike",
    capacity: 25,
    currentLoad: 8,
  },
  {
    id: "RDR-003",
    name: "Rohit Verma",
    phone: "9876543212",
    vehicle: "Scooter",
    capacity: 20,
    currentLoad: 15,
  },
  {
    id: "RDR-004",
    name: "Sneha Patel",
    phone: "9876543213",
    vehicle: "Bike",
    capacity: 25,
    currentLoad: 5,
  },
  {
    id: "RDR-005",
    name: "Vikram Joshi",
    phone: "9876543214",
    vehicle: "Scooter",
    capacity: 20,
    currentLoad: 18,
  },
];

// Mock data for available shipments
export const availableShipments = [
  {
    awbNumber: "HJD292412510",
    receiver: {
      name: "Aqib Khan",
      phone: "8601677140",
      address: "45 Park Street, Kolkata - 700016",
      city: "Kolkata",
      pincode: "700016",
    },
    package: {
      type: "Electronics",
      weight: "5 kg",
      description: "Mobile Phone",
      codAmount: "₹500",
      declaredValue: "₹15,000",
    },
    service: {
      type: "Surface",
      payment: "COD",
    },
    status: "ready_for_delivery",
    priority: "high",
    timeline: {
      shipmentDate: "2024-12-10",
      expectedDelivery: "2024-12-11",
    },
  },
  {
    awbNumber: "HJD292412511",
    receiver: {
      name: "Priya Singh",
      phone: "9876543211",
      address: "23 Nariman Point, Mumbai - 400021",
      city: "Mumbai",
      pincode: "400021",
    },
    package: {
      type: "Documents",
      weight: "0.5 kg",
      description: "Legal Contracts",
      codAmount: "-",
      declaredValue: "₹0",
    },
    service: {
      type: "Express",
      payment: "Prepaid",
    },
    status: "ready_for_delivery",
    priority: "critical",
    timeline: {
      shipmentDate: "2024-12-09",
      expectedDelivery: "2024-12-10",
    },
  },
  {
    awbNumber: "HJD292412512",
    receiver: {
      name: "Global Enterprises",
      phone: "9012345679",
      address: "78 Electronics City, Bangalore - 560100",
      city: "Bangalore",
      pincode: "560100",
    },
    package: {
      type: "Clothing",
      weight: "3 kg",
      description: "Summer Collection",
      codAmount: "₹1,500",
      declaredValue: "₹8,000",
    },
    service: {
      type: "Air",
      payment: "COD",
    },
    status: "ready_for_delivery",
    priority: "medium",
    timeline: {
      shipmentDate: "2024-12-08",
      expectedDelivery: "2024-12-09",
    },
  },
  {
    awbNumber: "HJD292412513",
    receiver: {
      name: "Customer Care",
      phone: "8899776656",
      address: "34 Salt Lake, Kolkata - 700091",
      city: "Kolkata",
      pincode: "700091",
    },
    package: {
      type: "Fragile",
      weight: "8 kg",
      description: "Glass Items",
      codAmount: "₹800",
      declaredValue: "₹12,000",
    },
    service: {
      type: "Surface",
      payment: "COD",
    },
    status: "ready_for_delivery",
    priority: "high",
    timeline: {
      shipmentDate: "2024-12-07",
      expectedDelivery: "2024-12-08",
    },
  },
  {
    awbNumber: "HJD292412514",
    receiver: {
      name: "Rajesh Kumar",
      phone: "9876543210",
      address: "12 Connaught Place, Delhi - 110001",
      city: "Delhi",
      pincode: "110001",
    },
    package: {
      type: "Documents",
      weight: "0.5 kg",
      description: "Academic Certificates",
      codAmount: "-",
      declaredValue: "₹0",
    },
    service: {
      type: "Express",
      payment: "Prepaid",
    },
    status: "ready_for_delivery",
    priority: "medium",
    timeline: {
      shipmentDate: "2024-12-11",
      expectedDelivery: "2024-12-11",
    },
  },
];

// Mock data for DRS templates
export const drsTemplates = [
  {
    id: "TPL-001",
    name: "Standard City Route",
    description: "Optimized for city deliveries",
    shipmentCount: 20,
  },
  {
    id: "TPL-002",
    name: "Express Deliveries",
    description: "Priority and express shipments",
    shipmentCount: 15,
  },
  {
    id: "TPL-003",
    name: "COD Heavy Route",
    description: "Focus on COD shipments",
    shipmentCount: 25,
  },
  {
    id: "TPL-004",
    name: "Suburban Route",
    description: "Covering suburban areas",
    shipmentCount: 18,
  },
];

export const statusConfig = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "FileText",
  },
  assigned: {
    label: "Assigned",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "Users",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "Clock",
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "CheckCircle2",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "XCircle",
  },
};

export const priorityConfig = {
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: { label: "Low", color: "bg-green-100 text-green-800 border-green-200" },
};
