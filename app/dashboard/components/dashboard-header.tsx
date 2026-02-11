import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  backUrl?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({ title, backUrl = "/dashboard", children }: DashboardHeaderProps) {
  return (
    <header className="relative z-10 w-full bg-white border-b-2 border-black sticky top-0">
      <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between sm:justify-center relative">
        <Link
          href={backUrl}
          className="group p-2 -ml-2 rounded-lg border-2 border-transparent hover:border-black hover:bg-primary hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all sm:absolute sm:left-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <ChevronLeft className="h-6 w-6 text-black group-hover:text-white" />
          <span className="sr-only">Back</span>
        </Link>
        <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
          <span className="w-3 h-3 bg-primary border-2 border-black rounded-full block"></span>
          {title}
        </h1>
        {children ? <div className="sm:absolute sm:right-4">{children}</div> : <div className="w-10 sm:hidden"></div>}
      </div>
    </header>
  );
}
