export const verificationData = [
  {
    id: "VER-001",
    podId: "POD-001",
    awbNumber: "HJD292412504",
    status: "verified",
    priority: "high",
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
      timestamp: "2024-12-11 14:45:30",
      location: "45 Park Street, Kolkata - 700016",
    },
    capture: {
      signature: {
        url: "/api/placeholder/400/200",
        quality: 95,
        timestamp: "2024-12-11 14:45:00",
        confidence: 98.2,
      },
      photos: [
        {
          id: "photo-1",
          type: "package",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 14:44:00",
          description: "Package at delivery location",
          quality: 92,
          flags: [],
        },
        {
          id: "photo-2",
          type: "receiver",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 14:45:00",
          description: "Receiver with package",
          quality: 88,
          flags: ["face_obscured"],
        },
      ],
      idVerification: {
        type: "Aadhaar",
        number: "XXXX XXXX 1234",
        photo: "/api/placeholder/300/200",
        verified: true,
        confidence: 96.5,
      },
      notes:
        "Receiver satisfied with the product. Package delivered in good condition.",
    },
    verification: {
      status: "verified",
      confidence: 95.7,
      automated: true,
      verifiedBy: "AI System",
      verifiedAt: "2024-12-11 14:46:00",
      flags: [],
      comments:
        "All documents clear and verifiable. Signature matches receiver name.",
      score: 95,
    },
    risk: {
      level: "low",
      factors: [],
      score: 12,
    },
  },
  {
    id: "VER-002",
    podId: "POD-003",
    awbNumber: "HJD292412506",
    status: "review_required",
    priority: "medium",
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
      timestamp: "2024-12-11 13:20:00",
      location: "78 Electronics City, Bangalore - 560100",
    },
    capture: {
      signature: {
        url: "/api/placeholder/400/200",
        quality: 78,
        timestamp: "2024-12-11 13:20:00",
        confidence: 65.3,
      },
      photos: [
        {
          id: "photo-1",
          type: "package",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 13:19:00",
          description: "Package at office reception",
          quality: 85,
          flags: ["poor_lighting"],
        },
      ],
      idVerification: {
        type: "Business Card",
        number: "N/A",
        photo: "/api/placeholder/300/200",
        verified: true,
        confidence: 72.1,
      },
      notes:
        "Delivered to office reception. Receiver provided business card for verification.",
    },
    verification: {
      status: "review_required",
      confidence: 65.3,
      automated: true,
      verifiedBy: "AI System",
      verifiedAt: "2024-12-11 13:21:00",
      flags: ["signature_mismatch", "id_quality_low"],
      comments:
        "Signature quality low and doesn't match receiver name pattern. Business card verification requires manual review.",
      score: 65,
    },
    risk: {
      level: "medium",
      factors: ["corporate_delivery", "alternative_id"],
      score: 45,
    },
  },
  {
    id: "VER-003",
    podId: "POD-004",
    awbNumber: "HJD292412507",
    status: "rejected",
    priority: "high",
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
      timestamp: "2024-12-11 12:15:00",
      location: "34 Salt Lake, Kolkata - 700091",
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
          quality: 90,
          flags: ["damage_evident"],
        },
      ],
      idVerification: null,
      notes:
        "Receiver refused delivery due to damaged contents. Package shows signs of mishandling.",
    },
    verification: {
      status: "rejected",
      confidence: 10.2,
      automated: false,
      verifiedBy: "Quality Team",
      verifiedAt: "2024-12-11 12:30:00",
      flags: ["damage_reported", "delivery_refused", "no_signature", "no_id"],
      comments:
        "Delivery rejected by receiver due to damaged goods. No valid proof of delivery attempt.",
      score: 10,
    },
    risk: {
      level: "high",
      factors: ["damaged_goods", "delivery_refused", "financial_impact"],
      score: 85,
    },
  },
  {
    id: "VER-004",
    podId: "POD-005",
    awbNumber: "HJD292412508",
    status: "pending",
    priority: "low",
    receiver: {
      name: "Rajesh Kumar",
      phone: "9876543210",
      signature: "captured",
      idVerified: false,
      relation: "Neighbor",
    },
    package: {
      type: "Documents",
      weight: "0.5 kg",
      description: "Legal documents",
      condition: "Good",
    },
    delivery: {
      agent: "Amit Sharma (RDR-005)",
      timestamp: "2024-12-11 16:30:00",
      location: "12 Connaught Place, Delhi - 110001",
    },
    capture: {
      signature: {
        url: "/api/placeholder/400/200",
        quality: 92,
        timestamp: "2024-12-11 16:30:00",
        confidence: 88.7,
      },
      photos: [
        {
          id: "photo-1",
          type: "package",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 16:29:00",
          description: "Package delivered to neighbor",
          quality: 85,
          flags: [],
        },
      ],
      idVerification: null,
      notes:
        "Delivered to neighbor as receiver was unavailable. Neighbor accepted on behalf.",
    },
    verification: {
      status: "pending",
      confidence: 0,
      automated: false,
      verifiedBy: null,
      verifiedAt: null,
      flags: ["delivered_to_third_party", "no_id_verification"],
      comments: "",
      score: 0,
    },
    risk: {
      level: "medium",
      factors: ["third_party_delivery", "no_id"],
      score: 58,
    },
  },
  {
    id: "VER-005",
    podId: "POD-006",
    awbNumber: "HJD292412509",
    status: "in_progress",
    priority: "medium",
    receiver: {
      name: "Priya Singh",
      phone: "9876543211",
      signature: "captured",
      idVerified: true,
      relation: "Self",
    },
    package: {
      type: "Electronics",
      weight: "2 kg",
      description: "Smartwatch",
      condition: "Good",
    },
    delivery: {
      agent: "Vikram Joshi (RDR-006)",
      timestamp: "2024-12-11 15:45:00",
      location: "56 Commercial Street, Mumbai - 400001",
    },
    capture: {
      signature: {
        url: "/api/placeholder/400/200",
        quality: 85,
        timestamp: "2024-12-11 15:45:00",
        confidence: 82.3,
      },
      photos: [
        {
          id: "photo-1",
          type: "package",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 15:44:00",
          description: "Package at doorstep",
          quality: 78,
          flags: ["blurry"],
        },
        {
          id: "photo-2",
          type: "receiver",
          url: "/api/placeholder/400/300",
          timestamp: "2024-12-11 15:45:00",
          description: "Receiver with package",
          quality: 82,
          flags: [],
        },
      ],
      idVerification: {
        type: "PAN Card",
        number: "XXXXX1234X",
        photo: "/api/placeholder/300/200",
        verified: true,
        confidence: 89.6,
      },
      notes: "Receiver confirmed delivery. Product in good condition.",
    },
    verification: {
      status: "in_progress",
      confidence: 84.1,
      automated: true,
      verifiedBy: "AI System",
      verifiedAt: "2024-12-11 15:46:00",
      flags: ["photo_quality_issue"],
      comments: "One photo appears blurry. Requires manual quality check.",
      score: 84,
    },
    risk: {
      level: "low",
      factors: [],
      score: 22,
    },
  },
];

