"use client";

import React, { useState, useRef, useEffect } from "react";
import { HighlightToken } from "@/types";
import { ExternalLink, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveTextProps {
  text: string;
  highlights?: HighlightToken[];
  className?: string;
  highlightClassName?: string;
}

export default function InteractiveText({
  text,
  highlights = [],
  className = "",
  highlightClassName = "",
}: InteractiveTextProps) {
  const [activeTokenId, setActiveTokenId] = useState<string | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveTokenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!highlights || highlights.length === 0 || !text) {
    return <span className={className}>{text}</span>;
  }

  // Create a regex to match all highlight phrases
  const phrases = highlights
    .filter((h) => h.phrase && h.phrase.trim().length > 0)
    .map((h) => h.phrase.trim());

  if (phrases.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Escape special regex characters in phrases
  const escapedPhrases = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escapedPhrases.join("|")})`, "gi");

  const parts = text.split(regex);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveTokenId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveTokenId(null);
    }, 180);
  };

  const handlePopoverMouseEnter = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveTokenId(id);
  };

  return (
    <span ref={containerRef} className={`relative leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        const matchToken = highlights.find(
          (h) => h.phrase.toLowerCase() === part.toLowerCase()
        );

        if (!matchToken) {
          return <span key={index}>{part}</span>;
        }

        const hasSubItems = matchToken.subItems && matchToken.subItems.length > 0;
        const isOpen = activeTokenId === matchToken.id;

        return (
          <span
            key={index}
            className={`relative inline-block ${isOpen ? "z-50" : "z-auto"}`}
            onMouseEnter={() => handleMouseEnter(matchToken.id)}
            onMouseLeave={handleMouseLeave}
          >
            {matchToken.url ? (
              <a
                href={matchToken.url}
                target={matchToken.url.startsWith("http") ? "_blank" : undefined}
                rel={matchToken.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`font-medium transition-colors duration-200 text-[#086972] dark:text-[#68b6c4] underline decoration-[#086972]/30 dark:decoration-[#68b6c4]/40 underline-offset-4 hover:decoration-[#086972] dark:hover:decoration-[#68b6c4] hover:text-[#06535a] dark:hover:text-[#85c8d4] cursor-pointer inline-flex items-center gap-0.5 ${highlightClassName}`}
                onClick={(e) => {
                  if (hasSubItems) {
                    e.preventDefault();
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    setActiveTokenId(isOpen ? null : matchToken.id);
                  }
                }}
              >
                <span>{part}</span>
                {matchToken.url.startsWith("http") && (
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 inline" />
                )}
              </a>
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  setActiveTokenId(isOpen ? null : matchToken.id);
                }}
                className={`font-medium transition-colors duration-200 text-[#086972] dark:text-[#68b6c4] underline decoration-[#086972]/30 dark:decoration-[#68b6c4]/40 underline-offset-4 hover:decoration-[#086972] dark:hover:decoration-[#68b6c4] hover:text-[#06535a] dark:hover:text-[#85c8d4] cursor-pointer ${highlightClassName}`}
              >
                {part}
              </span>
            )}

            {/* Hover Sub-list Popover */}
            <AnimatePresence>
              {hasSubItems && isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 3, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute z-50 left-1/2 -translate-x-1/2 top-full pt-1.5 w-64 sm:w-72"
                  onMouseEnter={() => handlePopoverMouseEnter(matchToken.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-2.5 bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] rounded-xl shadow-2xl backdrop-blur-xl">
                    <div className="px-2.5 py-1.5 border-b border-[#edf1f2] dark:border-[#243640] flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#086972] dark:text-[#68b6c4]">
                        {matchToken.phrase}
                      </span>
                      <span className="text-[11px] font-mono text-[#768d97] dark:text-[#9bb0bb]">
                        {matchToken.subItems.length} items
                      </span>
                    </div>

                    <div className="mt-1 space-y-0.5 max-h-56 overflow-y-auto custom-scroll">
                      {matchToken.subItems.map((sub) => (
                        <div key={sub.id}>
                          {sub.url ? (
                            <a
                              href={sub.url}
                              target={sub.url.startsWith("http") ? "_blank" : undefined}
                              rel={sub.url.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs sm:text-sm text-[#1c2830] dark:text-[#f0f4f5] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36] hover:text-[#086972] dark:hover:text-[#68b6c4] transition-colors group"
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold flex items-center gap-1">
                                  {sub.label}
                                  {sub.url.startsWith("http") && (
                                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                  )}
                                </span>
                                {sub.description && (
                                  <span className="text-xs text-[#768d97] dark:text-[#9bb0bb]">
                                    {sub.description}
                                  </span>
                                )}
                              </div>
                              <ChevronRight className="w-4 h-4 text-[#768d97] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-none" />
                            </a>
                          ) : (
                            <div className="px-2.5 py-2 rounded-lg text-xs sm:text-sm text-[#1c2830] dark:text-[#f0f4f5]">
                              <span className="font-semibold">{sub.label}</span>
                              {sub.description && (
                                <p className="text-xs text-[#768d97] dark:text-[#9bb0bb] mt-0.5">
                                  {sub.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}
