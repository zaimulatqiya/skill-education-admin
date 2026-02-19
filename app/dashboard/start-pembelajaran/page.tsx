"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Save, Trash2, Pencil, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ProgramSchedule {
  id: string;
  day: string;
  month: string;
  year: string;
}

const MONTHS = [
  { value: "Januari", label: "Januari" },
  { value: "Februari", label: "Februari" },
  { value: "Maret", label: "Maret" },
  { value: "April", label: "April" },
  { value: "Mei", label: "Mei" },
  { value: "Juni", label: "Juni" },
  { value: "Juli", label: "Juli" },
  { value: "Agustus", label: "Agustus" },
  { value: "September", label: "September" },
  { value: "Oktober", label: "Oktober" },
  { value: "November", label: "November" },
  { value: "Desember", label: "Desember" },
];

export default function StartPembelajaranPage() {
  const [schedules, setSchedules] = useState<ProgramSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Active Items
  const [editingSchedule, setEditingSchedule] = useState<ProgramSchedule | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<ProgramSchedule | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    day: "",
    month: "",
    year: "",
  });

  // Fetch data
  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/pembelajaran-schedules");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch schedules");
      }

      setSchedules(result.data || []);
    } catch (error: any) {
      console.error("Error fetching schedules:", error);
      toast.error("Gagal mengambil data jadwal.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow only numbers
    if (value && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenDialog = (schedule?: ProgramSchedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData({
        day: schedule.day.toString(),
        month: schedule.month.toString(),
        year: schedule.year.toString(),
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        day: "",
        month: "", // Reset to empty string
        year: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simple validation
    if (!formData.day || !formData.month || !formData.year) {
      toast.error("Mohon lengkapi semua kolom tanggal.");
      setIsSaving(false);
      return;
    }

    const day = parseInt(formData.day);
    // const month = parseInt(formData.month); // Month is now string
    const year = parseInt(formData.year);

    if (day < 1 || day > 31 || year < 1900 || year > 2100) {
      toast.error("Format tanggal tidak valid.");
      setIsSaving(false);
      return;
    }

    try {
      let response;
      const payload = { ...formData }; // Payload already has month as string

      if (editingSchedule) {
        // Edit via API (PUT)
        response = await fetch("/api/pembelajaran-schedules", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingSchedule.id, ...payload }),
        });
      } else {
        // Add via API (POST)
        response = await fetch("/api/pembelajaran-schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan jadwal.");
      }

      toast.success(editingSchedule ? "Jadwal berhasil diperbarui!" : "Jadwal berhasil ditambahkan!");
      await fetchSchedules();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan jadwal.");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (schedule: ProgramSchedule) => {
    setScheduleToDelete(schedule);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      const response = await fetch(`/api/pembelajaran-schedules?id=${scheduleToDelete.id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus jadwal.");
      }

      toast.success("Jadwal berhasil dihapus.");
      await fetchSchedules();
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      toast.error(error.message || "Gagal menghapus jadwal.");
    } finally {
      setIsDeleteDialogOpen(false);
      setScheduleToDelete(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f0f0f0] font-sans selection:bg-yellow-200 selection:text-black">
      <DashboardHeader title="MULAI PEMBELAJARAN" backUrl="/dashboard" />

      {/* Background Decor - Grid Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative z-10 mx-auto max-w-7xl p-6">
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
          {/* Header / Add Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => handleOpenDialog()}
              size="sm"
              className="h-10 border-2 border-black bg-yellow-400 px-6 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="mr-2 h-5 w-5" /> Tambah Jadwal
            </Button>
          </div>

          {/* List of Schedules */}
          {isLoading ? (
            <div className="text-center py-10 font-bold text-slate-500">Memuat jadwal...</div>
          ) : schedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-xl bg-white/50">
              <Calendar className="h-12 w-12 text-slate-300 mb-4" />
              <p className="text-lg font-bold text-slate-500">Belum ada jadwal pembelajaran.</p>
              <Button variant="link" onClick={() => handleOpenDialog()} className="text-blue-600 font-bold mt-2">
                Buat Jadwal Baru
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {schedules.map((schedule, index) => (
                <div
                  key={schedule.id}
                  className="group flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
                >
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-yellow-400 font-black text-xl text-black">#{index + 1}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-black">{schedule.day}</span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-300 mx-1">/</span>
                      <span className="text-2xl sm:text-3xl font-black text-black uppercase">{schedule.month}</span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-300 mx-1">/</span>
                      <span className="text-2xl sm:text-3xl font-black text-black">{schedule.year}</span>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenDialog(schedule)}
                      className="flex-1 sm:flex-none border-2 border-black bg-white font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button
                      onClick={() => confirmDelete(schedule)}
                      className="flex-1 sm:flex-none border-2 border-black bg-red-500 font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-xl">
            <DialogHeader className="bg-yellow-400 p-6 border-b-2 border-black">
              <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight flex items-center gap-3">
                <div className="bg-white p-1.5 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Calendar className="h-5 w-5" />
                </div>
                {editingSchedule ? "Edit Jadwal" : "Tambah Jadwal"}
              </DialogTitle>
              <DialogDescription className="text-slate-700 font-bold">Masukkan detail tanggal, bulan, dan tahun untuk memulai pembelajaran.</DialogDescription>
            </DialogHeader>
            <div className="p-8 bg-white">
              <form id="scheduleForm" onSubmit={handleSave} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-sm font-black uppercase text-black">Tanggal Pelaksanaan</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="day" className="text-xs font-bold text-slate-500 uppercase">
                        Hari
                      </Label>
                      <Input
                        id="day"
                        name="day"
                        placeholder="DD"
                        maxLength={2}
                        value={formData.day}
                        onChange={handleInputChange}
                        className="h-12 text-center text-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="month" className="text-xs font-bold text-slate-500 uppercase">
                        Bulan
                      </Label>
                      <Select value={formData.month} onValueChange={(value) => setFormData((prev) => ({ ...prev, month: value }))}>
                        <SelectTrigger
                          id="month"
                          className="h-12 w-full text-center text-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:ring-0 focus:ring-offset-0 focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all rounded-lg relative flex items-center justify-center [&>svg]:absolute [&>svg]:right-3 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&_span]:w-full [&_span]:text-center"
                        >
                          <SelectValue placeholder="Bulan" />
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={5} className="w-[var(--radix-select-trigger-width)] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          {MONTHS.map((month) => (
                            <SelectItem key={month.value} value={month.value} className="font-bold focus:bg-yellow-200 cursor-pointer justify-center text-center">
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year" className="text-xs font-bold text-slate-500 uppercase">
                        Tahun
                      </Label>
                      <Input
                        id="year"
                        name="year"
                        placeholder="YYYY"
                        maxLength={4}
                        value={formData.year}
                        onChange={handleInputChange}
                        className="h-12 text-center text-lg font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <DialogFooter className="bg-slate-50 p-6 border-t-2 border-black">
              <Button
                type="submit"
                form="scheduleForm"
                disabled={isSaving}
                className="w-full h-11 text-base border-2 border-black bg-blue-600 text-white hover:bg-blue-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase tracking-wide rounded-lg disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSaving ? (
                  "Menyimpan..."
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" /> {editingSchedule ? "Simpan Perubahan" : "Simpan Jadwal"}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-xl">
            <div className="bg-red-500 p-6 border-b-2 border-black flex justify-center">
              <div className="h-16 w-16 bg-white rounded-full border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <AlertTriangle className="h-8 w-8 text-black" />
              </div>
            </div>
            <div className="p-6 text-center space-y-2">
              <DialogTitle className="text-2xl font-black uppercase text-black">Hapus Jadwal?</DialogTitle>
              <DialogDescription className="font-medium text-slate-600">
                Apakah Anda yakin ingin menghapus jadwal tanggal{" "}
                <span className="font-bold text-black">
                  {scheduleToDelete?.day}/{scheduleToDelete ? scheduleToDelete.month : ""}/{scheduleToDelete?.year}
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </div>
            <div className="grid grid-cols-2 gap-4 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="w-full border-2 border-black bg-white font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all cursor-pointer"
              >
                BATAL
              </Button>
              <Button
                onClick={handleDelete}
                className="w-full border-2 border-black bg-red-500 text-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all cursor-pointer"
              >
                YA, HAPUS
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
