import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Calculator, Ruler, RefreshCw } from "lucide-react";

interface WeightToolsProps {
  onBulkWeigh?: () => void;
  onCalculator?: () => void;
  onVolumetricCalc?: () => void;
  onAutoVerify?: () => void;
}

const WeightTools = ({ onBulkWeigh, onCalculator, onVolumetricCalc, onAutoVerify }: WeightToolsProps) => {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-card">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Weight Tools</p>
            <p className="text-xs text-muted-foreground">
              Quick actions for weight management
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onBulkWeigh}
            >
              <Upload className="h-4 w-4" />
              Bulk Weighing
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onCalculator}
            >
              <Calculator className="h-4 w-4" />
              Charge Calculator
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onVolumetricCalc}
            >
              <Ruler className="h-4 w-4" />
              Volumetric Calc
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70"
              onClick={onAutoVerify}
            >
              <RefreshCw className="h-4 w-4" />
              Auto Verify
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightTools;
