"use client";

import { ChevronRight, Phone, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserListItemProps {
  user: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  onClick: () => void;
}

export function UserListItem({ user, onClick }: UserListItemProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/5 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
    >
      <div className="flex items-center gap-4 overflow-hidden">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-black bg-black text-white">
          <User className="h-6 w-6" />
        </div>

        {/* User Info */}
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-lg font-black text-black">{user.name}</span>
          <div className="flex flex-col gap-0.5 text-sm font-medium text-slate-600 sm:flex-row sm:items-center sm:gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {user.phone}
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="flex items-center gap-1 truncate">
              <Mail className="h-3 w-3" />
              {user.email}
            </span>
          </div>
        </div>
      </div>

      {/* Action Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-transparent text-black transition-colors group-hover:border-black group-hover:bg-primary group-hover:text-white">
        <ChevronRight className="h-6 w-6" />
      </div>
    </div>
  );
}
