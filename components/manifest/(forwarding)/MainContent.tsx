// app/dashboard/manifest/forwarding/create/components/MainContent.tsx
import ShipmentList from "./ShipmentList";
import ShipmentDetails from "./ShipmentDetails";

interface MainContentProps {
  filteredShipments: any[];
  selectedShipment: any;
  setSelectedShipment: (shipment: any) => void;
}

const MainContent = ({
  filteredShipments,
  selectedShipment,
  setSelectedShipment,
}: MainContentProps) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 space-y-4">
        <ShipmentList
          shipments={filteredShipments}
          selectedShipment={selectedShipment}
          setSelectedShipment={setSelectedShipment}
        />
      </div>
      <div className="xl:col-span-2 space-y-6">
        <ShipmentDetails shipment={selectedShipment} />
      </div>
    </div>
  );
};

export default MainContent;
