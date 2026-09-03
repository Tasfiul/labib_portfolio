"use client";

import React, { useEffect, useState } from "react";
import { Award as AwardType } from "@/types";
import ProjectBlocksRenderer from "@/components/ProjectBlocksRenderer";
import ImageModal from "@/components/ImageModal";
import PageTransition from "@/components/PageTransition";
import {
  Trophy,
  Award as AwardIcon,
  Calendar,
  Building2,
  ExternalLink,
  Maximize2,
  Sparkles,
} from "lucide-react";

export default function AwardsPage() {
  const [awards, setAwards] = useState<AwardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<{
    src: string;
    caption?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/awards")
      .then((res) => res.json())
      .then((data: AwardType[]) => {
        setAwards(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load awards", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#086972] dark:border-[#68b6c4] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#768d97] font-mono">Loading awards & honors...</span>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Header */}
        <div className="mb-12 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-widest text-[#086972] dark:text-[#68b6c4]">
            Honors & Global Competitions
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1c2830] dark:text-white mt-1">
            Awards & Recognition
          </h1>
        </div>

        {/* Awards List */}
        <div className="space-y-8">
          {awards.map((award, idx) => (
            <article
              key={award.id}
              className="p-6 sm:p-10 rounded-2xl border border-[#d6e2e6] dark:border-[#243640] bg-white dark:bg-[#18242b]/70 shadow-sm hover:border-[#086972]/40 dark:hover:border-[#68b6c4]/40 transition-all duration-300 space-y-6"
            >
              {/* Award Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-mono">
                    {award.badgeText && (
                      <span className="font-bold text-[#086972] dark:text-[#68b6c4]">
                        {award.badgeText}
                      </span>
                    )}
                    {award.badgeText && (
                      <span className="text-[#cbd7dc] dark:text-[#2f4450]">•</span>
                    )}
                    <span className="text-[#768d97] dark:text-[#9bb0bb]">
                      Issued: {award.issuedDate}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#1c2830] dark:text-white leading-snug">
                    {award.title}
                  </h2>

                  <p className="text-sm sm:text-base font-semibold text-[#086972] dark:text-[#68b6c4]">
                    Issued By: <span>{award.issuedBy}</span>
                  </p>
                </div>

                {award.link && (
                  <a
                    href={award.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36] text-[#1c2830] dark:text-[#f0f4f5] transition-all"
                  >
                    <span>Verification / Event</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Description */}
              {award.description && (
                <p className="text-base sm:text-lg text-[#334155] dark:text-[#d0dee4] leading-relaxed text-justify">
                  {award.description}
                </p>
              )}

              {/* Centralized Certificate or Image Preview */}
              {(award.certificateUrl || award.thumbnail) && (
                <div className="pt-4 flex justify-center items-center w-full">
                  <div
                    className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden border border-[#d6e2e6] dark:border-[#243640] bg-slate-950 cursor-pointer group shadow-lg mx-auto"
                    onClick={() =>
                      setSelectedCertificate({
                        src: award.certificateUrl || award.thumbnail || "",
                        caption: `${award.title} - ${award.issuedBy}`,
                      })
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={award.certificateUrl || award.thumbnail}
                      alt={award.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-103"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs sm:text-sm font-semibold backdrop-blur-[2px]">
                      <span className="bg-[#121a20]/90 px-4 py-2 rounded-full border border-[#243640] flex items-center gap-2 shadow-lg">
                        <Maximize2 className="w-4 h-4 text-[#68b6c4]" />
                        View Certificate in Window
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Blocks if any */}
              {award.blocks && award.blocks.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <ProjectBlocksRenderer blocks={award.blocks} />
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Certificate Modal with Open In Separate Window */}
        {selectedCertificate && (
          <ImageModal
            isOpen={true}
            src={selectedCertificate.src}
            caption={selectedCertificate.caption}
            onClose={() => setSelectedCertificate(null)}
          />
        )}
      </div>
    </PageTransition>
  );
}
