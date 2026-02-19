"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardHeader } from "@/app/dashboard/components/dashboard-header";
import { supabase } from "@/supabase/client";
import { toast } from "sonner";

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to parse input to number
const parseCurrency = (value: string) => {
  return parseInt(value.replace(/[^0-9]/g, "")) || 0;
};

interface ProgramPackage {
  id: string;
  title: string;
  originalPrice: number;
  price: number;
  isBestValue: boolean;
}

export default function PaketProgramPage() {
  const [packages, setPackages] = useState<ProgramPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Active Items
  const [editingPackage, setEditingPackage] = useState<ProgramPackage | null>(null);
  const [packageToDelete, setPackageToDelete] = useState<ProgramPackage | null>(null);

  // Form State - using strings for input handling to allow easy typing
  const [formData, setFormData] = useState({
    title: "",
    originalPrice: "",
    price: "",
    isBestValue: false,
  });

  // Fetch data from API
  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/program-packages");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch packages");
      }

      // Map API response (API returns snake_case from DB in result.data)
      // Prices come as numbers from DB now
      const formattedPackages: ProgramPackage[] = (result.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        originalPrice: item.original_price, // Now a number
        price: item.price, // Now a number
        isBestValue: item.is_best_value,
      }));
      setPackages(formattedPackages);
    } catch (error: any) {
      console.error("Error fetching packages:", error);
      toast.error(error.message || "Gagal mengambil data paket.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenDialog = (pkg?: ProgramPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        title: pkg.title,
        originalPrice: formatCurrency(pkg.originalPrice), // Display formatted
        price: formatCurrency(pkg.price), // Display formatted
        isBestValue: pkg.isBestValue,
      });
    } else {
      setEditingPackage(null);
      setFormData({
        title: "",
        originalPrice: "",
        price: "",
        isBestValue: false,
      });
    }
    setIsDialogOpen(true);
  };

  // Handle price inputs specifically
  const handlePriceInput = (value: string, field: "originalPrice" | "price") => {
    // 1. Remove non-digits
    const numericValue = parseCurrency(value);

    // 2. Format immediately if there is a value, else empty
    const formatted = value === "" ? "" : formatCurrency(numericValue);

    setFormData((prev) => ({ ...prev, [field]: formatted }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        title: formData.title,
        originalPrice: parseCurrency(formData.originalPrice), // Send as number
        price: parseCurrency(formData.price), // Send as number
        isBestValue: formData.isBestValue,
      };

      let response;
      if (editingPackage) {
        // Edit via API (PUT)
        response = await fetch("/api/program-packages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingPackage.id,
            ...payload,
          }),
        });
      } else {
        // Add via API (POST)
        response = await fetch("/api/program-packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan data.");
      }

      toast.success(editingPackage ? "Paket berhasil diperbarui!" : "Paket berhasil ditambahkan!");
      await fetchPackages();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving package:", error);
      toast.error(error.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  const confirmDelete = (pkg: ProgramPackage) => {
    setPackageToDelete(pkg);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!packageToDelete) return;

    try {
      const response = await fetch(`/api/program-packages?id=${packageToDelete.id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus paket.");
      }

      toast.success("Paket berhasil dihapus.");
      await fetchPackages();
    } catch (error: any) {
      console.error("Error deleting package:", error);
      toast.error(error.message || "Gagal menghapus paket.");
    } finally {
      setIsDeleteDialogOpen(false);
      setPackageToDelete(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f0f0f0] font-sans selection:bg-yellow-200 selection:text-black">
      <DashboardHeader title="PAKET PROGRAM" backUrl="/dashboard" />

      {/* Background Decor - Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      <div className="relative z-10 mx-auto max-w-7xl p-6">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => handleOpenDialog()}
              size="sm"
              className="h-10 border-2 border-black bg-yellow-400 px-6 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="mr-2 h-5 w-5" /> Tambah Paket
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-10 font-bold text-slate-500">Memuat data paket...</div>
          ) : packages.length === 0 ? (
            <div className="text-center py-10 font-bold text-slate-500">Belum ada paket program.</div>
          ) : (
            packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
              >
                <div className="flex flax-1 items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-blue-100 font-black text-xl text-blue-600">#{index + 1}</div>
                  <div>
                    <h3 className="text-xl font-black uppercase text-black">{pkg.title}</h3>
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <span className="text-slate-400 line-through decoration-red-500 decoration-2">{formatCurrency(pkg.originalPrice)}</span>
                      <span className="text-blue-600">{formatCurrency(pkg.price)}</span>
                    </div>
                  </div>
                  {pkg.isBestValue && <div className="hidden sm:flex rounded-md border-2 border-black bg-yellow-400 px-3 py-1 text-xs font-black text-black ml-2">BEST VALUE</div>}
                </div>

                {pkg.isBestValue && <div className="sm:hidden rounded-md border-2 border-black bg-yellow-400 px-3 py-1 text-xs font-black text-black w-fit">BEST VALUE</div>}

                <div className="flex w-full sm:w-auto items-center gap-2 mt-2 sm:mt-0">
                  <Button
                    variant="outline"
                    onClick={() => handleOpenDialog(pkg)}
                    size="sm"
                    className="flex-1 sm:flex-none border-2 border-black bg-white font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
                  >
                    <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    onClick={() => confirmDelete(pkg)}
                    size="sm"
                    className="flex-1 sm:flex-none border-2 border-black bg-red-500 font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden rounded-xl">
            <DialogHeader className="bg-blue-600 p-6 border-b-2 border-black">
              <DialogTitle className="text-2xl font-black text-white uppercase tracking-tight">{editingPackage ? "Edit Paket" : "Tambah Paket"}</DialogTitle>
              <DialogDescription className="text-blue-100 font-medium">Sesuaikan detail paket program di sini.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 p-6">
              <div className="grid gap-2">
                <Label htmlFor="title" className="font-bold text-black">
                  Durasi Paket
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: 1 Minggu"
                  className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="originalPrice" className="font-bold text-black">
                  Harga Asli
                </Label>
                <Input
                  id="originalPrice"
                  value={formData.originalPrice}
                  onChange={(e) => handlePriceInput(e.target.value, "originalPrice")}
                  placeholder="Rp 0"
                  className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price" className="font-bold text-black">
                  Harga Diskon
                </Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handlePriceInput(e.target.value, "price")}
                  placeholder="Rp 0"
                  className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:translate-x-[2px] focus-visible:translate-y-[2px] transition-all"
                />
              </div>
              <div className="flex items-center space-x-3 rounded-lg border-2 border-black bg-yellow-50 p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Checkbox
                  id="isBestValue"
                  checked={formData.isBestValue}
                  onCheckedChange={(checked) => setFormData({ ...formData, isBestValue: checked as boolean })}
                  className="h-5 w-5 border-2 border-black data-[state=checked]:bg-black data-[state=checked]:text-white"
                />
                <label htmlFor="isBestValue" className="font-bold text-black cursor-pointer">
                  Tandai sebagai BEST VALUE
                </label>
              </div>
            </div>
            <DialogFooter className="bg-slate-50 p-6 border-t-2 border-black">
              <Button
                type="submit"
                onClick={handleSave}
                disabled={isLoading}
                className="w-full border-2 border-black bg-black text-white hover:bg-slate-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold cursor-pointer"
              >
                {isLoading ? "Menyimpan..." : "SIMPAN PERUBAHAN"}
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
              <DialogTitle className="text-2xl font-black uppercase text-black">Hapus Paket?</DialogTitle>
              <DialogDescription className="font-medium text-slate-600">
                Apakah Anda yakin ingin menghapus paket <span className="font-bold text-black">"{packageToDelete?.title}"</span>? Tindakan ini tidak dapat dibatalkan.
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
