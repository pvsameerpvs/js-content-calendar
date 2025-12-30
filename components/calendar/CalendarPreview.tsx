"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useCalendarStore } from "./store";
import type { WeekdayKey, DayData } from "./types";
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { exportPresentationPdf } from "@/lib/exportPdf";
import { DayEditor } from "./DayEditor";

const order: WeekdayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  "Facebook": <Facebook className="w-4 h-4" />,
  "Insta": <Instagram className="w-4 h-4" />,
  "LinkedIn": <Linkedin className="w-4 h-4" />,
  "Twitter": <Twitter className="w-4 h-4" />,
  "Youtube": <Youtube className="w-4 h-4" />,
  // Default/Fallback
  "default": <div className="w-4 h-4 rounded-full bg-blue-500" />
};

function getPlatformIcon(platformString: string) {
    if (!platformString) return null;
    
    // Split by comma or slash to support legacy "Insta / Facebook" and new "Insta, Facebook"
    const platforms = platformString.split(/[,/]/).map(p => p.trim()).filter(Boolean);
    
    if (platforms.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
            {platforms.map((p, i) => {
                const lower = p.toLowerCase();
                let icon = <div className="w-4 h-4 rounded-full bg-zinc-400" />;

                if (lower.includes("face")) icon = <Facebook className="w-5 h-5 text-[#1877F2]" />;
                else if (lower.includes("insta")) icon = <Instagram className="w-5 h-5 text-[#E4405F]" />;
                else if (lower.includes("link")) icon = <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
                else if (lower.includes("twit") || lower.includes("x")) icon = <Twitter className="w-5 h-5 text-[#1DA1F2]" />;
                else if (lower.includes("you")) icon = <Youtube className="w-5 h-5 text-[#FF0000]" />;
                else if (lower.includes("pin")) icon = <div className="w-5 h-5 rounded-full bg-[#E60023] text-white flex items-center justify-center text-[10px] font-bold">P</div>;
                else if (lower.includes("tik")) icon = <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">T</div>;

                return <div key={i}>{icon}</div>;
            })}
        </div>
    );
}


