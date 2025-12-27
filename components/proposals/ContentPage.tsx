"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mail, Globe, MapPin, Phone } from "lucide-react";
import { CONTENT_PRESETS } from "./contentPresets";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ContentPage({ data, onSplit }: { data: any, onSplit?: (overflow: string, remaining: string) => void }) {
    const contentRef = useRef<HTMLDivElement>(null);
    
    // Check for overflow logic
    const performOverflowCheck = () => {
        const target = contentRef.current;
        if (!target || !onSplit) return;

        // Tolerance threshold
        if (target.scrollHeight > target.clientHeight + 5) {
             // Avoid split loop if only one element is present and it's too big? 
             // Ideally we'd split text, but for now blocking it might be safer, 
             // OR we just let it overflow on the new page if it's irreducible.
             if (target.children.length === 0) return;

             console.log("Overflow detected, splitting...");
             toast.info("Auto-paginating content...");
             
             // Use childNodes to catch text nodes too (not just Elements)
             const nodes = Array.from(target.childNodes);
             let removedHtml = "";
             
             // Iterate backwards
             for (let i = nodes.length - 1; i >= 0; i--) {
                 const node = nodes[i];
                 
                 // SPECIAL HANDLING: If it's a list, try to split the items first
                 if (node.nodeType === Node.ELEMENT_NODE && ['UL', 'OL'].includes(node.nodeName)) {
                     const list = node as HTMLElement;
                     const listItems = Array.from(list.children);
                     let listRemovedHtml = "";
                     let listFits = false;

                     // Remove LIs from the bottom up
                     for (let j = listItems.length - 1; j >= 0; j--) {
                         const li = listItems[j];
                         list.removeChild(li);
                         listRemovedHtml = li.outerHTML + listRemovedHtml;
                         
                         if (target.scrollHeight <= target.clientHeight) {
                             listFits = true;
                             break;
                         }
                     }

                     if (listFits) {
                         // Loop ends, we found a split point INSIDE the list.
                         // Add the removed LIs (wrapped in the same list tag) to removedHtml
                         // We basically clone the wrapper structure
                         const cloneWrapper = list.cloneNode(false) as HTMLElement; // shallow clone (just tag + attrs)
                         removedHtml = cloneWrapper.outerHTML.replace('><', `>${listRemovedHtml}<`) + removedHtml; 
                         // Note: outerHTML of empty clone is <ul></ul>, we insert content. 
                         // Check strictly: <ul></ul> -> <ul>...</ul>. 
                         // Safer way:
                         removedHtml = `<${list.tagName.toLowerCase()} class="${list.className}" style="${list.style.cssText}">${listRemovedHtml}</${list.tagName.toLowerCase()}>` + removedHtml;
                         
                         break; // We solved the overflow!
                     } else {
                         // Even extracting all items didn't maximize space efficiently? 
                         // Or we removed all items and the empty UL still exists.
                         // Remove the empty UL and continue to previous sibling
                         target.removeChild(list); // Removing the node itself
                         // Logic below will add it to removedHtml
                     }
                 } else {
                    target.removeChild(node);
                 }
                 
                 // Append to removedHtml (preserving order)
                 if (node.nodeType === Node.ELEMENT_NODE) {
                    // Logic handles if we removed it above. 
                    // If we did the List Split and succeeded, we broke; logic never reaches here for that node.
                    // If we failed list split (removed all LIs), we removed `node` (the UL) above.
                    // We need to verify if node is still attached? No, we call removeChild.
                    // Re-adding logic to be cleaner:
                     removedHtml = (node as Element).outerHTML + removedHtml;
                 } else if (node.nodeType === Node.TEXT_NODE) {
                    removedHtml = (node.textContent || "") + removedHtml;
                 }
                 
                 // Check if it fits now
                 if (target.scrollHeight <= target.clientHeight) {
                     break;
                 }
             }
             
             if (removedHtml) {
                 // Pass both the overflow content (for new page) AND the remaining content (for current page)
                 // This ensures the parent state updates the current page so React doesn't restore the removed content.
                 onSplit(removedHtml, target.innerHTML);
             }
        }
    };

    // Check on mount (for recursive splitting) and updates
    useEffect(() => {
        // Small timeout to allow layout to settle
        const timer = setTimeout(performOverflowCheck, 500);
        return () => clearTimeout(timer);
    }, [data?.initialHtml]); // Run when data changes (initial load of new page)

    const [formats, setFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        insertUnorderedList: false,
        insertOrderedList: false
    });

    const checkFormats = () => {
        setFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            insertOrderedList: document.queryCommandState('insertOrderedList')
        });
    };

    // ... existing performOverflowCheck code ... 

    // Helper to run format command and check state
    const toggleFormat = (command: string) => {
        document.execCommand(command);
        checkFormats();
        if (contentRef.current) contentRef.current.focus();
    };

    // ... existing useEffect ...

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        performOverflowCheck();
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        checkFormats();
        if (e.key === 'Enter') performOverflowCheck();
    };

    // ... existing manual sync useEffect ...

    return (
        <div className="w-[210mm] h-[297mm] bg-white relative shadow-sm overflow-hidden flex flex-col justify-between">
            {/* ... Header ... */}
            {/* ... */}
            
            <div className="flex-1 px-12 py-32 relative group/page overflow-hidden">
                
                {/* Formatting Toolbar (Visible on Hover/Focus) */}
                <div className="absolute top-24 left-12 right-12 flex items-center gap-2 border-b border-zinc-200 pb-2 mb-4 opacity-0 group-hover/page:opacity-100 transition-opacity z-50 bg-white/90 backdrop-blur-sm">
                    {/* Text Formatting */}
                    <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 mr-2">
                        <button 
                            onMouseDown={(e) => { e.preventDefault(); toggleFormat('bold'); }}
                            className={cn(
                                "p-1.5 rounded transition-colors",
                                formats.bold ? "bg-zinc-800 text-white" : "hover:bg-zinc-100 text-zinc-700 hover:text-black"
                            )}
                            title="Bold"
                        >
                            <b className="font-serif">B</b>
                        </button>
                        <button 
                            onMouseDown={(e) => { e.preventDefault(); toggleFormat('italic'); }}
                            className={cn(
                                "p-1.5 rounded transition-colors",
                                formats.italic ? "bg-zinc-800 text-white" : "hover:bg-zinc-100 text-zinc-700 hover:text-black"
                            )}
                            title="Italic"
                        >
                            <i className="font-serif">I</i>
                        </button>
                        <button 
                            onMouseDown={(e) => { e.preventDefault(); toggleFormat('underline'); }}
                            className={cn(
                                "p-1.5 rounded transition-colors",
                                formats.underline ? "bg-zinc-800 text-white" : "hover:bg-zinc-100 text-zinc-700 hover:text-black"
                            )}
                            title="Underline"
                        >
                            <u className="font-serif">U</u>
                        </button>
                    </div>

                    {/* Lists */}
                    <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 mr-2">
                        <button 
                            onMouseDown={(e) => { e.preventDefault(); toggleFormat('insertUnorderedList'); }}
                            className={cn(
                                "p-1.5 rounded transition-colors flex items-center gap-1",
                                formats.insertUnorderedList ? "bg-zinc-800 text-white" : "hover:bg-zinc-100 text-zinc-700 hover:text-black"
                            )}
                            title="Bullet List"
                        >
                            <span className="text-[10px]">•</span> List
                        </button>
                        <button 
                            onMouseDown={(e) => { e.preventDefault(); toggleFormat('insertOrderedList'); }}
                            className={cn(
                                "p-1.5 rounded transition-colors flex items-center gap-1",
                                formats.insertOrderedList ? "bg-zinc-800 text-white" : "hover:bg-zinc-100 text-zinc-700 hover:text-black"
                            )}
                            title="Numbered List"
                        >
                            <span className="text-[10px]">1.</span> List
                        </button>
                    </div>
                    
                    {/* Presets */}
                    <select 
                        className="bg-zinc-50 border border-zinc-200 text-xs rounded px-2 py-1.5 outline-none focus:border-orange-500 text-zinc-600 min-w-[120px]"
                        onChange={(e) => {
                            const preset = CONTENT_PRESETS[e.target.value];
                            // Using a more robust selector than random ID
                             const editableDiv = (e.target as HTMLElement).closest('.group\\/page')?.querySelector('[contentEditable]') as HTMLElement;
                             
                             if (editableDiv && preset) {
                                // Append content
                                const newContent = `<br/><br/>${preset}`;
                                editableDiv.insertAdjacentHTML('beforeend', newContent);
                                
                                // Manually trigger overflow check
                                // Create a synthetic event or just call logic directly
                                performOverflowCheck();
                             }
                             e.target.value = ""; // Reset
                        }}
                    >
                        <option value="">-- Add Section --</option>
                        {Object.keys(CONTENT_PRESETS).map(key => (
                            <option key={key} value={key}>{key}</option>
                        ))}
                    </select>
                </div>

                <div 
                    ref={contentRef}
                    contentEditable
                    className="w-full h-full outline-none text-zinc-800 leading-relaxed space-y-4 hover:bg-zinc-50 focus:bg-orange-50/10 p-4 rounded overflow-hidden [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onBlur={handleInput}
                    onKeyUp={handleKeyUp} 
                    onMouseUp={checkFormats}
                    // Initial render only
                    dangerouslySetInnerHTML={!contentRef.current ? { __html: data?.initialHtml || `
                        <h2 class="text-xl font-bold mb-4">Scope of Work</h2>
                        <p>The purpose of this project is to...</p>
                        <p>Select a preset from the toolbar above to replace this content.</p>
                    ` } : undefined}
                />
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
