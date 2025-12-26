"use client";

import Image from "next/image";
import { Mail, Globe, MapPin, Phone, Plus, Trash } from "lucide-react";
import { useState } from "react";

export function TablePage({ data }: { data: any }) {
    const [rows, setRows] = useState([
        { service: "Website Development", desc: "Design & setup of responsive website", cost: "999" },
        { service: "Social Media", desc: "Monthly management & content creation", cost: "1000/ Month" },
        { service: "SEO", desc: "Search engine optimization", cost: "1000/ Month" },
    ]);

    const addRow = () => setRows([...rows, { service: "New Service", desc: "Description", cost: "0" }]);
    const removeRow = (idx: number) => setRows(rows.filter((_, i) => i !== idx));

    return (
        <div className="w-[210mm] h-[297mm] bg-white relative shadow-sm overflow-hidden flex flex-col justify-between">
            
            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-20 bg-white">
                <div className="h-2 bg-[#FF4B1F] w-full"></div>
                <div className="px-8 py-4 flex items-center justify-between border-b border-zinc-100">
                    <div className="w-48 relative h-12">
                        <Image src="/logo-js.png" alt="Just Search" fill className="object-contain object-left" />
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-zinc-600">
                         <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#FF4B1F]" /> info@justsearch.ae</div>
                         <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-[#FF4B1F]" /> www.justsearch.ae</div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-12 py-32 flex flex-col gap-8">
                
                <h2 className="text-xl font-bold uppercase border-b-2 border-orange-500 pb-2 w-fit text-zinc-900">Monthly Package</h2>

                {/* Table */}
                <div className="w-full border border-zinc-300">
                    <div className="grid grid-cols-[1fr_2fr_1fr_40px] bg-white font-bold text-lg text-center text-zinc-900 border-b border-zinc-900 divide-x divide-zinc-300">
                         <div className="p-2">Services</div>
                         <div className="p-2">Description</div>
                         <div className="p-2">Cost ( AED )</div>
                         <div className="p-2 bg-zinc-50"></div>
                    </div>

                    {rows.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-[1fr_2fr_1fr_40px] border-b border-zinc-300 divide-x divide-zinc-300 text-sm text-zinc-900 group">
                            <div className="p-2" contentEditable suppressContentEditableWarning>{row.service}</div>
                            <div className="p-2" contentEditable suppressContentEditableWarning>{row.desc}</div>
                            <div className="p-2 text-center" contentEditable suppressContentEditableWarning>{row.cost}</div>
                            <button onClick={() => removeRow(idx)} className="flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    <button 
                        onClick={addRow}
                        className="w-full p-2 flex items-center justify-center gap-2 text-zinc-400 hover:text-orange-600 hover:bg-orange-50 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" /> Add Item
                    </button>
                    
                     <div className="grid grid-cols-[3fr_1fr_40px] bg-zinc-50 font-bold border-t-2 border-zinc-900 divide-x divide-zinc-300 text-zinc-900">
                         <div className="p-2 text-right">Total</div>
                         <div className="p-2 text-center">2999</div>
                         <div></div>
                    </div>
                </div>

                 <div 
                    contentEditable 
                    className="mt-8 text-sm space-y-2 outline-none hover:bg-zinc-50 p-2 rounded text-zinc-900"
                    suppressContentEditableWarning
                 >
                    <h3 className="font-bold text-lg">Did You Know?</h3>
                    <ul className="list-disc pl-5">
                       <li>50% upon project initiation</li>
                       <li>25% upon design approval</li>
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
