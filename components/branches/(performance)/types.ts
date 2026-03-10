export interface BranchPerformance {
  id: string;
  name: string;
  code: string;
  type: "company" | "partner";
  manager: string;
  location: string;
  performanceScore: number;
  deliverySuccessRate: number;
  customerSatisfaction: number;
  avgDeliveryTime: string;
  activeIssues: number;
  revenue: number;
  status: "active" | "warning" | "critical";
  lastAuditDate: string;
  trend: "up" | "down" | "stable";
}

export interface PerformanceStat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: any;
  description: string;
}
