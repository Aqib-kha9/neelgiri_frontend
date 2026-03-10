export const missingPODData = [
  {
    id: "MPOD-001",
    awbNumber: "HJD292412510",
    status: "pending",
    priority: "high",
    shipmentDate: "2024-12-10",
    deliveryDate: "2024-12-11",
    deliveryAgent: "Raj Kumar (RDR-001)",
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
    timeline: {
      reported: "2024-12-11 16:30:00",
      lastUpdated: "2024-12-11 16:30:00",
      sla: "2024-12-12 18:00:00",
    },
    investigation: {
      status: "not_started",
      assignedTo: null,
      attempts: 0,
      lastAttempt: null,
      notes: "",
    },
    risk: {
      level: "high",
      score: 78,
      factors: ["cod_shipment", "high_value", "first_occurrence"],
    },
    financial: {
      potentialLoss: "₹500",
      insuranceCovered: "₹15,000",
      resolutionCost: "₹0",
    },
  },
  // ... include all other mock data objects from original file
];

export const missingPODStats = {
  totalMissing: 156,
  pendingResolution: 89,
  resolvedToday: 23,
  escalatedCases: 12,
  avgResolutionTime: "2.3 days",
  successRate: 85.7,
  financialRisk: "₹1,45,600",
};
