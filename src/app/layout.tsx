import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ClientShell from "@/components/ClientShell";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Farhan Labib | Portfolio & Research Scholar",
  description:
    "Power Electronics Researcher, Founder & CTO of Edu-Explorer, Graduate Student at RUET ETE. Specialized in Multilevel Inverters, Robotics, and Hardware Design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#f4f6f5] dark:bg-[#121a20] text-[#1c2830] dark:text-[#f0f4f5] font-sans transition-colors duration-200">
        <CustomCursor />
        <ThemeProvider>
          <ClientShell>{children}</ClientShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
