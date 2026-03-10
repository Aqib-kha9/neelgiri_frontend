
export interface Driver {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  licenseNo: string;
  licenseExpiry: string;
  aadharNo: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED';
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  currentVehicleId?: string; // Assigned vehicle
  hubId: string; // Home base
  rating: number;
  dateOfJoining: string;
  fatherName?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  bloodGroup?: string;
  panCard?: string;
  bankDetails?: {
    accountNo: string;
    ifscCode: string;
    bankName: string;
  };
}

export interface DriverFormData extends Omit<Driver, 'id' | 'code'> {}
