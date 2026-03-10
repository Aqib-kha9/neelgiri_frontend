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

interface AddPartnerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddPartnerDialog = ({ open, onOpenChange }: AddPartnerDialogProps) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Partner</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new partner.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="partnerName">Business Name *</Label>
                            <Input
                                id="partnerName"
                                placeholder="e.g., Spice Garden Restaurant"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="partnerType">Business Type *</Label>
                                <Select required>
                                    <SelectTrigger id="partnerType">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="restaurant">Restaurant</SelectItem>
                                        <SelectItem value="grocery">Grocery</SelectItem>
                                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                                        <SelectItem value="retail">Retail</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    placeholder="e.g., Delhi"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="location">Full Address *</Label>
                            <Input
                                id="location"
                                placeholder="e.g., Sector 18, Noida"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="contactPerson">Contact Person *</Label>
                            <Input
                                id="contactPerson"
                                placeholder="e.g., Rajesh Kumar"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contact@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deliveryRadius">Delivery Radius (km) *</Label>
                            <Input
                                id="deliveryRadius"
                                type="number"
                                placeholder="5"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
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
                        <Button type="submit">Add Partner</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
