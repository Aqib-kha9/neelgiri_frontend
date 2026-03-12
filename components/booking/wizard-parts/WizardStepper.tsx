"use client";

import { CheckCircle2 } from "lucide-react";

interface Step {
    id: number;
    label: string;
    icon: any;
}

interface WizardStepperProps {
    currentStep: number;
    steps: Step[];
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
    return (
        <div className="w-full py-8 mb-4">
            <div className="flex items-center justify-between w-full max-w-3xl mx-auto relative px-4">
                {/* Connecting Line Backdrop */}
                <div className="absolute top-5 left-0 w-full h-[2px] bg-border/50 z-0" />
                
                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;
                    
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            <div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                                    isActive 
                                    ? "bg-primary border-primary text-white shadow-brand scale-110" 
                                    : isCompleted 
                                        ? "bg-success border-success text-white shadow-lg shadow-success/20" 
                                        : "bg-background border-border text-muted-foreground"
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <span className="text-sm font-black">{step.id}</span>
                                )}
                            </div>
                            
                            <div className="absolute top-12 whitespace-nowrap text-center">
                                <p 
                                    className={`text-[10px] uppercase font-black tracking-widest transition-colors ${
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    }`}
                                >
                                    {step.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
