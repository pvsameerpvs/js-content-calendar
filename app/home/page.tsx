import Link from "next/link";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center animate-in fade-in duration-500">
        <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">JS Content Calendar</h1>
            <p className="text-zinc-500">Manage and export your social media schedule.</p>
        </div>
        
        <Link 
          className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF4B1F] to-[#FF9068] px-8 py-4 text-white hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20 transition-all active:scale-95 font-bold shadow-lg"
          href="/calendar"
        >
          Open Content Calendar
        </Link>
      </main>
    </div>
  );
}
