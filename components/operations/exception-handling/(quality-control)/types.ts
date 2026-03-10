export interface QualityCheck {
    id: string;
    metric: string;
    score: number;
    target: number;
    status: "pass" | "fail" | "warning";
    lastChecked: string;
}
