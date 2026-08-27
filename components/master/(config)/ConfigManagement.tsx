"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import ConfigHeader from "./ConfigHeader";
import ConfigStats from "./ConfigStats";
import ConfigCategories from "./ConfigCategories";
import SystemSettings from "./SystemSettings";
import BusinessSettings from "./BusinessSettings";
import LogisticsSettings from "./LogisticsSettings";
import FinancialSettings from "./FinancialSettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle2, Loader2 } from "lucide-react";
import {
  systemConfig as defaultSystemConfig,
  businessConfig as defaultBusinessConfig,
  logisticsConfig as defaultLogisticsConfig,
  financialConfig as defaultFinancialConfig,
  notificationConfig as defaultNotificationConfig,
  securityConfig as defaultSecurityConfig,
} from "./mockData";
import {
  SystemConfigData,
  BusinessConfigData,
  LogisticsConfigData,
  FinancialConfigData,
  NotificationConfigData,
  SecurityConfigData,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

const ConfigManagement = () => {
  const [activeCategory, setActiveCategory] = useState("system");
  const [systemData, setSystemData] = useState<SystemConfigData>(defaultSystemConfig);
  const [businessData, setBusinessData] = useState<BusinessConfigData>(defaultBusinessConfig);
  const [logisticsData, setLogisticsData] = useState<LogisticsConfigData>(defaultLogisticsConfig);
  const [financialData, setFinancialData] = useState<FinancialConfigData>(defaultFinancialConfig);
  const [notificationData, setNotificationData] = useState<NotificationConfigData>(defaultNotificationConfig);
  const [securityData, setSecurityData] = useState<SecurityConfigData>(defaultSecurityConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_BASE}/api/config`, { headers });
      const configs = Array.isArray(res.data) ? res.data : [];

      // Build a lookup map by key
      const configMap: Record<string, any> = {};
      configs.forEach((c: any) => {
        configMap[c.key] = c;
      });

      // Map backend configs to frontend data structures
      const getVal = (key: string, fallback: any) => {
        const c = configMap[key];
        if (!c) return fallback;
        return c.value !== undefined && c.value !== null ? c.value : fallback;
      };

      // System
      setSystemData({
        companyName: getVal("system.companyName", defaultSystemConfig.companyName),
        companyLogo: getVal("system.companyLogo", defaultSystemConfig.companyLogo),
        timezone: getVal("system.timezone", defaultSystemConfig.timezone),
        dateFormat: getVal("system.dateFormat", defaultSystemConfig.dateFormat),
        timeFormat: getVal("system.timeFormat", defaultSystemConfig.timeFormat),
        language: getVal("system.language", defaultSystemConfig.language),
        currency: getVal("system.currency", defaultSystemConfig.currency),
        decimalPlaces: getVal("system.decimalPlaces", defaultSystemConfig.decimalPlaces),
        autoBackup: getVal("system.autoBackup", defaultSystemConfig.autoBackup),
        backupFrequency: getVal("system.backupFrequency", defaultSystemConfig.backupFrequency),
        maintenanceMode: getVal("system.maintenanceMode", defaultSystemConfig.maintenanceMode),
        sessionTimeout: getVal("system.sessionTimeout", defaultSystemConfig.sessionTimeout),
        maxLoginAttempts: getVal("system.maxLoginAttempts", defaultSystemConfig.maxLoginAttempts),
      });

      // Business
      setBusinessData({
        businessType: getVal("business.businessType", defaultBusinessConfig.businessType),
        industry: getVal("business.industry", defaultBusinessConfig.industry),
        taxId: getVal("business.taxId", defaultBusinessConfig.taxId),
        registrationNumber: getVal("business.registrationNumber", defaultBusinessConfig.registrationNumber),
        fiscalYearStart: getVal("business.fiscalYearStart", defaultBusinessConfig.fiscalYearStart),
        fiscalYearEnd: getVal("business.fiscalYearEnd", defaultBusinessConfig.fiscalYearEnd),
        workingDays: getVal("business.workingDays", defaultBusinessConfig.workingDays),
        businessHours: getVal("business.businessHours", defaultBusinessConfig.businessHours),
        holidayCalendar: getVal("business.holidayCalendar", defaultBusinessConfig.holidayCalendar),
        supportEmail: getVal("business.supportEmail", defaultBusinessConfig.supportEmail),
        supportPhone: getVal("business.supportPhone", defaultBusinessConfig.supportPhone),
        supportHours: getVal("business.supportHours", defaultBusinessConfig.supportHours),
      });

      // Logistics
      setLogisticsData({
        defaultWeightUnit: getVal("logistics.defaultWeightUnit", defaultLogisticsConfig.defaultWeightUnit),
        defaultDistanceUnit: getVal("logistics.defaultDistanceUnit", defaultLogisticsConfig.defaultDistanceUnit),
        autoRouteOptimization: getVal("logistics.autoRouteOptimization", defaultLogisticsConfig.autoRouteOptimization),
        defaultDeliveryTime: getVal("logistics.defaultDeliveryTime", defaultLogisticsConfig.defaultDeliveryTime),
        maxDeliveryAttempts: getVal("logistics.maxDeliveryAttempts", defaultLogisticsConfig.maxDeliveryAttempts),
        returnPolicy: getVal("logistics.returnPolicy", defaultLogisticsConfig.returnPolicy),
        packagingRules: getVal("logistics.packagingRules", defaultLogisticsConfig.packagingRules),
        hazardousHandling: getVal("logistics.hazardousHandling", defaultLogisticsConfig.hazardousHandling),
        temperatureControl: getVal("logistics.temperatureControl", defaultLogisticsConfig.temperatureControl),
        defaultTemperature: getVal("logistics.defaultTemperature", defaultLogisticsConfig.defaultTemperature),
        signatureRequired: getVal("logistics.signatureRequired", defaultLogisticsConfig.signatureRequired),
        photoProofRequired: getVal("logistics.photoProofRequired", defaultLogisticsConfig.photoProofRequired),
      });

      // Financial
      setFinancialData({
        currency: getVal("financial.currency", defaultFinancialConfig.currency),
        taxRate: getVal("financial.taxRate", defaultFinancialConfig.taxRate),
        gstEnabled: getVal("financial.gstEnabled", defaultFinancialConfig.gstEnabled),
        gstNumber: getVal("financial.gstNumber", defaultFinancialConfig.gstNumber),
        invoicePrefix: getVal("financial.invoicePrefix", defaultFinancialConfig.invoicePrefix),
        invoiceStartingNumber: getVal("financial.invoiceStartingNumber", defaultFinancialConfig.invoiceStartingNumber),
        paymentTerms: getVal("financial.paymentTerms", defaultFinancialConfig.paymentTerms),
        lateFeePercentage: getVal("financial.lateFeePercentage", defaultFinancialConfig.lateFeePercentage),
        creditLimit: getVal("financial.creditLimit", defaultFinancialConfig.creditLimit),
        autoInvoiceGeneration: getVal("financial.autoInvoiceGeneration", defaultFinancialConfig.autoInvoiceGeneration),
        revenueRecognition: getVal("financial.revenueRecognition", defaultFinancialConfig.revenueRecognition),
      });

      // Notifications
      setNotificationData({
        emailNotifications: getVal("notification.emailNotifications", defaultNotificationConfig.emailNotifications),
        smsNotifications: getVal("notification.smsNotifications", defaultNotificationConfig.smsNotifications),
        pushNotifications: getVal("notification.pushNotifications", defaultNotificationConfig.pushNotifications),
        customerAlerts: getVal("notification.customerAlerts", defaultNotificationConfig.customerAlerts),
        riderAlerts: getVal("notification.riderAlerts", defaultNotificationConfig.riderAlerts),
        adminAlerts: getVal("notification.adminAlerts", defaultNotificationConfig.adminAlerts),
        lowStockAlerts: getVal("notification.lowStockAlerts", defaultNotificationConfig.lowStockAlerts),
        delayAlerts: getVal("notification.delayAlerts", defaultNotificationConfig.delayAlerts),
        paymentAlerts: getVal("notification.paymentAlerts", defaultNotificationConfig.paymentAlerts),
        systemAlerts: getVal("notification.systemAlerts", defaultNotificationConfig.systemAlerts),
        alertEmail: getVal("notification.alertEmail", defaultNotificationConfig.alertEmail),
        alertPhone: getVal("notification.alertPhone", defaultNotificationConfig.alertPhone),
      });

      // Security
      setSecurityData({
        passwordPolicy: getVal("security.passwordPolicy", defaultSecurityConfig.passwordPolicy),
        twoFactorAuth: getVal("security.twoFactorAuth", defaultSecurityConfig.twoFactorAuth),
        ipWhitelist: getVal("security.ipWhitelist", defaultSecurityConfig.ipWhitelist),
        sessionTimeout: getVal("security.sessionTimeout", defaultSecurityConfig.sessionTimeout),
        maxLoginAttempts: getVal("security.maxLoginAttempts", defaultSecurityConfig.maxLoginAttempts),
        auditLogRetention: getVal("security.auditLogRetention", defaultSecurityConfig.auditLogRetention),
        dataEncryption: getVal("security.dataEncryption", defaultSecurityConfig.dataEncryption),
        apiRateLimit: getVal("security.apiRateLimit", defaultSecurityConfig.apiRateLimit),
      });
    } catch (error: any) {
      // Silently fall back to defaults if config API fails
      console.error("Failed to load configs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  const handleExport = () => {
    const allConfig = {
      system: systemData,
      business: businessData,
      logistics: logisticsData,
      financial: financialData,
      notifications: notificationData,
      security: securityData,
    };
    const blob = new Blob([JSON.stringify(allConfig, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "system-config.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Configuration exported.");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = JSON.parse(text);
        if (imported.system) setSystemData(imported.system);
        if (imported.business) setBusinessData(imported.business);
        if (imported.logistics) setLogisticsData(imported.logistics);
        if (imported.financial) setFinancialData(imported.financial);
        if (imported.notifications) setNotificationData(imported.notifications);
        if (imported.security) setSecurityData(imported.security);
        setHasChanges(true);
        toast.success("Configuration imported. Click Save to apply.");
      } catch {
        toast.error("Invalid config file.");
      }
    };
    input.click();
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Flatten all config data into key-value pairs
      const flatten = (obj: any, prefix: string): { key: string; value: any }[] => {
        const result: { key: string; value: any }[] = [];
        for (const [k, v] of Object.entries(obj)) {
          const key = `${prefix}.${k}`;
          if (v !== null && typeof v === "object" && !Array.isArray(v)) {
            result.push(...flatten(v, key));
          } else {
            result.push({ key, value: v });
          }
        }
        return result;
      };

      const allConfigs = [
        ...flatten(systemData, "system"),
        ...flatten(businessData, "business"),
        ...flatten(logisticsData, "logistics"),
        ...flatten(financialData, "financial"),
        ...flatten(notificationData, "notification"),
        ...flatten(securityData, "security"),
      ];

      // Use bulk update endpoint
      await axios.put(
        `${API_BASE}/api/config/bulk`,
        { configs: allConfigs.map((c) => ({ key: c.key, value: c.value })) },
        { headers }
      );

      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      toast.success("Configuration saved successfully!");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to save configuration.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Generic change handler that sets hasChanges to true
  const createChangeHandler = <T,>(
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => {
    return (data: T) => {
      setter(data);
      setHasChanges(true);
      setSaveSuccess(false);
    };
  };

  const renderActiveSettings = () => {
    switch (activeCategory) {
      case "system":
        return <SystemSettings data={systemData} onChange={createChangeHandler(setSystemData)} />;
      case "business":
        return <BusinessSettings data={businessData} onChange={createChangeHandler(setBusinessData)} />;
      case "logistics":
        return <LogisticsSettings data={logisticsData} onChange={createChangeHandler(setLogisticsData)} />;
      case "financial":
        return <FinancialSettings data={financialData} onChange={createChangeHandler(setFinancialData)} />;
      case "notifications":
        return <NotificationSettings data={notificationData} onChange={createChangeHandler(setNotificationData)} />;
      case "security":
        return <SecuritySettings data={securityData} onChange={createChangeHandler(setSecurityData)} />;
      default:
        return <SystemSettings data={systemData} onChange={createChangeHandler(setSystemData)} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-7 p-6">
      <ConfigHeader onExport={handleExport} onImport={handleImport} />

      <ConfigStats />

      <ConfigCategories
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {renderActiveSettings()}

      {/* Save Changes Section */}
      <div className=" bottom-6 bg-background/95 backdrop-blur-sm rounded-2xl border border-border/70 p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {saveSuccess ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">
                  Configuration saved successfully!
                </span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {hasChanges
                  ? "You have unsaved changes. Don't forget to save your configuration."
                  : "All changes are saved. Your configuration is up to date."}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-border/70"
              onClick={() => {
                setSystemData(defaultSystemConfig);
                setBusinessData(defaultBusinessConfig);
                setLogisticsData(defaultLogisticsConfig);
                setFinancialData(defaultFinancialConfig);
                setNotificationData(defaultNotificationConfig);
                setSecurityData(defaultSecurityConfig);
                setHasChanges(false);
                setSaveSuccess(false);
              }}
            >
              Reset
            </Button>
            <Button
              className="rounded-xl"
              onClick={handleSaveChanges}
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigManagement;
