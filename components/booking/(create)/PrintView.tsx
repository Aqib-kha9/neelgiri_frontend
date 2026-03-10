// @/components/booking/create/PrintView.tsx
import { BookingFormData } from "./types";

interface PrintViewProps {
  formData: BookingFormData;
  bookingNumber: string;
}

const PrintView = ({ formData, bookingNumber }: PrintViewProps) => {
  const currentDate = new Date();
  const bookedDate = currentDate.toLocaleDateString("en-IN");
  const bookedTime = currentDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="p-8 bg-white text-black space-y-6 max-w-4xl mx-auto border-2 border-gray-800 print:border-0 print:shadow-none">
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
                  {formData.documentNo || "N/A"}
                  <br />₹{formData.netAmount || "0.00"}
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
            <strong>Doc No:</strong> {formData.documentNo || "N/A"}
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
          {formData.sender && (
            <div className="space-y-1 text-sm">
              <p>
                <strong>BookedBy:</strong>{" "}
                {formData.sender.contactPerson || "ADMIN"}
              </p>
              <p>
                <strong>Sender:</strong>{" "}
                {formData.sender.code || formData.sender.name}
              </p>
              <p>
                <strong>Address:</strong> {formData.sender.address1}{" "}
                {formData.sender.address2}
              </p>
              <p>
                <strong>City:</strong> {formData.sender.city}
              </p>
              <p>
                <strong>Station:</strong> {formData.sender.station}
              </p>
              <p>
                <strong>Phone:</strong> {formData.sender.mobileNo}
              </p>
              {formData.sender.gstin && (
                <p>
                  <strong>GSTIN:</strong> {formData.sender.gstin}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Receiver */}
        <div>
          <h3 className="font-bold text-lg mb-2 border-b border-gray-800 pb-1 print:border-b">
            RECEIVER
          </h3>
          {formData.receiver && (
            <div className="space-y-1 text-sm">
              <p>
                <strong>Destination:</strong> {formData.receiver.city}
              </p>
              <p>
                <strong>Receiver:</strong> {formData.receiver.name}
              </p>
              <p>
                <strong>Address:</strong> {formData.receiver.address}
              </p>
              <p>
                <strong>City:</strong> {formData.receiver.city}
              </p>
              <p>
                <strong>Pincode:</strong> {formData.receiver.pincode}
              </p>
              <p>
                <strong>Phone:</strong> {formData.receiver.mobileNo}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pickup Location */}
      {formData.pickupLocation && (
        <div className="border-b-2 border-gray-800 pb-4 print:border-b-2">
          <h3 className="font-bold text-lg mb-2">PICKUP LOCATION</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Name:</strong> {formData.pickupLocation.name}
            </p>
            <p>
              <strong>Address:</strong> {formData.pickupLocation.address},{" "}
              {formData.pickupLocation.city}
            </p>
            <p>
              <strong>Contact:</strong> {formData.pickupLocation.contactPerson}{" "}
              ({formData.pickupLocation.mobileNo})
            </p>
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="border-b-2 border-gray-800 pb-4 print:border-b-2">
        <h3 className="font-bold text-lg mb-2">BOOKING DETAILS</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p>
              <strong>Contents:</strong> {formData.contents || "NON DOX"}
            </p>
            <p>
              <strong>Pay Mode:</strong> {formData.paymentMode}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>Forward To:</strong>{" "}
              {formData.forwardTo || "R-BillToSender"}
            </p>
            <p>
              <strong>Thru:</strong> {formData.thru || "YELLOWHYDERA"}
            </p>
          </div>
          <div className="space-y-1">
            <p>
              <strong>Weight:</strong> {formData.weight || "0.00"} kg
            </p>
            <p>
              <strong>Charge Wt.:</strong> {formData.chargeableWeight || "0.00"} kg
            </p>
            <p>
              <strong>Rate:</strong> ₹{formData.rate || "0.00"}
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
            <p>₹{formData.fovAmt || "0.00"}</p>
          </div>
          <div>
            <p>
              <strong>Charges</strong>
            </p>
            <p>₹{formData.charges || "0.00"}</p>
          </div>
          <div>
            <p>
              <strong>Other Add/Less</strong>
            </p>
            <p>₹{formData.otherAddLess || "0.00"}</p>
          </div>
          <div>
            <p>
              <strong>Net Charges</strong>
            </p>
            <p>₹{formData.netCharges || "0.00"}</p>
          </div>
        </div>
      </div>

      {/* Final Amount */}
      <div className="grid grid-cols-4 gap-4 text-center border-b-2 border-gray-800 pb-4 print:border-b-2 text-sm">
        <div>
          <p>
            <strong>Discount</strong>
          </p>
          <p>{formData.disc || "0.00"}%</p>
        </div>
        <div>
          <p>
            <strong>Fuel %</strong>
          </p>
          <p>{formData.fuelPercent || "0.00"}%</p>
        </div>
        <div>
          <p>
            <strong>Tax</strong>
          </p>
          <p>₹{formData.taxAmount || "0.00"}</p>
        </div>
        <div>
          <p>
            <strong>Net Amount</strong>
          </p>
          <p className="font-bold">₹{formData.netAmount || "0.00"}</p>
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

export default PrintView;
