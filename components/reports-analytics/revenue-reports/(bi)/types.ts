export interface BIInsight {
    id: string;
    category: "Growth" | "Efficiency" | "Market" | "Risk";
    insight: string;
    impact: "High" | "Medium" | "Low";
    recommendation: string;
}
