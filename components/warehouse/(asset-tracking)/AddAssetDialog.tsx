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

interface AddAssetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddAssetDialog = ({ open, onOpenChange }: AddAssetDialogProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Asset</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new asset.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="assetName">Asset Name *</Label>
                            <Input
                                id="assetName"
                                placeholder="e.g., Forklift - Toyota 8FD25"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="assetId">Asset ID *</Label>
                                <Input
                                    id="assetId"
                                    placeholder="e.g., FLT-2024-001"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="assetCategory">Category *</Label>
                                <Select required>
                                    <SelectTrigger id="assetCategory">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Material Handling">Material Handling</SelectItem>
                                        <SelectItem value="Automation">Automation</SelectItem>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="Storage">Storage</SelectItem>
                                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                                        <SelectItem value="Security">Security</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="assetLocation">Location *</Label>
                            <Input
                                id="assetLocation"
                                placeholder="e.g., Warehouse A - Loading Bay"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="condition">Condition *</Label>
                                <Select required>
                                    <SelectTrigger id="condition">
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="excellent">Excellent</SelectItem>
                                        <SelectItem value="good">Good</SelectItem>
                                        <SelectItem value="fair">Fair</SelectItem>
                                        <SelectItem value="poor">Poor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="purchaseDate">Purchase Date *</Label>
                                <Input
                                    id="purchaseDate"
                                    type="date"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="purchaseValue">Purchase Value (₹) *</Label>
                            <Input
                                id="purchaseValue"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="assignedTo">Assigned To</Label>
                            <Input
                                id="assignedTo"
                                placeholder="e.g., Rajesh Kumar"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="assetNotes">Notes</Label>
                            <Textarea
                                id="assetNotes"
                                placeholder="Additional information..."
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
                        <Button type="submit">Add Asset</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
