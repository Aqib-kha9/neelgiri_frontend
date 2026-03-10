import { GSTData } from "./types";

export const mockGSTData: GSTData[] = [
    { id: "GST-1", month: "Nov 2024", gstr1Status: "Filed", gstr3bStatus: "Filed", inputCredit: 45000, taxLiability: 52000, netPayable: 7000 },
    { id: "GST-2", month: "Oct 2024", gstr1Status: "Filed", gstr3bStatus: "Filed", inputCredit: 42000, taxLiability: 49000, netPayable: 7000 },
    { id: "GST-3", month: "Sep 2024", gstr1Status: "Filed", gstr3bStatus: "Filed", inputCredit: 48000, taxLiability: 55000, netPayable: 7000 },
    { id: "GST-4", month: "Dec 2024", gstr1Status: "Pending", gstr3bStatus: "Pending", inputCredit: 38000, taxLiability: 45000, netPayable: 7000 },
];
