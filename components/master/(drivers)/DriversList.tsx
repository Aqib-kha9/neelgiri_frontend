
import {
    Edit,
    Trash2,
    MoreHorizontal,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Star,
    FileCheck,
    ShieldAlert,
    UserCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Driver } from "./types";

interface DriversListProps {
    drivers: Driver[];
    onEdit: (driver: Driver) => void;
    onDelete: (id: string) => void;
}

const DriversList = ({ drivers, onEdit, onDelete }: DriversListProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-500/10 text-green-600 border-green-200/50";
            case "INACTIVE":
                return "bg-slate-500/10 text-slate-600 border-slate-200/50";
            case "ON_LEAVE":
                return "bg-blue-500/10 text-blue-600 border-blue-200/50";
            case "SUSPENDED":
                return "bg-red-500/10 text-red-600 border-red-200/50";
            default:
                return "bg-slate-500/10 text-slate-600 border-slate-200/50";
        }
    };

    if (drivers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-border/60 bg-card/50 border-dashed">
                <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <UserCircle2 className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No drivers found</h3>
                <p className="text-muted-foreground max-w-sm mt-1">
                    We couldn't find any drivers matching your search criteria. Try adjusting your filters or add a new driver.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {drivers.map((driver) => (
                <Card
                    key={driver.id}
                    className="group relative overflow-hidden rounded-3xl border-border/60 bg-card/95 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
                >
                    <div className="absolute top-0 right-0 p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full bg-transparent hover:bg-muted/50"
                                >
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onEdit(driver)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => onDelete(driver.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <CardHeader className="pb-3 pt-6 px-6">
                        <div className="flex items-start gap-4">
                            <div className="relative">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 text-primary shadow-inner">
                                    <UserCircle2 className="h-6 w-6" />
                                </div>
                                <div className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background ${driver.status === 'ACTIVE' ? 'bg-green-500' : 'bg-muted-foreground'
                                    }`} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-base leading-none text-foreground pr-6">
                                    {driver.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-medium text-muted-foreground font-mono">
                                        {driver.code}
                                    </p>
                                    <Badge variant="outline" className={`h-5 text-[10px] px-1.5 font-medium border-0 ${getStatusColor(driver.status)}`}>
                                        {driver.status.replace("_", " ")}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-6 space-y-4">
                        {/* Contact Info */}
                        <div className="grid gap-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-3.5 w-3.5 text-primary/70" />
                                <span className="truncate">{driver.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3.5 w-3.5 text-primary/70" />
                                <span className="truncate">{driver.email || "No Email"}</span>
                            </div>
                            <div className="flex items-start gap-2 text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 text-primary/70 mt-0.5 shrink-0" />
                                <span className="line-clamp-2 text-xs">{driver.address || "No Address Provided"}</span>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="rounded-xl bg-orange-500/5 p-3 border border-orange-100/10">
                                <div className="flex items-center gap-1.5 text-orange-700 mb-1">
                                    <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                                    <span className="text-xs font-semibold">Rating</span>
                                </div>
                                <p className="text-lg font-bold text-foreground">{driver.rating}<span className="text-xs text-muted-foreground font-normal">/5</span></p>
                            </div>
                            <div className="rounded-xl bg-blue-500/5 p-3 border border-blue-100/10">
                                <div className="flex items-center gap-1.5 text-blue-700 mb-1">
                                    <FileCheck className="h-3.5 w-3.5" />
                                    <span className="text-xs font-semibold">License</span>
                                </div>
                                <p className="text-xs font-medium text-foreground truncate">{driver.licenseNo}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Exp: {driver.licenseExpiry}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default DriversList;
