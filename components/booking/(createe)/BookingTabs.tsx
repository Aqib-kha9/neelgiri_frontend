"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Truck, MapPin, User, CheckCircle2 } from "lucide-react";

const BookingTabs = ({ onComplete }: any) => {
  const [tab, setTab] = useState("details");
  const [data, setData] = useState<any>({});

  const nextTab = () => {
    if (tab === "details") setTab("sender");
    else if (tab === "sender") setTab("receiver");
    else if (tab === "receiver") setTab("review");
    else {
      const awb = "AWB-" + Math.floor(Math.random() * 90000 + 10000);
      const charges = { total: 280, tax: 42, final: 322 };
      onComplete(data, awb, charges);
    }
  };

  const handleChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full space-y-5">
          <TabsList className="grid grid-cols-4 rounded-xl bg-muted/40">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="sender">Sender</TabsTrigger>
            <TabsTrigger value="receiver">Receiver</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          {/* Details */}
          <TabsContent value="details">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Package Type</label>
                <Input
                  placeholder="Documents / Parcel"
                  onChange={(e) => handleChange("packageType", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Weight (kg)</label>
                <Input
                  placeholder="e.g. 2.5"
                  onChange={(e) => handleChange("weight", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Pickup Location</label>
                <Input
                  placeholder="Enter pickup address"
                  onChange={(e) => handleChange("pickup", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Destination</label>
                <Input
                  placeholder="Enter destination address"
                  onChange={(e) => handleChange("destination", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Sender */}
          <TabsContent value="sender">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Sender Name
                </label>
                <Input
                  placeholder="Full Name"
                  onChange={(e) => handleChange("senderName", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sender Phone</label>
                <Input
                  placeholder="Mobile number"
                  onChange={(e) => handleChange("senderPhone", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Sender Address
                </label>
                <Input
                  placeholder="Street, City, State"
                  onChange={(e) =>
                    handleChange("senderAddress", e.target.value)
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Receiver */}
          <TabsContent value="receiver">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Receiver Name
                </label>
                <Input
                  placeholder="Full Name"
                  onChange={(e) => handleChange("receiverName", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Receiver Phone</label>
                <Input
                  placeholder="Mobile number"
                  onChange={(e) =>
                    handleChange("receiverPhone", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Receiver Address
                </label>
                <Input
                  placeholder="Street, City, State"
                  onChange={(e) =>
                    handleChange("receiverAddress", e.target.value)
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Review */}
          <TabsContent value="review">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review all details before generating your AWB.
              </p>
              <ul className="text-sm list-disc list-inside space-y-1">
                <li>Package Type: {data.packageType}</li>
                <li>Pickup: {data.pickup}</li>
                <li>Destination: {data.destination}</li>
                <li>Sender: {data.senderName}</li>
                <li>Receiver: {data.receiverName}</li>
              </ul>
            </div>
          </TabsContent>

          <div className="flex justify-end pt-4">
            <Button
              onClick={nextTab}
              className="gap-2 rounded-xl bg-primary text-primary-foreground"
            >
              {tab === "review" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Complete Booking
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4" /> Next Step
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingTabs;
