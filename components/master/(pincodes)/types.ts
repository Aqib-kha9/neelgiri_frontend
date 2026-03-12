
export interface Pincode {
  _id: string; // MongoDB ID
  pincode: string;
  officeName: string;
  district: string;
  state: string;
  zone: string;
  latitude?: number;
  longitude?: number;
  
  // Mapping
  branchId?: {
    _id: string;
    name: string;
    code: string;
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
