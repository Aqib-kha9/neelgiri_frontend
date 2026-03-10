import { QualityCheck } from "./types";

export const mockQuality: QualityCheck[] = [
    { id: "QC-1", metric: "Package Handling", score: 98, target: 99, status: "warning", lastChecked: "Today" },
    { id: "QC-2", metric: "Proof of Delivery", score: 100, target: 100, status: "pass", lastChecked: "Today" },
    { id: "QC-3", metric: "Customer Conduct", score: 95, target: 95, status: "pass", lastChecked: "Yesterday" },
    { id: "QC-4", metric: "Uniform Compliance", score: 88, target: 95, status: "fail", lastChecked: "Today" },
];
