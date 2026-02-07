"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import AnimatedLoginPage from "@/components/animated-characters-login-page";

export default function LoginPage() {
  return (
    <>
      <div className="lg:hidden bg-[#0f1208] h-[100dvh] w-full relative overflow-hidden flex flex-col justify-end md:justify-center supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh]">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1759984782199-a4f6d1b6054e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Futuristic Background"
            className="w-full h-full object-cover object-center md:object-top opacity-100 mix-blend-normal"
          />

          {/* Top gradient - lighter on mobile to show image */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0f1208] mix-blend-overlay"></div>
          {/* Bottom gradient - smooth transition for the form */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050602] via-[#0f1208]/50 to-transparent"></div>
        </div>

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-lg mx-auto">
          {/* Glass Panel */}
          <div className="bg-[#12140c]/70 backdrop-blur-2xl border-t border-white/10 rounded-t-[30px] md:rounded-[40px] md:border md:shadow-2xl px-6 pt-4 pb-4 md:px-8 md:pt-6 md:pb-8 shadow-2xl ring-1 ring-white/5">
            {/* Drag Handle (Mobile Visual Cue) */}
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-5 md:hidden"></div>

            {/* Header Content */}
            <div className="text-center mb-4 md:mb-6 space-y-1 md:space-y-2">
              <span className="text-primary text-xl font-bold tracking-widest uppercase">Skill Education</span>
              <h1 className="text-xl md:text-3xl text-white font-medium tracking-tight">Login</h1>
              <p className="text-neutral-400 text-xs md:text-base font-light max-w-xs mx-auto leading-relaxed">Let&apos;s get started by filling out the form.</p>
            </div>

            {/* Login Form Component */}
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <AnimatedLoginPage />
      </div>
    </>
  );
}
