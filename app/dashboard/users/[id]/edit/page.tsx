"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, X, Save, Loader2, Download, QrCode } from "lucide-react"; // Tambahkan Download icon
import { format, addYears } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getProfileById, updateProfile } from "@/lib/profile-api";
import { Profile, UpdateProfilePayload } from "@/types/profile";
import { DashboardHeader } from "../../../components/dashboard-header"; // Relative path to dashboard-header

import generateCertificate, { downloadQR } from "@/lib/generatepdf";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use()
  const { id } = React.use(params);
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [profile, setProfile] = React.useState<Profile | null>(null);

  // TAMBAHKAN STATE UNTUK LOADING DOWNLOAD
  const [downloading, setDownloading] = React.useState(false);
  const [userRole, setUserRole] = React.useState("certificate");

  React.useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) {
      setUserRole(role);
    }
  }, []);

  // Form States
  const [formData, setFormData] = React.useState({
    nama: "",
    email: "",
    nomor_whatsapp: "",
    tempat_lahir: "",
  });
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [testDate, setTestDate] = React.useState<Date | undefined>(undefined);
  const [printDate, setPrintDate] = React.useState<Date | undefined>(undefined);
  const [expiredDate, setExpiredDate] = React.useState<Date | undefined>(undefined);

  // Score States
  const [scores, setScores] = React.useState({
    score1: {
      listening: "",
      structure: "",
      reading: "",
      total: "",
    },
    score2: {
      listening: "",
      structure: "",
      reading: "",
      total: "",
    },
    score3: {
      listening: "",
      structure: "",
      reading: "",
      total: "",
    },
    score4: {
      listening: "",
      structure: "",
      reading: "",
      total: "",
    },
  });

  // ... (kode fetch data tetap sama)
  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getProfileById(id);

        if (data) {
          setProfile(data);

          setFormData({
            nama: data.nama || "",
            email: data.email || "",
            nomor_whatsapp: data.nomor_whatsapp || "",
            tempat_lahir: data.tempat_lahir || "",
          });

          if (data.tanggal_lahir) {
            setDate(new Date(data.tanggal_lahir));
          }
          if (data.tanggal_selesai_ujian) {
            setTestDate(new Date(data.tanggal_selesai_ujian));
          }
          // Setup dates logic
          let initialPrintDate = new Date();

          if (data.tanggal_cetak_sertifikat) {
            initialPrintDate = new Date(data.tanggal_cetak_sertifikat);
            setPrintDate(initialPrintDate);
          } else {
            setPrintDate(initialPrintDate);
          }

          if (data.expired_date) {
            setExpiredDate(new Date(data.expired_date));
          } else {
            setExpiredDate(addYears(initialPrintDate, 2));
          }

          setScores({
            score1: {
              listening: data.score_listening?.toString() || "",
              structure: data.score_structure?.toString() || "",
              reading: data.score_reading?.toString() || "",
              total: data.total_score?.toString() || "",
            },
            score2: {
              listening: data.score_listening2?.toString() || "",
              structure: data.score_structure2?.toString() || "",
              reading: data.score_reading2?.toString() || "",
              total: data.total_score2?.toString() || "",
            },
            score3: {
              listening: data.score_listening3?.toString() || "",
              structure: data.score_structure3?.toString() || "",
              reading: data.score_reading3?.toString() || "",
              total: data.total_score3?.toString() || "",
            },
            score4: {
              listening: data.score_listening4?.toString() || "",
              structure: data.score_structure4?.toString() || "",
              reading: data.score_reading4?.toString() || "",
              total: data.total_score4?.toString() || "",
            },
          });
        } else {
          toast.error("User tidak ditemukan");
          router.push("/dashboard/users");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Gagal memuat data user");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, router]);

  // ... (fungsi handleScoreChange tetap sama)
  const handleScoreChange = (scoreType: "score1" | "score2" | "score3" | "score4", field: "listening" | "structure" | "reading", value: string) => {
    if (value && !/^\d*$/.test(value)) return;

    setScores((prev) => {
      const currentScore = { ...prev[scoreType], [field]: value };

      const l = parseInt(currentScore.listening || "0");
      const s = parseInt(currentScore.structure || "0");
      const r = parseInt(currentScore.reading || "0");

      let total = prev[scoreType].total;

      if (currentScore.listening || currentScore.structure || currentScore.reading) {
        const calculated = ((l + s + r) / 3) * 10;
        total = Math.round(calculated).toString();
      }

      return {
        ...prev,
        [scoreType]: {
          ...currentScore,
          total,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const payload: UpdateProfilePayload = {
        id: profile.id,
        nama: formData.nama,
        email: formData.email,
        nomor_whatsapp: formData.nomor_whatsapp,
        tempat_lahir: formData.tempat_lahir,
        tanggal_lahir: date ? format(date, "yyyy-MM-dd") : null,
        tanggal_selesai_ujian: testDate ? format(testDate, "yyyy-MM-dd") : null,
        tanggal_cetak_sertifikat: printDate ? format(printDate, "yyyy-MM-dd") : null,
        expired_date: expiredDate ? format(expiredDate, "yyyy-MM-dd") : null,

        score_listening: scores.score1.listening ? parseInt(scores.score1.listening) : null,
        listening: !!scores.score1.listening,
        score_structure: scores.score1.structure ? parseInt(scores.score1.structure) : null,
        structure: !!scores.score1.structure,
        score_reading: scores.score1.reading ? parseInt(scores.score1.reading) : null,
        reading: !!scores.score1.reading,
        total_score: scores.score1.total ? parseFloat(scores.score1.total) : null,

        score_listening2: scores.score2.listening ? parseInt(scores.score2.listening) : null,
        listening2: !!scores.score2.listening,
        score_structure2: scores.score2.structure ? parseInt(scores.score2.structure) : null,
        structure2: !!scores.score2.structure,
        score_reading2: scores.score2.reading ? parseInt(scores.score2.reading) : null,
        reading2: !!scores.score2.reading,
        total_score2: scores.score2.total ? parseFloat(scores.score2.total) : null,

        score_listening3: scores.score3.listening ? parseInt(scores.score3.listening) : null,
        listening3: !!scores.score3.listening,
        score_structure3: scores.score3.structure ? parseInt(scores.score3.structure) : null,
        structure3: !!scores.score3.structure,
        score_reading3: scores.score3.reading ? parseInt(scores.score3.reading) : null,
        reading3: !!scores.score3.reading,
        total_score3: scores.score3.total ? parseFloat(scores.score3.total) : null,

        score_listening4: scores.score4.listening ? parseInt(scores.score4.listening) : null,
        listening4: !!scores.score4.listening,
        score_structure4: scores.score4.structure ? parseInt(scores.score4.structure) : null,
        structure4: !!scores.score4.structure,
        score_reading4: scores.score4.reading ? parseInt(scores.score4.reading) : null,
        reading4: !!scores.score4.reading,
        total_score4: scores.score4.total ? parseFloat(scores.score4.total) : null,
      };

      await updateProfile(payload);
      toast.success("Data berhasil disimpan");
      router.refresh();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // TAMBAHKAN FUNGSI DOWNLOAD SERTIFIKAT
  const handleDownloadCertificate = async () => {
    if (!profile) {
      toast.error("Data profile tidak tersedia");
      return;
    }

    // Validasi data yang diperlukan
    if (!formData.nama) {
      toast.error("Nama tidak boleh kosong");
      return;
    }

    if (!formData.tempat_lahir) {
      toast.error("Tempat lahir tidak boleh kosong");
      return;
    }

    if (!date) {
      toast.error("Tanggal lahir tidak boleh kosong");
      return;
    }

    // Cek apakah ada minimal 1 score yang terisi
    const hasScore1 = scores.score1.total && parseInt(scores.score1.total) > 0;
    const hasScore2 = scores.score2.total && parseInt(scores.score2.total) > 0;

    if (!hasScore1 && !hasScore2 && !scores.score3.total && !scores.score4.total) {
      toast.error("Minimal harus ada 1 set nilai yang terisi");
      return;
    }

    setDownloading(true);
    try {
      const examFinishDate = profile.tanggal_selesai_ujian ? new Date(profile.tanggal_selesai_ujian) : new Date();

      // Siapkan data untuk generate certificate
      const certificateData = {
        id: profile.id,
        nama: formData.nama,
        tempat_lahir: formData.tempat_lahir,
        tanggal_lahir: format(date, "yyyy-MM-dd"),
        tanggal_selesai_ujian: testDate ? format(testDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        tanggal_cetak_sertifikat: printDate ? format(printDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        nomor_registrasi: profile.nomor_registrasi || "REG-" + profile.id,
        expired: expiredDate ? format(expiredDate, "yyyy-MM-dd") : format(addYears(new Date(), 2), "yyyy-MM-dd"),

        // Score 1
        score_listening: scores.score1.listening ? parseInt(scores.score1.listening) : 0,
        score_structure: scores.score1.structure ? parseInt(scores.score1.structure) : 0,
        score_reading: scores.score1.reading ? parseInt(scores.score1.reading) : 0,
        total_score: scores.score1.total ? parseFloat(scores.score1.total) : 0,

        // Score 2 (untuk best score calculation)
        score_listening2: scores.score2.listening ? parseInt(scores.score2.listening) : 0,
        score_structure2: scores.score2.structure ? parseInt(scores.score2.structure) : 0,
        score_reading2: scores.score2.reading ? parseInt(scores.score2.reading) : 0,
        total_score2: scores.score2.total ? parseFloat(scores.score2.total) : 0,

        // Score 3
        score_listening3: scores.score3.listening ? parseInt(scores.score3.listening) : 0,
        score_structure3: scores.score3.structure ? parseInt(scores.score3.structure) : 0,
        score_reading3: scores.score3.reading ? parseInt(scores.score3.reading) : 0,
        total_score3: scores.score3.total ? parseFloat(scores.score3.total) : 0,

        // Score 4
        score_listening4: scores.score4.listening ? parseInt(scores.score4.listening) : 0,
        score_structure4: scores.score4.structure ? parseInt(scores.score4.structure) : 0,
        score_reading4: scores.score4.reading ? parseInt(scores.score4.reading) : 0,
        total_score4: scores.score4.total ? parseFloat(scores.score4.total) : 0,
      };

      // Generate certificate
      await generateCertificate(certificateData);

      toast.success("Sertifikat berhasil didownload!");
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast.error("Gagal membuat sertifikat. Silakan coba lagi.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadBarcode = async () => {
    if (!profile) {
      toast.error("Data profile tidak tersedia");
      return;
    }

    setDownloading(true);
    try {
      await downloadQR(profile);
      toast.success("Barcode berhasil didownload!");
    } catch (error) {
      console.error("Error generating barcode:", error);
      toast.error("Gagal membuat barcode. Silakan coba lagi.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) return null;

  const scoreTabs = [
    { id: "score1", label: "Score 1" },
    { id: "score2", label: "Score 2" },
    { id: "score3", label: "Score 3" },
    { id: "score4", label: "Score 4" },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 font-sans selection:bg-primary/30 selection:text-primary-foreground overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

      {/* Header */}
      <DashboardHeader title={profile.nama} backUrl="/dashboard/users" />

      {/* Main Content */}
      <div className="flex-1 w-full overflow-y-auto relative z-0">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
          {/* Personal Info Section */}
          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="relative group">
              <Label htmlFor="name" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
                Nama Lengkap
              </Label>
              <Input
                id="name"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
              />
            </div>
            {/* Email */}
            <div className="relative group">
              <Label htmlFor="email" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
                Email
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
              />
            </div>
            {/* Phone */}
            <div className="relative group">
              <Label htmlFor="phone" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
                Nomor Whatsapp
              </Label>
              <Input
                id="phone"
                value={formData.nomor_whatsapp}
                onChange={(e) => setFormData({ ...formData, nomor_whatsapp: e.target.value })}
                className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
              />
            </div>
            {/* Birth Place */}
            <div className="relative group">
              <Label htmlFor="birthPlace" className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">
                Tempat Lahir
              </Label>
              <Input
                id="birthPlace"
                value={formData.tempat_lahir}
                onChange={(e) => setFormData({ ...formData, tempat_lahir: e.target.value })}
                className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
              />
            </div>
          </div>

          {/* Date of Birth Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full h-14 justify-center text-left font-black text-white bg-black border-2 border-black hover:bg-slate-800 hover:text-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-[2px] active:shadow-none transition-all uppercase tracking-wider text-lg cursor-pointer",
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
          <Tabs defaultValue="score1" className="w-full mt-4">
            <TabsList className="w-full justify-between bg-transparent p-0 border-b-2 border-slate-200 h-auto rounded-none mb-6">
              {scoreTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 rounded-none border-b-4 border-transparent px-4 py-3 text-sm font-bold text-slate-400 data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:bg-transparent transition-all"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {scoreTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Listening */}
                <div className="relative group">
                  <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Nilai Listening</Label>
                  <div className="relative">
                    <Input
                      value={scores[tab.id as keyof typeof scores].listening}
                      onChange={(e) => handleScoreChange(tab.id as "score1" | "score2" | "score3" | "score4", "listening", e.target.value)}
                      className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
                      placeholder="Contoh: 50"
                    />
                    {scores[tab.id as keyof typeof scores].listening && (
                      <button onClick={() => handleScoreChange(tab.id as "score1" | "score2" | "score3" | "score4", "listening", "")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Structure */}
                <div className="relative group">
                  <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Nilai Structure</Label>
                  <div className="relative">
                    <Input
                      value={scores[tab.id as keyof typeof scores].structure}
                      onChange={(e) => handleScoreChange(tab.id as "score1" | "score2" | "score3" | "score4", "structure", e.target.value)}
                      className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
                      placeholder="Contoh: 50"
                    />
                    {scores[tab.id as keyof typeof scores].structure && (
                      <button onClick={() => handleScoreChange(tab.id as "score1" | "score2" | "score3" | "score4", "structure", "")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Reading */}
                <div className="relative group">
                  <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Nilai Reading</Label>
                  <div className="relative">
                    <Input
                      value={scores[tab.id as keyof typeof scores].reading}
                      onChange={(e) => handleScoreChange(tab.id as "score1" | "score2" | "score3" | "score4", "reading", e.target.value)}
                      className="h-14 rounded-lg border-2 border-slate-200 bg-white px-4 pt-2 font-bold text-black shadow-sm focus-visible:ring-0 focus-visible:border-black transition-all"
                      placeholder="Contoh: 50"
                    />
                    {scores[tab.id as keyof typeof scores].reading && (
                      <button onClick={() => handleScoreChange(tab.id as "score1" | "score2" | "score3" | "score4", "reading", "")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {/* Total Score Section */}
                <div className="relative group">
                  <Label className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Total Score (Auto Calculated)</Label>
                  <div className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200 font-black text-lg text-black h-14 flex items-center">{scores[tab.id as keyof typeof scores].total || "0"}</div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Certificate Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t-2 border-slate-200 pt-6 mt-4">
            <div className="md:col-span-3">
              <h3 className="text-lg font-black text-slate-700 mb-2 uppercase tracking-wide">Informasi Sertifikat</h3>
            </div>

            {/* Expired Date */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Expired Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full h-14 justify-start text-left font-bold text-black border-2 border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm active:translate-y-[1px] transition-all", !expiredDate && "text-muted-foreground")}
                  >
                    {expiredDate ? format(expiredDate, "MMMM dd, yyyy", { locale: idLocale }) : <span>Pilih Tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-2 border-slate-200 shadow-md rounded-lg">
                  <Calendar
                    mode="single"
                    selected={expiredDate}
                    onSelect={(date) => {
                      setExpiredDate(date);
                      if (date) {
                        setPrintDate(addYears(date, -2));
                      }
                    }}
                    initialFocus
                    locale={idLocale}
                    captionLayout="dropdown"
                    fromYear={2000}
                    toYear={2040}
                    defaultMonth={expiredDate}
                    classNames={{ today: "font-normal" }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Cetak Sertifikat Date */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Cetak Sertifikat</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full h-14 justify-start text-left font-bold text-black border-2 border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm active:translate-y-[1px] transition-all", !printDate && "text-muted-foreground")}
                  >
                    {printDate ? format(printDate, "MMMM dd, yyyy", { locale: idLocale }) : <span>Pilih Tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-2 border-slate-200 shadow-md rounded-lg">
                  <Calendar
                    mode="single"
                    selected={printDate}
                    onSelect={(date) => {
                      setPrintDate(date);
                      if (date) {
                        setExpiredDate(addYears(date, 2));
                      }
                    }}
                    initialFocus
                    locale={idLocale}
                    captionLayout="dropdown"
                    fromYear={2000}
                    toYear={2040}
                    defaultMonth={printDate || undefined}
                    classNames={{ today: "font-normal" }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Selesai Test Date */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Selesai Test</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full h-14 justify-start text-left font-bold text-black border-2 border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm active:translate-y-[1px] transition-all", !testDate && "text-muted-foreground")}
                  >
                    {testDate ? format(testDate, "MMMM dd, yyyy", { locale: idLocale }) : <span>Pilih Tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-2 border-slate-200 shadow-md rounded-lg">
                  <Calendar
                    mode="single"
                    selected={testDate}
                    onSelect={(date) => {
                      setTestDate(date);
                      if (date) {
                        setPrintDate(date);
                        setExpiredDate(addYears(date, 2));
                      }
                    }}
                    initialFocus
                    locale={idLocale}
                    captionLayout="dropdown"
                    fromYear={2000}
                    toYear={2040}
                    defaultMonth={testDate || undefined}
                    classNames={{ today: "font-normal" }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action Buttons - BAGIAN YANG DIUBAH */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-2 mb-8">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-14 rounded-xl border-2 border-black bg-slate-800 text-white font-bold text-sm md:text-lg hover:bg-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Simpan
                </>
              )}
            </Button>

            {/* BUTTON DOWNLOAD - DITAMBAHKAN FUNGSI onClick */}
            {userRole === "barcode" ? (
              <Button
                onClick={handleDownloadBarcode}
                disabled={downloading}
                className="h-14 rounded-xl border-2 border-black bg-white text-black font-bold text-sm md:text-lg hover:bg-slate-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-5 w-5" />
                    Download Barcode
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDownloadCertificate}
                disabled={downloading}
                className="h-14 rounded-xl border-2 border-black bg-white text-black font-bold text-sm md:text-lg hover:bg-slate-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {downloading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download Sertifikat
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
