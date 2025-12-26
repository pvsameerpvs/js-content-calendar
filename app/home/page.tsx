import Link from "next/link";
import { Header } from "@/components/Header";
import { CalendarDays, Plus,FilePen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
        
        {/* Page Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Dashboard</h1>
            <p className="text-zinc-500">Select a tool to get started.</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Content Calendar Card */}
            <Link 
              href="/calendar"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CalendarDays className="w-24 h-24 text-orange-500 -mr-4 -mt-4 transform rotate-12" />
                </div>

                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <CalendarDays className="w-6 h-6" />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-1 group-hover:text-orange-600 transition-colors">Content Calendar</h2>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        Plan, organize, and export your weekly social media content schedule to PDF.
                    </p>
                </div>

                <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-orange-600">
                    Open Tool <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </Link>

            {/* Proposal Generator Card */}
            <Link 
              href="/proposals"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden"
            >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <FilePen className="w-24 h-24 text-orange-500 -mr-4 -mt-4 transform rotate-12" />
                </div>

                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                    <FilePen className="w-6 h-6" />
                </div>

                <div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-1 group-hover:text-orange-600 transition-colors">Proposal Generator</h2>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        Create professional A4 proposals with custom pricing tables and branding.
                    </p>
                </div>

                <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-orange-600">
                    Create New <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </Link>

        </div>
      </main>
    </div>
  );
}
