"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Download, Trash2 } from "lucide-react";
import { ProposalPageData, PageType } from "./types";
import { toast } from "sonner";
import { CoverPage } from "./CoverPage";
import { ContentPage } from "./ContentPage";
import { TablePage } from "./TablePage";
import { LastPage } from "./LastPage";
import { EditorToolbar } from "./EditorToolbar";
import { exportProposalPdf } from "@/lib/proposalExport";

const PageWrapper = ({ children, onDelete, pageNumber }: { children: React.ReactNode, onDelete: () => void, pageNumber: number }) => (
  <div className="relative group shrink-0 transition-transform hover:scale-[1.005] proposal-page-wrapper">
    {children}
    
    {/* Page Number Indicator (UI Only) */}
    <div className="absolute top-4 left-[-60px] w-12 h-12 flex items-center justify-center bg-zinc-900 text-white font-bold rounded-full shadow-sm text-sm opacity-50 group-hover:opacity-100 group-hover:left-[-20px] transition-all z-40 cursor-default">
        {pageNumber}
    </div>

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
  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage on Mount
  useEffect(() => {
    const saved = localStorage.getItem("proposal_pages");
    if (saved) {
        try {
            setPages(JSON.parse(saved));
            toast.success("Restored your previous work");
        } catch (e) {
            console.error("Failed to load saved proposal", e);
        }
    }
  }, []);

  // Save to LocalStorage on Change
  useEffect(() => {
    if (pages.length > 0) {
        localStorage.setItem("proposal_pages", JSON.stringify(pages));
    }
  }, [pages]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (pages.length > 0) {
            e.preventDefault();
            e.returnValue = '';
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pages]);

  const addPage = (type: PageType) => {
    const newPage: ProposalPageData = {
      id: crypto.randomUUID(),
      type,
      content: {}, 
    };
    setPages(prev => [...prev, newPage]);
    toast.success(`Added ${type} page`);
    
    setTimeout(() => {
        containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };
  
  const removePage = (id: string) => {
    setPages(prev => {
        const newPages = prev.filter(p => p.id !== id);
        if (newPages.length === 0) localStorage.removeItem("proposal_pages");
        return newPages;
    });
    toast.info("Page removed");
  };

  const confirmDeletePage = () => {
    if (deleteConfirmId) {
        setPages(prev => {
            const newPages = prev.filter(p => p.id !== deleteConfirmId);
            if (newPages.length === 0) localStorage.removeItem("proposal_pages");
            return newPages;
        });
        toast.info("Page removed");
        setDeleteConfirmId(null);
    }
  };

  const confirmReset = () => {
    setPages([]);
    localStorage.removeItem("proposal_pages");
    setResetConfirmOpen(false);
    toast.info("Started over");
  };

  const splitPage = (sourcePageId: string, overflowContent: string, remainingContent: string) => {
    const pageIndex = pages.findIndex(p => p.id === sourcePageId);
    if (pageIndex === -1) return;

    // Update current page with remaining content to prevent loop/restoration
    const updatedPages = [...pages];
    updatedPages[pageIndex] = {
        ...updatedPages[pageIndex],
        content: { ...updatedPages[pageIndex].content, initialHtml: remainingContent }
    };

    // Check if next page exists and is a CONTENT page
    const nextPage = updatedPages[pageIndex + 1];
    
    if (nextPage && nextPage.type === "CONTENT") {
        // Merge overflow into the next page
        updatedPages[pageIndex + 1] = {
            ...nextPage,
            content: {
                ...nextPage.content,
                // Ensure we don't define undefined
                initialHtml: overflowContent + (nextPage.content.initialHtml || "")
            }
        };
        toast.success("Content moved to next page");
    } else {
        // Insert new page if next doesn't exist or isn't content
        const newPage: ProposalPageData = {
            id: crypto.randomUUID(),
            type: "CONTENT",
            content: { initialHtml: overflowContent },
            isContinuation: false
        };
        updatedPages.splice(pageIndex + 1, 0, newPage);
        toast.success("New page created");
    }

    setPages(updatedPages);
    // Focus the next page (where content was moved)
    if (updatedPages[pageIndex + 1]) {
        setFocusTarget(updatedPages[pageIndex + 1].id);
    }
  };

  const updatePageContent = (id: string, html: string) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, content: { ...p.content, initialHtml: html } } : p));
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
                        className="flex items-center gap-2 px-4 py-3 text-sm text-left font-medium text-zinc-700 bg-zinc-50 hover:bg-orange-50 hover:text-orange-700 rounded-lg border border-zinc-100 hover:border-orange-200 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Content / Text
                    </button>
                    {/* <button 
                        onClick={() => addPage("TABLE")}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-left font-medium text-zinc-700 bg-zinc-50 hover:bg-orange-50 hover:text-orange-700 rounded-lg border border-zinc-100 hover:border-orange-200 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Pricing Table
                    </button> */}
                    <button 
                        onClick={() => addPage("LAST")}
                         className="flex items-center gap-2 px-4 py-3 text-sm text-left font-medium text-zinc-700 bg-zinc-50 hover:bg-orange-50 hover:text-orange-700 rounded-lg border border-zinc-100 hover:border-orange-200 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Acceptance / Last
                    </button>
                </div>
            </div>

            <div className="mt-auto flex flex-col gap-2">
                <button 
                    onClick={() => setResetConfirmOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-zinc-100 text-zinc-600 font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-sm active:scale-95 border border-zinc-200"
                >
                    <Trash2 className="w-5 h-5" /> Reset / Start Over
                </button>
                <button 
                    onClick={() => exportProposalPdf("proposal-container")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                >
                    <Download className="w-5 h-5" /> Export PDF
                </button>
            </div>
        </div>

        {/* Scrollable Preview Area */}
        <div ref={containerRef} id="proposal-container" className="flex-1 overflow-y-auto bg-zinc-200/50 rounded-xl border-dashed border-2 border-zinc-300 shadow-inner relative">
            <EditorToolbar />
            
            <div className="p-8">
                {pages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-400 min-h-[500px]">
                        <p className="text-lg font-medium">No pages yet</p>
                        <p className="text-sm">Select a page type from the left to start</p>
                    </div>
                ) : (
                <div className="flex flex-col gap-8 items-center pb-20">
                    {pages.map((page, index) => (
                        <PageWrapper key={page.id} onDelete={() => setDeleteConfirmId(page.id)} pageNumber={index + 1}>
                            {page.type === "COVER" && <CoverPage data={page.content} isActive={true} />}
                            {page.type === "CONTENT" && (
                                <ContentPage 
                                    data={page.content} 
                                    onSplit={(overflow, remaining) => splitPage(page.id, overflow, remaining)}
                                    autoFocus={page.id === focusTarget}
                                    onFocusConsumed={() => setFocusTarget(null)}
                                    onUpdate={(html) => updatePageContent(page.id, html)}
                                    hasHeader={!page.isContinuation}
                                />
                            )}
                            {page.type === "TABLE" && <TablePage data={page.content} />}
                            {page.type === "LAST" && <LastPage data={page.content} />}
                        </PageWrapper>
                    ))}
                </div>
            )}
            </div>
        </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full m-4 border border-zinc-200">
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Delete Page?</h3>
                <p className="text-zinc-600 mb-6 text-sm">
                    Are you sure you want to remove this page? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDeletePage}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
                    >
                        Delete Page
                    </button>
                </div>
            </div>
        </div>
      )}


      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-full m-4 border border-zinc-200">
                <h3 className="text-lg font-bold text-zinc-900 mb-2">Start Over?</h3>
                <p className="text-zinc-600 mb-6 text-sm">
                    Are you sure you want to remove all pages and start fresh? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setResetConfirmOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmReset}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
                    >
                        Yes, Start Over
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
