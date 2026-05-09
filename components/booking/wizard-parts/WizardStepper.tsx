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
        <div className="w-full py-4 mb-4">
            <div className="flex items-center justify-between w-full max-w-2xl mx-auto relative px-4">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1px] bg-border z-0" />
                
                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;
                    
                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-background px-2">
                            <div 
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all border ${
                                    isActive 
                                    ? "bg-primary border-primary text-primary-foreground" 
                                    : isCompleted 
                                        ? "bg-primary/10 border-primary text-primary" 
                                        : "bg-background border-muted-foreground/30 text-muted-foreground"
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <span>{step.id}</span>
                                )}
                            </div>
                            
                            <p 
                                className={`text-xs font-medium ${
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                }`}
                            >
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
