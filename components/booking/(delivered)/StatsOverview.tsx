import {
  CheckCircle2,
  Calendar,
  ThumbsUp,
  IndianRupee,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deliveredData } from "./data/mockData";

const StatsOverview = () => {
  const getTodayDeliveries = () => {
    return deliveredData.filter(
      (delivery) =>
        new Date(delivery.deliveryInfo.deliveredAt).toDateString() ===
        new Date().toDateString()
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
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-green-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Delivered
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {deliveredData.length}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  All Time
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Successful deliveries
              </p>
            </div>
            <div className="rounded-2xl bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-blue-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Today's Deliveries
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getTodayDeliveries()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  {Math.round(
                    (getTodayDeliveries() / deliveredData.length) * 100
                  )}
                  %
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Completed today</p>
            </div>
            <div className="rounded-2xl bg-blue-100 p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-yellow-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Average Rating
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {getAverageRating()}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Number(getAverageRating())
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Customer satisfaction
              </p>
            </div>
            <div className="rounded-2xl bg-yellow-100 p-3">
              <ThumbsUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/70 bg-gradient-to-br from-card/95 to-purple-50/50 shadow-card">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ₹{getTotalRevenue().toLocaleString()}
                </span>
                <Badge variant="success" className="rounded-full text-xs">
                  +12%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                From delivered shipments
              </p>
            </div>
            <div className="rounded-2xl bg-purple-100 p-3">
              <IndianRupee className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
