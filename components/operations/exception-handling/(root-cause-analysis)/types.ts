export interface RootCause {
    id: string;
    category: "Address" | "Rider" | "System" | "Weather" | "Customer";
    issue: string;
    frequency: number;
    impact: "High" | "Medium" | "Low";
    trend: "up" | "down" | "stable";
}
