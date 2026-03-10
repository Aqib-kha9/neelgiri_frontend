// @/components/booking/bulk/BulkPrintView.tsx
import { BulkBookingData } from "./types";

interface BulkPrintViewProps {
  data: BulkBookingData;
  bookingNumber: string;
}

const BulkPrintView = ({ data, bookingNumber }: BulkPrintViewProps) => {
  const currentDate = new Date();
  const bookedDate = currentDate.toLocaleDateString("en-IN");
  const bookedTime = currentDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="p-8 bg-white text-black space-y-6 max-w-4xl mx-auto border-2 border-gray-800 print:border-0 print:shadow-none print:break-after-page">
      {/* Header with QR Code */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 print:border-b-2">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold">TECH-NEEDER CORNER PVT. LTD.</h1>
          <p className="text-lg">(EF-36) (Royal Law)</p>
        </div>

        {/* QR Code in Header */}
        <div className="text-center">
          <div className="border-2 border-gray-800 p-2 inline-block">
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs text-center">
              <div className="text-center">
                <div className="font-bold">QR CODE</div>
                <div className="text-[8px] mt-1 leading-tight">
                  {bookingNumber}
                  <br />
                  {data.documentNo || "N/A"}
                  <br />₹{data.netAmount || "0.00"}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs mt-1">Scan to verify</p>
        </div>
      </div>

      {/* Document Info */}
      <div className="grid grid-cols-3 gap-4 border-b-2 border-gray-800 pb-4 print:border-b-2">
        <div>
          <p>
            <strong>Doc No:</strong> {data.documentNo || "N/A"}
          </p>
          <p>
            <strong>Link No:</strong> -
          </p>
        </div>
        <div className="text-center">
          <p>
            <strong>Booking No:</strong> {bookingNumber}
          </p>
        </div>
        <div className="text-right">
          <p>
            <strong>Date:</strong> {bookedDate}
          </p>
          <p>
            <strong>Time:</strong> {bookedTime}
          </p>
        </div>
      </div>

      {/* Sender and Receiver */}
      <div className="grid grid-cols-2 gap-6 border-b-2 border-gray-800 pb-4 print:border-b-2">
        {/* Sender */}
        <div>
          <h3 className="font-bold text-lg mb-2 border-b border-gray-800 pb-1 print:border-b">
            SENDER
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>BookedBy:</strong> ADMIN
            </p>
            <p>
              <strong>Sender:</strong> {data.senderName}
            </p>
            <p>
              <strong>Address:</strong> {data.senderAddress}
            </p>
            <p>
              <strong>City:</strong> {data.senderCity}
            </p>
            <p>
              <strong>Phone:</strong> {data.senderContact}
            </p>
          </div>
        </div>

        {/* Receiver */}
        <div>
          <h3 className="font-bold text-lg mb-2 border-b border-gray-800 pb-1 print:border-b">
            RECEIVER
          </h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Destination:</strong> {data.receiverCity}
            </p>
            <p>
              <strong>Receiver:</strong> {data.receiverName}
            </p>
            <p>
              <strong>Address:</strong> {data.receiverAddress}
            </p>
            <p>
              <strong>City:</strong> {data.receiverCity}
            </p>
            <p>
              <strong>Phone:</strong> {data.receiverContact}
            </p>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="border-b-2 border-gray-800 pb-4 print:border-b-2">
        <h3 className="font-bold text-lg mb-2">BOOKING DETAILS</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p>
              <strong>Contents:</strong> {data.contents || "GENERAL"}
            </p>
            <p>
              <strong>Pay Mode:</strong> {data.payMode || "Cash"}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>Forward To:</strong> {data.forwardTo || "R-BillToSender"}
            </p>
            <p>
              <strong>Thru:</strong> {data.thru || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>Weight:</strong> {data.weight || "0.00"} kg
            </p>
            <p>
              <strong>Charge Wt.:</strong> {data.chargeWeight || "0.00"} kg
            </p>
            <p>
              <strong>Rate:</strong> ₹{data.rate || "0.00"}
            </p>
          </div>
        </div>
      </div>

      {/* Charges */}
      <div className="border-b-2 border-gray-800 pb-4 print:border-b-2">
        <h3 className="font-bold text-lg mb-2">CHARGES</h3>
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <p>
              <strong>FOV Amt</strong>
            </p>
            <p>₹{data.fovAmt || "0.00"}</p>
          </div>
          <div>
            <p>
              <strong>Charges</strong>
            </p>
            <p>₹{data.charges || "0.00"}</p>
          </div>
          <div>
            <p>
              <strong>Other Add/Less</strong>
            </p>
            <p>₹{data.otherAddLess || "0.00"}</p>
          </div>
          <div>
            <p>
              <strong>Net Charges</strong>
            </p>
            <p>₹{data.netCharges || data.charges || "0.00"}</p>
          </div>
        </div>
      </div>

      {/* Final Amount */}
      <div className="grid grid-cols-4 gap-4 text-center border-b-2 border-gray-800 pb-4 print:border-b-2 text-sm">
        <div>
          <p>
            <strong>Discount</strong>
          </p>
          <p>{data.disc || "0.00"}%</p>
        </div>
        <div>
          <p>
            <strong>Fuel %</strong>
          </p>
          <p>{data.fuelPercent || "0.00"}%</p>
        </div>
        <div>
          <p>
            <strong>Tax</strong>
          </p>
          <p>₹{data.tax || "0.00"}</p>
        </div>
        <div>
          <p>
            <strong>Net Amount</strong>
          </p>
          <p className="font-bold">₹{data.netAmount || "0.00"}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-gray-800 pt-4 print:border-t-2">
        <p className="text-sm">This is a computer generated document</p>
        <p className="text-sm">Booked By: ADMIN | Date: {bookedDate}</p>
      </div>
    </div>
  );
};

export default BulkPrintView;
