"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, ChevronLeft, ChevronDown, FileMinus, FileMinus2, Users, UserPlus, Download } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StatistikPage() {
  const [date, setDate] = React.useState<DateRange | undefined>();

  const [statsData, setStatsData] = React.useState({
    ujian1: 0,
    ujian2: 0,
    totalPesertaUjian: 0,
    totalPesertaBuatAkun: 0,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        let url = "/api/statistics";
        if (date?.from && date?.to) {
          const fromParams = date.from.toISOString();
          const toParams = date.to.toISOString();
          url += `?from=${fromParams}&to=${toParams}`;
        } else if (date?.from) {
          const fromParams = date.from.toISOString();
          const toParams = date.from.toISOString();
          url += `?from=${fromParams}&to=${toParams}`;
        }

        const res = await fetch(url);
        const json = await res.json();
        if (res.ok && json.data) {
          setStatsData(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [date]);

  const handleDownload = async (type: string) => {
    try {
      let url = `/api/statistics/export?type=${type}`;
      if (date?.from && date?.to) {
        const fromParams = date.from.toISOString();
        const toParams = date.to.toISOString();
        url += `&from=${fromParams}&to=${toParams}`;
      } else if (date?.from) {
        const fromParams = date.from.toISOString();
        const toParams = date.from.toISOString();
        url += `&from=${fromParams}&to=${toParams}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (res.ok && json.data) {
        // Convert to CSV
        const items = json.data;
        if (items.length === 0) {
          alert("Tidak ada data untuk didownload");
          return;
        }

        const replacer = (key: string, value: any) => (value === null ? "" : value);
        const header = Object.keys(items[0]);
        const csv = [
          header.join(","), // header row first
          ...items.map((row: any) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(",")),
        ].join("\r\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", `statistik-${type}-${new Date().getTime()}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("Gagal mengambil data");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Terjadi kesalahan saat download");
    }
  };

  const stats = [
    {
      title: "Ujian 1",
      value: isLoading ? "..." : statsData.ujian1.toString(),
      icon: FileMinus,
      type: "ujian1",
    },
    {
      title: "Ujian 2",
      value: isLoading ? "..." : statsData.ujian2.toString(),
      icon: FileMinus2,
      type: "ujian2",
    },
    {
      title: "Total Peserta Ujian",
      value: isLoading ? "..." : statsData.totalPesertaUjian.toString(),
      icon: Users,
      type: "totalPesertaUjian",
    },
    {
      title: "Total Peserta Buat Akun",
      value: isLoading ? "..." : statsData.totalPesertaBuatAkun.toString(),
      icon: UserPlus,
      type: "totalPesertaBuatAkun",
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-slate-50 font-sans selection:bg-primary/30 selection:text-primary-foreground">
      {/* Background Decor - Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      {/* Header */}
      <header className="relative z-10 w-full bg-white border-b-2 border-black sticky top-0">
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
            Statistik
          </h1>
          <div className="w-10 sm:hidden"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Date Picker Button */}
        <div className="flex justify-center mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "group flex h-auto items-center gap-2.5 rounded-lg border-2 border-black bg-white px-6 py-3 text-sm font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/5 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
                  date && "bg-primary/10 hover:bg-primary/20",
                )}
              >
                <CalendarIcon className="h-4 w-4 text-black" />
                <span>
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "PPP", { locale: id })} - {format(date.to, "PPP", { locale: id })}
                      </>
                    ) : (
                      format(date.from, "PPP", { locale: id })
                    )
                  ) : (
                    "PILIH TANGGAL"
                  )}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-black transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden" align="center">
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                initialFocus
                captionLayout="dropdown"
                fromYear={2024}
                toYear={2076}
                className="p-3 bg-white"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center gap-1",
                  caption_label: "text-sm font-bold hidden",
                  nav: "space-x-1 flex items-center bg-transparent",
                  nav_button:
                    "h-7 w-7 bg-transparent p-0 opacity-100 hover:opacity-100 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-md flex items-center justify-center",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-black rounded-md w-9 font-black text-[0.8rem] uppercase",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary/5 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-bold aria-selected:opacity-100 hover:bg-primary/20 border-2 border-transparent hover:border-black rounded-md transition-all",
                  day_selected:
                    "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[-1px] translate-y-[-1px] hover:translate-x-0 hover:translate-y-0 hover:shadow-none !opacity-100",
                  day_today: "bg-yellow-200 text-black font-black border-2 border-black",
                  day_outside: "text-slate-400 opacity-50",
                  day_disabled: "text-slate-400 opacity-50",
                  day_range_middle: "aria-selected:bg-primary/20 aria-selected:text-black aria-selected:border-none aria-selected:shadow-none aria-selected:translate-x-0 aria-selected:translate-y-0 rounded-none",
                  day_hidden: "invisible",
                  caption_dropdowns: "flex gap-2 items-center",
                  dropdown: "opacity-100 relative bg-white border-2 border-black hover:bg-slate-50 p-1 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-sm py-1 px-2 mx-1 appearance-none",
                  dropdown_icon: "",
                  dropdown_year: "relative",
                  dropdown_month: "relative",
                }}
                locale={id}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Statistics Stack */}
        <div className="flex flex-col gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary/5"
            >
              <div className="relative flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500 text-black">{stat.title}</span>
                  <span className="text-4xl font-black text-black">{stat.value}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-black bg-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:rotate-6">
                    <stat.icon className="h-7 w-7 text-white" />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 border-2 border-black bg-white hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all rounded-md"
                    onClick={() => handleDownload(stat.type)}
                    title="Download CSV"
                  >
                    <Download className="h-5 w-5 text-black" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
