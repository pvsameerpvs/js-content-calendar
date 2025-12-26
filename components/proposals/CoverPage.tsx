"use client";

import Image from "next/image";
import { useState } from "react";

export function CoverPage({ data, isActive }: { data: any, isActive?: boolean }) {
  return (
    <div className="w-[210mm] h-[297mm] bg-white relative shadow-sm overflow-hidden flex flex-col">
      
      {/* Top Section: Logo & Titles */}
      <div className="pt-16 px-16">
        <div className="text-center font-medium text-xl text-zinc-800 mb-6">
            Transform Your Brand with
        </div>
        
        {/* Logo Container */}
        <div className="mb-6 relative w-full h-32 flex justify-center">
             <Image 
                src="/logo-js.png" 
                alt="Just Search"
                width={500}
                height={150}
                className="object-contain"
                priority
             />
        </div>

        <div className="text-center uppercase text-2xl font-normal text-zinc-800 tracking-wider mb-2">
            DIGITAL MARKETING AGENCY
        </div>
        <div className="text-center text-zinc-500 text-sm">
            Trust a marketing team dedicated to your success.
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex mt-16">
         {/* Left Orange Sidebar */}
         <div className="w-[60mm] bg-[#FF4B1F] h-full"></div>

         {/* Right Text Area */}
         <div className="flex-1 pl-10 pr-16 pt-10">
            
            <div 
                contentEditable 
                className="text-4xl font-extrabold text-zinc-800 uppercase leading-snug mb-20 outline-none hover:bg-zinc-50 focus:bg-orange-50/30 p-2 border border-transparent focus:border-orange-200 rounded"
                suppressContentEditableWarning
            >
                [DIGITAL MARKETING/Website Development/ Social Media Marketing/ SEO & AEO] SOLUTIONS
            </div>

            <div className="text-2xl text-zinc-700 mb-4">
                Proposal Prepared For:
            </div>
            
            <div 
                contentEditable 
                className="text-xl font-bold text-zinc-900 mb-8 outline-none hover:bg-zinc-50 focus:bg-orange-50/30 p-2 border-b-2 border-zinc-200 focus:border-orange-500 w-full"
                suppressContentEditableWarning
            >
                [ Client Name ]
            </div>

            <div 
                contentEditable
                className="text-sm text-zinc-600 leading-relaxed outline-none hover:bg-zinc-50 focus:bg-orange-50/30 p-2 rounded"
                suppressContentEditableWarning
            >
                This proposal outlines the scope, timeline, process, and commercial terms for designing and developing a high-quality, modern, and fully optimized corporate website to enhance your digital presence
            </div>

         </div>
      </div>
    </div>
  );
}
