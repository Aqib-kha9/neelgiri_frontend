import { Exception } from "./types";

export const exceptionsData: Exception[] = [
  {
    id: "EXP-001",
    awbNumber: "HJD292412504",
    type: "delivery_failed",
    severity: "high",
    status: "open",
    title: "Delivery Attempt Failed - Customer Not Available",
    description:
      "Three delivery attempts made. Customer not available at provided address. Left notification card each time.",
    createdAt: "2024-12-11 18:30",
    updatedAt: "2024-12-11 18:30",
    priority: "urgent",
    shipment: {
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
      },
      package: {
        type: "Parcel",
        weight: "5 kg",
        description: "Electronics items - Mobile Phone",
        codAmount: "₹500",
      },
      service: {
        type: "Standard",
        payment: "COD",
      },
    },
    details: {
      attempts: 3,
      lastAttempt: "2024-12-11 17:45",
      rider: "Raj Kumar (RDR-001)",
      notes:
        "Customer not responding to calls. Neighbors confirm person moved out last week.",
      location: {
        latitude: "12.9716",
        longitude: "77.5946",
        address: "123 MG Road, Bangalore",
      },
    },
    resolution: {
      required: true,
      assignedTo: "Dispute Team",
      deadline: "2024-12-12 18:30",
      actions: ["Contact sender", "Verify address", "Attempt call to receiver"],
    },
    financialImpact: {
      codAmount: "₹500",
      additionalCharges: "₹150",
      totalImpact: "₹650",
    },
  },
  // ... include other exception objects from your original data
];
