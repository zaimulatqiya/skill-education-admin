import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  href: string;
  icon: LucideIcon;
  variant?: "default" | "danger";
}

export function DashboardCard({ title, href, icon: Icon, variant = "default" }: DashboardCardProps) {
  const isDanger = variant === "danger";

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-36 w-36 flex-col items-center justify-center rounded-3xl border p-4 text-center transition-all duration-300 active:scale-95 sm:h-44 sm:w-44",
        // Neo-Brutalism Styles
        "rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        isDanger ? "bg-red-50 hover:bg-red-100" : "bg-blue-50 hover:bg-blue-100",
      )}
    >
      <div className={cn("mb-3 rounded-lg border-2 border-black p-3 transition-colors", isDanger ? "bg-red-200 text-black" : "bg-blue-200 text-black")}>
        <Icon className="h-8 w-8 text-black" />
      </div>
      <span className="text-base font-bold text-black">{title}</span>
    </Link>
  );
}
