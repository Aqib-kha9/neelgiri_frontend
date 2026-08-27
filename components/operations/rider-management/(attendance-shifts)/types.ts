export interface AttendanceRecord {
    _id?: string;
    id: string;
    name: string;
    riderId: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: "present" | "absent" | "late" | "half-day" | "on_leave" | "holiday" | "weekly_off";
    shift: "morning" | "evening" | "night" | "general" | "custom";
    totalHours: string;
    // Extended backend fields
    attendanceId?: string;
    riderName?: string;
    riderCode?: string;
    workingHoursMins?: number;
    overtimeMins?: number;
    lateByMins?: number;
    earlyLeaveMins?: number;
    remarks?: string;
}

export interface AttendanceStats {
    total: number;
    present: number;
    absent: number;
    late: number;
    halfDay: number;
    onLeave: number;
    shiftBreakdown: Array<{ _id: string; count: number }>;
    avgLateMins: number;
    overtimeCount: number;
}
