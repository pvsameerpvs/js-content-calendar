
"use client";

import { Header } from "@/components/Header";
import { ProposalEditor } from "@/components/proposals/ProposalEditor";

export default function ProposalPage() {
  return (
    <div className="h-screen bg-zinc-50 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 p-6 overflow-hidden">
         <div className="max-w-[1600px] mx-auto h-full">
            <ProposalEditor />
         </div>
      </main>
    </div>
  );
}
