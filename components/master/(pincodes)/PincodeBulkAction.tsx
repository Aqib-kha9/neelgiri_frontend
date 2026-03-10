"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Zap } from "lucide-react";

interface PincodeBulkActionProps {
    states: string[];
    districts: string[];
    onBulkUpdate: (type: "state" | "district", value: string, isServiceable: boolean) => Promise<void>;
    isLoading: boolean;
}

const PincodeBulkAction = ({
    states,
    districts,
    onBulkUpdate,
    isLoading,
}: PincodeBulkActionProps) => {
    const [selectedType, setSelectedType] = useState<"state" | "district">("district");
    const [selectedValue, setSelectedValue] = useState<string>("");

    const handleApply = async (isServiceable: boolean) => {
        if (!selectedValue) return;
        await onBulkUpdate(selectedType, selectedValue, isServiceable);
        setSelectedValue("");
    };

    return (
        <Card className="rounded-2xl border-primary/20 bg-primary/5 shadow-sm overflow-hidden">
            <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex items-center gap-2 text-primary font-semibold shrink-0">
                        <Zap className="h-5 w-5 fill-primary" />
                        <span>Bulk Serviceability</span>
                    </div>

                    <div className="flex flex-wrap gap-3 flex-1 w-full">
                        <Select
                            value={selectedType}
                            onValueChange={(val: any) => {
                                setSelectedType(val);
                                setSelectedValue("");
                            }}
                        >
                            <SelectTrigger className="w-full sm:w-40 rounded-xl bg-background border-primary/20">
                                <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="state">By State</SelectItem>
                                <SelectItem value="district">By District</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedValue} onValueChange={setSelectedValue}>
                            <SelectTrigger className="flex-1 min-w-[200px] rounded-xl bg-background border-primary/20">
                                <SelectValue placeholder={`Select ${selectedType === "state" ? "State" : "District"}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {(selectedType === "state" ? states : districts).map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                disabled={!selectedValue || isLoading}
                                onClick={() => handleApply(true)}
                                className="flex-1 sm:flex-none rounded-xl"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Enable All
                            </Button>
                            <Button
                                variant="outline"
                                disabled={!selectedValue || isLoading}
                                onClick={() => handleApply(false)}
                                className="flex-1 sm:flex-none rounded-xl border-primary/20 hover:bg-primary/10"
                            >
                                Disable All
                            </Button>
                        </div>
                    </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground/80">
                    * This will update serviceability for all pincodes in the selected {selectedType}. Useful for enabling entire regions quickly.
                </p>
            </CardContent>
        </Card>
    );
};

export default PincodeBulkAction;
