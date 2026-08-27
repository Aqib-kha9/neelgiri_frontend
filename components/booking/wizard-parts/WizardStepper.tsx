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
        <div className="rounded-2xl border bg-card/60 p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Booking progress
                    </p>
                    <p className="text-sm font-medium">
                        Step {currentStep} of {steps.length}
                    </p>
                </div>
                <span className="text-xs text-muted-foreground">
                    {Math.round((currentStep / steps.length) * 100)}% complete
                </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-1 sm:gap-2">
                {steps.map((step) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.id}
                            className={`flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-2 sm:px-2 ${
                                isActive ? "bg-primary/10" : ""
                            }`}
                        >
                            <div
                                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs transition-all ${
                                    isActive
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : isCompleted
                                            ? "border-primary/40 bg-primary/10 text-primary"
                                            : "border-muted-foreground/30 bg-background text-muted-foreground"
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                ) : (
                                    <Icon className="h-3.5 w-3.5" />
                                )}
                            </div>
                            <p
                                className={`hidden truncate text-xs font-medium sm:block ${
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
