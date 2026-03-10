import PendingExceptions from "@/components/operations/exception-handling/(pending-exceptions)/PendingExceptions";

export const metadata = {
    title: "Pending Exceptions | Operations",
    description: "View and manage pending delivery exceptions.",
};

export default function PendingExceptionsPage() {
    return <PendingExceptions />;
}
