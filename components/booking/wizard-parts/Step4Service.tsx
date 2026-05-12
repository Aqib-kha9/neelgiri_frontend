"use client";
import { useState, useRef } from "react";
import { Truck, Zap, CheckCircle2, ShieldCheck, CreditCard, Banknote, IndianRupee, Upload, X, FileText, File, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Step4ServiceProps {
    formData: any;
    handleInputChange: (field: string, value: any) => void;
    session: any;
    uploadFiles: (files: File[]) => Promise<any[]>;
}

export function Step4Service({ formData, handleInputChange, session, uploadFiles }: Step4ServiceProps) {
    const [isFetching, setIsFetching] = useState(false);
    const docRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const uploadedFiles = await uploadFiles(files);
        
        const newAttachments = uploadedFiles.map((file, index) => ({
            id: Math.random().toString(36).substr(2, 9),
            url: file.url,
            name: file.originalname,
            type: 'document_scan',
            size: 'Server File' // We could get size from server if needed
        }));
        
        handleInputChange("attachments", [...(formData.attachments || []), ...newAttachments]);
    };

    const removeFile = (id: string) => {
        const updated = formData.attachments.filter((a: any) => a.id !== id);
        handleInputChange("attachments", updated);
    };

    const docScans = (formData.attachments || []).filter((a: any) => a.type === 'document_scan');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Service Selection</h3>
                    <div className="grid gap-3">
                        {(!session?.user?.allowedServices || session.user.allowedServices.length === 0 || session.user.allowedServices.includes('SURFACE')) && (
                            <Card
                                className={`p-4 cursor-pointer transition-all border flex items-center gap-4 ${
                                    formData.mode === 'SURFACE' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                    : 'hover:border-primary/40 bg-background'
                                }`}
                                onClick={() => handleInputChange("mode", "SURFACE")}
                            >
                                <div className={`h-10 w-10 rounded-md flex items-center justify-center ${formData.mode === 'SURFACE' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-foreground">Surface Standard</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">3-7 Transit Days • Economy</p>
                                </div>
                                {formData.mode === 'SURFACE' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                            </Card>
                        )}

                        {(!session?.user?.allowedServices || session.user.allowedServices.length === 0 || session.user.allowedServices.includes('AIR')) && (
                            <Card
                                className={`p-4 cursor-pointer transition-all border flex items-center gap-4 ${
                                    formData.mode === 'AIR' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                    : 'hover:border-primary/40 bg-background'
                                }`}
                                onClick={() => handleInputChange("mode", "AIR")}
                            >
                                <div className={`h-10 w-10 rounded-md flex items-center justify-center ${formData.mode === 'AIR' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    <Zap className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-foreground">Premium Air Express</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">1-3 Transit Days • Priority</p>
                                </div>
                                {formData.mode === 'AIR' && <CheckCircle2 className="h-5 w-5 text-primary" />}
                            </Card>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground border-b pb-2">Document Metadata</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm">Sender Invoice Number</Label>
                            <Input 
                                placeholder="Enter Invoice Number" 
                                value={formData.senderInvoiceNo || ""}
                                onChange={(e) => handleInputChange("senderInvoiceNo", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm">E-Way Bill Number</Label>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Enter E-Way Bill Number" 
                                    value={formData.eWayBill || ""}
                                    onChange={(e) => handleInputChange("eWayBill", e.target.value)}
                                    className="font-mono"
                                />
                                <Button 
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={isFetching}
                                    className="border-primary/30 text-primary hover:bg-primary/5 min-w-[70px]"
                                    onClick={async () => {
                                        if (!formData.eWayBill) {
                                            alert("Please enter an E-Way Bill number");
                                            return;
                                        }
                                        setIsFetching(true);
                                        try {
                                            const token = localStorage.getItem("token");
                                            const res = await fetch(`/api/shipments/compliance/ewaybill/${formData.eWayBill}`, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            const data = await res.json();
                                            
                                            // CORRECT MAPPING: Sandbox EWB
                                            const ewb = data.data?.data || data.data;

                                            if (res.ok && ewb) {
                                                // Auto-populate based on EWB data
                                                if (ewb.docNo) handleInputChange("senderInvoiceNo", ewb.docNo.toString());
                                                if (ewb.totalValue) handleInputChange("declaredValue", ewb.totalValue.toString());
                                                
                                                alert(`Success: E-Way Bill Verified! \nFrom: ${ewb.fromTrdName || 'N/A'} \nTo: ${ewb.toTrdName || 'N/A'}`);
                                            } else {
                                                alert(`Error: ${data.message || "E-Way Bill details not found"}`);
                                            }
                                        } catch (err) {
                                            console.error("EWB Fetch failed", err);
                                            alert("Failed to connect to verification service");
                                        } finally {
                                            setIsFetching(false);
                                        }
                                    }}
                                >
                                    {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                                </Button>
                            </div>
                            
                            {/* E-Way Bill Actions */}
                            {formData.eWayBill && formData.eWayBill.length >= 12 && (
                                <div className="flex gap-2 mt-2">
                                    <Button 
                                        type="button"
                                        size="sm"
                                        variant="link"
                                        className="h-auto p-0 text-xs text-blue-600 flex items-center gap-1"
                                        onClick={async () => {
                                            try {
                                                const token = localStorage.getItem("token");
                                                const res = await fetch(`/api/shipments/compliance/ewaybill/${formData.eWayBill}/print`, {
                                                    headers: { Authorization: `Bearer ${token}` }
                                                });
                                                const data = await res.json();
                                                if (data.data?.print_url || data.print_url) {
                                                    window.open(data.data?.print_url || data.print_url, '_blank');
                                                } else {
                                                    alert("PDF not available yet. Please try again in a moment.");
                                                }
                                            } catch (err) {
                                                alert("Failed to fetch EWB PDF");
                                            }
                                        }}
                                    >
                                        <FileText className="h-3 w-3" /> View/Download E-Way Bill PDF
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm">Other Document Numbers</Label>
                                <Input 
                                    placeholder="e.g. DC No, Permit No" 
                                    value={formData.additionalDocNos || ""}
                                    onChange={(e) => handleInputChange("additionalDocNos", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm">Insurance / FOV Rate (%)</Label>
                                <div className="relative group">
                                    <Input 
                                        placeholder="Default" 
                                        type="number"
                                        step="0.01"
                                        value={formData.fovPercentage || ""}
                                        onChange={(e) => handleInputChange("fovPercentage", e.target.value)}
                                        className="border-amber-200 focus:border-amber-400"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-600 font-bold">%</span>
                                </div>
                            </div>
                        </div>
                        <div 
                            className="border-2 border-dashed border-muted-foreground/20 rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary/50 transition-all cursor-pointer bg-muted/5 group"
                            onClick={() => docRef.current?.click()}
                        >
                            <Upload className="h-5 w-5 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                            <span className="text-xs font-semibold">Upload Document Scans</span>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Invoice, E-Way Bill, etc. (PDF/JPG)</p>
                            <input 
                                type="file" 
                                ref={docRef}
                                multiple 
                                className="hidden" 
                                accept="image/*,application/pdf" 
                                onChange={handleFileChange}
                            />
                        </div>

                        {docScans.length > 0 && (
                            <div className="space-y-2 mt-2">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <FileText className="h-3 w-3" /> Selected Documents ({docScans.length})
                                </h4>
                                <div className="space-y-2">
                                    {docScans.map((doc: any) => (
                                        <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-muted-foreground/10 group">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <File className="h-4 w-4 text-primary shrink-0" />
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-medium truncate">{doc.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{doc.size}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); removeFile(doc.id); }}
                                                className="p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <h3 className="text-sm font-semibold text-foreground border-b pb-2 pt-2">Payment & Confirmation</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Card
                                className={`p-4 cursor-pointer transition-all border flex flex-col items-center justify-center gap-2 text-center ${
                                    formData.paymentMode === 'prepaid' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                    : 'hover:border-primary/40 bg-background'
                                }`}
                                onClick={() => handleInputChange("paymentMode", "prepaid")}
                            >
                                <CreditCard className={`h-5 w-5 ${formData.paymentMode === 'prepaid' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={`text-xs font-medium ${formData.paymentMode === 'prepaid' ? 'text-primary' : 'text-muted-foreground'}`}>Prepaid</span>
                            </Card>
                            
                            <Card
                                className={`p-4 cursor-pointer transition-all border flex flex-col items-center justify-center gap-2 text-center ${
                                    formData.paymentMode === 'topay' 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                                    : 'hover:border-primary/40 bg-background'
                                }`}
                                onClick={() => handleInputChange("paymentMode", "topay")}
                            >
                                <Banknote className={`h-5 w-5 ${formData.paymentMode === 'topay' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className={`text-xs font-medium ${formData.paymentMode === 'topay' ? 'text-primary' : 'text-muted-foreground'}`}>To Pay</span>
                            </Card>
                        </div>

                        <Card className={`p-4 flex flex-col gap-4 ${formData.agreedToTerms ? 'bg-primary/5 border-primary/20' : ''}`}>
                            <div className="flex items-start gap-4">
                                <div className={`h-10 w-10 rounded-md flex items-center justify-center shrink-0 ${formData.agreedToTerms ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Terms & Conditions</p>
                                    <p className="text-xs text-muted-foreground mt-1">I acknowledge the Insurance Policy and Cargo Liability terms for this shipment.</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t">
                                <span className="text-sm font-medium">{formData.agreedToTerms ? 'Accepted' : 'Required'}</span>
                                <Switch
                                    checked={formData.agreedToTerms}
                                    onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked)}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
