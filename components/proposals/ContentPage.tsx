"use client";

import Image from "next/image";
import { Mail, Globe, MapPin, Phone } from "lucide-react";

export function ContentPage({ data }: { data: any }) {
    return (
        <div className="w-[210mm] h-[297mm] bg-white relative shadow-sm overflow-hidden flex flex-col justify-between">
            
            {/* Header */}
            <div className="absolute top-0 left-0 w-full">
                <div className="h-2 bg-[#FF4B1F] w-full"></div>
                <div className="bg-white px-8 py-4 flex items-center justify-between border-b border-zinc-100">
                    <div className="w-48 relative h-12">
                        <Image src="/logo-js.png" alt="Just Search" fill className="object-contain object-left" />
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-zinc-600">
                         <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-[#FF4B1F]" /> info@justsearch.ae
                         </div>
                         <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-[#FF4B1F]" /> www.justsearch.ae
                         </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-12 py-32">
                <div 
                    contentEditable
                    className="w-full h-full outline-none text-zinc-800 leading-relaxed space-y-4 hover:bg-zinc-50 focus:bg-orange-50/10 p-4 rounded"
                    suppressContentEditableWarning
                >
                    <h2 className="text-xl font-bold mb-4">Scope of Work</h2>
                    <p>The purpose of this project is to...</p>
                    <br/>
                    <h2 className="text-xl font-bold mb-4">Project Objectives:</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Improve brand credibility</li>
                        <li>Strengthen online visibility...</li>
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="h-[20mm] bg-[#1a1a1a] flex items-center justify-between px-8 text-white relative">
                <div className="absolute bottom-0 left-0 border-b-[20mm] border-b-[#FF4B1F] border-r-[20mm] border-r-transparent"></div>

                <div className="z-10 flex items-center gap-4 text-[10px] ml-12">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>305, Damas Tower, Al Maktoum Road, Rigga Al Buteen, Deira, Dubai</span>
                    </div>
                </div>

                <div className="z-10 flex items-center gap-2 text-[10px]">
                     <Phone className="w-3 h-3" /> 04 491
                </div>
            </div>
        </div>
    );
}
