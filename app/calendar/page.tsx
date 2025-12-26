"use client";

import { CalendarPreview } from "@/components/calendar/CalendarPreview";
import { Header } from "@/components/Header";

export default function CalendarPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <Header />
      <main className="flex-1 flex flex-col items-center py-12">
        <div className="w-full max-w-[1400px] px-6">
          <div className="overflow-auto rounded-xl border border-white/10 bg-white/5 p-8 flex justify-center">
            <CalendarPreview />
          </div>
        </div>
      </main>
    </div>
  );
}
