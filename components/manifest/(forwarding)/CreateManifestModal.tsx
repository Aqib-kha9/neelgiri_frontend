import { Truck, CheckCircle2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CreateManifestModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}

const CreateManifestModal = ({
    showModal,
    setShowModal,
}: CreateManifestModalProps) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-lg rounded-2xl border-border/70 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Create New Manifest
                    </CardTitle>
                    <CardDescription>
                        Enter details to create a new forwarding manifest
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Destination Hub
                            </label>
                            <Select>
                                <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEL">Delhi Central Hub</SelectItem>
                                    <SelectItem value="MUM">Mumbai Central Hub</SelectItem>
                                    <SelectItem value="BLR">Bangalore Central Hub</SelectItem>
                                    <SelectItem value="KOL">Kolkata Central Hub</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Manifest Type
                            </label>
                            <Select>
                                <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="surface">Surface</SelectItem>
                                    <SelectItem value="air">Air</SelectItem>
                                    <SelectItem value="express">Express</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Notes
                            </label>
                            <Input
                                placeholder="Optional notes"
                                className="rounded-lg"
                            />
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-border/70">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-lg"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 gap-2 rounded-lg bg-primary text-primary-foreground shadow-brand"
                                onClick={() => setShowModal(false)}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Create Manifest
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateManifestModal;
