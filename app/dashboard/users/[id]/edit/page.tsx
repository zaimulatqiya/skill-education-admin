"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, X, Save } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthPlace: string;
  birthDate: Date;
  scores: {
    [key: string]: {
      listening: string;
      structure: string;
      reading: string;
      total: string;
    };
  };
}

// Dummy data fetching function (simulate fetching user by ID)
const getUserData = (userId: string): UserData => {
  return {
    id: "9904",
    name: "joy",
    email: "joy@gmail.com",
    phone: "081324456667",
    birthPlace: "Malang",
    birthDate: new Date(2001, 0, 26),
    scores: {
      "Score 1": { listening: "520", structure: "460", reading: "230", total: "403" },
      "Score 2": { listening: "", structure: "", reading: "", total: "" },
      "Score 3": { listening: "", structure: "", reading: "", total: "" },
      "Score 4": { listening: "", structure: "", reading: "", total: "" },
    },
  };
};

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = React.use(params);

  const [user, setUser] = React.useState<UserData | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  // Simulation of data fetching
  React.useEffect(() => {
    const data = getUserData(id);
    setUser(data);
    setDate(data.birthDate);
  }, [id]);

  if (!user) return null; // Or loading state

  const scoreTabs = ["Score 1", "Score 2", "Score 3", "Score 4"];

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans selection:bg-primary/30 selection:text-primary-foreground pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      {/* Header */}
      <header className="relative z-10 w-full bg-white border-b-2 border-black sticky top-0 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between sm:justify-center relative">
          <Link
            href="/dashboard/users"
            className="group p-2 -ml-2 rounded-lg border-2 border-transparent hover:border-black hover:bg-primary hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all sm:absolute sm:left-4 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <ChevronLeft className="h-6 w-6 text-black group-hover:text-white" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tight text-black flex items-center gap-2">{user.id}</h1>
          <div className="w-10 sm:hidden"></div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Personal Info Section */}
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="relative group">
            <Label htmlFor="name" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
              Nama Lengkap
            </Label>
            <Input id="name" defaultValue={user.name} className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all" />
          </div>
          {/* Email */}
          <div className="relative group">
            <Label htmlFor="email" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
              Email
            </Label>
            <Input id="email" defaultValue={user.email} className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all" />
          </div>
          {/* Phone */}
          <div className="relative group">
            <Label htmlFor="phone" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
              Nomor Whatsapp
            </Label>
            <Input id="phone" defaultValue={user.phone} className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all" />
          </div>
          {/* Birth Place */}
          <div className="relative group">
            <Label htmlFor="birthPlace" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
              Tempat Lahir
            </Label>
            <Input id="birthPlace" defaultValue={user.birthPlace} className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all" />
          </div>
        </div>

        {/* Date of Birth Picker (Full Width Button) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full h-14 justify-center text-left font-black text-white bg-black border-2 border-black hover:bg-slate-800 hover:text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-wider text-lg",
                !date && "text-muted-foreground",
              )}
            >
              {date ? format(date, "PPP", { locale: idLocale }) : <span>Pilih Tanggal Lahir</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={idLocale} />
          </PopoverContent>
        </Popover>

        {/* Scores Tabs */}
        <Tabs defaultValue="Score 1" className="w-full mt-4">
          <TabsList className="w-full justify-between bg-transparent p-0 border-b-2 border-slate-200 h-auto rounded-none mb-6">
            {scoreTabs.map((score) => (
              <TabsTrigger
                key={score}
                value={score}
                className="flex-1 rounded-none border-b-4 border-transparent px-4 py-3 text-sm font-bold text-slate-400 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:bg-transparent transition-all"
              >
                {score}
              </TabsTrigger>
            ))}
          </TabsList>

          {scoreTabs.map((score) => (
            <TabsContent key={score} value={score} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Listening */}
              <div className="relative group">
                <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Nilai Listening</Label>
                <div className="relative">
                  <Input defaultValue={user.scores[score]?.listening} className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Structure */}
              <div className="relative group">
                <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Nilai Structure</Label>
                <div className="relative">
                  <Input defaultValue={user.scores[score]?.structure} className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Reading */}
              <div className="relative group">
                <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Nilai Reading</Label>
                <div className="relative">
                  <Input defaultValue={user.scores[score]?.reading} className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all" />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Total Score Section */}
              <div className="relative group">
                <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Total Score</Label>
                <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 font-black text-lg text-black h-14 flex items-center">{user.scores[score]?.total || "0"}</div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <Button className="h-14 rounded-xl border-2 border-black bg-slate-800 text-white font-bold text-lg hover:bg-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none">
            Simpan
          </Button>
          <Button className="h-14 rounded-xl border-2 border-black bg-slate-800 text-white font-bold text-lg hover:bg-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none">
            Buat Barcode
          </Button>
        </div>
      </div>
    </div>
  );
}
