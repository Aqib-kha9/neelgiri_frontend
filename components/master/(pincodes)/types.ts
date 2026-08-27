
export interface OperationalLocation {
  _id: string;
  name: string;
  code: string;
  type: "BRANCH" | "DELIVERY_CENTER" | "PICKUP_POINT";
  address?: {
    city?: string;
    state?: string;
  };
}

export interface Pincode {
  _id: string; // MongoDB ID
  pincode: string;
  officeName: string;
  district: string;
  state: string;
  zone: string;
  latitude?: number;
  longitude?: number;
  
  // Commercial ownership mapping
  branchId?: {
    _id: string;
    name: string;
    code: string;
  } | null;
  // Physical operational facility mapping
  locationId?: {
    _id: string;
    name: string;
    code: string;
    type?: string;
    address?: {
      city?: string;
      state?: string;
      pincode?: string;
    };
    status?: string;
  } | null;
  isServiceable: boolean;
  isActiveForBranch: boolean;
  isODA?: boolean;
  isMetro?: boolean;
  transitDays?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PincodeFormData extends Partial<Omit<Pincode, '_id' | 'createdAt' | 'updatedAt'>> {}
