// ROUTE: /dashboard/partner-performance

import {
  Users,
  TrendingUp,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Star,
  Download,
  Calendar,
  Filter,
  Shield,
  IndianRupee,
  MapPin,
} from "lucide-react";

import { PartnerPerformanceHeader } from "@/components/dashboard/partner-performance/PartnerPerformanceHeader";
import { PartnerStatsGrid } from "@/components/dashboard/partner-performance/PartnerStatsGrid";
import { PartnerScorecardsPanel } from "@/components/dashboard/partner-performance/PartnerScorecardsPanel";
import { PerformanceTrendsPanel } from "@/components/dashboard/partner-performance/PerformanceTrendsPanel";
import { SLACompliancePanel } from "@/components/dashboard/partner-performance/SLACompliancePanel";
import { RevenueSharingPanel } from "@/components/dashboard/partner-performance/RevenueSharingPanel";
import { IncentiveProgramsPanel } from "@/components/dashboard/partner-performance/IncentiveProgramsPanel";
import { PartnerActivitiesPanel } from "@/components/dashboard/partner-performance/PartnerActivitiesPanel";

const partnerStats = [
  {
    title: "Total Partners",
    value: "48",
    changeLabel: "Active",
    changeValue: "42",
    trend: "up",
    icon: Users,
    color: "text-primary",
  },
  {
    title: "Avg. Performance Score",
    value: "8.7",
    suffix: "/10",
    changeLabel: "This month",
    changeValue: "+0.3",
    trend: "up",
    icon: Award,
    color: "text-success",
  },
  {
    title: "SLA Compliance",
    value: "94.2",
    suffix: "%",
    changeLabel: "vs target",
    changeValue: "+4.2%",
    trend: "up",
    icon: Shield,
    color: "text-success",
  },
  {
    title: "Revenue Shared",
    value: "₹18.2L",
    changeLabel: "This quarter",
    changeValue: "+12.8%",
    trend: "up",
    icon: IndianRupee,
    color: "text-primary",
  },
  {
    title: "Partners at Risk",
    value: "6",
    changeLabel: "Need attention",
    changeValue: "-2",
    trend: "down",
    icon: AlertTriangle,
    color: "text-warning",
  },
  {
    title: "Avg. Response Time",
    value: "2.8",
    suffix: "hours",
    changeLabel: "Support tickets",
    changeValue: "-0.4",
    trend: "down",
    icon: Clock,
    color: "text-muted-foreground",
  },
];

const partnerScorecards: {
  name: string;
  location: string;
  performance: number;
  slaCompliance: number;
  revenue: number;
  growth: number;
  status: "warning" | "excellent" | "good";
  joined: string;
}[] = [
  {
    name: "LogiMax Partners",
    location: "Mumbai, MH",
    performance: 9.2,
    slaCompliance: 98,
    revenue: 4.2,
    growth: 15,
    status: "excellent",
    joined: "Jan 2023",
  },
  {
    name: "SpeedExpress Network",
    location: "Delhi, DL",
    performance: 8.8,
    slaCompliance: 96,
    revenue: 3.8,
    growth: 12,
    status: "excellent",
    joined: "Mar 2023",
  },
  {
    name: "Metro Couriers",
    location: "Bangalore, KA",
    performance: 8.5,
    slaCompliance: 94,
    revenue: 3.2,
    growth: 8,
    status: "good",
    joined: "Jun 2023",
  },
  {
    name: "Quick Connect Logistics",
    location: "Chennai, TN",
    performance: 7.9,
    slaCompliance: 89,
    revenue: 2.8,
    growth: 5,
    status: "good",
    joined: "Aug 2023",
  },
  {
    name: "City Speed Services",
    location: "Hyderabad, TS",
    performance: 7.2,
    slaCompliance: 85,
    revenue: 2.1,
    growth: 2,
    status: "warning",
    joined: "Nov 2023",
  },
  {
    name: "Regional Express",
    location: "Kolkata, WB",
    performance: 6.8,
    slaCompliance: 82,
    revenue: 1.8,
    growth: -1,
    status: "warning",
    joined: "Feb 2024",
  },
];

const performanceTrends = [
  { month: "Jul", performance: 8.2, sla: 91, revenue: 15.2 },
  { month: "Aug", performance: 8.4, sla: 92, revenue: 16.1 },
  { month: "Sep", performance: 8.5, sla: 93, revenue: 16.8 },
  { month: "Oct", performance: 8.6, sla: 94, revenue: 17.4 },
  { month: "Nov", performance: 8.7, sla: 94.2, revenue: 18.2 },
  { month: "Dec", performance: 8.8, sla: 95, revenue: 19.1 },
];

