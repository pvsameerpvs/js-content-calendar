import { create } from "zustand";
import type { CalendarState, WeekdayKey } from "./types";

const defaultDays = () => ({
  monday: { title: "Monday", contentType: "", platform: "", caption: "", hashtag: "" },
  tuesday: { title: "Tuesday", contentType: "Wishes REEL", platform: "Insta / Facebook", caption: "pablo and others wishing", hashtag: "#ChristmasPlay" },
  wednesday: { title: "Wednesday", contentType: "", platform: "", caption: "", hashtag: "" },
  thursday: { title: "Thursday", contentType: "POST", platform: "Insta / Facebook", caption: "Projector Painting Play Set-New Edition", hashtag: "#kidslearning #" },
  friday: { title: "Friday", contentType: "", platform: "", caption: "", hashtag: "" },
  saturday: { title: "Saturday", contentType: "POST", platform: "Insta / Facebook", caption: "Talking and learning doll- chloe pretend play doll", hashtag: "#learningthroughplay" },
} as const);

export const useCalendarStore = create<CalendarState>((set) => ({
  brandLeftText: "/logo-js.png", // Updated to logo path
  brandRightText: "justsearch.ae",
  clientName: "CLIENT COMPANY NAME",
  logoDataUrl: undefined,

  days: defaultDays(),

  setBrandLeftText: (v) => set({ brandLeftText: v }),
  setBrandRightText: (v) => set({ brandRightText: v }),
  setClientName: (v) => set({ clientName: v }),
  setLogo: (dataUrl) => set({ logoDataUrl: dataUrl }),

  updateDay: (key, patch) =>
    set((s) => ({
      days: {
        ...s.days,
        [key]: { ...s.days[key as WeekdayKey], ...patch },
      },
    })),

  setDayMoodImage: (key, dataUrl) =>
    set((s) => ({
      days: {
        ...s.days,
        [key]: { ...s.days[key as WeekdayKey], moodImage: dataUrl },
      },
    })),

  reset: () =>
    set({
      brandLeftText: "/logo-js.png",
      brandRightText: "justsearch.ae",
      clientName: "CLIENT COMPANY NAME",
      logoDataUrl: undefined,
      days: defaultDays(),
    }),
}));
