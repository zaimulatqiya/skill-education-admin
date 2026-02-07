"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Search, Filter } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserListItem } from "./components/user-list-item";
import { UserDetailModal } from "./components/user-detail-modal";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Generate years from 2020 to 2030
  const years = Array.from({ length: 7 }, (_, i) => (2024 + i).toString());

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Dummy Data
  const users = [
    {
      id: 1,
      name: "joy",
      email: "joy@gmail.com",
      phone: "081324456667",
    },
  ];

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-slate-50 font-sans selection:bg-primary/30 selection:text-primary-foreground">
      {/* Background Decor - Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 w-full bg-white border-b-2 border-black sticky top-0 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between sm:justify-center relative">
          <Link
            href="/dashboard"
            className="group p-2 -ml-2 rounded-lg border-2 border-transparent hover:border-black hover:bg-primary hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all sm:absolute sm:left-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <ChevronLeft className="h-6 w-6 text-black group-hover:text-white" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">
            <span className="w-3 h-3 bg-primary border-2 border-black rounded-full block"></span>
            Cari User
          </h1>
          <div className="w-10 sm:hidden"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Controls Container */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Cari User"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Year Select */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-lg border-2 border-black bg-white px-4 text-left font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/5 focus:ring-0">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                {years.map((year) => (
                  <SelectItem key={year} value={year} className="font-medium focus:bg-primary focus:text-white cursor-pointer">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Month Select */}
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-lg border-2 border-black bg-white px-4 text-left font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/5 focus:ring-0">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg max-h-60">
                {months.map((month) => (
                  <SelectItem key={month} value={month} className="font-medium focus:bg-primary focus:text-white cursor-pointer">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* User List or Empty State */}
        {users.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
            {users.map((user) => (
              <UserListItem key={user.id} user={user} onClick={() => handleUserClick(user)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-6 relative">
              {/* Filter Icon stylized */}
              <Filter className="w-16 h-16 text-slate-300 stroke-[1.5]" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-200 rounded-full border-2 border-slate-300"></div>
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-slate-200 rounded-full border-2 border-slate-300"></div>
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Tidak ada data</h2>
            <p className="text-slate-500 font-medium max-w-[250px] mx-auto leading-relaxed">Pilih bulan dan tahun untuk menampilkan data</p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && <UserDetailModal user={selectedUser} open={isModalOpen} onOpenChange={setIsModalOpen} />}
    </div>
  );
}
