// @/components/booking/bulk/PreviewTable.tsx
import { BulkBookingData } from "./types";

interface PreviewTableProps {
  data: BulkBookingData[];
}

const PreviewTable = ({ data }: PreviewTableProps) => {
  if (data.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/70 overflow-hidden">
      <div className="bg-muted/50 px-6 py-4 border-b border-border/70">
        <h3 className="font-semibold">Preview ({data.length} bookings)</h3>
        <p className="text-sm text-muted-foreground">
          Review the booking data before creating
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 border-b border-border/70">
            <tr>
              <th className="text-left p-3 font-medium">Doc No</th>
              <th className="text-left p-3 font-medium">Sender</th>
              <th className="text-left p-3 font-medium">Receiver</th>
              <th className="text-left p-3 font-medium">Contents</th>
              <th className="text-right p-3 font-medium">Weight</th>
              <th className="text-right p-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((booking, index) => (
              <tr
                key={index}
                className="border-b border-border/30 hover:bg-muted/20"
              >
                <td className="p-3 font-mono text-xs">{booking.documentNo}</td>
                <td className="p-3">
                  <div className="font-medium">{booking.senderName}</div>
                  <div className="text-xs text-muted-foreground">
                    {booking.senderCity}
                  </div>
                </td>
                <td className="p-3">
                  <div className="font-medium">{booking.receiverName}</div>
                  <div className="text-xs text-muted-foreground">
                    {booking.receiverCity}
                  </div>
                </td>
                <td className="p-3">{booking.contents}</td>
                <td className="p-3 text-right">{booking.weight} kg</td>
                <td className="p-3 text-right font-medium">
                  ₹{booking.netAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewTable;
