import { mockRateRules } from "@/components/master/(rates)/mockData";
import { mockRoutes } from "@/components/master/(routes)/mockData";
import { mockProducts } from "@/components/master/(products)/mockData";
import { RateRule } from "@/components/master/(rates)/types";

// Types for calculation
interface CalculationResult {
  baseFreight: number;
  fuelSurcharge: number;
  taxAmount: number;
  netAmount: number;
  rateApplied: number;
  chargeableWeight: number;
  docketCharge: number;
  fovCharge: number;
  error?: string;
}

interface CalcParams {
  weight: number;
  length?: number;
  breadth?: number;
  height?: number;
  serviceType: string; // SURFACE | AIR
  distanceZone?: string; // For now assuming ZONE based on cities
  sourceCity: string;
  destCity: string;
  declaredValue?: number;
}

export const calculateVolumetricWeight = (l: number, b: number, h: number, divisor: number = 5000) => {
  return (l * b * h) / divisor;
};

export const findServiceableRoute = (source: string, dest: string) => {
  // Simple match for now based on City names in Mock Data
  // In real app, this would be Pincode based
  return mockRoutes.find(
    r => r.sourceCity.toLowerCase() === source.toLowerCase() && 
         r.destinationCity.toLowerCase() === dest.toLowerCase()
  );
};

export const calculateBookingCharges = (params: CalcParams): CalculationResult => {
  const { weight, length = 0, breadth = 0, height = 0, serviceType, declaredValue = 0 } = params;

  // 1. Find applicable Rate Rule
  // Priority: Match Service Type (SURFACE/AIR)
  const rule = mockRateRules.find(r => r.serviceType === serviceType && r.isActive) || mockRateRules[0];

  if (!rule) {
    return {
      baseFreight: 0, fuelSurcharge: 0, taxAmount: 0, netAmount: 0, 
      rateApplied: 0, chargeableWeight: 0, docketCharge: 0, fovCharge: 0,
      error: "No applicable rate card found"
    };
  }

  // 2. Calculate Chargeable Weight
  const volWeight = calculateVolumetricWeight(length, breadth, height, rule.volumetricDivisor || 5000);
  // Round up to next 0.5 or 1 based on rule, for now simple Math.ceil
  const chargeableWeight = Math.max(weight, volWeight);
  
  // 3. Find Rate Slab
  let rate = 0;
  let baseFreight = 0;

  // Simple slab logic
  const slab = rule.slabs.find(s => chargeableWeight > s.minWeight && chargeableWeight <= s.maxWeight);
  
  if (slab) {
    rate = slab.rate;
    if (slab.rateType === "FIXED") {
      baseFreight = rate;
    } else {
      baseFreight = rate * chargeableWeight;
    }
  } else {
    // Fallback to highest slab or default
    rate = 25; // Default fallback
    baseFreight = rate * chargeableWeight;
  }

  // Min Charge Check
  if (rule.minCharge && baseFreight < rule.minCharge.amount) {
    baseFreight = rule.minCharge.amount;
  }

  // 4. Surcharges
  let fuelSurcharge = 0;
  if (rule.fuelSurcharge) {
    fuelSurcharge = (baseFreight * rule.fuelSurcharge.percentage) / 100;
  }

  let fovCharge = 0;
  if (declaredValue > 0 && rule.fovCharge) {
    fovCharge = Math.max(
        (declaredValue * rule.fovCharge.percentage) / 100, 
        rule.fovCharge.minAmount
    );
  }

  let docketCharge = 0; // Fixed docket/handling charge if any
  
  // 5. Total
  const taxableAmount = baseFreight + fuelSurcharge + fovCharge + docketCharge;
  const taxAmount = taxableAmount * 0.18; // 18% GST standard
  const netAmount = taxableAmount + taxAmount;

  return {
    baseFreight: Number(baseFreight.toFixed(2)),
    fuelSurcharge: Number(fuelSurcharge.toFixed(2)),
    fovCharge: Number(fovCharge.toFixed(2)),
    docketCharge: Number(docketCharge.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    netAmount: Number(netAmount.toFixed(2)),
    rateApplied: rate,
    chargeableWeight: Number(chargeableWeight.toFixed(2))
  };
};

// Validation Logic based on Master Data
export const validateBookingRules = (customer: any, serviceType: string, paymentMode: string): string | null => {
    if (!customer) return null;

    // 1. Service Check
    if (customer.allowedServices && customer.allowedServices.length > 0) {
        if (!customer.allowedServices.includes(serviceType) && !customer.allowedServices.includes("ALL")) {
            return `Service '${serviceType}' is not allowed for this customer. Allowed: ${customer.allowedServices.join(", ")}`;
        }
    }

    // 2. Credit Check
    if (paymentMode === "CREDIT") {
         if (customer.riskStatus === "HIGH") {
             return "Credit Blocked: Customer Risk Status is HIGH.";
         }
         // In real app, check Credit Limit vs Current Outstanding
    }

    return null; // All good
};

export const searchProducts = (query: string) => {
    if (!query) return [];
    return mockProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.sku.toLowerCase().includes(query.toLowerCase())
    );
};
