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

interface CreateDispatchModalProps {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}

const CreateDispatchModal = ({
    showModal,
    setShowModal,
}: CreateDispatchModalProps) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-lg rounded-2xl border-border/70 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        New Dispatch
                    </CardTitle>
                    <CardDescription>
                        Assign vehicle and driver for dispatch
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Select Manifest
                            </label>
                            <Select>
                                <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Select manifest to dispatch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MAN-001">MAN-KOL-DEL-001</SelectItem>
                                    <SelectItem value="MAN-002">MAN-MUM-BLR-001</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Assign Vehicle
                            </label>
                            <Input
                                placeholder="Search or enter vehicle number"
                                className="rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Assign Driver
                            </label>
                            <Input
                                placeholder="Search or enter driver name"
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
                                Create Dispatch
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateDispatchModal;
