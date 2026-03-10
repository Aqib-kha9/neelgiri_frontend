import { Route } from "./types";

export const mockRoutes: Route[] = [
  {
    id: "R001",
    code: "BOM-DEL-L1",
    sourceCity: "Mumbai",
    destinationCity: "Delhi",
    sourceHub: "Mumbai Gateway",
    destinationHub: "Delhi Hub",
    totalDistanceKm: 1420,
    totalTransitTimeHours: 36,
    schedule: ["MON", "WED", "FRI"],
    departureTime: "22:00",
    stops: [
      {
        id: "S1",
        hubId: "HB-SUR-01",
        hubName: "Surat Hub",
        sequence: 1,
        distanceFromPrevKm: 280,
        transitTimeFromPrevMins: 300, // 5 hours
        haltTimeMins: 45
      },
      {
        id: "S2",
        hubId: "HB-JAI-01",
        hubName: "Jaipur Hub",
        sequence: 2,
        distanceFromPrevKm: 850,
        transitTimeFromPrevMins: 960, // 16 hours
        haltTimeMins: 60
      }
    ],
    status: "ACTIVE",
    type: "LINEHAUL",
    isReturnRoute: true,
    returnRouteId: "R001-RET",
    baseCost: 28000,
    vehicleTypeRequired: "32FT MXL"
  },
  {
    id: "R002",
    code: "BLR-CHE-L1",
    sourceCity: "Bangalore",
    destinationCity: "Chennai",
    sourceHub: "Bangalore Hub",
    destinationHub: "Chennai Hub",
    totalDistanceKm: 350,
    totalTransitTimeHours: 8,
    schedule: ["DAILY"],
    departureTime: "21:00",
    stops: [
      {
        id: "S1",
        hubId: "HB-HOS-01",
        hubName: "Hosur",
        sequence: 1,
        distanceFromPrevKm: 40,
        transitTimeFromPrevMins: 90,
        haltTimeMins: 30
      }
    ],
    status: "ACTIVE",
    type: "LINEHAUL",
    isReturnRoute: true,
    baseCost: 5000,
    vehicleTypeRequired: "20FT SXL"
  },
  {
    id: "R003",
    code: "BOM-PUN-F1",
    sourceCity: "Mumbai",
    destinationCity: "Pune",
    sourceHub: "Mumbai Gateway",
    destinationHub: "Pune Branch",
    totalDistanceKm: 150,
    totalTransitTimeHours: 4,
    schedule: ["DAILY"],
    departureTime: "06:00",
    stops: [],
    status: "ACTIVE",
    type: "FEEDER",
    isReturnRoute: true,
    baseCost: 2000,
    vehicleTypeRequired: "TATA 407"
  },
  {
    id: "R004",
    code: "DEL-GGN-LM1",
    sourceCity: "Delhi",
    destinationCity: "Gurgaon",
    sourceHub: "Delhi Hub",
    destinationHub: "Gurgaon DC",
    totalDistanceKm: 40,
    totalTransitTimeHours: 2,
    schedule: ["DAILY"],
    departureTime: "08:00",
    stops: [],
    status: "ACTIVE",
    type: "LAST_MILE",
    isReturnRoute: false,
    baseCost: 500,
    vehicleTypeRequired: "TATA ACE"
  },
  {
    id: "R005",
    code: "HYD-BLR-EXP",
    sourceCity: "Hyderabad",
    destinationCity: "Bangalore",
    sourceHub: "Hyderabad Gateway",
    destinationHub: "Bangalore Hub",
    totalDistanceKm: 570,
    totalTransitTimeHours: 12,
    schedule: ["TUE", "THU", "SAT"],
    departureTime: "18:00",
    stops: [
       {
        id: "S1",
        hubId: "HB-KUR-01",
        hubName: "Kurnool",
        sequence: 1,
        distanceFromPrevKm: 210,
        transitTimeFromPrevMins: 240, 
        haltTimeMins: 30
      },
      {
        id: "S2",
        hubId: "HB-ATP-01",
        hubName: "Anantapur",
        sequence: 2,
        distanceFromPrevKm: 150,
        transitTimeFromPrevMins: 180, 
        haltTimeMins: 30
      }
    ],
    status: "ACTIVE",
    type: "LINEHAUL",
    isReturnRoute: true,
    baseCost: 12500,
    vehicleTypeRequired: "32FT SXL"
  }
];
