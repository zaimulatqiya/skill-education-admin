import { LineChart, User, Headset, FileCheck2, LogOut, Link } from "lucide-react";
import { DashboardCard } from "./components/dashboard-card";
import { DashboardFooter } from "../../components/layout/dashboard-footer";

export default function DashboardPage() {
  const menuItems = [
    {
      title: "Statistik",
      icon: LineChart,
      href: "/dashboard/statistik",
      variant: "default" as const,
    },
    {
      title: "User",
      icon: User,
      href: "/dashboard/users",
      variant: "default" as const,
    },
    {
      title: "Nomor Admin",
      icon: Headset,
      href: "/dashboard/nomor-admin",
      variant: "default" as const,
    },
    {
      title: "Aktifkan Ujian",
      icon: FileCheck2,
      href: "/dashboard/ujian",
      variant: "default" as const,
    },
    {
      title: "Link",
      icon: Link,
      href: "/dashboard/link",
      variant: "default" as const,
    },
    {
      title: "Log out",
      icon: LogOut,
      href: "/auth/login", // Assuming this is the logout route
      variant: "danger" as const,
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#f0f0f0] font-sans selection:bg-yellow-200 selection:text-black">
      {/* Background Decor - Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-4xl px-6 py-10 flex flex-col items-center">
        {/* Header Text */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 w-fit -rotate-2 border-2 border-black bg-primary px-4 py-1 text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">SKILL EDUCATION</div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-black sm:text-6xl">Dashboard</h1>
          <p className="mt-4 font-bold text-slate-600">WELCOME BACK, ADMIN.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="flex w-full flex-wrap justify-center gap-4 sm:gap-6">
          {menuItems.map((item) => (
            <DashboardCard key={item.title} title={item.title} icon={item.icon} href={item.href} variant={item.variant} />
          ))}
        </div>

        {/* Footer Info */}
        <DashboardFooter />
      </div>
    </div>
  );
}
