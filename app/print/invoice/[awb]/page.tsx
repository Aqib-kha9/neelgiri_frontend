"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function InvoicePage() {
  const { awb } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const shipments = await apiClient.get<any[]>("/shipments");
        const found = shipments.find((s: any) => s.awb === awb);
        if (found) {
          setOrder(found);
        } else {
          toast.error("Order not found");
        }
      } catch (err) {
        toast.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    if (awb) fetchOrder();
  }, [awb]);

  if (loading) {
    return <div className="p-8 text-center">Loading Invoice...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-red-500">Order not found for AWB: {awb}</div>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
        }
      `}} />
      <div className="min-h-screen bg-gray-100 p-8 print:bg-white print:p-0 print:m-0 print:min-h-0">
        <div className="max-w-4xl mx-auto bg-white p-12 shadow-lg print:shadow-none print:p-8">
          {/* Print Button - Hidden in print mode */}
          <div className="flex justify-end mb-8 print:hidden">
            <Button onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" />
              Print Invoice
            </Button>
          </div>

        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">TAX INVOICE</h1>
            <p className="text-gray-500 font-medium">LogiFlow Logistics Ltd.</p>
            <p className="text-sm text-gray-500 mt-2">GSTIN: 27AABCT3518Q1Z4</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">Invoice No: <span className="font-normal">{`INV-${order.awb}`}</span></p>
            <p className="text-sm font-semibold text-gray-900 mt-1">Date: <span className="font-normal">{new Date(order.createdAt).toLocaleDateString()}</span></p>
            <p className="text-sm font-semibold text-gray-900 mt-1">AWB No: <span className="font-normal">{order.awb}</span></p>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-12 mb-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">Billed To (Sender)</h3>
            <p className="font-bold text-gray-900">{order.sender?.name || order.customer?.name}</p>
            <p className="text-sm text-gray-600 mt-1">{order.sender?.address}</p>
            <p className="text-sm text-gray-600">{order.sender?.city}, {order.sender?.state} - {order.sender?.pincode}</p>
            <p className="text-sm text-gray-600 mt-2">Ph: {order.sender?.phone}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b pb-2">Consignee (Receiver)</h3>
            <p className="font-bold text-gray-900">{order.receiver?.name}</p>
            <p className="text-sm text-gray-600 mt-1">{order.receiver?.address}</p>
            <p className="text-sm text-gray-600">{order.receiver?.city}, {order.receiver?.state} - {order.receiver?.pincode}</p>
            <p className="text-sm text-gray-600 mt-2">Ph: {order.receiver?.phone}</p>
          </div>
        </div>

        {/* Particulars Table */}
        <div className="mb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold border">Description</th>
                <th className="px-4 py-3 font-semibold border">HSN/SAC</th>
                <th className="px-4 py-3 font-semibold border text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-4 border">
                  Freight Charges (Weight: {order.chargeableWeight || order.weight || 0} kg)
                  <br />
                  <span className="text-xs text-gray-500">Routing: {order.sender?.city} to {order.receiver?.city}</span>
                </td>
                <td className="px-4 py-4 border">996511</td>
                <td className="px-4 py-4 border text-right">{((order.totalAmount || 0) - (order.taxAmount || 0) - (order.fovCharge || 0)).toFixed(2)}</td>
              </tr>
              {(order.fovCharge || 0) > 0 && (
                <tr>
                  <td className="px-4 py-4 border">FOV Charge</td>
                  <td className="px-4 py-4 border">996511</td>
                  <td className="px-4 py-4 border text-right">{(order.fovCharge || 0).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm font-semibold text-gray-600">Subtotal</span>
              <span className="text-sm font-semibold text-gray-900">₹{((order.totalAmount || 0) - (order.taxAmount || 0)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm font-semibold text-gray-600">IGST (18%)</span>
              <span className="text-sm font-semibold text-gray-900">₹{(order.taxAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 border-b-2 border-gray-900">
              <span className="text-base font-bold text-gray-900">Total Amount</span>
              <span className="text-base font-bold text-gray-900">₹{(order.totalAmount || 0).toFixed(2)}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500 text-right uppercase">
              (Inclusive of all taxes)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-8 text-center text-sm text-gray-500">
          <p className="mb-2">This is a computer generated invoice and does not require a signature.</p>
          <p>Thank you for doing business with LogiFlow!</p>
        </div>
      </div>
      </div>
    </>
  );
}
