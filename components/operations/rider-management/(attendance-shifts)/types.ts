export interface AttendanceRecord {
    id: string;
    name: string;
    riderId: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: "present" | "absent" | "late" | "half-day";
    shift: "morning" | "evening" | "night";
    totalHours: string;
}
