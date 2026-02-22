"use client";

import React, { useEffect, useState } from "react";

interface DashboardFooterProps {
  email?: string;
}

export function DashboardFooter({ email: propEmail }: DashboardFooterProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");

    if (propEmail) {
      setEmail(propEmail);
    } else if (userEmail) {
      setEmail(userEmail);
    }

    if (userName) {
      setName(userName);
    }
  }, [propEmail]);

  if (!mounted) return null;

  return (
    <div className="mt-16 text-center">
      <p className="text-xs text-slate-400">
        Logged in as <span className="font-bold text-slate-600">{name || "Admin"}</span>
        {email && (
          <>
            {" "}
            (<span className="font-medium text-slate-500">{email}</span>)
          </>
        )}
      </p>
    </div>
  );
}
