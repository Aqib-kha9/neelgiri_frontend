// @/components/booking/bulk/types.ts
export interface BulkBookingData {
  documentNo: string;
  senderName: string;
  senderContact: string;
  senderAddress: string;
  senderCity: string;
  receiverName: string;
  receiverContact: string;
  receiverAddress: string;
  receiverCity: string;
  contents: string;
  weight: string;
  chargeWeight: string;
  rate: string;
  charges: string;
  netAmount: string;
  payMode?: string;
  forwardTo?: string;
  thru?: string;
  fovAmt?: string;
  otherAddLess?: string;
  netCharges?: string;
  disc?: string;
  fuelPercent?: string;
  tax?: string;
  remark?: string;
}

export interface UploadResponse {
  success: boolean;
  data: BulkBookingData[];
  errors: string[];
}

export interface BulkBookingResult {
  success: boolean;
  bookings: {
    data: BulkBookingData;
    bookingNumber: string;
    printView: React.ReactNode;
  }[];
  failed: number;
}
