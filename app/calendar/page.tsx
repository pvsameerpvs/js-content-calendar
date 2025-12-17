"use client";

import { CalendarPreview } from "@/components/calendar/CalendarPreview";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center py-12">
      <div className="w-full max-w-[1400px] px-6">
        <div className="overflow-auto rounded-xl border border-white/10 bg-white/5 p-8 flex justify-center">
          <CalendarPreview />
        </div>
      </div>
    </main>
  );
}
