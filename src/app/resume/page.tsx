"use client";

import React, { useEffect, useState } from "react";
import { ResumeCategory, ResumeItem } from "@/types";
import InteractiveText from "@/components/InteractiveText";
import PageTransition from "@/components/PageTransition";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumePage() {
  const [categories, setCategories] = useState<ResumeCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resume")
      .then((res) => res.json())
      .then((data: ResumeCategory[]) => {
        setCategories(data);
        if (data.length > 0) {
          setActiveCategoryId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load resume", err);
        setLoading(false);
      });
  }, []);

  const activeCategory = categories.find((c) => c.id === activeCategoryId) || categories[0];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#086972] dark:border-[#68b6c4] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#768d97] font-mono">Loading resume...</span>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-[#086972] dark:text-[#68b6c4]">
            Curriculum Vitae
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1c2830] dark:text-white mt-1">
            Resume & Track Record
          </h1>
        </div>

        {/* Two-column Layout: Sidebar tabs + Scrollable Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Category Selector Tabs */}
          <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-24">
            <div className="p-2 rounded-2xl bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] shadow-sm space-y-1">
              {categories.map((cat) => {
                const isActive = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#086972] dark:bg-[#68b6c4] text-white dark:text-[#121a20] shadow-md shadow-[#086972]/15 dark:shadow-[#68b6c4]/15 font-bold"
                        : "text-[#1c2830] dark:text-[#f0f4f5] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36]"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? "bg-black/15 text-white dark:text-[#121a20]"
                          : "text-[#768d97] dark:text-[#9bb0bb] bg-[#edf1f2] dark:bg-[#121a20]"
                      }`}
                    >
                      {cat.items?.length || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Content Area for Selected Category with Dedicated Scrollable Window */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeCategory && (
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Category Banner Card */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] shadow-sm">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#1c2830] dark:text-white">
                        {activeCategory.name}
                      </h2>
                      {activeCategory.subtitle && (
                        <p className="text-base font-semibold text-[#086972] dark:text-[#68b6c4] mt-0.5">
                          {activeCategory.subtitle}
                        </p>
                      )}
                    </div>

                    {activeCategory.summary && (
                      <p className="mt-4 text-base sm:text-lg text-[#4a606a] dark:text-[#9bb0bb] leading-relaxed text-justify pt-4 border-t border-[#edf1f2] dark:border-[#243640]">
                        {activeCategory.summary}
                      </p>
                    )}
                  </div>

                  {/* Scrollable Window for Items */}
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 sm:pr-3 custom-scroll">
                    {activeCategory.items && activeCategory.items.length > 0 ? (
                      activeCategory.items.map((item: ResumeItem) => (
                        <div
                          key={item.id}
                          className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#18242b]/70 border border-[#d6e2e6] dark:border-[#243640] hover:border-[#086972]/40 dark:hover:border-[#68b6c4]/40 shadow-sm transition-all duration-200 space-y-3.5 group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="space-y-1">
                              <h3 className="text-xl sm:text-2xl font-bold text-[#1c2830] dark:text-white group-hover:text-[#086972] dark:group-hover:text-[#68b6c4] transition-colors leading-snug">
                                {item.link ? (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 hover:underline"
                                  >
                                    <span>{item.title}</span>
                                    <ExternalLink className="w-4 h-4 opacity-60" />
                                  </a>
                                ) : (
                                  item.title
                                )}
                              </h3>
                              <p className="text-base sm:text-lg font-semibold text-[#086972] dark:text-[#68b6c4]">
                                {item.organization}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#768d97] dark:text-[#9bb0bb] font-mono">
                              <span>
                                {item.period}
                              </span>
                              {item.location && (
                                <>
                                  <span className="text-[#cbd7dc] dark:text-[#2f4450]">•</span>
                                  <span>
                                    {item.location}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Item Description with Natural Inline Copy */}
                          {item.description && (
                            <div className="text-base sm:text-lg text-[#334155] dark:text-[#d0dee4] leading-relaxed text-justify">
                              <InteractiveText
                                text={item.description}
                                highlights={item.highlights}
                              />
                            </div>
                          )}

                          {/* Item Tags - Clean Hardcoded Typography */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-sm font-mono text-[#768d97] dark:text-[#9bb0bb]">
                              {item.tags.map((tag, idx) => (
                                <span key={idx}>
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#18242b]/40 border border-dashed border-[#d6e2e6] dark:border-[#243640] text-[#768d97] text-sm">
                        No entries currently in this category. Add entries in the admin panel.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
