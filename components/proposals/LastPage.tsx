"use client";

import Image from "next/image";
import { Mail, Globe, MapPin, Phone } from "lucide-react";

// Reusing standard header/footer layout
export function LastPage({ data }: { data: any }) {
    return (
        <div className="w-[210mm] h-[297mm] bg-white relative shadow-sm overflow-hidden flex flex-col justify-between">
            
            {/* Header (Standard) */}
            <div className="absolute top-0 left-0 w-full z-20 bg-white">
                <div className="h-2 bg-[#FF4B1F] w-full"></div>
                <div className="px-8 py-4">
                     <table className="w-full border-collapse">
                         <tbody>
                             <tr>
                                 {/* Left: Logo */}
                                 <td className="align-middle text-left w-1/2">
                                     <img src="/logo-js.png" alt="Just Search" className="h-10 w-auto object-contain object-left" style={{ maxWidth: 'none', height: '2.5rem' }} />
                                 </td>
                                 {/* Right: Contact Info */}
                                 <td className="align-middle text-right w-1/2">
                                     <table className="inline-table text-left border-collapse" style={{ marginLeft: 'auto' }}>
                                         <tbody>
                                             <tr>
                                                 <td className="align-middle pr-3 pb-2">
                                                     {/* Icon removed */}
                                                 </td>
                                                 <td className="align-middle text-xs text-zinc-600 pb-2 whitespace-nowrap">
                                                     info@justsearch.ae
                                                 </td>
                                             </tr>
                                             <tr>
                                                 <td className="align-middle pr-3">
                                                     {/* Icon removed */}
                                                 </td>
                                                 <td className="align-middle text-xs text-zinc-600 whitespace-nowrap">
                                                     www.justsearch.ae
                                                 </td>
                                             </tr>
                                         </tbody>
                                     </table>
                                 </td>
                             </tr>
                         </tbody>
                     </table>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-12 py-24 text-zinc-900">
                
                {/* Company Details */}
                <div 
                    contentEditable 
                    className="mb-8 text-sm font-bold uppercase leading-relaxed outline-none hover:bg-zinc-50 p-2 rounded"
                    suppressContentEditableWarning
                >
                    COMPANY NAME:<br/>
                    HELLO VISION EVENTS LLC<br/>
                    ACCOUNT NO: 14006537820001<br/>
                    IBAN: AE720030014006537820001 BANK- ADCB
                </div>

                <h2 className="text-xl font-bold mb-6">Acceptance</h2>

                <div 
                    contentEditable 
                    className="text-sm leading-relaxed mb-10 outline-none hover:bg-zinc-50 p-2 rounded min-h-[100px]"
                    suppressContentEditableWarning
                >
                    <p className="mb-4"> If the above proposal meets your approval, please confirm by signing below or replying via email.</p>
                    <p className="mb-4">This project will elevate digital presence and support business growth, and serve as a strong digital foundation for the company.</p>
                    <p>We look forward to partnering with you on this project.</p>
                </div>

                {/* Signature Block */}
                <div className="border border-zinc-800 flex h-40">
                    {/* Client Side */}
                    <div className="flex-1 border-r border-zinc-800 p-4 text-sm font-bold relative">
                        <div contentEditable suppressContentEditableWarning className="outline-none hover:bg-zinc-50 p-1">
                            [Company Name]:<br/>
                            Name:<br/>
                            Designation:<br/>
                            Date:<br/>
                            Signature:
                        </div>
                    </div>

                    {/* Just Search Side */}
                    <div className="flex-1 p-4 text-sm font-bold relative overflow-hidden">
                        <div contentEditable suppressContentEditableWarning className="relative z-10 outline-none hover:bg-zinc-50 p-1">
                            Just Search:<br/>
                            Name: Rijo Varghese<br/>
                            Designation: CEO & Project Manager<br/>
                            Date:<br/>
                            Signature:
                        </div>
                        
                        {/* Signature 1 */}
                        <div className="absolute bottom-5 left-24 w-24 h-12 mix-blend-multiply pointer-events-none">
                            <Image 
                                src="/signature-1.png" 
                                alt="Signature" 
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Stamp & Signature 2 */}
                        <div className="absolute bottom-1 right-2 w-24 h-24 rotate-[-10deg] pointer-events-none">
                            {/* Stamp */}
                            <div className="absolute inset-0 opacity-90">
                                <Image 
                                    src="/stamp-js.png" 
                                    alt="Stamp" 
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            {/* Sig 2 overlapping stamp */}
                            <div className="absolute inset-0 flex items-center justify-center mix-blend-multiply opacity-80">
                                <Image 
                                    src="/signature-2.png" 
                                    alt="Signature 2" 
                                    width={64}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* KYC Section */}
                 <div 
                    contentEditable 
                    className="mt-12 text-sm font-medium outline-none hover:bg-zinc-50 p-2 rounded"
                    suppressContentEditableWarning
                >
                    KYC Requirement -<br/>
                    Trade License Copy
                </div>

            </div>


            {/* Footer (Same as others) */}
            <div className="h-[20mm] bg-[#1a1a1a] flex items-center justify-between px-8 text-white relative">
                <div className="absolute bottom-0 left-0 border-b-[20mm] border-b-[#FF4B1F] border-r-[20mm] border-r-transparent"></div>
                <div className="z-10 flex items-center gap-4 text-[10px] ml-12">
                    <div className="flex items-center gap-2">
                        <span>305, Damas Tower, Al Maktoum Road, Rigga Al Buteen, Deira, Dubai</span>
                    </div>
                </div>
                <div className="z-10 flex items-center gap-2 text-[10px]">
                     <Phone className="w-3 h-3" /> 04 491 9850
                </div>
            </div>

        </div>
    );
}
