export const customerTrackingData = [
  {
    id: "CT-001",
    awbNumber: "HJD292412510",
    customer: {
      name: "Aqib Khan",
      phone: "8601677140",
      email: "aqib.khan@email.com",
      address: "45 Park Street, Kolkata - 700016",
      city: "Kolkata",
      pincode: "700016",
    },
    package: {
      type: "Electronics",
      weight: "5 kg",
      dimensions: "20 x 15 x 10 cm",
      description: "Mobile Phone",
      codAmount: "₹500",
      declaredValue: "₹15,000",
      serviceType: "Express",
      paymentMode: "COD"
    },
    status: "in_transit",
    currentStatus: "Reached Kolkata Hub",
    timeline: {
      shipped: "2024-12-10 14:30:00",
      expectedDelivery: "2024-12-11 18:00:00",
      lastUpdate: "2024-12-11 10:15:00",
    },
    deliveryAgent: {
      id: "RDR-001",
      name: "Raj Kumar",
      phone: "9876543210",
      status: "active",
    },
    location: {
      current: "Kolkata Sorting Center",
      coordinates: "22.5726° N, 88.3639° E",
      lastScan: "15 min ago",
    },
    communication: {
      lastContact: "2024-12-11 09:30:00",
      contactMethod: "SMS",
      nextUpdate: "2024-12-11 12:00:00",
    },
    alerts: [],
  },
  {
    id: "CT-002",
    awbNumber: "HJD292412511",
    customer: {
      name: "Priya Singh",
      phone: "9876543211",
      email: "priya.singh@email.com",
      address: "23 Nariman Point, Mumbai - 400021",
      city: "Mumbai",
      pincode: "400021",
    },
    package: {
      type: "Documents",
      weight: "0.5 kg",
      dimensions: "30 x 21 x 1 cm",
      description: "Legal Contracts",
      codAmount: "-",
      declaredValue: "₹0",
      serviceType: "Standard",
      paymentMode: "Prepaid"
    },
    status: "out_for_delivery",
    currentStatus: "With delivery agent",
    timeline: {
      shipped: "2024-12-09 11:20:00",
      expectedDelivery: "2024-12-10 16:00:00",
      lastUpdate: "2024-12-11 11:45:00",
    },
    deliveryAgent: {
      id: "RDR-002",
      name: "Amit Sharma",
      phone: "9876543211",
      status: "active",
    },
    location: {
      current: "Near Nariman Point",
      coordinates: "18.9260° N, 72.8226° E",
      lastScan: "5 min ago",
    },
    communication: {
      lastContact: "2024-12-11 11:30:00",
      contactMethod: "Call",
      nextUpdate: "2024-12-11 13:00:00",
    },
    alerts: [
      {
        type: "delay",
        message: "Delivery attempted - customer unavailable",
        priority: "medium",
      },
    ],
  },
  {
    id: "CT-003",
    awbNumber: "HJD292412512",
    customer: {
      name: "Global Enterprises",
      phone: "9012345679",
      email: "support@globalent.com",
      address: "78 Electronics City, Bangalore - 560100",
      city: "Bangalore",
      pincode: "560100",
    },
    package: {
      type: "Clothing",
      weight: "3 kg",
      dimensions: "40 x 30 x 15 cm",
      description: "Summer Collection",
      codAmount: "₹1,500",
      declaredValue: "₹8,000",
      serviceType: "Standard",
      paymentMode: "COD"
    },
    status: "delivered",
    currentStatus: "Delivered successfully",
    timeline: {
      shipped: "2024-12-08 09:15:00",
      expectedDelivery: "2024-12-09 17:00:00",
      actualDelivery: "2024-12-09 14:30:00",
      lastUpdate: "2024-12-09 14:30:00",
    },
    deliveryAgent: {
      id: "RDR-003",
      name: "Rohit Verma",
      phone: "9876543212",
      status: "active",
    },
    location: {
      current: "Delivered - Receiver Location",
      coordinates: "12.9716° N, 77.5946° E",
      lastScan: "2 days ago",
    },
    communication: {
      lastContact: "2024-12-09 14:30:00",
      contactMethod: "POD",
      nextUpdate: "Completed",
    },
    alerts: [],
  },
  {
    id: "CT-004",
    awbNumber: "HJD292412513",
    customer: {
      name: "Customer Care",
      phone: "8899776656",
      email: "care@company.com",
      address: "34 Salt Lake, Kolkata - 700091",
      city: "Kolkata",
      pincode: "700091",
    },
    package: {
      type: "Fragile",
      weight: "8 kg",
      dimensions: "50 x 50 x 50 cm",
      description: "Glass Items",
      codAmount: "₹800",
      declaredValue: "₹12,000",
      serviceType: "Express",
      paymentMode: "Prepaid"
    },
    status: "exception",
    currentStatus: "Delivery failed - Address issue",
    timeline: {
      shipped: "2024-12-07 13:45:00",
      expectedDelivery: "2024-12-08 15:00:00",
      lastUpdate: "2024-12-11 09:00:00",
    },
    deliveryAgent: {
      id: "RDR-004",
      name: "Sneha Patel",
      phone: "9876543213",
      status: "active",
    },
    location: {
      current: "Returned to Warehouse",
      coordinates: "22.5726° N, 88.3639° E",
      lastScan: "1 hour ago",
    },
    communication: {
      lastContact: "2024-12-11 09:00:00",
      contactMethod: "Call",
      nextUpdate: "2024-12-11 14:00:00",
    },
    alerts: [
      {
        type: "address",
        message: "Incorrect address provided",
        priority: "high",
      },
      {
        type: "return",
        message: "Package held for address verification",
        priority: "high",
      },
    ],
  },
  {
    id: "CT-005",
    awbNumber: "HJD292412514",
    customer: {
      name: "Rajesh Kumar",
      phone: "9876543210",
      email: "rajesh.k@email.com",
      address: "12 Connaught Place, Delhi - 110001",
      city: "Delhi",
      pincode: "110001",
    },
    package: {
      type: "Documents",
      weight: "0.5 kg",
      dimensions: "30 x 21 x 1 cm",
      description: "Academic Certificates",
      codAmount: "-",
      declaredValue: "₹0",
      serviceType: "Standard",
      paymentMode: "Prepaid"
    },
    status: "pending",
    currentStatus: "Awaiting pickup",
    timeline: {
      shipped: "2024-12-11 08:00:00",
      expectedDelivery: "2024-12-12 18:00:00",
      lastUpdate: "2024-12-11 08:00:00",
    },
    deliveryAgent: {
      id: "RDR-005",
      name: "Vikram Joshi",
      phone: "9876543214",
      status: "assigned",
    },
    location: {
      current: "Origin Facility",
      coordinates: "28.6139° N, 77.2090° E",
      lastScan: "3 hours ago",
    },
    communication: {
      lastContact: "2024-12-10 16:00:00",
      contactMethod: "Email",
      nextUpdate: "2024-12-11 12:00:00",
    },
    alerts: [
      { type: "info", message: "Scheduled for pickup today", priority: "low" },
    ],
  },
];

export const trackingStats = {
  totalActive: 156,
  deliveredToday: 89,
  inTransit: 45,
  exceptions: 12,
  onTimeRate: 94.2,
  customerSatisfaction: 4.8,
};

export const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "Clock",
  },
  in_transit: {
    label: "In Transit",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "Truck",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "Package",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "CheckCircle2",
  },
  exception: {
    label: "Exception",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "AlertCircle",
  },
  returned: {
    label: "Returned",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "XCircle",
  },
};

export const alertConfig = {
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
