"use client";
import * as React from "react";

import { X, ChevronRight, User, Phone, Mail, Award, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";
import { updateProfile } from "@/lib/profile-api";
import { toast } from "sonner";

interface UserDetailModalProps {
  user: Profile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({ user, open, onOpenChange }: UserDetailModalProps) {
  const [currentUser, setCurrentUser] = React.useState<Profile>(user);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Define exam data based on user's profile
  const exam1 = [
    { key: "reading", name: "Reading", completed: currentUser.reading, score: currentUser.score_reading },
    { key: "listening", name: "Listening", completed: currentUser.listening, score: currentUser.score_listening },
    { key: "structure", name: "Structure", completed: currentUser.structure, score: currentUser.score_structure },
  ];

  const exam2 = [
    { key: "reading2", name: "Reading", completed: currentUser.reading2, score: currentUser.score_reading2 },
    { key: "listening2", name: "Listening", completed: currentUser.listening2, score: currentUser.score_listening2 },
    { key: "structure2", name: "Structure", completed: currentUser.structure2, score: currentUser.score_structure2 },
  ];

  const exam3 = [
    { key: "reading3", name: "Reading", completed: currentUser.reading3, score: currentUser.score_reading3 },
    { key: "listening3", name: "Listening", completed: currentUser.listening3, score: currentUser.score_listening3 },
    { key: "structure3", name: "Structure", completed: currentUser.structure3, score: currentUser.score_structure3 },
  ];

  const exam4 = [
    { key: "reading4", name: "Reading", completed: currentUser.reading4, score: currentUser.score_reading4 },
    { key: "listening4", name: "Listening", completed: currentUser.listening4, score: currentUser.score_listening4 },
    { key: "structure4", name: "Structure", completed: currentUser.structure4, score: currentUser.score_structure4 },
  ];

  /**
   * Handle toggling exam status
   * If status is changed to from true (completed) to false (not completed), reset the score.
   */
  const handleToggleStatus = async (examType: 1 | 2 | 3 | 4, fieldKey: string, currentStatus: boolean | undefined) => {
    if (updating) return;

    // Determine new values
    const newStatus = !currentStatus;

    // Construct field names
    const statusField = fieldKey;
    // Score field is always "score_" + fieldKey (e.g. score_reading, score_reading2, score_reading3, etc.)
    const scoreField = `score_${fieldKey}`;

    // Optimistic update
    const updatedUser = { ...currentUser, [statusField]: newStatus };
    if (!newStatus) {
      // If setting to not completed, reset score
      // @ts-ignore - dynamic assignment
      updatedUser[scoreField] = null;
    }
    setCurrentUser(updatedUser);
    setUpdating(true);

    try {
      const payload: any = {
        id: currentUser.id,
        [statusField]: newStatus,
      };

      if (!newStatus) {
        payload[scoreField] = null;
      }

      await updateProfile(payload);
      toast.success("Status ujian berhasil diperbarui");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal memperbarui status");
      // Revert on error
      setCurrentUser(currentUser);
    } finally {
      setUpdating(false);
    }
  };

  const hasExam1 = currentUser.reading || currentUser.listening || currentUser.structure || currentUser.total_score !== null;
  const hasExam2 = currentUser.reading2 || currentUser.listening2 || currentUser.structure2 || currentUser.total_score2 !== null;
  const hasExam3 = currentUser.reading3 || currentUser.listening3 || currentUser.structure3 || currentUser.total_score3 !== null;
  const hasExam4 = currentUser.reading4 || currentUser.listening4 || currentUser.structure4 || currentUser.total_score4 !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 bg-white p-0 overflow-hidden fixed top-auto bottom-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full rounded-t-2xl rounded-b-none border-x-2 border-t-2 border-b-0 border-black data-[state=open]:slide-in-from-bottom-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-bottom-100 data-[state=closed]:zoom-out-100 sm:max-w-4xl sm:left-1/2 sm:-translate-x-1/2 sm:right-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-black p-6 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <User className="h-8 w-8 text-black" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-black">{currentUser.nama}</DialogTitle>
              <p className="text-sm font-medium text-slate-500">{currentUser.email}</p>
              {currentUser.nomor_whatsapp && (
                <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                  <Phone className="h-3 w-3" />
                  {currentUser.nomor_whatsapp}
                </p>
              )}
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="rounded-lg border-2 border-transparent p-1 transition-all hover:border-black hover:bg-red-500 hover:text-white cursor-pointer">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Account Settings */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Account Settings</h4>
            <Link
              href={`/dashboard/users/${currentUser.id}/edit`}
              className="group flex cursor-pointer items-center justify-between rounded-lg border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-slate-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <span className="font-bold text-black flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </span>
              <ChevronRight className="h-5 w-5 text-black transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Scores Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Informasi Skor</h4>

            {/* Total Scores */}
            <div className="grid grid-cols-2 gap-3">
              {currentUser.total_score !== null && (
                <div className="rounded-lg border-2 border-black bg-gradient-to-br from-blue-50 to-blue-100 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-bold text-slate-600 mb-1">Total Skor 1</p>
                  <p className="text-2xl font-black text-black">{currentUser.total_score?.toFixed(0)}</p>
                </div>
              )}
              {currentUser.total_score2 !== null && (
                <div className="rounded-lg border-2 border-black bg-gradient-to-br from-green-50 to-green-100 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-bold text-slate-600 mb-1">Total Skor 2</p>
                  <p className="text-2xl font-black text-black">{currentUser.total_score2?.toFixed(0)}</p>
                </div>
              )}
              {currentUser.total_score3 !== null && (
                <div className="rounded-lg border-2 border-black bg-gradient-to-br from-purple-50 to-purple-100 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-bold text-slate-600 mb-1">Total Skor 3</p>
                  <p className="text-2xl font-black text-black">{currentUser.total_score3?.toFixed(0)}</p>
                </div>
              )}
              {currentUser.total_score4 !== null && (
                <div className="rounded-lg border-2 border-black bg-gradient-to-br from-orange-50 to-orange-100 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-bold text-slate-600 mb-1">Total Skor 4</p>
                  <p className="text-2xl font-black text-black">{currentUser.total_score4?.toFixed(0)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Scores Tabs */}

          {/* Helper function to check if scores 3 or 4 should be shown */}
          {/* We only show them if Total Score is present or if any component has a score */}

          <Tabs defaultValue="exam1" className="w-full">
            <TabsList className="w-full justify-start rounded-lg border-2 border-black bg-slate-100 p-1 h-auto flex-wrap gap-1">
              <TabsTrigger value="exam1" className="flex-1 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                Ujian 1
              </TabsTrigger>
              <TabsTrigger value="exam2" className="flex-1 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                Ujian 2
              </TabsTrigger>
              <TabsTrigger value="exam3" className="flex-1 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                Ujian 3
              </TabsTrigger>
              <TabsTrigger value="exam4" className="flex-1 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                Ujian 4
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exam1" className="mt-4 space-y-3">
              {exam1.map((exam) => (
                <div key={`exam1-${exam.key}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:border-black hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <span className="text-sm font-bold text-black">Ujian {exam.name}</span>
                    {exam.score !== null && <p className="text-xs text-slate-500 mt-0.5">Skor: {exam.score}</p>}
                  </div>
                  <div onClick={() => handleToggleStatus(1, exam.key, exam.completed)} className="cursor-pointer transition-transform active:scale-95">
                    {exam.completed ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(6,95,70,1)]">Selesai</Badge>
                    ) : (
                      <Badge className="bg-red-500 hover:bg-red-600 border-2 border-red-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)]">Belum Selesai</Badge>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="exam2" className="mt-4 space-y-3">
              {exam2.map((exam) => (
                <div key={`exam2-${exam.key}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:border-black hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <span className="text-sm font-bold text-black">Ujian {exam.name}</span>
                    {exam.score !== null && <p className="text-xs text-slate-500 mt-0.5">Skor: {exam.score}</p>}
                  </div>
                  <div onClick={() => handleToggleStatus(2, exam.key, exam.completed)} className="cursor-pointer transition-transform active:scale-95">
                    {exam.completed ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(6,95,70,1)]">Selesai</Badge>
                    ) : (
                      <Badge className="bg-red-500 hover:bg-red-600 border-2 border-red-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)]">Belum Selesai</Badge>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="exam3" className="mt-4 space-y-3">
              {exam3.map((exam) => (
                <div key={`exam3-${exam.key}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:border-black hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <span className="text-sm font-bold text-black">Ujian {exam.name}</span>
                    {exam.score !== null && <p className="text-xs text-slate-500 mt-0.5">Skor: {exam.score}</p>}
                  </div>
                  <div onClick={() => handleToggleStatus(3, exam.key, exam.completed)} className="cursor-pointer transition-transform active:scale-95">
                    {exam.completed ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(6,95,70,1)]">Selesai</Badge>
                    ) : (
                      <Badge className="bg-red-500 hover:bg-red-600 border-2 border-red-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)]">Belum Selesai</Badge>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="exam4" className="mt-4 space-y-3">
              {exam4.map((exam) => (
                <div key={`exam4-${exam.key}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:border-black hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <span className="text-sm font-bold text-black">Ujian {exam.name}</span>
                    {exam.score !== null && <p className="text-xs text-slate-500 mt-0.5">Skor: {exam.score}</p>}
                  </div>
                  <div onClick={() => handleToggleStatus(4, exam.key, exam.completed)} className="cursor-pointer transition-transform active:scale-95">
                    {exam.completed ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(6,95,70,1)]">Selesai</Badge>
                    ) : (
                      <Badge className="bg-red-500 hover:bg-red-600 border-2 border-red-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)]">Belum Selesai</Badge>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black bg-slate-50 p-4">
          {currentUser.nomor_whatsapp ? (
            <Button
              onClick={() => {
                const phoneNumber = currentUser.nomor_whatsapp?.replace(/^0/, "62") ?? "";
                window.open(`https://wa.me/${phoneNumber}`, "_blank");
              }}
              className="w-full rounded-lg border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-bold text-lg h-12"
            >
              <Phone className="mr-2 h-5 w-5" />
              Hubungi via WhatsApp
            </Button>
          ) : (
            <Button
              onClick={() => (window.location.href = `mailto:${currentUser.email}`)}
              className="w-full rounded-lg border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-bold text-lg h-12"
            >
              <Mail className="mr-2 h-5 w-5" />
              Hubungi via Email
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
