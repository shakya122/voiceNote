import type { Metadata } from "next";
import PreferencesApplier from "@/components/PreferencesApplier";
import "./globals.css";

export const metadata: Metadata = { title: "VoiceNotes", description: "Write or speak your notes. Search them. Listen to them." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to notes</a>
        <PreferencesApplier />
        {children}
      </body>
    </html>
  );
}
