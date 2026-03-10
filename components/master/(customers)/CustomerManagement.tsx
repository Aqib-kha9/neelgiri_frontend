// components/master/customers/CustomerManagement.tsx
"use client";

import { useEffect, useState } from "react";
import CustomerHeader from "./CustomerHeader";
import CustomerStats from "./CustomerStats";
import CustomerFilters from "./CustomerFilters";
import CustomerList from "./CustomerList";
import CustomerForm from "./CustomerForm";
import { Customer, CustomerFormData } from "./types";
import { toast } from "sonner";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.map((c: any) => ({ ...c, id: c._id })));
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleSaveCustomer = async (formData: CustomerFormData) => {
    try {
      const isEdit = !!selectedCustomer;
      const url = isEdit ? `/api/customers/${selectedCustomer.id}` : '/api/customers';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(`Customer ${isEdit ? 'updated' : 'created'} successfully`);
        setShowForm(false);
        setSelectedCustomer(null);
        fetchCustomers();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to save customer');
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error while saving customer");
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        toast.success("Customer deleted successfully");
        fetchCustomers();
      } else {
        const err = await res.json();
        toast.error(err.message || 'Failed to delete customer');
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error while deleting customer");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (customer.name?.toLowerCase() || "").includes(searchLower) ||
      (customer.code?.toLowerCase() || "").includes(searchLower) ||
      (customer.gstin?.toLowerCase() || "").includes(searchLower) ||
      (customer.city?.toLowerCase() || "").includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-7 p-6">
      <CustomerHeader
        onAddCustomer={handleAddCustomer}
        customerCount={customers.length}
      />

      <CustomerStats customers={customers} />

      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <CustomerList
        customers={filteredCustomers}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDeleteCustomer}
      />

      {showForm && (
        <CustomerForm
          customer={selectedCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => {
            setShowForm(false);
            setSelectedCustomer(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomerManagement;
