"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TableSelectorProps {
    onSelect: (rows: number, cols: number) => void;
}

export function TableSelector({ onSelect }: TableSelectorProps) {
    const [hover, setHover] = useState({ rows: 0, cols: 0 });
    const maxRows = 10;
    const maxCols = 10;

    return (
        <div className="p-3 bg-white border border-zinc-200 shadow-xl rounded-lg z-[60]">
            <div className="mb-2 text-xs font-semibold text-zinc-600 text-center">
                {hover.rows > 0 ? `${hover.rows} x ${hover.cols}` : "Insert Table"}
            </div>
            <div 
                className="grid gap-[1px] bg-zinc-100 border border-zinc-200"
                style={{ 
                    gridTemplateColumns: `repeat(${maxCols}, 14px)`,
                    gridTemplateRows: `repeat(${maxRows}, 14px)`
                }}
                onMouseLeave={() => setHover({ rows: 0, cols: 0 })}
            >
                {Array.from({ length: maxRows }).map((_, r) => (
                    Array.from({ length: maxCols }).map((_, c) => {
                        const row = r + 1;
                        const col = c + 1;
                        const isActive = row <= hover.rows && col <= hover.cols;
                        
                        return (
                            <div 
                                key={`${row}-${col}`}
                                className={cn(
                                    "w-[14px] h-[14px] border border-white cursor-pointer transition-colors hover:border-orange-200",
                                    isActive ? "bg-orange-200 border-orange-300" : "bg-white hover:bg-zinc-50"
                                )}
                                onMouseEnter={() => setHover({ rows: row, cols: col })}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onSelect(row, col);
                                }}
                            />
                        );
                    })
                ))}
            </div>
        </div>
    );
}
