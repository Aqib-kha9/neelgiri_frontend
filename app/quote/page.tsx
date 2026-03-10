import PublicLayout from "@/components/layout/PublicLayout";
import QuoteCalculator from "@/components/pricing/QuoteCalculator";
import { Calculator } from "lucide-react";

export const metadata = {
    title: "Get a Shipping Quote - LogiFlow Express",
    description: "Calculate shipping rates instantly. Check prices for express and standard delivery services across India.",
};

export default function QuotePage() {
    return (
        <PublicLayout>
            <div className="min-h-screen bg-muted/30">

                {/* Header Section */}
                <div className="bg-primary/5 pb-24 pt-16 md:pt-28 px-6 md:px-12 lg:px-24">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                            <Calculator className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                            Calculate Shipping Rates
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                            Get instant price estimates for your shipments based on weight and destination.
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 -mt-12 pb-24">
                    <QuoteCalculator />
                </div>

            </div>
        </PublicLayout>
    );
}
