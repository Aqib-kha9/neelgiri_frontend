// components/master/products/ProductForm.tsx
import { useState, useEffect } from "react";
import {
  X,
  Package,
  Weight,
  Ruler,
  IndianRupee,
  ShieldAlert,
  AlertTriangle,
  Thermometer,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Product, ProductFormData } from "./types";

interface ProductFormProps {
  product: Product | null;
  onSave: (data: ProductFormData) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "Electronics",
    subCategory: "",
    hsnCode: "",
    weight: 0,
    dimensions: "",
    value: 0,
    fragile: false,
    hazardous: false,
    temperatureSensitive: false,
    specialHandling: "",
    storageRequirements: "",
    status: "active",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        subCategory: product.subCategory,
        hsnCode: product.hsnCode,
        weight: product.weight,
        dimensions: product.dimensions,
        value: product.value,
        fragile: product.fragile,
        hazardous: product.hazardous,
        temperatureSensitive: product.temperatureSensitive,
        specialHandling: product.specialHandling,
        storageRequirements: product.storageRequirements,
        status: product.status,
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Health & Nutrition",
    "Food & Beverages",
    "Sports & Fitness",
    "Books & Media",
    "Toys & Games",
    "Automotive",
    "Industrial & Scientific",
    "Other",
  ];

  const subCategories: Record<string, string[]> = {
    Electronics: [
      "Mobile Phones",
      "Televisions",
      "Laptops",
      "Tablets",
      "Cameras",
      "Audio Devices",
      "Wearables",
      "Computer Accessories",
      "Mobile Accessories",
    ],
    Fashion: [
      "Clothing",
      "Footwear",
      "Bags & Luggage",
      "Watches",
      "Jewelry",
      "Accessories",
    ],
    "Home & Kitchen": [
      "Furniture",
      "Kitchenware",
      "Home Decor",
      "Bedding",
      "Lighting",
      "Appliances",
    ],
    "Beauty & Personal Care": [
      "Skincare",
      "Haircare",
      "Makeup",
      "Fragrances",
      "Personal Hygiene",
    ],
    "Health & Nutrition": [
      "Supplements",
      "Medical Devices",
      "Fitness Equipment",
      "Personal Care",
    ],
    "Food & Beverages": [
      "Groceries",
      "Snacks",
      "Beverages",
      "Frozen Foods",
      "Organic",
    ],
  };

  // Get current subcategories based on selected category
  const currentSubCategories = subCategories[formData.category] || [];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-border/70 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/70">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {product ? "Edit Product" : "Add New Product"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                Basic Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="rounded-lg"
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="rounded-lg min-h-[80px]"
                  placeholder="Product description and features..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subCategory">Sub-category</Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(value) =>
                      handleInputChange("subCategory", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select sub-category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No sub-category</SelectItem>
                      {currentSubCategories.map((subCat) => (
                        <SelectItem key={subCat} value={subCat}>
                          {subCat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hsnCode">HSN Code *</Label>
                <Input
                  id="hsnCode"
                  value={formData.hsnCode}
                  onChange={(e) => handleInputChange("hsnCode", e.target.value)}
                  required
                  className="rounded-lg font-mono"
                  placeholder="Enter 6-8 digit HSN code"
                />
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                Specifications
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.001"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange(
                        "weight",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    required
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) =>
                      handleInputChange("dimensions", e.target.value)
                    }
                    className="rounded-lg"
                    placeholder="L x W x H cm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Value (₹) *</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) =>
                      handleInputChange(
                        "value",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    required
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Product Properties */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                Product Properties
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-orange-600" />
                    <div>
                      <Label htmlFor="fragile" className="text-sm font-medium">
                        Fragile Item
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Requires careful handling
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="fragile"
                    checked={formData.fragile}
                    onCheckedChange={(checked) =>
                      handleInputChange("fragile", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <Label
                        htmlFor="hazardous"
                        className="text-sm font-medium"
                      >
                        Hazardous Material
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Contains dangerous substances
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="hazardous"
                    checked={formData.hazardous}
                    onCheckedChange={(checked) =>
                      handleInputChange("hazardous", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label
                        htmlFor="temperatureSensitive"
                        className="text-sm font-medium"
                      >
                        Temperature Sensitive
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Requires climate control
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="temperatureSensitive"
                    checked={formData.temperatureSensitive}
                    onCheckedChange={(checked) =>
                      handleInputChange("temperatureSensitive", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Handling & Storage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Special Handling
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="specialHandling">
                    Special Handling Instructions
                  </Label>
                  <Textarea
                    id="specialHandling"
                    value={formData.specialHandling}
                    onChange={(e) =>
                      handleInputChange("specialHandling", e.target.value)
                    }
                    className="rounded-lg min-h-[100px]"
                    placeholder="Any special handling requirements, precautions, or instructions for delivery personnel..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Storage Requirements
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="storageRequirements">
                    Storage Requirements
                  </Label>
                  <Textarea
                    id="storageRequirements"
                    value={formData.storageRequirements}
                    onChange={(e) =>
                      handleInputChange("storageRequirements", e.target.value)
                    }
                    className="rounded-lg min-h-[100px]"
                    placeholder="Storage conditions, temperature ranges, humidity requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Status & Preview */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Status
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="status">Product Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) =>
                      handleInputChange("status", value)
                    }
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Inactive
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground border-b pb-2">
                  Product Preview
                </h3>

                <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        formData.status === "active" ? "success" : "secondary"
                      }
                      className="rounded-full text-xs"
                    >
                      {formData.status.toUpperCase()}
                    </Badge>
                    {formData.fragile && (
                      <Badge variant="warning" className="rounded-full text-xs">
                        FRAGILE
                      </Badge>
                    )}
                    {formData.hazardous && (
                      <Badge variant="error" className="rounded-full text-xs">
                        HAZARDOUS
                      </Badge>
                    )}
                    {formData.temperatureSensitive && (
                      <Badge variant="info" className="rounded-full text-xs">
                        TEMP SENSITIVE
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-muted-foreground">Weight: </span>
                      <span className="font-medium">{formData.weight} kg</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Value: </span>
                      <span className="font-medium">
                        ₹{formData.value.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">HSN: </span>
                      <span className="font-medium font-mono">
                        {formData.hsnCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-border/70">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-lg"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2 rounded-lg bg-green-600 hover:bg-green-700"
              >
                <Package className="h-4 w-4" />
                {product ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
