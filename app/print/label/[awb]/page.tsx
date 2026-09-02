"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import QRCode from "react-qr-code";

export default function LabelPage() {
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
    return <div className="p-8 text-center">Loading Label...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-red-500">Order not found for AWB: {awb}</div>;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: 4in 6in;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
        }
      `}} />
      <div className="min-h-screen bg-gray-200 p-8 flex flex-col items-center justify-center print:bg-white print:p-0 print:m-0 print:min-h-0">
        <div className="mb-4 print:hidden w-full max-w-[4in] flex justify-end">
          <Button onClick={() => window.print()} className="gap-2 shadow-lg">
            <Printer className="h-4 w-4" />
            Print Label (4x6)
          </Button>
        </div>

      {/* 4x6 Label Container */}
      <div className="w-[4in] h-[6in] bg-white text-black p-4 border-2 border-black flex flex-col print:w-[4in] print:h-[6in] print:border-none print:m-0 print:p-4 overflow-hidden relative shadow-2xl print:shadow-none bg-white">
        
        {/* Top Header */}
        <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-2">
          <h1 className="text-xl font-bold uppercase tracking-widest">LogiFlow</h1>
          <div className="font-bold text-lg">{order.paymentMode?.toUpperCase() || order.mode || 'SURFACE'}</div>
        </div>

        {/* Routing Hubs */}
        <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-2">
          <div className="text-center w-[45%]">
            <p className="text-[10px] text-gray-600 uppercase font-bold">Origin</p>
            <p className="font-bold text-2xl truncate">{order.sender?.city?.substring(0, 3).toUpperCase() || 'ORG'}</p>
          </div>
          <div className="text-2xl font-bold">→</div>
          <div className="text-center w-[45%]">
            <p className="text-[10px] text-gray-600 uppercase font-bold">Destination</p>
            <p className="font-bold text-2xl truncate">{order.receiver?.city?.substring(0, 3).toUpperCase() || 'DST'}</p>
          </div>
        </div>

        {/* QR Code and AWB */}
        <div className="flex flex-col items-center justify-center border-b-2 border-black py-4 mb-2">
          <QRCode 
            value={order.awb}
            size={120}
            level="H"
          />
          <p className="mt-2 font-mono text-xl font-bold tracking-widest">{order.awb}</p>
        </div>

        {/* Addresses */}
        <div className="flex flex-col flex-1 border-b-2 border-black pb-2 mb-2">
          <div className="mb-2">
            <p className="text-[10px] font-bold uppercase bg-black text-white inline-block px-1 mb-1">To (Receiver):</p>
            <p className="font-bold text-sm leading-tight">{order.receiver?.name}</p>
            <p className="text-xs leading-tight line-clamp-2">{order.receiver?.address}</p>
            <p className="text-xs font-bold leading-tight">{order.receiver?.city}, {order.receiver?.state} - {order.receiver?.pincode}</p>
            <p className="text-xs leading-tight">Ph: {order.receiver?.phone}</p>
          </div>
          <div className="mt-auto">
            <p className="text-[10px] font-bold uppercase border-b border-black mb-1">From (Sender):</p>
            <p className="font-bold text-xs leading-tight">{order.sender?.name || order.customer?.name}</p>
            <p className="text-[10px] leading-tight line-clamp-1">{order.sender?.address}, {order.sender?.city} - {order.sender?.pincode}</p>
          </div>
        </div>

        {/* Package details bottom */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="border border-black p-1">
            <p className="text-[8px] uppercase font-bold">Weight</p>
            <p className="font-bold text-sm">{order.chargeableWeight || order.weight || 0}kg</p>
          </div>
          <div className="border border-black p-1">
            <p className="text-[8px] uppercase font-bold">Pcs</p>
            <p className="font-bold text-sm">1</p>
          </div>
          <div className="border border-black p-1">
            <p className="text-[8px] uppercase font-bold">Date</p>
            <p className="font-bold text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
          </div>
        </div>
        
      </div>
      </div>
    </>
  );
}