export const verificationStats = {
  totalPending: 156,
  verifiedToday: 89,
  rejectionRate: 4.3,
  avgVerificationTime: "2.1 min",
  automationRate: 78.5,
  qualityScore: 92.7,
  highRiskCases: 12,
};

export const statusConfig = {
  verified: {
    label: "Verified",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "CheckCircle2",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "Clock",
  },
  review_required: {
    label: "Review Required",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "AlertCircle",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "RefreshCw",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "XCircle",
  },
};

export const priorityConfig = {
  high: { label: "High", color: "bg-red-100 text-red-800 border-red-200" },
  medium: {
    label: "Medium",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  low: { label: "Low", color: "bg-green-100 text-green-800 border-green-200" },
};

export const riskConfig = {
  low: {
    label: "Low Risk",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  medium: {
    label: "Medium Risk",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  high: { label: "High Risk", color: "bg-red-100 text-red-800 border-red-200" },
};

export const confidenceConfig = {
  high: {
    label: "High Confidence",
    color: "bg-green-100 text-green-800 border-green-200",
    min: 80,
  },
  medium: {
    label: "Medium Confidence",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    min: 60,
  },
  low: {
    label: "Low Confidence",
    color: "bg-red-100 text-red-800 border-red-200",
    min: 0,
  },
};
