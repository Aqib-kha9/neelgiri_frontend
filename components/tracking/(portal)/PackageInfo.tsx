import { Package } from "lucide-react";

interface PackageInfoProps {
  packageInfo: any;
}

const PackageInfo = ({ packageInfo }: PackageInfoProps) => {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Package className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-semibold text-foreground">
          Package Information
        </span>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{packageInfo.type}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Weight</p>
            <p className="font-medium">{packageInfo.weight}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">COD Amount</p>
            <p className="font-medium text-green-600">
              {packageInfo.codAmount}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Declared Value</p>
            <p className="font-medium">{packageInfo.declaredValue}</p>
          </div>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">Description</p>
          <p className="font-medium">{packageInfo.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PackageInfo;
