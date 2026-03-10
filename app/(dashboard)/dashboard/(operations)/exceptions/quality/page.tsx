import QualityControl from "@/components/operations/exception-handling/(quality-control)/QualityControl";

export const metadata = {
    title: "Quality Control | Operations",
    description: "Monitor service quality metrics.",
};

export default function QualityControlPage() {
    return <QualityControl />;
}
