import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JS Content Calendar",
  description: "Weekly Content Calendar with A4 PDF export",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-50">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
