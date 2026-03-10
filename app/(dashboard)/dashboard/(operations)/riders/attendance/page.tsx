import AttendanceShifts from "@/components/operations/rider-management/(attendance-shifts)/AttendanceShifts";

export const metadata = {
    title: "Rider Attendance | Operations",
    description: "Manage rider attendance and shifts.",
};

export default function RiderAttendancePage() {
    return <AttendanceShifts />;
}
