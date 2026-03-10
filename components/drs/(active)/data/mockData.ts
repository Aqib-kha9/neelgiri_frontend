export const activeDRSData = [
  {
    id: "DRS-001",
    drsNumber: "DRS-20241211-001",
    status: "in_progress",
    rider: {
      id: "RDR-001",
      name: "Raj Kumar",
      phone: "9876543210",
      vehicle: "Bike",
      capacity: 25,
    },
    date: "2024-12-11",
    timeline: {
      startTime: "2024-12-11 09:30:00",
      expectedEnd: "2024-12-11 18:00:00",
      lastUpdate: "2024-12-11 14:45:00",
    },
    progress: {
      totalShipments: 18,
      delivered: 12,
      pending: 6,
      returned: 0,
      completion: 67,
    },
    financial: {
      totalCOD: 4500,
      collectedCOD: 3200,
      pendingCOD: 1300,
    },
    performance: {
      averageTimePerStop: "15 min",
      efficiency: 85,
      onTimeRate: 92,
    },
    location: {
      current: "Salt Lake, Kolkata",
      lastUpdate: "2 min ago",
      connectivity: "online",
      battery: 75,
    },
    route: {
      totalDistance: "45 km",
      completedDistance: "32 km",
      remainingDistance: "13 km",
      optimized: true,
    },
    alerts: [
      {
        type: "delay",
        message: "Behind schedule by 15 min",
        priority: "medium",
      },
    ],
  },
  {
    id: "DRS-002",
    drsNumber: "DRS-20241211-002",
    status: "in_progress",
    rider: {
      id: "RDR-002",
      name: "Amit Sharma",
      phone: "9876543211",
      vehicle: "Bike",
      capacity: 25,
    },
    date: "2024-12-11",
    timeline: {
      startTime: "2024-12-11 10:15:00",
      expectedEnd: "2024-12-11 19:00:00",
      lastUpdate: "2024-12-11 15:20:00",
    },
    progress: {
      totalShipments: 22,
      delivered: 8,
      pending: 14,
      returned: 0,
      completion: 36,
    },
    financial: {
      totalCOD: 7800,
      collectedCOD: 2800,
      pendingCOD: 5000,
    },
    performance: {
      averageTimePerStop: "22 min",
      efficiency: 65,
      onTimeRate: 78,
    },
    location: {
      current: "Park Street, Kolkata",
      lastUpdate: "5 min ago",
      connectivity: "online",
      battery: 45,
    },
    route: {
      totalDistance: "52 km",
      completedDistance: "18 km",
      remainingDistance: "34 km",
      optimized: true,
    },
    alerts: [
      { type: "performance", message: "Low efficiency rate", priority: "high" },
      {
        type: "battery",
        message: "Rider device battery low",
        priority: "medium",
      },
    ],
  },
  {
    id: "DRS-003",
    drsNumber: "DRS-20241211-003",
    status: "paused",
    rider: {
      id: "RDR-003",
      name: "Rohit Verma",
      phone: "9876543212",
      vehicle: "Scooter",
      capacity: 20,
    },
    date: "2024-12-11",
    timeline: {
      startTime: "2024-12-11 09:45:00",
      expectedEnd: "2024-12-11 17:30:00",
      lastUpdate: "2024-12-11 13:15:00",
    },
    progress: {
      totalShipments: 15,
      delivered: 9,
      pending: 6,
      returned: 0,
      completion: 60,
    },
    financial: {
      totalCOD: 3200,
      collectedCOD: 1900,
      pendingCOD: 1300,
    },
    performance: {
      averageTimePerStop: "18 min",
      efficiency: 82,
      onTimeRate: 88,
    },
    location: {
      current: "Howrah Bridge",
      lastUpdate: "25 min ago",
      connectivity: "offline",
      battery: 20,
    },
    route: {
      totalDistance: "38 km",
      completedDistance: "24 km",
      remainingDistance: "14 km",
      optimized: true,
    },
    alerts: [
      {
        type: "connectivity",
        message: "Rider offline for 25 min",
        priority: "high",
      },
      {
        type: "battery",
        message: "Rider device critical battery",
        priority: "critical",
      },
    ],
  },
  {
    id: "DRS-004",
    drsNumber: "DRS-20241211-004",
    status: "completed",
    rider: {
      id: "RDR-004",
      name: "Sneha Patel",
      phone: "9876543213",
      vehicle: "Bike",
      capacity: 25,
    },
    date: "2024-12-11",
    timeline: {
      startTime: "2024-12-11 08:30:00",
      expectedEnd: "2024-12-11 16:00:00",
      lastUpdate: "2024-12-11 15:45:00",
      actualEnd: "2024-12-11 15:45:00",
    },
    progress: {
      totalShipments: 20,
      delivered: 19,
      pending: 0,
      returned: 1,
      completion: 100,
    },
    financial: {
      totalCOD: 5600,
      collectedCOD: 5200,
      pendingCOD: 400,
    },
    performance: {
      averageTimePerStop: "12 min",
      efficiency: 94,
      onTimeRate: 100,
    },
    location: {
      current: "Warehouse",
      lastUpdate: "10 min ago",
      connectivity: "online",
      battery: 35,
    },
    route: {
      totalDistance: "42 km",
      completedDistance: "42 km",
      remainingDistance: "0 km",
      optimized: true,
    },
    alerts: [],
  },
  {
    id: "DRS-005",
    drsNumber: "DRS-20241211-005",
    status: "scheduled",
    rider: {
      id: "RDR-005",
      name: "Vikram Joshi",
      phone: "9876543214",
      vehicle: "Scooter",
      capacity: 20,
    },
    date: "2024-12-11",
    timeline: {
      startTime: "2024-12-11 14:00:00",
      expectedEnd: "2024-12-11 20:00:00",
      lastUpdate: "2024-12-11 13:30:00",
    },
    progress: {
      totalShipments: 16,
      delivered: 0,
      pending: 16,
      returned: 0,
      completion: 0,
    },
    financial: {
      totalCOD: 4100,
      collectedCOD: 0,
      pendingCOD: 4100,
    },
    performance: {
      averageTimePerStop: "0 min",
      efficiency: 0,
      onTimeRate: 0,
    },
    location: {
      current: "Not started",
      lastUpdate: "N/A",
      connectivity: "offline",
      battery: 100,
    },
    route: {
      totalDistance: "35 km",
      completedDistance: "0 km",
      remainingDistance: "35 km",
      optimized: true,
    },
    alerts: [
      { type: "schedule", message: "Starting in 30 minutes", priority: "low" },
    ],
  },
];

export const drsStats = {
  totalActive: 3,
  completedToday: 8,
  totalRiders: 12,
  averageEfficiency: 78.5,
  totalCODCollection: 45200,
  onTimeDelivery: 89.2,
  pendingShipments: 156,
  activeRiders: 9,
};

export const statusConfig = {
  scheduled: {
    label: "Scheduled",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "Clock",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "PlayCircle",
  },
  paused: {
    label: "Paused",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "PauseCircle",
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

export const connectivityConfig = {
  online: {
    label: "Online",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "Wifi",
  },
  offline: {
    label: "Offline",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "WifiOff",
  },
};
