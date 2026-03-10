import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileDown } from "lucide-react";

interface ExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ExportDialog = ({ open, onOpenChange }: ExportDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Inventory Report</DialogTitle>
                    <DialogDescription>
                        Choose format and data to export inventory information.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-3">
                        <Label>Export Format</Label>
                        <RadioGroup defaultValue="csv" className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="csv" id="csv" className="peer sr-only" />
                                <Label
                                    htmlFor="csv"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <FileDown className="mb-2 h-6 w-6 text-muted-foreground" />
                                    CSV
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="pdf" id="pdf" className="peer sr-only" />
                                <Label
                                    htmlFor="pdf"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <Download className="mb-2 h-6 w-6 text-muted-foreground" />
                                    PDF
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-3">
                        <Label>Include</Label>
                        <div className="grid gap-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="stock" defaultChecked />
                                <Label htmlFor="stock">Stock Levels</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="pricing" defaultChecked />
                                <Label htmlFor="pricing">Pricing Information</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="supplier" />
                                <Label htmlFor="supplier">Supplier Details</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="location" />
                                <Label htmlFor="location">Location Information</Label>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => onOpenChange(false)}>Export Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
