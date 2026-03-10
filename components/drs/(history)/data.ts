// Mock data for DRS history
export const drsHistoryData = [
  {
    id: "DRS-001",
    drsNumber: "DRS-20241210-001",
    status: "completed",
    rider: {
      id: "RDR-001",
      name: "Raj Kumar",
      phone: "9876543210",
      vehicle: "Bike",
      rating: 4.8,
    },
    date: "2024-12-10",
    timeline: {
      startTime: "2024-12-10 09:30:00",
      endTime: "2024-12-10 17:45:00",
      duration: "8h 15m",
    },
    progress: {
      totalShipments: 22,
      delivered: 21,
      pending: 0,
      returned: 1,
      completion: 95,
    },
    financial: {
      totalCOD: 12500,
      collectedCOD: 12000,
      pendingCOD: 500,
      cashDeposited: 12000,
      depositTime: "2024-12-10 18:30:00",
    },
    performance: {
      averageTimePerStop: "14 min",
      efficiency: 92,
      onTimeRate: 96,
      customerRating: 4.7,
    },
    route: {
      totalDistance: "48 km",
      optimized: true,
      fuelCost: "₹320",
    },
    issues: [
      {
        type: "return",
        description: "1 shipment returned - receiver unavailable",
      },
    ],
  },
  {
    id: "DRS-002",
    drsNumber: "DRS-20241210-002",
    status: "completed",
    rider: {
      id: "RDR-002",
      name: "Amit Sharma",
      phone: "9876543211",
      vehicle: "Bike",
      rating: 4.5,
    },
    date: "2024-12-10",
    timeline: {
      startTime: "2024-12-10 10:15:00",
      endTime: "2024-12-10 19:20:00",
      duration: "9h 5m",
    },
    progress: {
      totalShipments: 25,
      delivered: 23,
      pending: 0,
      returned: 2,
      completion: 92,
    },
    financial: {
      totalCOD: 18400,
      collectedCOD: 17500,
      pendingCOD: 900,
      cashDeposited: 17500,
      depositTime: "2024-12-10 20:15:00",
    },
    performance: {
      averageTimePerStop: "18 min",
      efficiency: 78,
      onTimeRate: 84,
      customerRating: 4.3,
    },
    route: {
      totalDistance: "55 km",
      optimized: true,
      fuelCost: "₹380",
    },
    issues: [
      { type: "delay", description: "Traffic congestion in city center" },
      {
        type: "return",
        description: "2 shipments returned - address incorrect",
      },
    ],
  },
  {
    id: "DRS-003",
    drsNumber: "DRS-20241209-001",
    status: "completed",
    rider: {
      id: "RDR-003",
      name: "Rohit Verma",
      phone: "9876543212",
      vehicle: "Scooter",
      rating: 4.9,
    },
    date: "2024-12-09",
    timeline: {
      startTime: "2024-12-09 09:45:00",
      endTime: "2024-12-09 16:30:00",
      duration: "6h 45m",
    },
    progress: {
      totalShipments: 18,
      delivered: 18,
      pending: 0,
      returned: 0,
      completion: 100,
    },
    financial: {
      totalCOD: 8200,
      collectedCOD: 8200,
      pendingCOD: 0,
      cashDeposited: 8200,
      depositTime: "2024-12-09 17:00:00",
    },
    performance: {
      averageTimePerStop: "12 min",
      efficiency: 98,
      onTimeRate: 100,
      customerRating: 4.9,
    },
    route: {
      totalDistance: "35 km",
      optimized: true,
      fuelCost: "₹240",
    },
    issues: [],
  },
  {
    id: "DRS-004",
    drsNumber: "DRS-20241209-002",
    status: "cancelled",
    rider: {
      id: "RDR-004",
      name: "Sneha Patel",
      phone: "9876543213",
      vehicle: "Bike",
      rating: 4.6,
    },
    date: "2024-12-09",
    timeline: {
      startTime: "2024-12-09 08:30:00",
      endTime: "2024-12-09 12:15:00",
      duration: "3h 45m",
    },
    progress: {
      totalShipments: 20,
      delivered: 8,
      pending: 12,
      returned: 0,
      completion: 40,
    },
    financial: {
      totalCOD: 15600,
      collectedCOD: 6200,
      pendingCOD: 9400,
      cashDeposited: 6200,
      depositTime: "2024-12-09 13:00:00",
    },
    performance: {
      averageTimePerStop: "16 min",
      efficiency: 85,
      onTimeRate: 0,
      customerRating: 4.2,
    },
    route: {
      totalDistance: "22 km",
      optimized: true,
      fuelCost: "₹180",
    },
    issues: [
      {
        type: "cancellation",
        description: "DRS cancelled due to heavy rainfall",
      },
    ],
  },
  {
    id: "DRS-005",
    drsNumber: "DRS-20241208-001",
    status: "completed",
    rider: {
      id: "RDR-005",
      name: "Vikram Joshi",
      phone: "9876543214",
      vehicle: "Scooter",
      rating: 4.4,
    },
    date: "2024-12-08",
    timeline: {
      startTime: "2024-12-08 09:00:00",
      endTime: "2024-12-08 18:45:00",
      duration: "9h 45m",
    },
    progress: {
      totalShipments: 24,
      delivered: 22,
      pending: 0,
      returned: 2,
      completion: 92,
    },
    financial: {
      totalCOD: 16800,
      collectedCOD: 15500,
      pendingCOD: 1300,
      cashDeposited: 15500,
      depositTime: "2024-12-08 19:30:00",
    },
    performance: {
      averageTimePerStop: "20 min",
      efficiency: 72,
      onTimeRate: 88,
      customerRating: 4.1,
    },
    route: {
      totalDistance: "52 km",
      optimized: false,
      fuelCost: "₹350",
    },
    issues: [
      { type: "performance", description: "Below average efficiency" },
      {
        type: "return",
        description: "2 shipments returned - receiver refused",
      },
    ],
  },
  {
    id: "DRS-006",
    drsNumber: "DRS-20241208-002",
    status: "completed",
    rider: {
      id: "RDR-001",
      name: "Raj Kumar",
      phone: "9876543210",
      vehicle: "Bike",
      rating: 4.8,
    },
    date: "2024-12-08",
    timeline: {
      startTime: "2024-12-08 10:00:00",
      endTime: "2024-12-08 17:30:00",
      duration: "7h 30m",
    },
    progress: {
      totalShipments: 20,
      delivered: 19,
      pending: 0,
      returned: 1,
      completion: 95,
    },
    financial: {
      totalCOD: 11200,
      collectedCOD: 10700,
      pendingCOD: 500,
      cashDeposited: 10700,
      depositTime: "2024-12-08 18:15:00",
    },
    performance: {
      averageTimePerStop: "15 min",
      efficiency: 90,
      onTimeRate: 94,
      customerRating: 4.6,
    },
    route: {
      totalDistance: "42 km",
      optimized: true,
      fuelCost: "₹280",
    },
    issues: [
      {
        type: "return",
        description: "1 shipment returned - receiver relocated",
      },
    ],
  },
];

// Mock data for performance analytics
export const performanceStats = {
  totalDRS: 156,
  completedDRS: 142,
  cancellationRate: 9.0,
  averageEfficiency: 85.2,
  totalRevenue: 1256400,
  onTimeDelivery: 91.5,
  customerSatisfaction: 4.6,
  peakPerformance: {
    rider: "Raj Kumar",
    efficiency: 94.8,
    deliveries: 245,
  },
};

export const statusConfig = {
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
  partial: {
    label: "Partial",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "AlertCircle",
  },
};

export const performanceConfig = {
  excellent: {
    label: "Excellent",
    color: "bg-green-100 text-green-800 border-green-200",
    min: 90,
  },
  good: {
    label: "Good",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    min: 80,
  },
  average: {
    label: "Average",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    min: 70,
  },
  poor: {
    label: "Poor",
    color: "bg-red-100 text-red-800 border-red-200",
    min: 0,
  },
};
