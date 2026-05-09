"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Building2, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface PlaceAutocompleteProps {
    onSelect: (details: any) => void;
    placeholder?: string;
    label?: string;
}

export function GooglePlacesAutocomplete({ onSelect, placeholder = "Search business on Google...", label = "Auto-fill from Google" }: PlaceAutocompleteProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchPlaces = async () => {
            console.log(`[Frontend Places] User typed: "${query}"`);
            if (!query.trim() || query.length < 3) {
                console.log(`[Frontend Places] Query too short or empty, not fetching.`);
                setResults([]);
                return;
            }
            
            console.log(`[Frontend Places] Fetching places for: "${query}"`);
            setIsLoading(true);
            try {
                const res = await fetch(`/api/places/search?input=${encodeURIComponent(query)}`);
                console.log(`[Frontend Places] API Response Status: ${res.status}`);
                if (res.ok) {
                    const data = await res.json();
                    console.log(`[Frontend Places] API Data Received:`, data);
                    if (data.predictions) {
                        console.log(`[Frontend Places] Found ${data.predictions.length} predictions.`);
                        setResults(data.predictions);
                        setIsOpen(true);
                    } else if (data.status) {
                        console.error(`[Frontend Places] Google API Error Status: ${data.status}`, data.error_message);
                    }
                } else {
                    console.error(`[Frontend Places] Backend returned error status: ${res.status}`);
                }
            } catch (err) {
                console.error("[Frontend Places] Error searching places:", err);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchPlaces();
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = async (placeId: string, description: string) => {
        setQuery(description);
        setIsOpen(false);
        setIsLoading(true);

        try {
            const res = await fetch(`/api/places/details?place_id=${placeId}`);
            if (res.ok) {
                const data = await res.json();
                if (data.result) {
                    const result = data.result;
                    
                    // Extract details
                    let pincode = "";
                    let city = "";
                    let state = "";
                    
                    result.address_components?.forEach((comp: any) => {
                        if (comp.types.includes("postal_code")) pincode = comp.long_name;
                        if (comp.types.includes("locality")) city = comp.long_name;
                        if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
                    });

                    onSelect({
                        name: result.name,
                        address: result.formatted_address,
                        pincode,
                        city,
                        state,
                        phone: result.formatted_phone_number?.replace(/\D/g, '') || ""
                    });
                }
            }
        } catch (err) {
            console.error("Error fetching place details:", err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setQuery(""), 1000); // Clear after a second so it's ready again
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            {label && <label className="text-sm font-medium mb-2 block text-muted-foreground flex items-center gap-1"><Search className="w-3 h-3"/> {label}</label>}
            <div className="relative group">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                    placeholder={placeholder}
                    className="pl-9 bg-primary/5 border-primary/20 focus-visible:ring-primary/30"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
                {query && !isLoading && (
                    <X 
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" 
                        onClick={() => { setQuery(""); setResults([]); }}
                    />
                )}
            </div>

            {isOpen && results.length > 0 && (
                <Card className="absolute z-50 w-full mt-1 max-h-[300px] overflow-y-auto shadow-lg border-primary/20">
                    <div className="p-1">
                        {results.map((place) => (
                            <div
                                key={place.place_id}
                                onClick={() => handleSelect(place.place_id, place.description)}
                                className="p-3 hover:bg-muted cursor-pointer flex items-start gap-3 rounded-md transition-colors"
                            >
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">{place.structured_formatting?.main_text || place.description}</p>
                                    <p className="text-xs text-muted-foreground truncate">{place.structured_formatting?.secondary_text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
