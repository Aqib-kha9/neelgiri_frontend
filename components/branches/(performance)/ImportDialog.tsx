import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText } from "lucide-react";

interface ImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ImportDialog = ({ open, onOpenChange }: ImportDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Data</DialogTitle>
                    <DialogDescription>
                        Upload a CSV or Excel file to update branch performance metrics.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-8 text-center transition-colors hover:bg-muted/10">
                        <div className="rounded-full bg-primary/10 p-3 text-primary">
                            <Upload className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">
                                CSV, XLS, XLSX (max. 10MB)
                            </p>
                        </div>
                        <Input id="file" type="file" className="hidden" />
                        <Button variant="outline" size="sm">
                            Select File
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                            <p className="text-sm font-medium">Template.csv</p>
                            <p className="text-xs text-muted-foreground">25KB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs">
                            Download
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Import Data</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
