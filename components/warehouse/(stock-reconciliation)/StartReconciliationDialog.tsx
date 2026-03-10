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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface StartReconciliationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const StartReconciliationDialog = ({ open, onOpenChange }: StartReconciliationDialogProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Start Stock Reconciliation</DialogTitle>
                    <DialogDescription>
                        Begin a new stock reconciliation process.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="itemSelect">Select Item *</Label>
                            <Select required>
                                <SelectTrigger id="itemSelect">
                                    <SelectValue placeholder="Choose item to reconcile" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DB-LRG-001">Delivery Bags - Large (DB-LRG-001)</SelectItem>
                                    <SelectItem value="TL-100-002">Thermal Labels (TL-100-002)</SelectItem>
                                    <SelectItem value="HS-PRO-003">Handheld Scanners (HS-PRO-003)</SelectItem>
                                    <SelectItem value="PT-HD-004">Packing Tape (PT-HD-004)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="expectedQty">Expected Quantity *</Label>
                                <Input
                                    id="expectedQty"
                                    type="number"
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="actualQty">Actual Quantity *</Label>
                                <Input
                                    id="actualQty"
                                    type="number"
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reconciledBy">Reconciled By *</Label>
                            <Input
                                id="reconciledBy"
                                placeholder="Your name"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="recNotes">Notes</Label>
                            <Textarea
                                id="recNotes"
                                placeholder="Any observations or issues..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Start Reconciliation</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
