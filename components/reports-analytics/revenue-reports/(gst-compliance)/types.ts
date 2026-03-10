export interface GSTData {
    id: string;
    month: string;
    gstr1Status: "Filed" | "Pending" | "Overdue";
    gstr3bStatus: "Filed" | "Pending" | "Overdue";
    inputCredit: number;
    taxLiability: number;
    netPayable: number;
}
