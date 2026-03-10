"use client";

import { useState } from "react";
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
import { Save, CheckCircle2 } from "lucide-react";
import {
  systemConfig,
  businessConfig,
  logisticsConfig,
  financialConfig,
  notificationConfig,
  securityConfig,
} from "./mockData";
import {
  SystemConfigData,
  BusinessConfigData,
  LogisticsConfigData,
  FinancialConfigData,
  NotificationConfigData,
  SecurityConfigData,
} from "./types";

const ConfigManagement = () => {
  const [activeCategory, setActiveCategory] = useState("system");
  const [systemData, setSystemData] = useState<SystemConfigData>(systemConfig);
  const [businessData, setBusinessData] =
    useState<BusinessConfigData>(businessConfig);
  const [logisticsData, setLogisticsData] =
    useState<LogisticsConfigData>(logisticsConfig);
  const [financialData, setFinancialData] =
    useState<FinancialConfigData>(financialConfig);
  const [notificationData, setNotificationData] =
    useState<NotificationConfigData>(notificationConfig);
  const [securityData, setSecurityData] =
    useState<SecurityConfigData>(securityConfig);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleExport = () => {
    const allConfig = {
      system: systemData,
      business: businessData,
      logistics: logisticsData,
      financial: financialData,
      notifications: notificationData,
      security: securityData,
    };
    console.log("Exporting config:", allConfig);
    // In real app, this would trigger file download
  };

  const handleImport = () => {
    // In real app, this would handle file upload and parsing
    console.log("Importing config");
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const allConfig = {
      system: systemData,
      business: businessData,
      logistics: logisticsData,
      financial: financialData,
      notifications: notificationData,
      security: securityData,
    };

    console.log("Saving configuration:", allConfig);

    setIsSaving(false);
    setHasChanges(false);
    setSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
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
        return (
          <SystemSettings
            data={systemData}
            onChange={createChangeHandler(setSystemData)}
          />
        );
      case "business":
        return (
          <BusinessSettings
            data={businessData}
            onChange={createChangeHandler(setBusinessData)}
          />
        );
      case "logistics":
        return (
          <LogisticsSettings
            data={logisticsData}
            onChange={createChangeHandler(setLogisticsData)}
          />
        );
      case "financial":
        return (
          <FinancialSettings
            data={financialData}
            onChange={createChangeHandler(setFinancialData)}
          />
        );
      case "notifications":
        return (
          <NotificationSettings
            data={notificationData}
            onChange={createChangeHandler(setNotificationData)}
          />
        );
      case "security":
        return (
          <SecuritySettings
            data={securityData}
            onChange={createChangeHandler(setSecurityData)}
          />
        );
      default:
        return (
          <SystemSettings
            data={systemData}
            onChange={createChangeHandler(setSystemData)}
          />
        );
    }
  };

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
                setSystemData(systemConfig);
                setBusinessData(businessConfig);
                setLogisticsData(logisticsConfig);
                setFinancialData(financialConfig);
                setNotificationData(notificationConfig);
                setSecurityData(securityConfig);
                setHasChanges(false);
                setSaveSuccess(false);
              }}
              disabled={!hasChanges}
            >
              Reset Changes
            </Button>

            <Button
              className="gap-2 rounded-xl bg-green-600 hover:bg-green-700"
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigManagement;
