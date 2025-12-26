"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown } from "lucide-react";
import { logoutAction } from "@/app/actions";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    toast.success("Logged out successfully");
    router.refresh(); 
    router.push("/");
  };

  return (
    <header className="w-full bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <div className="relative w-32 h-10">
         <Image 
           src="/logo-js.png" 
           alt="JustSearch Logo" 
           fill 
           className="object-contain object-left"
           priority 
         />
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 hover:bg-zinc-50 p-1.5 pr-3 rounded-full border border-zinc-100 transition-all hover:shadow-sm group"
        >
           <div className="w-8 h-8 bg-gradient-to-br from-[#FF4B1F] to-[#FF9068] rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-white">
              <User className="w-4 h-4" />
           </div>
           <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-zinc-700 leading-none group-hover:text-[#FF4B1F] transition-colors">Admin</p>
           </div>
           <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-zinc-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="p-1">
                 <div className="px-3 py-2 border-b border-zinc-50 mb-1">
                    <p className="text-xs font-medium text-zinc-900">Signed in as</p>
                    <p className="text-xs text-zinc-500 truncate">justSearch</p>
                 </div>
                 <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                 >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                 </button>
               </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
