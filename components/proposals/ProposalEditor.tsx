"use client";

import { useState, useRef } from "react";
import { Plus, Download, Trash2 } from "lucide-react";
import { ProposalPageData, PageType } from "./types";
import { toast } from "sonner";
import { CoverPage } from "./CoverPage";
import { ContentPage } from "./ContentPage";
import { TablePage } from "./TablePage";
import { LastPage } from "./LastPage";
import { exportProposalPdf } from "@/lib/proposalExport";

// Page Wrapper 
const PageWrapper = ({ children, onDelete }: { children: React.ReactNode, onDelete: () => void }) => (
  <div className="relative group shrink-0 transition-transform hover:scale-[1.005] proposal-page-wrapper">
    {children}
    {/* Delete Action */}
    <button 
        onClick={onDelete}
        className="absolute top-4 right-[-50px] p-3 bg-white text-zinc-400 hover:text-red-500 rounded-full border border-zinc-200 shadow-sm opacity-0 group-hover:opacity-100 group-hover:right-4 transition-all z-50"
        title="Remove Page"
    >
        <Trash2 className="w-5 h-5" />
    </button>
  </div>
);

export function ProposalEditor() {
  const [pages, setPages] = useState<ProposalPageData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const addPage = (type: PageType) => {
    const newPage: ProposalPageData = {
      id: crypto.randomUUID(),
      type,
      content: {}, 
    };
    setPages([...pages, newPage]);
    toast.success(`Added ${type} page`);
    
    setTimeout(() => {
        containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const removePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id));
    toast.info("Page removed");
  };

  return (
    <div className="flex gap-8 h-[calc(100vh-100px)]">
        {/* Sidebar Controls */}
        <div className="w-64 flex flex-col gap-4 shrink-0">
            <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-900 mb-3 uppercase tracking-wider">Add Pages</h3>
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={() => addPage("COVER")}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-left font-medium text-zinc-700 bg-zinc-50 hover:bg-orange-50 hover:text-orange-700 rounded-lg border border-zinc-100 hover:border-orange-200 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Cover Page
                    </button>
                    <button 
                        onClick={() => addPage("CONTENT")}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-left font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 rounded-lg border border-zinc-100 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Content / Text
                    </button>
                    <button 
                        onClick={() => addPage("TABLE")}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-left font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 rounded-lg border border-zinc-100 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Pricing Table
                    </button>
                    <button 
                        onClick={() => addPage("LAST")}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-left font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 rounded-lg border border-zinc-100 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Acceptance / Last
                    </button>
                </div>
            </div>

            <div className="mt-auto">
                <button 
                    onClick={() => exportProposalPdf("proposal-container")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                >
                    <Download className="w-5 h-5" /> Export PDF
                </button>
            </div>
        </div>

        {/* Scrollable Preview Area */}
        <div ref={containerRef} id="proposal-container" className="flex-1 overflow-y-auto bg-zinc-200/50 rounded-xl border-dashed border-2 border-zinc-300 p-8 shadow-inner relative">
            {pages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                    <p className="text-lg font-medium">No pages yet</p>
                    <p className="text-sm">Select a page type from the left to start</p>
                </div>
            ) : (
                <div className="flex flex-col gap-8 items-center pb-20">
                    {pages.map((page) => (
                        <PageWrapper key={page.id} onDelete={() => removePage(page.id)}>
                            {page.type === "COVER" && <CoverPage data={page.content} isActive={true} />}
                            {page.type === "CONTENT" && <ContentPage data={page.content} />}
                            {page.type === "TABLE" && <TablePage data={page.content} />}
                            {page.type === "LAST" && <LastPage data={page.content} />}
                        </PageWrapper>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
