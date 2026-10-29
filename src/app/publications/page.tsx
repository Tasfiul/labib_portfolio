"use client";

import React, { useEffect, useState, useRef } from "react";
import { Publication } from "@/types";
import InteractiveText from "@/components/InteractiveText";
import ImageModal from "@/components/ImageModal";
import PageTransition from "@/components/PageTransition";
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [customTotalCitations, setCustomTotalCitations] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    caption?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/publications")
      .then((res) => res.json())
      .then((data) => {
        const pubList = Array.isArray(data) ? data : (data.publications || []);
        setPublications(pubList);
        if (data.totalCitations) {
          setCustomTotalCitations(data.totalCitations);
        }
        if (pubList.length > 0) {
          setExpandedId(pubList[0].id); // Expand first by default
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load publications", err);
        setLoading(false);
      });
  }, []);

  const calculatedCitations = publications.reduce(
    (acc, pub) => acc + (pub.citationCount || 0),
    0
  );
  const displayTotalCitations =
    customTotalCitations || (calculatedCitations > 0 ? `${calculatedCitations}+` : "300+");

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const scrollSlider = (containerId: string, direction: "left" | "right") => {
    const el = document.getElementById(containerId);
    if (el) {
      const scrollAmount = direction === "left" ? -350 : 350;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#086972] dark:border-[#68b6c4] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#768d97] font-mono">Loading publications...</span>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Header with Total Citations */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#d6e2e6] dark:border-[#243640] pb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#086972] dark:text-[#68b6c4]">
              Peer-Reviewed Scholarly Articles
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1c2830] dark:text-white mt-1">
              Publications
            </h1>
          </div>

          {/* Current Citation Badge */}
          <div className="px-6 py-3.5 rounded-2xl bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] shadow-sm self-start md:self-auto">
            <p className="text-xs text-[#768d97] dark:text-[#9bb0bb] font-bold uppercase tracking-wider">
              Total Citations
            </p>
            <p className="text-3xl font-black text-[#086972] dark:text-[#68b6c4] font-mono">
              {displayTotalCitations}
            </p>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-6">
          {publications.map((pub) => {
            const isExpanded = expandedId === pub.id;
            const sliderId = `pub-figures-${pub.id}`;

            return (
              <div
                key={pub.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? "bg-white dark:bg-[#18242b] border-[#086972]/60 dark:border-[#68b6c4]/60 shadow-lg shadow-black/5"
                    : "bg-white dark:bg-[#18242b]/60 border-[#d6e2e6] dark:border-[#243640] hover:border-[#086972]/40 dark:hover:border-[#68b6c4]/40 shadow-sm"
                }`}
              >
                {/* Header Clickable Row */}
                <div
                  onClick={() => toggleExpand(pub.id)}
                  className="p-6 sm:p-8 cursor-pointer select-none flex items-start justify-between gap-6 group"
                >
                  <div className="space-y-3 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#1c2830] dark:text-white group-hover:text-[#086972] dark:group-hover:text-[#68b6c4] transition-colors leading-snug">
                      {pub.title}
                    </h2>

                    <p className="text-sm sm:text-base text-[#086972] dark:text-[#68b6c4] font-semibold">
                      Published In: <span>{pub.publishedIn}</span>
                    </p>

                    <p className="text-sm sm:text-base text-[#4a606a] dark:text-[#9bb0bb]">
                      Authors: {pub.authors}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-1 flex-none">
                    {pub.url && (
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 text-[#768d97] hover:text-[#086972] dark:hover:text-[#68b6c4] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36] rounded-xl transition-colors"
                        title="Open paper link"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    <button
                      className={`p-2.5 rounded-xl bg-[#edf1f2] dark:bg-[#1e2d36] text-[#1c2830] dark:text-[#f0f4f5] group-hover:bg-[#086972] group-hover:text-white dark:group-hover:bg-[#68b6c4] dark:group-hover:text-[#121a20] transition-all cursor-pointer ${
                        isExpanded ? "rotate-180 bg-[#086972] text-white dark:bg-[#68b6c4] dark:text-[#121a20]" : ""
                      }`}
                      aria-label="Expand details"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Collapsible Detailed View */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-[#edf1f2] dark:border-[#243640] px-6 sm:px-8 pb-8 pt-6 space-y-6"
                    >
                      {/* DOI & Paper Links */}
                      {pub.doi && (
                        <div className="text-sm font-mono text-[#768d97] dark:text-[#9bb0bb] flex items-center gap-2">
                          <span className="font-semibold text-[#1c2830] dark:text-white">DOI:</span>
                          <a
                            href={pub.url || `https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#086972] dark:text-[#68b6c4] hover:underline"
                          >
                            {pub.doi}
                          </a>
                        </div>
                      )}

                      {/* Abstract */}
                      {pub.abstract && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#768d97] dark:text-[#9bb0bb]">
                            Abstract
                          </h3>
                          <div className="text-base sm:text-lg text-[#334155] dark:text-[#d0dee4] leading-relaxed text-justify bg-[#edf1f2]/40 dark:bg-[#121a20]/60 p-5 sm:p-6 rounded-xl border border-[#d6e2e6] dark:border-[#243640]">
                            <InteractiveText
                              text={pub.abstract}
                              highlights={pub.highlights}
                            />
                          </div>
                        </div>
                      )}

                      {/* Figures Slide Bar */}
                      {pub.figures && pub.figures.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              Figures & Experimental Waveforms ({pub.figures.length})
                            </h3>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => scrollSlider(sliderId, "left")}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                aria-label="Scroll left"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => scrollSlider(sliderId, "right")}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                                aria-label="Scroll right"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Horizontal Slide Container */}
                          <div
                            id={sliderId}
                            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin"
                          >
                            {pub.figures.map((fig, fIdx) => (
                              <div
                                key={fIdx}
                                className="flex-none w-72 sm:w-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm group/fig cursor-pointer flex flex-col justify-between"
                                onClick={() =>
                                  setSelectedImage({
                                    src: fig.url,
                                    caption: fig.caption || `${pub.title} - Fig ${fIdx + 1}`,
                                  })
                                }
                              >
                                <div className="relative aspect-video overflow-hidden bg-slate-900 flex items-center justify-center">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={fig.url}
                                    alt={fig.caption || `Figure ${fIdx + 1}`}
                                    className="w-full h-full object-contain transition-transform duration-300 group-hover/fig:scale-105"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/fig:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-[2px]">
                                    <span className="bg-[#121a20]/90 px-3 py-1.5 rounded-full border border-[#243640] flex items-center gap-1.5">
                                      <Maximize2 className="w-3.5 h-3.5 text-[#68b6c4]" />
                                      Full Size
                                    </span>
                                  </div>
                                </div>
                                {fig.caption && (
                                  <p className="p-3 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 line-clamp-2">
                                    {fig.caption}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Figure Modal with Open In Separate Window Support */}
        {selectedImage && (
          <ImageModal
            isOpen={true}
            src={selectedImage.src}
            caption={selectedImage.caption}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </div>
    </PageTransition>
  );
}