const slaCompliance: {
  metric: string;
  target: string | number;
  actual: string | number;
  status: "warning" | "exceeded" | "met";
}[] = [
  { metric: "On-time Delivery", target: 95, actual: 96.2, status: "exceeded" },
  { metric: "Pickup Compliance", target: 98, actual: 97.8, status: "met" },
  { metric: "POD Capture Rate", target: 99, actual: 98.5, status: "met" },
  {
    metric: "Customer Satisfaction",
    target: 90,
    actual: 92.4,
    status: "exceeded",
  },
  { metric: "Exception Rate", target: "≤2%", actual: "1.8%", status: "met" },
  { metric: "Response Time", target: "4h", actual: "2.8h", status: "exceeded" },
];

const revenueSharing: {
  partner: string;
  revenue: number;
  commission: number;
  payout: string;
  status: "pending" | "paid" | "processing";
}[] = [
  {
    partner: "LogiMax Partners",
    revenue: 4.2,
    commission: 0.63,
    payout: "₹63,000",
    status: "paid",
  },
  {
    partner: "SpeedExpress Network",
    revenue: 3.8,
    commission: 0.57,
    payout: "₹57,000",
    status: "paid",
  },
  {
    partner: "Metro Couriers",
    revenue: 3.2,
    commission: 0.48,
    payout: "₹48,000",
    status: "pending",
  },
  {
    partner: "Quick Connect Logistics",
    revenue: 2.8,
    commission: 0.42,
    payout: "₹42,000",
    status: "pending",
  },
  {
    partner: "City Speed Services",
    revenue: 2.1,
    commission: 0.315,
    payout: "₹31,500",
    status: "processing",
  },
];

const incentivePrograms: {
  program: string;
  description: string;
  reward: string;
  participants: number;
  status: "active";
  deadline: string;
}[] = [
  {
    program: "Q4 Excellence Bonus",
    description: "Top 5 partners by performance score",
    reward: "₹50,000",
    participants: 48,
    status: "active",
    deadline: "31 Dec 2024",
  },
  {
    program: "SLA Achievement Award",
    description: "Maintain 98%+ SLA for 3 consecutive months",
    reward: "₹25,000",
    participants: 42,
    status: "active",
    deadline: "15 Jan 2025",
  },
  {
    program: "Growth Accelerator",
    description: "Achieve 15%+ revenue growth in Q4",
    reward: "₹35,000",
    participants: 38,
    status: "active",
    deadline: "31 Dec 2024",
  },
];

const recentPartnerActivities = [
  {
    id: "1",
    title: "LogiMax Partners achieved 99% SLA",
    description:
      "Maintained exceptional service levels for 3 consecutive months",
    status: "success" as const,
    timestamp: "2 days ago",
    partner: "LogiMax Partners",
  },
  {
    id: "2",
    title: "Regional Express performance review",
    description: "Scheduled improvement plan for underperforming metrics",
    status: "warning" as const,
    timestamp: "3 days ago",
    partner: "Regional Express",
  },
  {
    id: "3",
    title: "New partner onboarding completed",
    description: "Urban Connect Logistics joined the network in Pune",
    status: "success" as const,
    timestamp: "5 days ago",
    partner: "Urban Connect Logistics",
  },
  {
    id: "4",
    title: "Q4 incentive program launched",
    description: "Three new performance-based reward programs introduced",
    status: "info" as const,
    timestamp: "1 week ago",
    partner: "All Partners",
  },
  {
    id: "5",
    title: "Commission structure updated",
    description: "New tiered commission rates effective from January",
    status: "info" as const,
    timestamp: "2 weeks ago",
    partner: "All Partners",
  },
];

export default function Page() {
  return (
    <div className="space-y-7">
      <PartnerPerformanceHeader />

      <PartnerStatsGrid stats={partnerStats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <PartnerScorecardsPanel data={partnerScorecards} />
        <PerformanceTrendsPanel data={performanceTrends} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SLACompliancePanel data={slaCompliance} />
        <RevenueSharingPanel data={revenueSharing} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <IncentiveProgramsPanel data={incentivePrograms} />
        <PartnerActivitiesPanel data={recentPartnerActivities} />
      </div>
    </div>
  );
}
