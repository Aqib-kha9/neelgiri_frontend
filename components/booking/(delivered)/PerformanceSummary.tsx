import {
  BarChart3,
  Verified,
  ThumbsUp,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deliveredData } from "./data/mockData";

const PerformanceSummary = () => {
  const getVerificationCount = (status: string) => {
    return deliveredData.filter(
      (delivery) =>
        status === "all" || delivery.podVerification.status === status
    ).length;
  };

  const getAverageRating = () => {
    const ratings = deliveredData.map((d) => d.deliveryInfo.customerRating);
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  const getTotalRevenue = () => {
    return deliveredData.reduce((sum, delivery) => {
      return (
        sum +
        parseFloat(
          delivery.financials.totalAmount.replace("₹", "").replace(",", "")
        )
      );
    }, 0);
  };

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" />
          Delivery Performance Summary
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Overview of delivery performance and customer satisfaction
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-xl border-green-200 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Verified className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {getVerificationCount("verified")}
                  </p>
                  <p className="text-sm text-muted-foreground">POD Verified</p>
                  <p className="text-xs text-green-600">
                    {Math.round(
                      (getVerificationCount("verified") /
                        deliveredData.length) *
                        100
                    )}
                    % success rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <ThumbsUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {getAverageRating()}/5
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="text-xs text-blue-600">
                    {
                      deliveredData.filter(
                        (d) => d.deliveryInfo.customerRating >= 4
                      ).length
                    }{" "}
                    positive reviews
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-purple-200 bg-purple-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <IndianRupee className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{getTotalRevenue().toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-xs text-purple-600">
                    From {deliveredData.length} successful deliveries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 rounded-xl border border-green-200 bg-green-50/50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Delivery Success Summary
              </p>
              <p className="text-xs text-muted-foreground">
                {deliveredData.length} successful deliveries with{" "}
                {getVerificationCount("verified")} verified PODs. Customer
                satisfaction rating of {getAverageRating()}/5 based on{" "}
                {deliveredData.length} reviews.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceSummary;