function CellLabel({ children, isExporting }: { children: React.ReactNode, isExporting?: boolean }) {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-[12px] bg-white text-[14px] font-bold text-zinc-800 shadow-sm border border-zinc-100`}>
      {children}
    </div>
  );
}

function DayHeader({ title }: { title: string, isExporting?: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[12px] bg-white text-[14px] uppercase tracking-wider font-extrabold text-zinc-800 shadow-md border-b-4 border-zinc-200">
      {title}
    </div>
  );
}

export function CalendarPreview() {
  const brandLeftText = useCalendarStore((s) => s.brandLeftText);
  const brandRightText = useCalendarStore((s) => s.brandRightText);
  const clientName = useCalendarStore((s) => s.clientName);
  const setClientName = useCalendarStore((s) => s.setClientName);
  const logoDataUrl = useCalendarStore((s) => s.logoDataUrl);
  const startDate = useCalendarStore((s) => s.startDate);
  const endDate = useCalendarStore((s) => s.endDate);
  const setStartDate = useCalendarStore((s) => s.setStartDate);
  const setEndDate = useCalendarStore((s) => s.setEndDate);
  const days = useCalendarStore((s) => s.days);
  const updateDay = useCalendarStore((s) => s.updateDay);
  
  // Renamed for clarity: tracks if we are currently preparing/capturing the PDF
  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Editor State
  const [editingDay, setEditingDay] = useState<WeekdayKey | null>(null);

  const handleEdit = (day: WeekdayKey) => {
    setEditingDay(day);
  };

  const handleCloseEditor = () => {
    setEditingDay(null);
  };

  const handleSaveDay = (key: WeekdayKey, data: Partial<DayData>) => {
    updateDay(key, data);
  };

  const handleDownloadPdf = async (e?: React.MouseEvent) => {
    console.log("handleDownloadPdf triggered");
    if (e) {
      e.preventDefault();
      console.log("Default prevented");
    }
    
    if (!calendarRef.current) {
      console.error("calendarRef is null");
      return;
    }
    
    console.log("Setting exporting state...");
    // 1. Set exporting state to true to switch inputs to text
    setIsPdfExporting(true);

    try {
      // 2. Wait for React to render the state change (inputs -> text)
      // Increased wait time to ensure images and styles are fully stable
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Waited for render, starting html2canvas...");

      if (calendarRef.current) {
         await exportPresentationPdf(calendarRef.current, "content-calendar-presentation.pdf");
      }
      
    } catch (err) {
      console.error("PDF generation failed", err);
      // Explicitly show error to user
      alert("Failed to generate PDF: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      // 3. Revert state
      setIsPdfExporting(false);
      console.log("Export state reverted");
    }
  };


  return (
    <div className="flex flex-col items-center gap-6">
       
       {/* Editor Dialog */}
       {editingDay && (
         <DayEditor 
            isOpen={true} 
            onClose={handleCloseEditor} 
            dayKey={editingDay} 
            dayData={days[editingDay]}
            onSave={handleSaveDay} 
         />
       )}
        
       {/* Actions Bar */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-zinc-200 w-full max-w-[338mm]">
        <h2 className="text-lg font-semibold text-zinc-800 flex-1">
             Weekly Planner <span className="text-zinc-400 font-normal text-sm ml-2">(Click any Column to Edit)</span>
        </h2>
         <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isPdfExporting}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {isPdfExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export PDF
        </button>
      </div>


      {/* Presentation 16:9: 338mm x 190mm */}
      <div
        ref={calendarRef}
        id="calendar-print"
        className="relative overflow-hidden shadow-2xl bg-white"
        style={{
          width: "338mm",
          height: "190mm",
          // The requested vibrant theme
          background: "linear-gradient(135deg, #FF4D00 0%, #FF8800 50%, #FFB700 100%)",
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[100mm] h-[100mm] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[80mm] h-[80mm] bg-black/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />


        {/* inner padding */}
        <div className="flex flex-col h-full w-full px-[12mm] py-[10mm]">
          
          {/* Header Section */}
          <div className="flex items-center justify-between mb-[4mm] h-[24mm]">
             {/* Left: JustSearch Logo */}
             <div className="w-[60mm] flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brandLeftText} alt="JustSearch" crossOrigin="anonymous" className="max-h-[18mm] w-auto object-contain" />
             </div>

             {/* Center: Title & Editable Client Name */}
             <div className="flex-1 text-center flex flex-col items-center justify-center">
                 {isPdfExporting ? (
                     // Render as TEXT during PDF export to avoid input glitches
                     <div className="text-[32px] font-black text-white uppercase tracking-wider drop-shadow-lg leading-none text-center w-full max-w-[400px] mb-1 pb-[1px] border-b border-transparent">
                         {clientName || "CLIENT COMPANY NAME"}
                     </div>
                 ) : (
                     <input 
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="text-[32px] font-black text-white uppercase tracking-wider drop-shadow-lg leading-none bg-transparent border-b border-white/20 hover:border-white/50 focus:border-white transition-colors text-center w-full max-w-[400px] outline-none placeholder:text-white/50 mb-1"
                        placeholder="CLIENT COMPANY NAME"
                     />
                 )}
                 <span className="block text-[24px] text-white/90 font-bold tracking-widest leading-[0.8] uppercase">
                    Weekly Content Calendar
                 </span>
             </div>

             {/* Right: Date Range */}
             <div className="w-[80mm] flex flex-col items-end justify-center select-none">
                 {/* From Date */}
                 <div className="flex items-center gap-2 mb-1">
                     <span className="text-white/80 font-bold text-[10px] uppercase tracking-wider">FROM:</span>
                     {isPdfExporting ? (
                         <span className="text-white font-bold text-[14px] tracking-wide min-w-[30mm] text-right">{startDate || "DD/MM/YYYY"}</span>
                     ) : (
                         <input 
                            type="text" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="bg-transparent border-b border-white/30 text-white font-bold text-[14px] tracking-wide w-[30mm] text-right outline-none placeholder:text-white/30 hover:border-white/60 focus:border-white transition-colors"
                         />
                     )}
                 </div>

                 {/* To Date */}
                 <div className="flex items-center gap-2">
                     <span className="text-white/80 font-bold text-[10px] uppercase tracking-wider">TO:</span>
                      {isPdfExporting ? (
                         <span className="text-white font-bold text-[14px] tracking-wide min-w-[30mm] text-right">{endDate || "DD/MM/YYYY"}</span>
                     ) : (
                         <input 
                            type="text" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="DD/MM/YYYY"
                            className="bg-transparent border-b border-white/30 text-white font-bold text-[14px] tracking-wide w-[30mm] text-right outline-none placeholder:text-white/30 hover:border-white/60 focus:border-white transition-colors"
                         />
                     )}
                 </div>
             </div>
          </div>

          {/* Grid Container */}
          {/* We need strictly equal height rows to fit exactly 210mm height minus padding/header */}
            {/* Remaining height approx: 210 - 20 (padding) - 24 (header) - 4 (margin) = 162mm */ }
            <div
            className="grid gap-[2mm] h-[142mm]" // EXPLICIT HEIGHT to prevent flex issues/jumping
            style={{
              gridTemplateColumns: "30mm repeat(6, minmax(0, 1fr))", // minmax(0, 1fr) ensures content doesn't force column expansion
              gridTemplateRows: "10mm 30mm 16mm 16mm 34mm 26mm", // Maximized heights to use full page space (Total ~132mm + gaps)
            }}
          >
            {/* --- ROW 1: HEADERS --- */}
            
            {/* Corner */}
             <div className="rounded-[12px] bg-white/50 p-[1px]">
                 <div className="w-full h-full flex items-center justify-center rounded-[11px] border border-zinc-200/60 bg-zinc-50">
                    <span className="font-black text-zinc-950 text-[12px] uppercase tracking-wide">Day</span>
                 </div>
            </div>

            {/* Days */}
            {order.map((k) => (
              <div key={k} className="cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => handleEdit(k)}>
                <DayHeader title={days[k].title} isExporting={isPdfExporting} />
              </div>
            ))}


            {/* --- ROW 2: MOOD BOARD --- */}
             <div className="rounded-[12px] p-[2mm]">
                <CellLabel>
                    <div className="text-center leading-tight">
                        Mood<br/>Board
                    </div>
                </CellLabel>
             </div>
             {order.map((k) => {
                 const mood = days[k].moodImage;
                 return (
                    <div key={k} className="bg-white p-1 rounded-[12px] shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all" onClick={() => handleEdit(k)}>
                        <div className="w-full h-full relative rounded-[8px] overflow-hidden bg-zinc-50 border border-zinc-100 group">
                             {mood ? (
                                <img src={mood} alt="Mood" crossOrigin="anonymous" className="absolute inset-0 w-full h-full object-cover" />
                             ) : (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-300">
                                   <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center mb-1">
                                        <div className="w-3 h-3 border-2 border-zinc-300 rounded-full" />
                                   </div>
                                </div>
                             )}
                        </div>
                    </div>
                 );
             })}


            {/* --- ROW 3: CONTENT TYPE --- */}
            <div className="rounded-[12px] p-[2mm]">
              <CellLabel>Content</CellLabel>
            </div>
             {order.map((k) => (
              <div 
                key={k} 
                className={`bg-white rounded-[12px] px-1 py-0.5 shadow-sm flex items-center justify-center transition-all cursor-pointer hover:ring-2 hover:ring-blue-500/50`}
                onClick={() => !isPdfExporting && handleEdit(k)}
               >
                 <div className={`text-[11px] font-bold text-center text-zinc-900 uppercase break-words leading-tight`}>
                     {days[k].contentType || "-"}
                 </div>
              </div>
            ))}


            {/* --- ROW 4: PLATFORM --- */}
            <div className="rounded-[12px] p-[2mm]">
              <CellLabel>Platform</CellLabel>
            </div>
             {order.map((k) => (
              <div 
                key={k} 
                className={`bg-white rounded-[12px] shadow-sm flex items-center justify-center transition-all cursor-pointer hover:ring-2 hover:ring-blue-500/50`}
                onClick={() => !isPdfExporting && handleEdit(k)}
              >
                   {/* Center the icon(s) */}
                   <div className="flex gap-2 scale-110">
                      {getPlatformIcon(days[k].platform)}
                   </div>
              </div>
            ))}


            {/* --- ROW 5: CAPTIONS --- */}
            <div className="rounded-[12px] p-[2mm]">
               <CellLabel>Captions</CellLabel>
            </div>
             {order.map((k) => (
              <div 
                key={k} 
                className={`bg-white rounded-[12px] p-2.5 shadow-sm relative transition-all cursor-pointer hover:ring-2 hover:ring-blue-500/50 overflow-hidden`}
                onClick={() => !isPdfExporting && handleEdit(k)}
               >
                   {days[k].caption ? (
                        <p className={`text-[10px] text-zinc-700 font-medium whitespace-pre-wrap break-words leading-normal line-clamp-7`}>
                            {days[k].caption}
                        </p>
                   ) : (
                       <div className="w-full h-full flex items-center justify-center">
                            <span className="w-8 h-[2px] bg-zinc-100 rounded-full"/>
                       </div>
                   )}
              </div>
            ))}

             {/* --- ROW 6: HASHTAGS --- */}
            <div className="rounded-[12px] p-[2mm]">
               <CellLabel>Hashtags</CellLabel>
            </div>
             {order.map((k) => (
              <div 
                key={k} 
                className={`bg-white rounded-[12px] px-1 py-0.5 shadow-sm flex items-center justify-center transition-all cursor-pointer hover:ring-2 hover:ring-blue-500/50`}
                onClick={() => !isPdfExporting && handleEdit(k)}
              >
                   <p className={`text-[10px] text-blue-600 font-semibold text-center break-words leading-tight`}>
                       {days[k].hashtag}
                   </p>
              </div>
            ))}
            
          </div>

          <div className="mt-auto pt-2 flex justify-between items-end opacity-80">
                <div className="text-[8px] text-white font-medium tracking-widest uppercase">
                    Designed by JustSearch LLC
                </div>
                <div className="text-[8px] text-white font-medium tracking-widest uppercase">
                    www.justsearch.ae
                </div>
          </div>

        </div>
      </div>
    </div>
  );
}
