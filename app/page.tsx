"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { loginAction } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const result = await loginAction(null, formData);

    if (result.success) {
        toast.success("Login Successful!");
        // Middleware will handle protection, but we redirect explicitly for UX
        setTimeout(() => {
             router.push("/home");
        }, 800);
    } else {
        setIsLoading(false);
        toast.error(result.message);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#FF4B1F] via-[#FF9068] to-[#FF4B1F] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Section with Logo */}
        <div className="bg-zinc-50 p-8 flex flex-col items-center justify-center border-b border-zinc-100">
          <div className="relative w-48 h-16 mb-2 transition-transform hover:scale-105 duration-300">
            <Image
              src="/logo-js.png"
              alt="JustSearch Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-sm text-zinc-500 font-medium tracking-wide uppercase mt-2">
            Content Management System
          </p>
        </div>

        {/* Login Form */}
        <div className="p-8 pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-semibold text-zinc-700 mb-1.5 ml-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4B1F]/20 focus:border-[#FF4B1F] transition-all placeholder:text-zinc-400"
                placeholder="username"
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-zinc-700 mb-1.5 ml-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4B1F]/20 focus:border-[#FF4B1F] transition-all placeholder:text-zinc-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 mt-4 bg-gradient-to-r from-[#FF4B1F] to-[#FF9068] text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 opacity-80" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-400">
              Protected & Secured by JustSearch Web Design L.L.C
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
