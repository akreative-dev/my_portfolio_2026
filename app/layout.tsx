import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./global.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "700"], 
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Aleksandra Kowalska | Creative Engineer",
  description: "Portfolio of Aleksandra Kowalska — Creative Engineer, Full-Stack Developer & UI Architect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth"><body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-[#fdfcf0] text-[#1a1a1b]`}>{children}</body></html>
  );
}