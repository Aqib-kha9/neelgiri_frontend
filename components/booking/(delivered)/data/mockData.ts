import { Verified, Clock, AlertCircle } from "lucide-react";

export const deliveredData = [
  {
    id: "DLV-001",
    awbNumber: "HJD292412504",
    sender: {
      name: "Aqib",
      phone: "8601677140",
      city: "Delhi",
      pincode: "110094",
      gstin: "07AABCU9603R1ZM",
    },
    receiver: {
      name: "Aqib Khan",
      phone: "8601677140",
      address: "123 MG Road, Brigade Road",
      city: "Bangalore",
      pincode: "560001",
      landmark: "Near UB City",
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
    deliveryInfo: {
      deliveredAt: "2024-12-11 14:30",
      deliveredBy: {
        id: "RDR-001",
        name: "Raj Kumar",
        phone: "9876543210",
        vehicle: "Bike - KA01AB1234",
      },
      receivedBy: "Reception Staff",
      relation: "Office Reception",
      proof: {
        signature: true,
        photo: true,
        idProof: false,
        notes: "Received in good condition",
      },
      podImages: [
        {
          type: "signature",
          url: "/signature-001.jpg",
          timestamp: "2024-12-11 14:30",
        },
        {
          type: "package",
          url: "/package-001.jpg",
          timestamp: "2024-12-11 14:29",
        },
      ],
      location: {
        latitude: "12.9716",
        longitude: "77.5946",
        address: "123 MG Road, Bangalore",
      },
      customerRating: 5,
      feedback: "Excellent service! Rider was very professional and on time.",
    },
    financials: {
      codCollected: "₹500",
      deliveryCharges: "₹462.56",
      totalAmount: "₹962.56",
      paymentStatus: "collected",
      invoiceGenerated: true,
      invoiceNumber: "INV-20241211-001",
    },
    timeline: [
      {
        event: "Booking Created",
        timestamp: "2024-12-10 23:36",
        status: "completed",
      },
      {
        event: "Pickup Completed",
        timestamp: "2024-12-11 09:15",
        status: "completed",
      },
      {
        event: "In Transit",
        timestamp: "2024-12-11 11:30",
        status: "completed",
      },
      {
        event: "Out for Delivery",
        timestamp: "2024-12-11 13:45",
        status: "completed",
      },
      {
        event: "Delivered",
        timestamp: "2024-12-11 14:30",
        status: "completed",
      },
    ],
    podVerification: {
      verified: true,
      verifiedBy: "Auto System",
      verifiedAt: "2024-12-11 14:35",
      status: "verified",
      notes: "POD complete with signature and photo",
    },
  },
  // ... include all other mock data objects exactly as in original
] as const;

export const verificationConfig = {
  verified: {
    label: "Verified",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: Verified,
  },
  pending: {
    label: "Pending Review",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: AlertCircle,
  },
} as const;

export const paymentConfig = {
  collected: {
    label: "Collected",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  paid: { label: "Paid", color: "bg-blue-100 text-blue-800 border-blue-200" },
  billed: {
    label: "Billed",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
} as const;
