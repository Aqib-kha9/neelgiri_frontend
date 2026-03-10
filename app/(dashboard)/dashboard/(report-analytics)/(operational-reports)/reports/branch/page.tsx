import BranchPerformance from "@/components/reports-analytics/operational-reports/(branch-performance)/BranchPerformance";

export const metadata = {
    title: "Branch Performance | Operational Reports",
    description: "Analyze branch-wise key performance indicators.",
};

export default function BranchPerformancePage() {
    return <BranchPerformance />;
}
