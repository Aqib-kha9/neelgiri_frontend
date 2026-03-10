export const podData = [
  {
    id: "POD-001",
    awbNumber: "HJD292412504",
    status: "completed",
    deliveryStatus: "delivered",
    timestamp: "2024-12-11 14:45:30",
    receiver: {
      name: "Aqib Khan",
      phone: "8601677140",
      signature: "captured",
      idVerified: true,
      relation: "Self",
    },
    package: {
      type: "Parcel",
      weight: "5 kg",
      description: "Electronics items - Mobile Phone",
      condition: "Good",
    },
    delivery: {
      agent: "Raj Kumar (RDR-001)",
      vehicle: "Motorcycle • DL01AB1234",
      timestamp: "2024-12-11 14:45:30",
      location: {
        latitude: 22.5726,
        longitude: 88.3639,
        address: "45 Park Street, Kolkata - 700016",
      },
    },
    capture: {
      signature: "data:image/svg+xml;base64,...",
      photos: [
        {
          id: "photo-1",
          type: "package",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 14:44:00",
          description: "Package at delivery location",
        },
        {
          id: "photo-2",
          type: "receiver",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 14:45:00",
          description: "Receiver with package",
        },
      ],
      idVerification: {
        type: "Aadhaar",
        number: "XXXX XXXX 1234",
        photo: "/api/placeholder/300/200",
        verified: true,
      },
      notes:
        "Receiver satisfied with the product. Package delivered in good condition.",
      codPayment: {
        amount: "₹500",
        method: "Cash",
        received: true,
        timestamp: "2024-12-11 14:45:30",
      },
    },
    verification: {
      automated: true,
      confidence: 95.7,
      flags: [],
      status: "verified",
    },
  },
  {
    id: "POD-002",
    awbNumber: "HJD292412505",
    status: "pending",
    deliveryStatus: "out_for_delivery",
    timestamp: "2024-12-11 15:30:00",
    receiver: {
      name: "Priya Singh",
      phone: "9876543211",
      signature: "pending",
      idVerified: false,
      relation: "Secretary",
    },
    package: {
      type: "Documents",
      weight: "0.5 kg",
      description: "Contract documents",
      condition: "Good",
    },
    delivery: {
      agent: "Amit Sharma (RDR-002)",
      vehicle: "Motorcycle • DL01CD4321",
      timestamp: "2024-12-11 15:30:00",
      location: {
        latitude: 28.6139,
        longitude: 77.209,
        address: "23 Nariman Point, Mumbai - 400021",
      },
    },
    capture: {
      signature: null,
      photos: [],
      idVerification: null,
      notes: "",
      codPayment: {
        amount: "-",
        method: "Prepaid",
        received: true,
        timestamp: null,
      },
    },
    verification: {
      automated: false,
      confidence: 0,
      flags: [],
      status: "pending",
    },
  },
  {
    id: "POD-003",
    awbNumber: "HJD292412506",
    status: "in_progress",
    deliveryStatus: "delivered",
    timestamp: "2024-12-11 13:20:00",
    receiver: {
      name: "Global Enterprises",
      phone: "9012345679",
      signature: "captured",
      idVerified: true,
      relation: "Reception",
    },
    package: {
      type: "Clothing",
      weight: "3 kg",
      description: "Summer collection",
      condition: "Good",
    },
    delivery: {
      agent: "Rohit Verma (RDR-003)",
      vehicle: "Car • MH12EF5678",
      timestamp: "2024-12-11 13:20:00",
      location: {
        latitude: 18.5204,
        longitude: 73.8567,
        address: "78 Electronics City, Bangalore - 560100",
      },
    },
    capture: {
      signature: "data:image/svg+xml;base64,...",
      photos: [
        {
          id: "photo-1",
          type: "package",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 13:19:00",
          description: "Package at office reception",
        },
      ],
      idVerification: {
        type: "Business Card",
        number: "N/A",
        photo: "/api/placeholder/300/200",
        verified: true,
      },
      notes:
        "Delivered to office reception. Receiver provided business card for verification.",
      codPayment: {
        amount: "₹1,500",
        method: "Cash",
        received: true,
        timestamp: "2024-12-11 13:20:00",
      },
    },
    verification: {
      automated: true,
      confidence: 88.3,
      flags: ["signature_mismatch"],
      status: "review_required",
    },
  },
  {
    id: "POD-004",
    awbNumber: "HJD292412507",
    status: "failed",
    deliveryStatus: "delivery_failed",
    timestamp: "2024-12-11 12:15:00",
    receiver: {
      name: "Customer Care",
      phone: "8899776656",
      signature: "rejected",
      idVerified: false,
      relation: "N/A",
    },
    package: {
      type: "Fragile",
      weight: "8 kg",
      description: "Glass items",
      condition: "Damaged",
    },
    delivery: {
      agent: "Sneha Patel (RDR-004)",
      vehicle: "Van • KA01GH9012",
      timestamp: "2024-12-11 12:15:00",
      location: {
        latitude: 12.9716,
        longitude: 77.5946,
        address: "34 Salt Lake, Kolkata - 700091",
      },
    },
    capture: {
      signature: null,
      photos: [
        {
          id: "photo-1",
          type: "damage",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 12:14:00",
          description: "Damaged package contents",
        },
      ],
      idVerification: null,
      notes:
        "Receiver refused delivery due to damaged contents. Package shows signs of mishandling.",
      codPayment: {
        amount: "₹800",
        method: "COD",
        received: false,
        timestamp: null,
      },
    },
    verification: {
      automated: false,
      confidence: 0,
      flags: ["damage_reported", "delivery_refused"],
      status: "failed",
    },
  },
];

export const podStats = {
  totalCaptured: 1245,
  pendingCapture: 23,
  verified: 1189,
  rejected: 33,
  successRate: 95.5,
  avgCaptureTime: "2.3 min",
  digitalAdoption: 87.2,
};

export const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "CheckCircle2",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "Clock",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "RefreshCw",
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "AlertCircle",
  },
};

export const deliveryStatusConfig = {
  delivered: {
    label: "Delivered",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  delivery_failed: {
    label: "Delivery Failed",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  in_transit: {
    label: "In Transit",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export const verificationConfig = {
  verified: {
    label: "Verified",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  review_required: {
    label: "Review Required",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  failed: { label: "Failed", color: "bg-red-100 text-red-800 border-red-200" },
};
