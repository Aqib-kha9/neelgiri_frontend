import { Progress } from "@/components/ui/progress";
import { Delivery } from "@/components/booking/(out-for-delivery)/types/index";

interface DeliveryProgressProps {
  delivery: Delivery;
}

const DeliveryProgress = ({ delivery }: DeliveryProgressProps) => {
  const steps = [
    { label: "Assigned", completed: true },
    { label: "Picked Up", completed: true },
    { label: "In Transit", completed: true },
    {
      label: "Out for Delivery",
      completed:
        delivery.currentStatus === "out_for_delivery" ||
        delivery.currentStatus === "delivery_attempted" ||
        delivery.currentStatus === "delivered",
    },
    { label: "Delivered", completed: delivery.currentStatus === "delivered" },
  ];

  const currentStep = steps.filter((step) => step.completed).length;
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-center ${
              step.completed ? "text-green-600 font-medium" : ""
            }`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryProgress;
