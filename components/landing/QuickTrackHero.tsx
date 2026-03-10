"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function QuickTrackHero() {
    const [awb, setAwb] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!awb.trim()) return;
        setLoading(true);
        router.push(`/track?awb=${awb.trim()}`);
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <form onSubmit={handleTrack} className="relative group">
                <div className="relative flex items-center bg-background border border-border rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                    <Search className="ml-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Enter Tracking Number (AWB)"
                        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground h-10 text-base text-foreground"
                        value={awb}
                        onChange={(e) => setAwb(e.target.value)}
                    />
                    <Button
                        type="submit"
                        size="default"
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white font-bold rounded-lg px-6 h-10 transition-all shadow-md hover:shadow-lg border-0"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
                    </Button>
                </div>
            </form>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground px-1">
                <p>Recent: <span className="text-primary font-medium cursor-pointer hover:underline" onClick={() => setAwb("HJD292412510")}>HJD292412510</span></p>
                <p className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> Live Tracking</p>
            </div>
        </div>
    );
}
