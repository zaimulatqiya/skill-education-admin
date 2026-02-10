"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Search, Filter, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { UserListItem } from "./components/user-list-item";
import { UserDetailModal } from "./components/user-detail-modal";
import { Profile } from "@/types/profile";
import { filterProfilesByDate } from "@/lib/profile-api";
import { toast } from "sonner";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedYear, setSelectedYear] = React.useState<string>("");
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  const [selectedUser, setSelectedUser] = React.useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // API State
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Generate years from 2024 to 2030
  const years = Array.from({ length: 7 }, (_, i) => (2024 + i).toString());

  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Fetch profiles on mount and when filters change
  React.useEffect(() => {
    loadProfiles();
  }, [selectedYear, selectedMonth]);

  // Apply search filter when search query changes
  React.useEffect(() => {
    applySearchFilter();
  }, [searchQuery, profiles]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, selectedMonth, searchQuery]);

  const loadProfiles = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use API filter for year and month
      const data = await filterProfilesByDate(selectedYear || undefined, selectedMonth || undefined);
      setProfiles(data);
      setFilteredProfiles(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load profiles";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const applySearchFilter = () => {
    if (!searchQuery.trim()) {
      setFilteredProfiles(profiles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = profiles.filter((profile) => {
      const nama = profile.nama?.toLowerCase() || "";
      return nama.includes(query);
    });
    setFilteredProfiles(filtered);
  };

  const handleYearChange = (year: string) => {
    // Treat space as empty (for "Semua Tahun" option)
    const newYear = year.trim() === "" ? "" : year;
    setSelectedYear(newYear);
    // Reset month when year changes to ensure consistency
    if (selectedMonth && newYear !== selectedYear) {
      setSelectedMonth("");
    }
  };

  const handleMonthChange = (month: string) => {
    // Treat space as empty (for "Semua Bulan" option)
    const newMonth = month.trim() === "" ? "" : month;
    setSelectedMonth(newMonth);
  };

  const handleClearFilters = () => {
    setSelectedYear("");
    setSelectedMonth("");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedYear || selectedMonth || searchQuery;

  const handleUserClick = (user: Profile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProfiles = filteredProfiles.slice(startIndex, endIndex);

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
              placeholder="Cari berdasarkan nama"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-black focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] focus-visible:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Year Select */}
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-lg border-2 border-black bg-white px-4 text-left font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/5 focus:ring-0">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg" position="popper">
                <SelectItem value=" " className="font-medium focus:bg-primary focus:text-white cursor-pointer text-slate-500">
                  Semua Tahun
                </SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year} className="font-medium focus:bg-primary focus:text-white cursor-pointer">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Month Select */}
            <Select value={selectedMonth} onValueChange={handleMonthChange} disabled={!selectedYear}>
              <SelectTrigger
                className={`w-full sm:w-[180px] h-12 rounded-lg border-2 border-black bg-white px-4 text-left font-medium text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/5 focus:ring-0 ${!selectedYear ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <SelectValue placeholder={selectedYear ? "Pilih Bulan" : "Pilih Bulan"} />
              </SelectTrigger>
              <SelectContent className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg max-h-60" position="popper">
                <SelectItem value=" " className="font-medium focus:bg-primary focus:text-white cursor-pointer text-slate-500">
                  Semua Bulan
                </SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month} className="font-medium focus:bg-primary focus:text-white cursor-pointer">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="h-12 px-4 rounded-lg border-2 border-black bg-red-500 text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none whitespace-nowrap"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* User List or Empty State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border-2 border-red-300">
              <Filter className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Terjadi Kesalahan</h2>
            <p className="text-slate-500 font-medium max-w-[300px] mx-auto leading-relaxed mb-4">{error}</p>
            <button
              onClick={loadProfiles}
              className="px-4 py-2 bg-primary text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="flex flex-col gap-6 w-full">
            <div className="grid gap-4 w-full sm:grid-cols-1 lg:grid-cols-1">
              {currentProfiles.map((user) => (
                <UserListItem key={user.id} user={user} onClick={() => handleUserClick(user)} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                    // Show first, last, current, and surrounding pages
                    page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1) ? (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ) : // Show ellipsis
                    page === currentPage - 2 || page === currentPage + 2 ? (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : null,
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
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
            <p className="text-slate-500 font-medium max-w-[250px] mx-auto leading-relaxed">
              {searchQuery || selectedYear || selectedMonth ? "Tidak ada hasil yang sesuai dengan filter" : "Belum ada data user. Silakan tambah data terlebih dahulu."}
            </p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && <UserDetailModal user={selectedUser} open={isModalOpen} onOpenChange={setIsModalOpen} />}
    </div>
  );
}
