"use client";

import BookingPage from "@/components/booking/BookingPage";
import CustomerBookingWizard from "@/components/booking/CustomerBookingWizard";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function CreateBookingPage() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session?.user?.role === 'customer') {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-muted/20 px-3 py-4 sm:px-6 sm:py-6">
        <CustomerBookingWizard />
      </div>
    );
  }

  return <BookingPage />;
}
