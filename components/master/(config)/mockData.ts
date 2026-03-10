import {
  SystemConfigData,
  BusinessConfigData,
  LogisticsConfigData,
  FinancialConfigData,
  NotificationConfigData,
  SecurityConfigData,
  ConfigCategory,
} from "./types";

export const configCategories: ConfigCategory[] = [
  {
    id: "system",
    name: "System Settings",
    description: "General system configuration and preferences",
    icon: "Settings",
    color: "blue",
  },
  {
    id: "business",
    name: "Business Information",
    description: "Company details and operational settings",
    icon: "Building",
    color: "green",
  },
  {
    id: "logistics",
    name: "Logistics & Delivery",
    description: "Delivery rules and logistics configuration",
    icon: "Truck",
    color: "orange",
  },
  {
    id: "financial",
    name: "Financial Settings",
    description: "Billing, taxes, and financial configuration",
    icon: "IndianRupee",
    color: "purple",
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Alert and notification preferences",
    icon: "Bell",
    color: "red",
  },
  {
    id: "security",
    name: "Security",
    description: "Security policies and access controls",
    icon: "Shield",
    color: "yellow",
  },
];

export const systemConfig: SystemConfigData = {
  companyName: "Speedy Logistics",
  companyLogo: "/logo.png",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",
  language: "en",
  currency: "INR",
  decimalPlaces: 2,
  autoBackup: true,
  backupFrequency: "daily",
  maintenanceMode: false,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
};

export const businessConfig: BusinessConfigData = {
  businessType: "Logistics",
  industry: "Courier & Delivery",
  taxId: "GSTIN123456789",
  registrationNumber: "REG123456789",
  fiscalYearStart: "2024-04-01",
  fiscalYearEnd: "2025-03-31",
  workingDays: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ],
  businessHours: {
    start: "09:00",
    end: "18:00",
  },
  holidayCalendar: ["2024-01-26", "2024-08-15", "2024-10-02"],
  supportEmail: "support@speedylogistics.com",
  supportPhone: "+91-9876543210",
  supportHours: "24/7",
};

export const logisticsConfig: LogisticsConfigData = {
  defaultWeightUnit: "kg",
  defaultDistanceUnit: "km",
  autoRouteOptimization: true,
  defaultDeliveryTime: "48h",
  maxDeliveryAttempts: 3,
  returnPolicy: "7 days return policy",
  packagingRules: "Standard packaging guidelines apply",
  hazardousHandling: "Special handling required",
  temperatureControl: true,
  defaultTemperature: 25,
  signatureRequired: true,
  photoProofRequired: true,
};

export const financialConfig: FinancialConfigData = {
  currency: "INR",
  taxRate: 18,
  gstEnabled: true,
  gstNumber: "GSTIN123456789",
  invoicePrefix: "INV",
  invoiceStartingNumber: 1001,
  paymentTerms: "Net 15",
  lateFeePercentage: 2,
  creditLimit: 50000,
  autoInvoiceGeneration: true,
  revenueRecognition: true,
};

export const notificationConfig: NotificationConfigData = {
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  customerAlerts: true,
  riderAlerts: true,
  adminAlerts: true,
  lowStockAlerts: true,
  delayAlerts: true,
  paymentAlerts: true,
  systemAlerts: true,
  alertEmail: "alerts@speedylogistics.com",
  alertPhone: "+91-9876543211",
};

export const securityConfig: SecurityConfigData = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
  },
  twoFactorAuth: true,
  ipWhitelist: ["192.168.1.1", "10.0.0.1"],
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  auditLogRetention: 365,
  dataEncryption: true,
  apiRateLimit: 1000,
};
