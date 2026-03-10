import {
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  BadgeCheck,
  XCircle,
  User as UserIcon,
  Shield,
  Building2,
  Pause,
  Play,
  Calendar,
  Contact,
  Fingerprint
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  roleName?: string;
  branchId?: string;
  branchName?: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  partnerName?: string;
  isPaused?: boolean;
  createdBy?: {
    name: string;
    email: string;
    role: {
      name: string;
      displayName?: string;
    };
  };
}

interface UserListProps {
  users: any[]; // Using any temporarily for mapping or fix local User type
  onEditUser: (user: any) => void;
  onDeleteUser: (userId: string) => void;
  onTogglePause: (userId: string) => void;
}

const UserList = ({ users, onEditUser, onDeleteUser, onTogglePause }: UserListProps) => {
  const getRoleInfo = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('super')) return { icon: <Shield className="h-4 w-4" />, color: "bg-indigo-50 text-indigo-700 border-indigo-100" };
    if (r.includes('partner')) return { icon: <Building2 className="h-4 w-4" />, color: "bg-orange-50 text-orange-700 border-orange-100" };
    if (r.includes('branch')) return { icon: <Building className="h-4 w-4" />, color: "bg-blue-50 text-blue-700 border-blue-100" };
    if (r.includes('dispatcher')) return { icon: <Building2 className="h-4 w-4" />, color: "bg-emerald-50 text-emerald-700 border-emerald-100" };
    if (r.includes('rider')) return { icon: <UserIcon className="h-4 w-4" />, color: "bg-cyan-50 text-cyan-700 border-cyan-100" };
    return { icon: <UserIcon className="h-4 w-4" />, color: "bg-slate-50 text-slate-700 border-slate-100" };
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {users.map((user: User) => {
        const role = getRoleInfo(user.role);
        return (
          <div
            key={user.id}
            className={`relative flex flex-col md:flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group ${user.isPaused ? 'opacity-80' : ''}`}
          >
            {/* Status Bar */}
            <div className={`w-1.5 shrink-0 ${user.isPaused ? 'bg-amber-400' : 'bg-primary/20 group-hover:bg-primary transition-colors'}`} />

            {/* Left Section: Identity & Primary Info */}
            <div className="flex-1 p-6 flex flex-col lg:flex-row gap-8 items-start lg:items-center">

              <div className="flex items-center gap-5 min-w-[300px]">
                {/* Avatar with Status Dot */}
                <div className={`h-14 w-14 rounded-full flex items-center justify-center border-2 ${role.color} shrink-0 relative`}>
                  {role.icon}
                  <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate leading-none">
                      {user.name}
                    </h3>
                    <Badge variant="outline" className={`px-2 py-0 text-[10px] font-bold uppercase tracking-wider h-5 ${role.color}`}>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Fingerprint className="h-3 w-3" />
                      <span>{user.id.slice(-6).toUpperCase()}</span>
                    </div>
                    {user.partnerName && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Building2 className="h-3 w-3" />
                        <span>{user.partnerName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Section: Clean Grid for Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6 flex-1 pr-4">

                {/* Contact Column */}
                <div className="space-y-3 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Contact</span>
                  <div className="flex items-center gap-3 text-sm group/item">
                    <Mail className="h-4 w-4 text-slate-300 group-hover/item:text-primary transition-colors shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 truncate font-medium">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-sm group/item">
                      <Phone className="h-4 w-4 text-slate-300 group-hover/item:text-primary transition-colors shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{user.phone}</span>
                    </div>
                  )}
                </div>

                {/* Scope/Branch Column */}
                <div className="space-y-3 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Assignment</span>
                  <div className="flex items-center gap-3 text-sm group/item">
                    <Building className="h-4 w-4 text-slate-300 group-hover/item:text-primary transition-colors shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium uppercase truncate">
                      {user.branchName || 'No Branch'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm group/item">
                    <Calendar className="h-4 w-4 text-slate-300 group-hover/item:text-primary transition-colors shrink-0" />
                    <span className="text-slate-500 dark:text-slate-500 text-xs">
                      Logged: <span className="text-slate-700 dark:text-slate-300 font-bold">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                    </span>
                  </div>
                </div>

                {/* Admin Origin Column */}
                <div className="space-y-3 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Origin</span>
                  {user.createdBy ? (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        {user.createdBy.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate leading-none mb-1">{user.createdBy.name}</p>
                        <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 uppercase border-slate-200 text-slate-400">
                          {user.createdBy.role?.displayName || user.createdBy.role?.name || 'Admin'}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 italic">
                      <UserCog className="h-4 w-4" />
                      <span>SYSTEM INITIALIZED</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Right Section: Actions */}
            <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-900/50 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex items-center justify-center gap-4 shrink-0">
              <TooltipProvider>
                {/* Pause/Resume Action */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={user.isPaused ? "default" : "outline"}
                      size="sm"
                      className={`h-10 px-4 rounded-lg font-bold text-[11px] uppercase tracking-wider gap-2 shadow-sm
                        ${user.isPaused
                          ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 text-white'
                          : 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 text-slate-600'}`}
                      onClick={() => onTogglePause(user.id)}
                    >
                      {user.isPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5" />}
                      {user.isPaused ? 'Resume' : 'Pause'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{user.isPaused ? 'Unlock User Access' : 'Temporarily Block User'}</TooltipContent>
                </Tooltip>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 border border-slate-200 bg-white hover:bg-slate-100 hover:text-primary transition-all shadow-sm"
                    onClick={() => onEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 border border-rose-100 bg-white text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipProvider>
            </div>
          </div>
        );
      })}

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
          <UserIcon className="h-10 w-10 text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">No Personnel Found</h3>
          <p className="text-slate-300 text-sm mt-1">Refine your search parameters to find results.</p>
        </div>
      )}
    </div>
  );
};

const UserCog = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 16v1" /><path d="M19 21v.01" /><path d="M22 19h-1" /><path d="M17 19h-1" />
  </svg>
);

export default UserList;
