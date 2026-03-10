// components/master/products/ProductsManagement.tsx
"use client";

import { useState } from "react";
import ProductsHeader from "./ProductsHeader";
import ProductsStats from "./ProductsStats";
import ProductsFilters from "./ProductsFilters";
import ProductsList from "./ProductsList";
import ProductForm from "./ProductForm";
import BulkUploadModal from "./BulkUploadModal";
import { Product, ProductFormData } from "./types";
import { mockProducts } from "./mockData";

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [hazardousFilter, setHazardousFilter] = useState("all");

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleSaveProduct = (formData: ProductFormData) => {
    if (selectedProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id ? { ...p, ...formData } : p
        )
      );
    } else {
      // Add new product
      const newProduct: Product = {
        id: `PROD-${Date.now()}`,
        sku: `SKU${products.length + 1}`.padStart(6, "0"),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts([...products, newProduct]);
    }
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleToggleStatus = (productId: string) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? {
            ...product,
            status: product.status === "active" ? "inactive" : "active",
          }
          : product
      )
    );
  };

  const handleBulkUpload = (data: any[]) => {
    // Process bulk upload data
    const newProducts: Product[] = data.map((item, index) => ({
      id: `BULK-${Date.now()}-${index}`,
      sku: item.sku || `BULK${Date.now()}${index}`,
      name: item.name,
      description: item.description || "",
      category: item.category || "General",
      subCategory: item.subCategory || "",
      hsnCode: item.hsnCode || "",
      weight: parseFloat(item.weight) || 0,
      dimensions: item.dimensions || "",
      value: parseFloat(item.value) || 0,
      fragile: item.fragile !== undefined ? item.fragile : false,
      hazardous: item.hazardous !== undefined ? item.hazardous : false,
      temperatureSensitive:
        item.temperatureSensitive !== undefined
          ? item.temperatureSensitive
          : false,
      specialHandling: item.specialHandling || "",
      storageRequirements: item.storageRequirements || "",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setProducts([...products, ...newProducts]);
    setShowBulkUpload(false);
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

      <ProductsList
        products={filteredProducts}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onToggleStatus={handleToggleStatus}
      />

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
