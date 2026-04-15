import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zodiac MBTI Oracle | Cosmic Destiny Reading",
  description: "Discover the mysterious connection between your zodiac sign and MBTI personality type",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
