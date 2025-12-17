export type WeekdayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

export type DayData = {
  title: string; // column header label
  moodImage?: string; // data URL
  contentType: string;
  platform: string;
  caption: string;
  hashtag: string;
};

export type CalendarState = {
  brandLeftText: string; // "JustSearch Logo"
  brandRightText: string; // "justsearch.ae"
  clientName: string; // "Your "
  logoDataUrl?: string;

  days: Record<WeekdayKey, DayData>;

  setBrandLeftText: (v: string) => void;
  setBrandRightText: (v: string) => void;
  setClientName: (v: string) => void;
  setLogo: (dataUrl?: string) => void;

  updateDay: (key: WeekdayKey, patch: Partial<DayData>) => void;
  setDayMoodImage: (key: WeekdayKey, dataUrl?: string) => void;

  reset: () => void;
};
