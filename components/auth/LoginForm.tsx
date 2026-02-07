"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check } from "lucide-react";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Hardcoded credentials for demo
    if (email === "halo@gmail.com" && password === "123456") {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleLogin}>
      {/* Email Field */}
      <div className="group relative">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border border-white/20 rounded-full py-4 px-6 text-lg text-white placeholder-neutral-500 outline-none focus:border-primary/60 focus:bg-white/5 transition-all duration-300 font-light"
          required
        />
      </div>

      {/* Password Field */}
      <div className="group relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border border-white/20 rounded-full py-4 px-6 text-lg text-white placeholder-neutral-500 outline-none focus:border-primary/60 focus:bg-white/5 transition-all duration-300 font-light pr-14"
          required
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors">
          {showPassword ? <EyeOff className="w-6 h-6" strokeWidth={1.5} /> : <Eye className="w-6 h-6" strokeWidth={1.5} />}
        </button>
      </div>

      {error && <div className="text-red-400 text-sm text-center font-light">{error}</div>}

      {/* Utility Row */}
      <div className="flex items-center justify-between pt-2 px-1">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center justify-center">
            <input type="checkbox" className="peer appearance-none w-5 h-5 border border-neutral-600 rounded bg-transparent checked:bg-primary checked:border-primary transition-all duration-200" />
            <Check strokeWidth={2.5} className="w-3 h-3 text-primary-foreground absolute opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
          </div>
          <span className="text-neutral-400 text-base font-light group-hover:text-neutral-300 transition-colors">Remember me</span>
        </label>
        <Link href="#" className="text-neutral-400 text-base font-light hover:text-primary transition-colors">
          Forgot Password?
        </Link>
      </div>

      {/* Action Button */}
      <button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium py-4 rounded-full shadow-[0_0_25px_-5px_var(--tw-shadow-color)] shadow-primary/30 transition-all duration-300 active:scale-[0.99] mt-4 mb-4"
      >
        Sign In
      </button>
    </form>
  );
};
