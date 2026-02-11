"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Headset, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { DashboardHeader } from "../components/dashboard-header";

export default function NomorAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    wa_sertifikat: "",
    wa_test: "",
    wa_teknisi: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin-number");
        if (response.ok) {
          const json = await response.json();
          if (json.data) {
            setFormData({
              wa_sertifikat: json.data.wa_sertifikat || "",
              wa_test: json.data.wa_test || "",
              wa_teknisi: json.data.wa_teknisi || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching admin numbers:", error);
        toast.error("Gagal memuat data nomor admin.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/admin-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Use property names matching the API expectations
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      toast.success("Nomor admin berhasil disimpan!");
    } catch (error) {
      console.error("Error saving admin numbers:", error);
      toast.error("Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-slate-50 font-sans selection:bg-primary/30 selection:text-primary-foreground">
      {/* Background Decor - Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
      {/* Header */}
      <DashboardHeader title="Nomor Admin" />
      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col gap-6 p-4 sm:p-10 items-center">
        <div className="w-full max-w-2xl flex flex-col gap-2">
          <h1 className="text-3xl font-black uppercase tracking-tight text-black sm:text-4xl text-center sm:text-left">Nomor Admin</h1>
          <p className="text-slate-600 text-center sm:text-left font-medium">Kelola link WhatsApp admin untuk berbagai keperluan admin.</p>
        </div>

        <Card className="w-full max-w-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white rounded-xl overflow-hidden">
          <CardHeader className="bg-white border-b-2 border-slate-100 pb-6">
            <CardTitle className="text-xl font-bold uppercase flex items-center gap-2">
              <Headset className="h-6 w-6" />
              Kontak Admin
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">Masukkan URL WhatsApp lengkap (contoh: https://wa.me/628...)</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="wa_sertifikat" className="font-bold text-slate-700">
                  Url Whatsapp Admin Sertifikat
                </Label>
                <Input
                  id="wa_sertifikat"
                  name="wa_sertifikat"
                  placeholder="https://wa.me/..."
                  value={formData.wa_sertifikat}
                  onChange={handleChange}
                  className="h-12 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-black shadow-sm font-bold text-black rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="wa_test" className="font-bold text-slate-700">
                  Url Whatsapp Admin Test
                </Label>
                <Input
                  id="wa_test"
                  name="wa_test"
                  placeholder="https://wa.me/..."
                  value={formData.wa_test}
                  onChange={handleChange}
                  className="h-12 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-black shadow-sm font-bold text-black rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="wa_teknisi" className="font-bold text-slate-700">
                  Url Whatsapp Admin Teknisi
                </Label>
                <Input
                  id="wa_teknisi"
                  name="wa_teknisi"
                  placeholder="https://wa.me/..."
                  value={formData.wa_teknisi}
                  onChange={handleChange}
                  className="h-12 border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-black shadow-sm font-bold text-black rounded-lg"
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="mt-4 w-full border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] transition-all hover:bg-slate-800 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none font-bold h-14 text-lg rounded-xl cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
