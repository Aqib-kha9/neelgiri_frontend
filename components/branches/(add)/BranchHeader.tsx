import { Building, Upload, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BranchHeaderProps {
  onBulkUpload: () => void;
  onBackToList: () => void;
}

const BranchHeader = ({ onBulkUpload, onBackToList }: BranchHeaderProps) => {
  return (
    <section className="rounded-3xl border border-border/70 bg-card/95 p-7 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="space-y-3">
          <Badge className="rounded-full bg-primary/15 px-4 py-1 text-primary">
            Branch Onboarding
          </Badge>
          <div className="space-y-2">
            <h1 className="text-display-1 leading-tight">Add New Branch</h1>
            <p className="max-w-2xl text-body">
              Create a new branch in your delivery network. Fill in the details
              step by step to set up the branch for operations.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-lg border-border/70"
            onClick={onBackToList}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-lg border-border/70"
            onClick={onBulkUpload}
          >
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BranchHeader;
