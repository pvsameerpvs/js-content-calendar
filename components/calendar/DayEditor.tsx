import React, { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import type { DayData, WeekdayKey } from "./types";

interface DayEditorProps {
  isOpen: boolean;
  onClose: () => void;
  dayKey: WeekdayKey;
  dayData: DayData;
  onSave: (key: WeekdayKey, data: Partial<DayData>) => void;
}

const CONTENT_TYPES = [
  "Post",
  "Reel",
  "Story",
  "Carousels",
  "Wishes Post",
  "Wishes Reel",
  "Video",
  "Live",
  "Guide",
  "Other",
];

const PLATFORMS = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "Twitter / X",
  "YouTube",
  "TikTok",
  "Pinterest",
  "Insta / Facebook",
  "Insta / LinkedIn",
  "All Platforms",
];

export function DayEditor({ isOpen, onClose, dayKey, dayData, onSave }: DayEditorProps) {
  const [formData, setFormData] = useState<DayData>(dayData);

  useEffect(() => {
    setFormData(dayData);
  }, [dayData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof DayData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("moodImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(dayKey, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 capitalize">
              Edit {dayData.title}
            </h2>
            <p className="text-sm text-zinc-500">Update content details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Mood Image */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">Mood Board</label>
            <div className="relative group w-full h-32 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl overflow-hidden transition-colors hover:border-zinc-300">
              {formData.moodImage ? (
                <img 
                  src={formData.moodImage} 
                  alt="Mood" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs font-medium">Click to upload image</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                 <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
                {formData.moodImage && (
                    <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-zinc-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-all">
                        Change Image
                    </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Content Type</label>
              <select
                value={formData.contentType}
                onChange={(e) => handleChange("contentType", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow appearance-none"
              >
                <option value="">Select Type...</option>
                {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Platform Multi-Select */}
            <div className="relative">
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Platform (Multi-select)</label>
              <div className="group relative">
                  <div className="min-h-[40px] w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-800 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer">
                      {formData.platform ? (
                          <div className="flex flex-wrap gap-1">
                              {formData.platform.split(",").map(p => p.trim()).filter(Boolean).map((p) => (
                                  <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                      {p}
                                      <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const current = formData.platform.split(",").map(s => s.trim()).filter(Boolean);
                                            const next = current.filter(c => c !== p).join(",");
                                            handleChange("platform", next);
                                        }}
                                        className="hover:text-blue-900"
                                      >
                                          <X className="w-3 h-3" />
                                      </button>
                                  </span>
                              ))}
                          </div>
                      ) : (
                          <span className="text-zinc-400">Select platforms...</span>
                      )}
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-xl border border-zinc-100 p-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-[200px] overflow-y-auto">
                      {PLATFORMS.map((p) => {
                          const currentSelected = formData.platform ? formData.platform.split(",").map(s => s.trim()) : [];
                          const isSelected = currentSelected.includes(p);
                          
                          return (
                              <label key={p} className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-50 rounded-md cursor-pointer transition-colors">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                    checked={isSelected}
                                    onChange={(e) => {
                                        let next;
                                        if (e.target.checked) {
                                            next = [...currentSelected, p];
                                        } else {
                                            next = currentSelected.filter(item => item !== p);
                                        }
                                        handleChange("platform", next.join(","));
                                    }}
                                  />
                                  <span className="text-sm text-zinc-700 font-medium">{p}</span>
                              </label>
                          );
                      })}
                  </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Caption</label>
            <textarea
              value={formData.caption}
              onChange={(e) => handleChange("caption", e.target.value)}
              placeholder="Write your caption here..."
              rows={4}
              className="w-full p-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow resize-none leading-relaxed"
            />
          </div>

           {/* Hashtags */}
           <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Hashtags</label>
             <textarea
              value={formData.hashtag}
              onChange={(e) => handleChange("hashtag", e.target.value)}
              placeholder="#hashtags..."
              rows={2}
              className="w-full p-3 rounded-lg border border-zinc-200 bg-white text-sm text-blue-600 font-medium placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
