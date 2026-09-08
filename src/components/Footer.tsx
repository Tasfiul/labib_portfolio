"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteConfig } from "@/types";
import SocialIcon from "./SocialIcon";

export default function Footer() {
  const pathname = usePathname();
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch(() => {});
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-[#d6e2e6] dark:border-[#243640] bg-white dark:bg-[#121a20] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-[#1c2830] dark:text-white flex items-center gap-1 group"
            >
              <span className="font-extrabold">{config?.siteName ? config.siteName.split(" ")[0] : "Farhan"}</span>
              <span className="font-semibold text-[#086972] dark:text-[#68b6c4]">
                {config?.siteName && config.siteName.includes(" ") ? config.siteName.substring(config.siteName.indexOf(" ") + 1) : "Labib"}
              </span>
            </Link>
            <p className="text-xs text-[#768d97] dark:text-[#9bb0bb] mt-1">
              Researcher || Power Electronics & Control System
            </p>
          </div>

          {/* Social Links */}
          {config?.socialLinks && config.socialLinks.length > 0 && (
            <div className="flex items-center flex-wrap justify-center gap-3">
              {config.socialLinks.map((item) => (
                <a
                  key={item.id || item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.platform}
                  className="p-2.5 rounded-full border border-[#d6e2e6] dark:border-[#243640] bg-[#f4f6f5] dark:bg-[#18242b] text-[#4a606a] dark:text-[#9bb0bb] hover:text-[#086972] dark:hover:text-[#68b6c4] hover:border-[#086972]/40 dark:hover:border-[#68b6c4]/40 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                >
                  <SocialIcon platform={item.platform} className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}

          {/* Copyright & Info */}
          <div className="text-xs text-[#768d97] dark:text-[#657e8c] text-center md:text-right flex items-center gap-1">
            <span>{config?.footerText || "© 2026 Farhan Labib. All rights reserved."}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
