"use client";

import { useState, useEffect } from "react";
import { User, Save, Building2, Phone } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";

export default function SettingsPage() {
  const [defaultAddress, setDefaultAddress] = useState("");
  const [defaultPhone, setDefaultPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("proposal_default_address");
    const savedPhone = localStorage.getItem("proposal_default_phone");
    
    if (savedAddress) setDefaultAddress(savedAddress);
    if (savedPhone) setDefaultPhone(savedPhone);
    setIsLoading(false);
  }, []);

  const handleSave = () => {
    localStorage.setItem("proposal_default_address", defaultAddress);
    localStorage.setItem("proposal_default_phone", defaultPhone);
    toast.success("Settings saved successfully");
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-5xl mx-auto p-6 space-y-8">
        <div>
            <h1 className="text-2xl font-bold text-zinc-900">Settings</h1>
            <p className="text-zinc-500 text-sm">Manage your account and application preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
            {/* Sidebar Navigation (Visual Only for now) */}
            <nav className="flex flex-col gap-1">
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-900 bg-white rounded-lg border border-zinc-200 shadow-sm">
                    <User className="w-4 h-4" /> General
                </button>
                 <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors text-left" disabled>
                    <Building2 className="w-4 h-4" /> Team (Coming Soon)
                </button>
            </nav>

            {/* Content Area */}
            <div className="space-y-6">
                
                {/* Profile Section */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                     <h2 className="text-lg font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-orange-600" />
                        Profile
                     </h2>
                     <div className="grid gap-4 max-w-md">
                        <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Display Name</label>
                            <input 
                                type="text" 
                                value="Just Search Admin" 
                                disabled 
                                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-500 cursor-not-allowed"
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-medium text-zinc-500 mb-1">Email</label>
                            <input 
                                type="text" 
                                value="admin@justcallback.com" 
                                disabled 
                                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-500 cursor-not-allowed"
                            />
                        </div>
                     </div>
                </div>

                {/* Proposal Defaults Section */}
                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                     <h2 className="text-lg font-semibold text-zinc-900 mb-1 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-orange-600" />
                        Proposal Configuration
                     </h2>
                     <p className="text-sm text-zinc-500 mb-6">These details will be used as default values for new proposals.</p>
                     
                     <div className="grid gap-4 max-w-xl">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Default Company Address</label>
                            <input 
                                type="text" 
                                value={defaultAddress}
                                onChange={(e) => setDefaultAddress(e.target.value)}
                                placeholder="e.g. 305, Damas Tower, Deira, Dubai"
                                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Default Contact Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                                <input 
                                    type="text" 
                                    value={defaultPhone}
                                    onChange={(e) => setDefaultPhone(e.target.value)}
                                    placeholder="e.g. 04 491 9850"
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors shadow-sm active:scale-95"
                            >
                                <Save className="w-4 h-4" /> Save Preferences
                            </button>
                        </div>
                     </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}
