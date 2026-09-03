"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, GraduationCap, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Resume", href: "/resume" },
  { name: "Publications", href: "/publications" },
  { name: "Projects", href: "/projects" },
  { name: "Awards", href: "/awards" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scholarUrl, setScholarUrl] = useState("https://scholar.google.com");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch site config for Google Scholar link
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.googleScholarUrl) setScholarUrl(data.googleScholarUrl);
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If in admin page, don't show the public navbar
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-[#121a20]/90 backdrop-blur-md border-b border-[#d6e2e6]/80 dark:border-[#243640]/80 shadow-md shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-black tracking-tight text-[#1c2830] dark:text-white flex items-center gap-1.5 group"
        >
          <span className="font-extrabold">Farhan</span>
          <span className="font-semibold text-[#086972] dark:text-[#68b6c4] group-hover:opacity-90 transition-opacity">
            Labib
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-[16.5px] font-bold transition-colors duration-200 rounded-lg ${
                  isActive
                    ? "text-[#086972] dark:text-[#68b6c4]"
                    : "text-[#4a606a] dark:text-[#9bb0bb] hover:text-[#086972] dark:hover:text-[#68b6c4] hover:bg-[#edf1f2]/80 dark:hover:bg-[#1e2d36]/60"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#086972] dark:bg-[#68b6c4] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons: Google Scholar & Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          {scholarUrl && (
            <a
              href={scholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide bg-[#086972] hover:bg-[#06535a] dark:bg-[#68b6c4] dark:hover:bg-[#85c8d4] text-white dark:text-[#121a20] shadow-md shadow-[#086972]/15 dark:shadow-[#68b6c4]/15 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Google Scholar</span>
            </a>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="p-2.5 rounded-full border border-[#d6e2e6] dark:border-[#243640] bg-white/80 dark:bg-[#18242b]/80 text-[#1c2830] dark:text-[#f0f4f5] hover:text-[#086972] dark:hover:text-[#68b6c4] transition-colors shadow-sm"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-[#1c2830] dark:text-[#f0f4f5] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36]"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            className="p-2 rounded-lg text-[#1c2830] dark:text-[#f0f4f5] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#d6e2e6] dark:border-[#243640] bg-white/95 dark:bg-[#121a20]/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-1 shadow-2xl">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                  isActive
                    ? "bg-[#edf1f2] dark:bg-[#1e2d36] text-[#086972] dark:text-[#68b6c4]"
                    : "text-[#1c2830] dark:text-[#f0f4f5] hover:bg-[#edf1f2]/60 dark:hover:bg-[#1e2d36]/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          {scholarUrl && (
            <div className="pt-3">
              <a
                href={scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#086972] hover:bg-[#06535a] dark:bg-[#68b6c4] text-white dark:text-[#121a20] shadow-md"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Google Scholar</span>
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
