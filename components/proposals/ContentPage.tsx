"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mail, Globe, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ... imports

export function ContentPage({ data, onSplit, autoFocus, onFocusConsumed, onUpdate }: { 
    data: any, 
    onSplit?: (overflow: string, remaining: string) => void,
    autoFocus?: boolean,
    onFocusConsumed?: () => void,
    onUpdate?: (html: string) => void
}) {
    const contentRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (autoFocus && contentRef.current) {
            // Focus and move caret to start (since it's overflow from previous page)
            // Or start? User was typing at bottom of prev page, text moved to top of this page.
            // Caret should be at... keeping it logical: Start of the moved content.
            contentRef.current.focus();
            
            // Move cursor to end of text? Or start? 
            // If they were typing in the middle of a sentence that split, they want to be at the split point (start of new page).
            // Default focus usually goes to start? contentEditable behavior varies.
            // Let's force start.
             const range = document.createRange();
             const sel = window.getSelection();
             if (sel) {
                 // Attempt to find the first text node?
                 // contentRef.current.firstChild could be <p>...</p>
                 // Let's just focus for now, browser default is reasonable (usually start).
                 // Actually, placing at start is safer for "continue typing".
                 range.setStart(contentRef.current, 0);
                 range.collapse(true);
                 sel.removeAllRanges();
                 sel.addRange(range);
             }

            onFocusConsumed?.();
        }
    }, [autoFocus]);

    // Sync content from parent state if it changes (e.g. pushed content from previous page)
    useEffect(() => {
        if (contentRef.current && data?.initialHtml && contentRef.current.innerHTML !== data.initialHtml) {
             contentRef.current.innerHTML = data.initialHtml;
        }
    }, [data?.initialHtml]);

    // Check for overflow logic
// ... rest of file
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
             
              
             const originalHtml = target.innerHTML;
             // Iterate backwards
             for (let i = nodes.length - 1; i >= 0; i--) {
                 const node = nodes[i];
                 
                 // ... (existing list logic logic doesn't need change here, just the loop structure around it)
                 // Wait, I can't easily replace just the loop wrapper without content.
                 // I will use `replace_file_content` carefully.
                 // Actually, I'll just check at the end.
                 
                 // ... list handling ...
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
                         
                         if (target.scrollHeight <= target.clientHeight + 5) {
                             listFits = true;
                             break;
                         }
                     }

                     if (listFits) {
                         // Loop ends, we found a split point INSIDE the list.
                         // Add the removed LIs (wrapped in the same list tag) to removedHtml
                         // We basically clone the wrapper structure
                         const cloneWrapper = list.cloneNode(false) as HTMLElement; // shallow clone (just tag + attrs)
                         if (listRemovedHtml) {
                              const tagName = list.tagName.toLowerCase();
                              removedHtml = `<${tagName} class="${list.className}" style="${list.style.cssText}">${listRemovedHtml}</${tagName}>` + removedHtml;
                         }
                         break; // We solved the overflow!
                     } else {
                         // Even extracting all items didn't maximize space efficiently? 
                         // Or we removed all items and the empty UL still exists.
                         // Remove the empty UL and continue to previous sibling
                         if (list.parentNode) target.removeChild(list); 
                     }
                 } else {
                    if (node.parentNode) target.removeChild(node);
                 }
                 
                 // Append to removedHtml (preserving order)
                 if (node.nodeType === Node.ELEMENT_NODE) {
                    removedHtml = (node as Element).outerHTML + removedHtml;
                 } else if (node.nodeType === Node.TEXT_NODE) {
                    removedHtml = (node.textContent || "") + removedHtml;
                 }
                 
                 // Check if it fits now
                 if (target.scrollHeight <= target.clientHeight + 5) {
                     break;
                 }
             }
             
             if (removedHtml) {
                 // Prevent infinite loop: If the page is now empty (meaning the item we removed was the ONLY thing, or we had to remove everything to fit nothing),
                 // then the content is simply too big for the page.
                 if (!target.innerText.trim() && !target.querySelector('img')) {
                     console.warn("Content too large for page, cancelling split to prevent loop.");
                     target.innerHTML = originalHtml; // Restore
                     return;
                 }

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
        performOverflowCheck();
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        performOverflowCheck();
        onUpdate?.(e.currentTarget.innerHTML);
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') performOverflowCheck();
    };

    return (
        <div className="w-[210mm] h-[297mm] bg-white relative shadow-sm overflow-hidden flex flex-col justify-between">
            
            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-20 bg-white">
                 <div className="flex h-10 w-full">
                      <div className="bg-[#FF4B1F] text-white px-12 flex items-center font-bold tracking-wider text-sm w-fit pr-16" style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)" }}>
                          DIGITAL MARKETING AGENCY
                      </div>
                      <div className="bg-zinc-900 w-16 h-full -ml-8" style={{ clipPath: "polygon(40% 0, 100% 0, 60% 100%, 0% 100%)" }}></div>
                 </div>

                 <div className="px-12 py-4 flex items-center justify-between">
                     <div className="relative w-48 h-12">
                         <Image src="/logo-js.png" alt="Just Search" fill className="object-contain object-left" />
                     </div>
                     <div className="flex flex-col gap-2 text-xs text-zinc-600 items-end">
                         <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded-full bg-[#FF4B1F] text-white flex items-center justify-center"><Mail className="w-3 h-3" /></div>
                             <span>info@justsearch.ae</span>
                         </div>
                         <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded-full bg-[#FF4B1F] text-white flex items-center justify-center"><Globe className="w-3 h-3" /></div>
                             <span>www.justsearch.ae</span>
                         </div>
                     </div>
                 </div>
            </div>

            <div className="flex-1 px-12 pt-[45mm] pb-16 relative group/page overflow-hidden">
                <div 
                    ref={contentRef}
                    contentEditable
                    className="w-full h-full outline-none text-zinc-800 leading-relaxed space-y-4 hover:bg-zinc-50 focus:bg-orange-50/10 p-4 rounded overflow-hidden [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2"
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onBlur={handleBlur}
                    onKeyUp={handleKeyUp} 
                    // Initial render only
                    dangerouslySetInnerHTML={!contentRef.current ? { __html: data?.initialHtml || `
                        <p class="text-base text-zinc-800"><br/></p>
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
