"use client";

import { useEffect, useState } from 'react';
import { XCircle, ShieldAlert, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ForceLogout() {
    const [isCleared, setIsCleared] = useState(false);

    useEffect(() => {
        // Absolute clearing of all potential sessions
        localStorage.clear();
        sessionStorage.clear();

        // Clear all cookies aggressively
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Prevent back navigation
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
        };

        setIsCleared(true);
        console.log("🔒 Security Lockdown Complete");
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 p-6 selection:bg-rose-500/30">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="w-full max-w-md relative">
                <div className="bg-slate-900 border-2 border-rose-500/30 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(244,63,94,0.1)] text-center space-y-8 animate-in fade-in zoom-in duration-500">

                    <div className="flex justify-center">
                        <div className="h-24 w-24 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 relative">
                            <ShieldAlert className="h-12 w-12 text-rose-500 animate-pulse" />
                            <div className="absolute -top-1 -right-1">
                                <XCircle className="h-8 w-8 text-rose-500 fill-slate-900" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-black uppercase tracking-tighter text-rose-500">Access Revoked</h1>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Your account has been <span className="text-slate-100 font-bold">Paused</span> by the administrator.
                            Active sessions have been terminated for security.
                        </p>
                    </div>

                    <div className="h-px bg-slate-800 w-full" />

                    <div className="space-y-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Contact support for restoration</p>
                        <div className="flex flex-col gap-3">
                            <Button asChild variant="outline" className="h-14 rounded-2xl bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300 gap-3 font-bold uppercase tracking-widest text-xs">
                                <Link href="/login">
                                    <LogOut className="h-4 w-4" />
                                    Return to Authentication
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <div className="h-1 w-1 rounded-full bg-rose-500 animate-ping" />
                        Security Protocol Active
                    </div>
                </div>
            </div>
        </div>
    );
}
