"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "../components/dashboard-header";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Power } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function UjianPage() {
  const [selectedExam, setSelectedExam] = useState<string>("1");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  // Fetch current status when exam selection changes
  useEffect(() => {
    fetchExamStatus(selectedExam);
  }, [selectedExam]);

  const fetchExamStatus = async (examId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/exam-settings?id=${examId}`);
      if (response.ok) {
        const data = await response.json();
        setIsActive(data.is_active);
      } else {
        console.error("Failed to fetch exam status");
      }
    } catch (error) {
      console.error("Error fetching exam status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExam = async () => {
    setUpdating(true);
    try {
      const newState = !isActive;
      const response = await fetch("/api/exam-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // id is the exam number selected (1, 2, 3, or 4)
        body: JSON.stringify({ id: selectedExam, is_active: newState }),
      });

      if (response.ok) {
        setIsActive(newState);
        toast.success(`Ujian ${selectedExam} berhasil ${newState ? "diaktifkan" : "dinonaktifkan"}`);
      } else {
        toast.error("Gagal mengubah status ujian");
      }
    } catch (error) {
      console.error("Error updating exam status:", error);
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-slate-50 font-sans selection:bg-primary/30 selection:text-primary-foreground">
      {/* Background Decor - Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      <DashboardHeader title="Aktifkan Ujian" />

      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-4 md:p-10">
        <Card className="w-full max-w-md md:max-w-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white rounded-xl overflow-hidden animate-in zoom-in duration-300">
          <CardContent className="p-5 md:p-12 flex flex-col gap-6 md:gap-10 items-center text-center">
            <div className="flex flex-col gap-3 md:gap-4">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-black">Konfigurasi Ujian</h2>
              <p className="text-slate-600 font-medium text-sm md:text-lg max-w-xs md:max-w-lg mx-auto leading-relaxed">Tekan tombol di bawah untuk mengaktifkan atau menonaktifkan akses ujian bagi peserta.</p>
            </div>

            <div className="w-full space-y-4 md:space-y-6">
              <div className="space-y-2 text-left">
                <Label className="font-bold text-black ml-1 text-base md:text-lg">Pilih Ujian</Label>
                <Select value={selectedExam} onValueChange={setSelectedExam} disabled={updating}>
                  <SelectTrigger className="h-14 md:h-16 mt-2 border-2 border-black bg-white font-bold text-black text-lg md:text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:ring-0 px-4 md:px-6">
                    <SelectValue placeholder="Pilih Ujian" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold" position="popper">
                    <SelectItem value="1" className="text-base md:text-lg py-3">
                      Ujian 1
                    </SelectItem>
                    <SelectItem value="2" className="text-base md:text-lg py-3">
                      Ujian 2
                    </SelectItem>
                    <SelectItem value="3" className="text-base md:text-lg py-3">
                      Ujian 3
                    </SelectItem>
                    <SelectItem value="4" className="text-base md:text-lg py-3">
                      Ujian 4
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-2 md:h-4"></div> {/* Spacer */}
              {loading ? (
                <div className="flex items-center justify-center h-14 md:h-16">
                  <Loader2 className="h-8 w-8 md:h-10 md:w-10 animate-spin text-primary" />
                </div>
              ) : (
                <Button
                  onClick={handleToggleExam}
                  disabled={updating}
                  className={`w-full h-14 md:h-16 text-lg md:text-xl font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none cursor-pointer ${
                    isActive ? "bg-black text-white hover:bg-slate-800" : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  {updating ? <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin" /> : isActive ? "Nonaktifkan Ujian" : "Aktifkan Ujian"}
                </Button>
              )}
              <div className="flex items-center justify-center pt-2">
                <p className={`text-base md:text-xl font-black ${isActive ? "text-green-600" : "text-slate-400"} flex items-center gap-2`}>
                  <span className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-black ${isActive ? "bg-green-500" : "bg-slate-300"}`}></span>
                  STATUS: {isActive ? "AKTIF" : "NONAKTIF"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
