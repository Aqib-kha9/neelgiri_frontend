import { BIInsight } from "./types";

export const mockBIInsights: BIInsight[] = [
    { id: "BI-1", category: "Growth", insight: "North Zone orders increased by 15%", impact: "High", recommendation: "Allocate 10 more riders to North Zone." },
    { id: "BI-2", category: "Efficiency", insight: "Avg delivery time spiked on weekends", impact: "Medium", recommendation: "Implement weekend specific routing optimization." },
    { id: "BI-3", category: "Risk", insight: "High COD returns in East Sector", impact: "High", recommendation: "Restrict COD for first-time customers in this sector." },
    { id: "BI-4", category: "Market", insight: "Competitor lowering rates in South Zone", impact: "Medium", recommendation: "Launch discount campaign for loyal customers." },
];
