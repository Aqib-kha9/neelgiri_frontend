import { RootCause } from "./types";

export const mockRCA: RootCause[] = [
    { id: "RCA-1", category: "Address", issue: "Invalid Pincode", frequency: 145, impact: "High", trend: "up" },
    { id: "RCA-2", category: "Customer", issue: "Unreachable", frequency: 98, impact: "Medium", trend: "stable" },
    { id: "RCA-3", category: "Rider", issue: "Vehicle Breakdown", frequency: 45, impact: "Low", trend: "down" },
    { id: "RCA-4", category: "System", issue: "App Crash", frequency: 12, impact: "High", trend: "down" },
];
