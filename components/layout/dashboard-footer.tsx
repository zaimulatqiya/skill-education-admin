import React from "react";

interface DashboardFooterProps {
  email?: string;
}

export function DashboardFooter({ email = "student@skill.edu" }: DashboardFooterProps) {
  return (
    <div className="mt-16 text-center">
      <p className="text-xs text-slate-400">
        Logged in as <span className="font-medium text-slate-600">{email}</span>
      </p>
    </div>
  );
}
