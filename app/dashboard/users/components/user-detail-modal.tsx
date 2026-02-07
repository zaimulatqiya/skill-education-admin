"use client";

import { X, ChevronRight, User, Phone, Mail, Award, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserDetailModalProps {
  user: {
    id?: string | number;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailModal({ user, open, onOpenChange }: UserDetailModalProps) {
  const scores = ["Score 1", "Score 2", "Score 3", "Score 4"];
  const exams = ["Ujian Reading", "Ujian Listening", "Ujian Structure"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 bg-white p-0 overflow-hidden fixed top-auto bottom-0 left-0 right-0 translate-x-0 translate-y-0 w-full max-w-full rounded-t-2xl rounded-b-none border-x-2 border-t-2 border-b-0 border-black data-[state=open]:slide-in-from-bottom-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-bottom-100 data-[state=closed]:zoom-out-100 sm:max-w-4xl sm:left-1/2 sm:-translate-x-1/2 sm:right-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-black p-6 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <User className="h-8 w-8 text-black" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-black">{user.name}</DialogTitle>
              <p className="text-sm font-medium text-slate-500">{user.email}</p>
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
              href={`/dashboard/users/${user.id || 1}/edit`}
              className="group flex cursor-pointer items-center justify-between rounded-lg border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-slate-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <span className="font-bold text-black flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </span>
              <ChevronRight className="h-5 w-5 text-black transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Scores Tabs */}
          <Tabs defaultValue="Score 1" className="w-full">
            <TabsList className="w-full justify-start rounded-lg border-2 border-black bg-slate-100 p-1 h-auto flex-wrap gap-1">
              {scores.map((score) => (
                <TabsTrigger key={score} value={score} className="flex-1 rounded-md px-3 py-1.5 text-xs font-bold text-slate-500 data-[state=active]:bg-black data-[state=active]:text-white transition-all">
                  {score}
                </TabsTrigger>
              ))}
            </TabsList>
            {scores.map((score) => (
              <TabsContent key={score} value={score} className="mt-4 space-y-3">
                {exams.map((exam) => (
                  <div key={`${score}-${exam}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:border-black hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-bold text-black">{exam}</span>
                    {score === "Score 1" ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 border-2 border-emerald-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(6,95,70,1)]">Selesai</Badge>
                    ) : (
                      <Badge className="bg-red-500 hover:bg-red-600 border-2 border-red-700 text-white font-bold rounded-md px-3 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)]">Belum Selesai</Badge>
                    )}
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black bg-slate-50 p-4">
          <Button className="w-full rounded-lg border-2 border-black bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-bold text-lg h-12">
            <Mail className="mr-2 h-5 w-5" />
            Hubungi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
