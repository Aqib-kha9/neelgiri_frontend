import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Users,
  IndianRupee,
  Shield,
  Settings,
  FileSpreadsheet,
  Zap,
} from "lucide-react";

export const statusConfig = {
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: FileText,
  },
  processing: {
    label: "Processing",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertCircle,
  },
  paused: {
    label: "Paused",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: AlertCircle,
  },
};

export const serviceTypeConfig = {
  Surface: {
    label: "Surface",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  Air: { label: "Air", color: "bg-blue-50 text-blue-700 border-blue-200" },
  Express: {
    label: "Express",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  International: {
    label: "International",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

export const paymentTypeConfig = {
  Prepaid: {
    label: "Prepaid",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  COD: { label: "COD", color: "bg-blue-50 text-blue-700 border-blue-200" },
  Credit: {
    label: "Credit",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  Mixed: {
    label: "Mixed",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

export const bookingTemplates = [
  {
    id: "ecommerce-standard",
    name: "E-commerce Standard",
    description: "Standard template for e-commerce deliveries",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
    fields: [
      "sender_details",
      "receiver_details",
      "package_type",
      "weight",
      "payment_type",
    ],
    defaultService: "Surface",
    defaultPayment: "Prepaid",
  },
  {
    id: "corporate-standard",
    name: "Corporate Standard",
    description: "Template for corporate shipments and B2B deliveries",
    icon: Users,
    color: "bg-green-50 text-green-600",
    fields: [
      "sender_details",
      "receiver_details",
      "package_type",
      "weight",
      "invoice_number",
      "priority",
    ],
    defaultService: "Express",
    defaultPayment: "Credit",
  },
  {
    id: "cod-orders",
    name: "COD Orders",
    description: "Cash on Delivery order template",
    icon: IndianRupee,
    color: "bg-orange-50 text-orange-600",
    fields: [
      "sender_details",
      "receiver_details",
      "package_type",
      "weight",
      "cod_amount",
      "payment_type",
    ],
    defaultService: "Surface",
    defaultPayment: "COD",
  },
  {
    id: "international",
    name: "International",
    description: "International shipment template with customs",
    icon: Shield,
    color: "bg-purple-50 text-purple-600",
    fields: [
      "sender_details",
      "receiver_details",
      "package_type",
      "weight",
      "customs_declaration",
      "insurance",
    ],
    defaultService: "Air",
    defaultPayment: "Prepaid",
  },
  {
    id: "fragile-goods",
    name: "Fragile Goods",
    description: "Template for fragile and sensitive items",
    icon: AlertCircle,
    color: "bg-red-50 text-red-600",
    fields: [
      "sender_details",
      "receiver_details",
      "package_type",
      "weight",
      "fragile_flag",
      "special_handling",
    ],
    defaultService: "Express",
    defaultPayment: "Prepaid",
  },
  {
    id: "custom-template",
    name: "Custom Template",
    description: "Create your own custom template",
    icon: Settings,
    color: "bg-gray-50 text-gray-600",
    fields: ["custom"],
    defaultService: "Surface",
    defaultPayment: "Prepaid",
  },
];
