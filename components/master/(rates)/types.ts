// components/master/rates/types.ts
export interface RateRule {
  id: string;
  name: string;
  customerId?: string;
  customerName?: string;
  customerType: "CUSTOMER" | "AGENT" | "VENDOR" | "ALL";
  serviceType: "SURFACE" | "AIR" | "EXPRESS" | "ALL";
  vehicleType?: string; // e.g., "TATA ACE", "10FT", "20FT" - aligns with Route vehicleTypeRequired
  paymentMode: "PREPAID" | "COD" | "CREDIT" | "ALL";
  
  // Volumetric Weight Calculation
  volumetricDivisor?: number; // e.g., 5000 for Air, 6000 for Surface (CFT)
  odaCharge?: number; // Flat surcharge for ODA areas

  // Slab-wise rates
  slabs: SlabRate[];

  // Zone matrix
  zones: ZoneRate[];

  // Additional charges
  fuelSurcharge: {
    percentage: number;
    minAmount: number;
    maxAmount?: number;
    applicableFrom: number; // weight in kg
  };

  fovCharge: {
    percentage: number;
    minAmount: number;
    maxAmount?: number;
  };

  codCharges: {
    percentage: number;
    minAmount: number;
    maxAmount?: number;
    fixedCharge?: number;
  };

  minCharge: {
    amount: number;
    applicableZones: string[]; // zone codes
  };

  additionalCharges: AdditionalCharge[];

  // Validity
  validFrom: string;
  validTo: string;
  isActive: boolean;

  // Auto-calculation rules
  autoCalculate: {
    enabled: boolean;
    baseOn: "WEIGHT" | "ZONE" | "BOTH";
    rounding: "UP" | "DOWN" | "NEAREST";
    roundingFactor: number; // e.g., 0.5 for round to nearest 0.5
  };

  // Restrictions
  restrictions: {
    maxWeight: number;
    minWeight: number;
    allowedPackaging: string[];
    prohibitedItems: string[];
    specialInstructions?: string;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SlabRate {
  id: string;
  slabName: string;
  minWeight: number;
  maxWeight: number;
  rate: number;
  rateType: "PER_KG" | "FIXED" | "SLAB";
  description?: string;
}

export interface ZoneRate {
  id: string;
  fromZone: string;
  toZone: string;
  rate: number;
  transitDays: number;
  isActive: boolean;
}

export interface AdditionalCharge {
  id: string;
  name: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  condition?: {
    field: string;
    operator: "EQ" | "GT" | "LT" | "GTE" | "LTE";
    value: any;
  };
  description: string;
}

export interface FreightCalculationInput {
  originZone: string;
  destinationZone: string;
  weight: number;
  serviceType: "SURFACE" | "AIR" | "EXPRESS";
  paymentMode: "PREPAID" | "COD" | "CREDIT";
  declaredValue?: number;
  isODA: boolean;
  isSundayHoliday: boolean;
  isSpecialHandling: boolean;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface FreightCalculationResult {
  baseFreight: number;
  fuelSurcharge: number;
  fovCharge: number;
  codCharges: number;
  additionalCharges: number;
  totalFreight: number;
  breakdown: {
    item: string;
    amount: number;
    description: string;
  }[];
  appliedRule: RateRule;
}
