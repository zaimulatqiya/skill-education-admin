"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronDown, FileMinus, FileMinus2, Users, UserPlus } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StatistikPage() {
  const [date, setDate] = React.useState<Date>();

  const stats = [
    {
      title: "Ujian 1",
      value: "0",
      icon: FileMinus,
    },
    {
      title: "Ujian 2",
      value: "0",
      icon: FileMinus2,
    },
    {
      title: "Total Peserta Ujian",
      value: "0",
      icon: Users,
    },
    {
      title: "Total Peserta Buat Akun",
      value: "0",
      icon: UserPlus,
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
                <span>{date ? format(date, "PPP", { locale: id }) : "PILIH TANGGAL"}</span>
                <ChevronDown className="h-3.5 w-3.5 text-black transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg overflow-hidden" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 bg-white"
                classNames={{
                  day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white rounded-md",
                  day_today: "bg-primary/20 text-black font-bold",
                  head_cell: "text-black font-bold",
                  caption_label: "text-black font-bold uppercase",
                }}
                captionLayout="dropdown"
                fromYear={2000}
                toYear={2030}
                locale={id}
                components={{
                  Dropdown: ({ value, onChange, children, ...props }: any) => {
                    const options = React.Children.toArray(children) as React.ReactElement<React.OptionHTMLAttributes<HTMLOptionElement>>[];
                    const selected = options.find((child) => child.props.value === value);
                    const handleChange = (value: string) => {
                      const changeEvent = {
                        target: { value },
                      } as React.ChangeEvent<HTMLSelectElement>;
                      onChange?.(changeEvent);
                    };
                    return (
                      <Select
                        value={value?.toString()}
                        onValueChange={(value) => {
                          handleChange(value);
                        }}
                      >
                        <SelectTrigger className="pr-1.5 focus:ring-0 h-8 w-fit gap-1 rounded border-2 border-black bg-white px-2 py-1 text-sm font-bold focus:bg-primary/10 hover:bg-primary/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <SelectValue>{selected?.props?.children}</SelectValue>
                        </SelectTrigger>
                        <SelectContent position="popper" className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                          <div className="max-h-[var(--radix-select-content-available-height)] overflow-y-auto">
                            {options.map((option, id) => (
                              <SelectItem key={`${option.props.value}-${id}`} value={option.props.value?.toString() ?? ""}>
                                {option.props.children}
                              </SelectItem>
                            ))}
                          </div>
                        </SelectContent>
                      </Select>
                    );
                  },
                }}
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
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500">{stat.title}</span>
                  <span className="text-4xl font-black text-black">{stat.value}</span>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-black bg-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:rotate-6">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
