// components/master/products/types.ts
export interface Product {
  _id?: string;
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subCategory: string;
  hsnCode: string;
  weight: number;
  dimensions: string;
  value: number;
  fragile: boolean;
  hazardous: boolean;
  temperatureSensitive: boolean;
  specialHandling: string;
  storageRequirements: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  // Backend fields
  barcode?: string;
  dimensionString?: string;
  customerId?: string;
  handlingFlags?: {
    fragile?: boolean;
    hazardous?: boolean;
    temperatureSensitive?: boolean;
  };
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  hsnCode: string;
  weight: number;
  dimensions: string;
  value: number;
  fragile: boolean;
  hazardous: boolean;
  temperatureSensitive: boolean;
  specialHandling: string;
  storageRequirements: string;
  status: "active" | "inactive";
}
