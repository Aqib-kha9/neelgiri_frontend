"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface AWBAutocompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    onSelectShipment: (shipment: any) => void;
    onBlur?: () => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    placeholder?: string;
}

export function AWBAutocompleteInput({
    value,
    onChange,
    onSelectShipment,
    onBlur,
    onKeyDown,
    className,
    placeholder = "Enter AWB number..."
}: AWBAutocompleteInputProps) {
    const [open, setOpen] = React.useState(false);
    const [suggestions, setSuggestions] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue && inputValue.length > 2) {
                fetchSuggestions(inputValue);
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue]);

    // Sync internal state with prop
    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    const fetchSuggestions = async (search: string) => {
        setLoading(true);
        try {
            // Fetch from available shipments only (status=not_scheduled)
            // This matches the "Create DRS" available shipments list
            const res = await fetch(`/api/shipments?status=not_scheduled&awb=${search}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.ok) {
                const data = await res.json();
                setSuggestions(data);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (shipment: any) => {
        onSelectShipment(shipment);
        onChange(shipment.awb || shipment.awbNumber);
        setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
        if (!open && newValue.length > 0) setOpen(true);
    };

    const handleManualEntry = () => {
        // If they hit enter or click away without selecting, it's a manual entry (handled by parent via value)
        setOpen(false);
    };

    return (
        <div className={cn("relative", className)}>
            <div className="relative">
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={onKeyDown}
                    onFocus={() => {
                        if (inputValue.length > 0) setOpen(true);
                    }}
                    onBlur={() => {
                        // Delay to allow clicking on suggestion
                        setTimeout(() => {
                            setOpen(false);
                            onBlur?.();
                        }, 200);
                    }}
                    placeholder={placeholder}
                    className="pr-10"
                />
                {loading && (
                    <div className="absolute right-3 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            {open && suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="p-1">
                        {suggestions.map((shipment) => (
                            <div
                                key={shipment._id || shipment.awb}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                onClick={() => handleSelect(shipment)}
                            >
                                <div className="flex flex-col w-full">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">{shipment.awb || shipment.awbNumber}</span>
                                        <span className="text-xs text-muted-foreground">{shipment.receiver?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{shipment.receiver?.pincode}</span>
                                        <span>{shipment.weight} kg</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {open && inputValue.length > 2 && suggestions.length === 0 && !loading && (
                <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-2 text-sm text-muted-foreground shadow-md">
                    No matching shipment found. Press Enter to add manually.
                </div>
            )}
        </div>
    );
}
