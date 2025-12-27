"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Table, GripHorizontal, LayoutTemplate } from "lucide-react";
import { TableSelector } from "./TableSelector";
import { CONTENT_PRESETS } from "./contentPresets";

export function EditorToolbar() {
    const [formats, setFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        insertUnorderedList: false,
        insertOrderedList: false
    });
    const [nextPlanChar, setNextPlanChar] = useState('A');
    const [showTableSelector, setShowTableSelector] = useState(false);

    const checkFormats = () => {
        setFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            insertOrderedList: document.queryCommandState('insertOrderedList')
        });
    };

    useEffect(() => {
        const handler = () => checkFormats();
        document.addEventListener('selectionchange', handler);
        return () => document.removeEventListener('selectionchange', handler);
    }, []);

    const toggleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        checkFormats();
        // We rely on the fact that we don't steal focus (onMouseDown preventDefault)
    };

    const insertTable = (rows: number, cols: number) => {
        let tableHtml = '<table style="width: 100%; table-layout: fixed; border-collapse: collapse; border: 1px solid #e4e4e7; margin: 1rem 0;"><tbody>';
        
        for (let r = 0; r < rows; r++) {
            tableHtml += '<tr>';
            for (let c = 0; c < cols; c++) {
                tableHtml += '<td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>';
            }
            tableHtml += '</tr>';
        }
        
        tableHtml += '</tbody></table><p><br/></p>'; 
        
        document.execCommand('insertHTML', false, tableHtml);
        // Force input event for overflow checking? 
        // execCommand usually triggers input, but let's see. 
        // We might need to manually dispatch if React doesn't catch it, 
        // but 'selectionchange' and 'input' on the contentEditable usually work.
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-white border-b border-zinc-200 sticky top-0 z-[100] shadow-sm flex-wrap">
            {/* Draggable Handle (Visual Only) */}
            <div className="mr-2 text-zinc-300">
                <GripHorizontal className="w-4 h-4" />
            </div>

            {/* Headings */}
            <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 mr-2">
                <select 
                    className="bg-zinc-50 border border-zinc-200 text-xs rounded px-2 py-1.5 outline-none focus:border-orange-500 text-zinc-600 w-24"
                    onChange={(e) => {
                        e.preventDefault();
                        toggleFormat('formatBlock', e.target.value);
                        e.target.value = ""; // Reset
                    }}
                >
                    <option value="" disabled selected>Heading</option>
                    <option value="p">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                </select>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 mr-2">
                <select 
                    className="bg-zinc-50 border border-zinc-200 text-xs rounded px-2 py-1.5 outline-none focus:border-orange-500 text-zinc-600 w-20"
                    onChange={(e) => {
                        e.preventDefault();
                        toggleFormat('fontSize', e.target.value);
                        e.target.value = ""; 
                    }}
                >
                    <option value="" disabled selected>Size</option>
                    <option value="1">Small</option>
                    <option value="3">Normal</option>
                    <option value="4">Large</option>
                    <option value="5">Huge</option>
                    <option value="7">Giant</option>
                </select>
            </div>

            {/* Basic Formatting */}
            <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 mr-2">
                <button 
                    type="button"
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
                    type="button"
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
                    type="button"
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
                    type="button"
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
                    type="button"
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

            {/* Table */}
            <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 mr-2 relative">
                <button 
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); setShowTableSelector(!showTableSelector); }}
                    className={cn(
                        "p-1.5 rounded transition-colors flex items-center gap-1",
                        showTableSelector ? "bg-zinc-800 text-white" : "hover:bg-zinc-100 text-zinc-700 hover:text-black"
                    )}
                    title="Insert Table"
                >
                    <Table className="w-3 h-3" /> Table
                </button>
                
                {showTableSelector && (
                    <div className="absolute top-full left-0 mt-2 z-[110]">
                        <TableSelector onSelect={(rows, cols) => {
                            insertTable(rows, cols);
                            setShowTableSelector(false);
                        }} />
                    </div>
                )}

            </div>

            {/* Plan Table */}
            <div className="flex items-center gap-1 border-r border-zinc-200 pr-2 mr-2">
                <button 
                    type="button"
                    onMouseDown={(e) => { 
                        e.preventDefault(); 
                        const tableHtml = `
                            <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem;">Plan ${nextPlanChar}</h3>
                            <table style="width: 100%; table-layout: fixed; border-collapse: collapse; border: 1px solid #e4e4e7; margin-bottom: 1rem;">
                                <thead>
                                    <tr style="background-color: #f3f4f6;">
                                        <th style="border: 1px solid #e4e4e7; padding: 0.5rem; text-align: left; width: 30%;">Services</th>
                                        <th style="border: 1px solid #e4e4e7; padding: 0.5rem; text-align: left; width: 50%;">Description</th>
                                        <th style="border: 1px solid #e4e4e7; padding: 0.5rem; text-align: left; width: 20%;">Cost ( AED )</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>
                                        <td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>
                                        <td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>
                                        <td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>
                                        <td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>
                                        <td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>
                                        <td style="border: 1px solid #e4e4e7; padding: 0.5rem;">&nbsp;</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p><br/></p>
                        `;
                        document.execCommand('insertHTML', false, tableHtml);
                        setNextPlanChar(String.fromCharCode(nextPlanChar.charCodeAt(0) + 1));
                    }}
                    className="p-1.5 rounded transition-colors flex items-center gap-1 hover:bg-zinc-100 text-zinc-700 hover:text-black"
                    title="Insert Plan Table"
                >
                    <LayoutTemplate className="w-3 h-3" /> Plan Table
                </button>
            </div>

            {/* Presets */}
            <select 
                className="bg-zinc-50 border border-zinc-200 text-xs rounded px-2 py-1.5 outline-none focus:border-orange-500 text-zinc-600 min-w-[120px]"
                onChange={(e) => {
                    e.preventDefault();
                    // We need to find where to insert. execCommand('insertHTML') inserts at cursor.
                    const preset = CONTENT_PRESETS[e.target.value];
                    if (preset) {
                        const newContent = `<br/><br/>${preset}`;
                        document.execCommand('insertHTML', false, newContent);
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
    );
}
