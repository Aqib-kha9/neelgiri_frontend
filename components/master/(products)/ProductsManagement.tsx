// components/master/products/ProductsManagement.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import ProductsHeader from "./ProductsHeader";
import ProductsStats from "./ProductsStats";
import ProductsFilters from "./ProductsFilters";
import ProductsList from "./ProductsList";
import ProductForm from "./ProductForm";
import BulkUploadModal from "./BulkUploadModal";
import { Product, ProductFormData } from "./types";
import { Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const mapProduct = (product: any): Product => {
  const handlingFlags = product.handlingFlags || {};
  return {
    ...product,
    _id: product._id,
    id: product._id || product.id,
    sku: product.sku || "-",
    name: product.name || "-",
    description: product.description || "",
    category: product.category || "General",
    subCategory: product.subCategory || "",
    hsnCode: product.hsnCode || "",
    weight: product.weight || 0,
    dimensions: product.dimensionString || product.dimensions || "",
    value: product.value || 0,
    fragile: product.fragile ?? handlingFlags.fragile ?? false,
    hazardous: product.hazardous ?? handlingFlags.hazardous ?? false,
    temperatureSensitive: product.temperatureSensitive ?? handlingFlags.temperatureSensitive ?? false,
    specialHandling: product.specialHandling || "",
    storageRequirements: product.storageRequirements || "",
    status: product.status || "active",
    createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : new Date().toISOString(),
  };
};

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [hazardousFilter, setHazardousFilter] = useState("all");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== "all") params.status = statusFilter;
      if (categoryFilter !== "all") params.category = categoryFilter;

      const { data } = await axios.get(`${API_BASE}/api/products`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawProducts = Array.isArray(data) ? data : data.products || data.data || [];
      setProducts(rawProducts.map(mapProduct));
    } catch (error) {
      console.error("Failed to load products", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = async (formData: ProductFormData) => {
    const payload = {
      ...formData,
      handlingFlags: {
        fragile: formData.fragile,
        hazardous: formData.hazardous,
        temperatureSensitive: formData.temperatureSensitive,
      },
    };

    try {
      const token = localStorage.getItem("token");
      if (selectedProduct) {
        await axios.put(`${API_BASE}/api/products/${selectedProduct._id || selectedProduct.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${API_BASE}/api/products`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product created successfully");
      }
      setShowForm(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to save product", error);
      toast.error("Failed to save product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleStatus = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const newStatus = product.status === "active" ? "inactive" : "active";
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/api/products/${product._id || product.id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Product ${newStatus === "active" ? "activated" : "deactivated"}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to toggle product status", error);
      toast.error("Failed to update product status");
    }
  };

  const handleBulkUpload = async (data: any[]) => {
    try {
      const token = localStorage.getItem("token");
      const payload = data.map((item) => ({
        name: item.name,
        sku: item.sku,
        description: item.description || "",
        category: item.category || "General",
        subCategory: item.subCategory || "",
        hsnCode: item.hsnCode || "",
        weight: parseFloat(item.weight) || 0,
        dimensions: item.dimensions || "",
        value: parseFloat(item.value) || 0,
        handlingFlags: {
          fragile: item.fragile === "true" || item.fragile === true,
          hazardous: item.hazardous === "true" || item.hazardous === true,
          temperatureSensitive: item.temperatureSensitive === "true" || item.temperatureSensitive === true,
        },
        specialHandling: item.specialHandling || "",
        storageRequirements: item.storageRequirements || "",
        status: "active",
      }));

      const results = [];
      for (const item of payload) {
        try {
          await axios.post(`${API_BASE}/api/products`, item, {
            headers: { Authorization: `Bearer ${token}` },
          });
          results.push({ success: true });
        } catch {
          results.push({ success: false });
        }
      }

      const successCount = results.filter((r) => r.success).length;
      toast.success(`${successCount} of ${payload.length} products imported successfully`);
      setShowBulkUpload(false);
      fetchProducts();
    } catch (error) {
      console.error("Failed to bulk upload products", error);
      toast.error("Failed to bulk upload products");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.hsnCode.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesHazardous =
      hazardousFilter === "all" ||
      (hazardousFilter === "hazardous" && product.hazardous) ||
      (hazardousFilter === "non_hazardous" && !product.hazardous);

    return (
      matchesSearch && matchesStatus && matchesCategory && matchesHazardous
    );
  });

  return (
    <div className="space-y-7 p-6">
      <ProductsHeader
        onAddProduct={handleAddProduct}
        onBulkUpload={() => setShowBulkUpload(true)}
        productCount={products.length}
      />

      <ProductsStats products={products} />

      <ProductsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        hazardousFilter={hazardousFilter}
        onHazardousFilterChange={setHazardousFilter}
        products={products}
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ProductsList
          products={filteredProducts}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {showForm && (
        <ProductForm
          product={selectedProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showBulkUpload && (
        <BulkUploadModal
          onUpload={handleBulkUpload}
          onCancel={() => setShowBulkUpload(false)}
        />
      )}
    </div>
  );
};

export default ProductsManagement;
