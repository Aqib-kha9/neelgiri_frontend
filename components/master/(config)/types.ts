export interface SystemConfigData {
  companyName: string;
  companyLogo: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  currency: string;
  decimalPlaces: number;
  autoBackup: boolean;
  backupFrequency: string;
  maintenanceMode: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

export interface BusinessConfigData {
  businessType: string;
  industry: string;
  taxId: string;
  registrationNumber: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  workingDays: string[];
  businessHours: {
    start: string;
    end: string;
  };
  holidayCalendar: string[];
  supportEmail: string;
  supportPhone: string;
  supportHours: string;
}

export interface LogisticsConfigData {
  defaultWeightUnit: string;
  defaultDistanceUnit: string;
  autoRouteOptimization: boolean;
  defaultDeliveryTime: string;
  maxDeliveryAttempts: number;
  returnPolicy: string;
  packagingRules: string;
  hazardousHandling: string;
  temperatureControl: boolean;
  defaultTemperature: number;
  signatureRequired: boolean;
  photoProofRequired: boolean;
}

export interface FinancialConfigData {
  currency: string;
  taxRate: number;
  gstEnabled: boolean;
  gstNumber: string;
  invoicePrefix: string;
  invoiceStartingNumber: number;
  paymentTerms: string;
  lateFeePercentage: number;
  creditLimit: number;
  autoInvoiceGeneration: boolean;
  revenueRecognition: boolean;
}

export interface NotificationConfigData {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  customerAlerts: boolean;
  riderAlerts: boolean;
  adminAlerts: boolean;
  lowStockAlerts: boolean;
  delayAlerts: boolean;
  paymentAlerts: boolean;
  systemAlerts: boolean;
  alertEmail: string;
  alertPhone: string;
}

export interface SecurityConfigData {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  twoFactorAuth: boolean;
  ipWhitelist: string[];
  sessionTimeout: number;
  maxLoginAttempts: number;
  auditLogRetention: number;
  dataEncryption: boolean;
  apiRateLimit: number;
}

export interface ConfigCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
