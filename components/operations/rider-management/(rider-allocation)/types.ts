export interface Rider {
    id: string;
    name: string;
    riderId: string;
    avatar?: string;
    phone: string;
    zone: string;
    status: "active" | "inactive" | "on-leave" | "blocked";
    vehicleType: "bike" | "scooter" | "ev" | "bicycle";
    currentLoad: number; // percentage or count
    assignedOrders: number;
    shift: "morning" | "evening" | "night" | "full-day";
    joiningDate: string;
    rating: number;
}
