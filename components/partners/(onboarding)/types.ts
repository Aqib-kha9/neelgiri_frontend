export interface OnboardingApplication {
    id: string;
    applicantName: string;
    businessName: string;
    businessType: "restaurant" | "grocery" | "pharmacy" | "retail";
    location: string;
    city: string;
    applicationDate: string;
    status: "pending" | "in-review" | "approved" | "rejected";
    assignedTo: string;
    phone: string;
    email: string;
    documents: number;
}

export interface OnboardingStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: any;
    description: string;
}
