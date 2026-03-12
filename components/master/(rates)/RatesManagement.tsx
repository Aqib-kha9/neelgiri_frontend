"use client";

import { useState, useMemo, useEffect } from "react";
import RatesHeader from "./RatesHeader";
import RatesStats from "./RatesStats";
import RatesFilters from "./RatesFilters";
import RatesList from "./RatesList";
import RateForm from "./RateForm";
import FreightCalculator from "./FreightCalculator";
import RateDetailsModal from "./RateDetailsModal";
import { RateRule } from "./types";
import axios from "axios";
import { toast } from "sonner";

const RatesManagement = () => {
    const [rates, setRates] = useState<RateRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchRates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("/api/rates", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const normalizedData = (data || []).map((rate: any) => ({
                ...rate,
                id: rate.id || rate._id,
                slabs: (rate.slabs || []).map((s: any) => ({ ...s, id: s.id || s._id })),
                distanceBuckets: (rate.distanceBuckets || []).map((db: any) => ({ ...db, id: db.id || db._id })),
                additionalCharges: rate.additionalCharges || [],
                minCharge: rate.minCharge || { amount: 0, applicableZones: [] },
                fuelSurcharge: rate.fuelSurcharge || { percentage: 0, minAmount: 0, maxAmount: 0 },
                fovCharge: rate.fovCharge || { percentage: 0, minAmount: 0, maxAmount: 0 },
                restrictions: rate.restrictions || { minWeight: 0, maxWeight: 0, allowedPackaging: [], prohibitedItems: [] },
                autoCalculate: rate.autoCalculate || { enabled: false, baseOn: 'weight', rounding: 'none', roundingFactor: 1 }
            }));
            setRates(normalizedData);
        } catch (error) {
            toast.error("Failed to load rates");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, []);

    const [showCalculator, setShowCalculator] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [customerType, setCustomerType] = useState<
        "ALL" | "CUSTOMER" | "AGENT" | "VENDOR"
    >("ALL");
    const [serviceType, setServiceType] = useState<
        "ALL" | "SURFACE" | "AIR" | "EXPRESS"
    >("ALL");
    const [paymentMode, setPaymentMode] = useState<
        "ALL" | "PREPAID" | "COD" | "CREDIT"
    >("ALL");
    const [statusFilter, setStatusFilter] = useState<
        "ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED"
    >("ALL");
    const [selectedRate, setSelectedRate] = useState<RateRule | null>(null);
    const [expandedRates, setExpandedRates] = useState<string[]>([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRateForDetails, setSelectedRateForDetails] =
        useState<RateRule | null>(null);

    // Filter rates
    const filteredRates = useMemo(() => {
        return rates.filter((rate) => {
            // Search filter
            const searchMatch =
                searchTerm === "" ||
                (rate.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (rate.id?.toLowerCase().includes(searchTerm.toLowerCase()));

            // Customer type filter
            const customerMatch =
                customerType === "ALL" || rate.customerType === customerType;

            // Service type filter
            const serviceMatch =
                serviceType === "ALL" || rate.serviceType === serviceType;

            // Payment mode filter
            const paymentMatch =
                paymentMode === "ALL" || rate.paymentMode === paymentMode;

            // Status filter
            const statusMatch =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" &&
                    rate.isActive &&
                    new Date(rate.validTo) >= new Date()) ||
                (statusFilter === "INACTIVE" && !rate.isActive) ||
                (statusFilter === "EXPIRED" && new Date(rate.validTo) < new Date());

            return (
                searchMatch &&
                customerMatch &&
                serviceMatch &&
                paymentMatch &&
                statusMatch
            );
        });
    }, [searchTerm, customerType, serviceType, paymentMode, statusFilter, rates]);

    const toggleExpand = (rateId: string) => {
        setExpandedRates((prev) =>
            prev.includes(rateId)
                ? prev.filter((id) => id !== rateId)
                : [...prev, rateId]
        );
    };

    const handleDelete = (rateId: string) => {
        if (confirm("Are you sure you want to delete this rate rule?")) {
            console.log("Delete rate:", rateId);
            // API call here
        }
    };

    const handleShowDetails = (rate: RateRule) => {
        setSelectedRateForDetails(rate);
        setShowDetailsModal(true);
    };

    const handleEdit = (rate: RateRule) => {
        setSelectedRate(rate);
        setShowForm(true);
    };

    const handleAdd = () => {
        setSelectedRate(null);
        setShowForm(true);
    };

    // Render Sub-Components or Modals
    if (showForm) {
        return (
            <RateForm
                onClose={() => setShowForm(false)}
                initialData={selectedRate || undefined}
            />
        );
    }

    if (showCalculator) {
        return (
            <FreightCalculator
                onClose={() => setShowCalculator(false)}
                rates={rates}
            />
        );
    }

    return (
        <div className="space-y-7 p-6">
            <RatesHeader
                onAddRate={handleAdd}
                onCalculate={() => setShowCalculator(true)}
                rateCount={rates.length}
            />

            <RatesStats rates={rates} />

            <RatesFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                customerType={customerType}
                onCustomerTypeChange={setCustomerType}
                serviceType={serviceType}
                onServiceTypeChange={setServiceType}
                paymentMode={paymentMode}
                onPaymentModeChange={setPaymentMode}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                filteredCount={filteredRates.length}
            />

            <RatesList
                rates={filteredRates}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShowDetails={handleShowDetails}
                onCreate={handleAdd}
                expandedRates={expandedRates}
                toggleExpand={toggleExpand}
            />

            {showDetailsModal && selectedRateForDetails && (
                <RateDetailsModal
                    rate={selectedRateForDetails}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedRateForDetails(null);
                    }}
                />
            )}
        </div>
    );
};

export default RatesManagement;
