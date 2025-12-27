"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Mail, Globe, MapPin, Phone } from "lucide-react";
import { CONTENT_PRESETS } from "./contentPresets";
import { toast } from "sonner";

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

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        // Debounce could be good, but for now direct check is responsive
        performOverflowCheck();
    };

    // Manual DOM Sync to prevent cursor jumps
    useEffect(() => {
        if (contentRef.current && data.initialHtml && contentRef.current.innerHTML !== data.initialHtml) {
            contentRef.current.innerHTML = data.initialHtml;
        }
    }, [data?.initialHtml]);

    return (
        <div className="w-[210mm] h-[297mm] bg-white relative shadow-sm overflow-hidden flex flex-col justify-between">
            {/* ... Header ... */}
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
            <div className="flex-1 px-12 py-32 relative group/page overflow-hidden">
                
                {/* Formatting Toolbar (Visible on Hover/Focus) */}
                <div className="absolute top-24 left-12 right-12 flex items-center justify-between border-b border-zinc-200 pb-2 mb-4 opacity-0 group-hover/page:opacity-100 transition-opacity z-50">
                    <select 
                        className="bg-zinc-50 border border-zinc-200 text-xs rounded px-2 py-1 outline-none focus:border-orange-500 text-zinc-600"
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
                    <span className="text-[10px] text-zinc-400 uppercase font-medium">Editable Content</span>
                </div>

                <div 
                    ref={contentRef}
                    contentEditable
                    className="w-full h-full outline-none text-zinc-800 leading-relaxed space-y-4 hover:bg-zinc-50 focus:bg-orange-50/10 p-4 rounded overflow-hidden"
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onBlur={handleInput}
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
