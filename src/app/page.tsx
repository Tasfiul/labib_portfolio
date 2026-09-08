"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ProfileData } from "@/types";
import InteractiveText from "@/components/InteractiveText";
import ImageModal from "@/components/ImageModal";
import PageTransition from "@/components/PageTransition";
import {
  ArrowRight,
  FileText,
  Sparkles,
  ExternalLink,
  GraduationCap,
  Award,
  Layers,
  BookOpen,
  Download,
} from "lucide-react";

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#086972] dark:border-[#68b6c4] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#768d97] font-mono">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <PageTransition>
      <div className="relative overflow-hidden">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-10 left-1/4 -z-10 w-96 h-96 bg-[#086972]/10 dark:bg-[#68b6c4]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 -z-10 w-96 h-96 bg-[#68b6c4]/10 dark:bg-[#086972]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text & Intro */}
            <div className="lg:col-span-7 space-y-6">
              {/* Natural Editorial Titles (No AI-like background capsule boxes) */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm sm:text-base font-semibold text-[#086972] dark:text-[#68b6c4]">
                {profile.titles.map((title, idx) => (
                  <React.Fragment key={idx}>
                    <span>{title}</span>
                    {idx < profile.titles.length - 1 && (
                      <span className="text-[#cbd7dc] dark:text-[#2f4450] select-none font-normal">/</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#768d97] dark:text-[#9bb0bb]">
                  Welcome to my research portfolio
                </p>
                <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#1c2830] dark:text-white leading-[1.12]">
                  Hello, I&apos;m{" "}
                  <span className="text-[#086972] dark:text-[#68b6c4]">
                    {profile.name}
                  </span>
                </h1>
              </div>

              {/* Bio with Natural Inline Editorial Copy */}
              <div className="text-lg sm:text-xl text-[#1c2830] dark:text-[#edf1f2] leading-relaxed font-normal text-justify">
                <InteractiveText
                  text={profile.bio}
                  highlights={profile.highlights}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href={profile.resumeDownloadUrl || "/Farhan_Labib_CV.pdf"}
                  download="Farhan_Labib_CV.pdf"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold bg-[#086972] hover:bg-[#06535a] dark:bg-[#68b6c4] dark:hover:bg-[#85c8d4] text-white dark:text-[#121a20] shadow-md shadow-[#086972]/15 dark:shadow-[#68b6c4]/15 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>CV</span>
                  <Download className="w-4 h-4" />
                </a>

                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] text-[#1c2830] dark:text-[#f0f4f5] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36] transition-all duration-200"
                >
                  <span>Projects</span>
                </Link>

                <Link
                  href="/publications"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] text-[#1c2830] dark:text-[#f0f4f5] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36] transition-all duration-200"
                >
                  <span>Publications</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Portrait with Animated Orbit Ring */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96">
                {/* Ambient glow */}
                <div className="absolute inset-8 rounded-full bg-[#086972]/25 dark:bg-[#68b6c4]/30 blur-3xl pointer-events-none animate-pulse-glow" />

                {/* Static outer track */}
                <div className="absolute inset-0 rounded-full border-[1.5px] border-[#086972]/45 dark:border-[#68b6c4]/50 pointer-events-none" />

                {/* Sweeping accent arc */}
                <div className="absolute inset-0 rounded-full portrait-orbit-arc animate-orbit pointer-events-none" />

                {/* Counter-rotating inner tick ring */}
                <svg
                  className="absolute inset-[10px] text-[#086972] dark:text-[#68b6c4] animate-orbit-reverse pointer-events-none"
                  viewBox="0 0 200 200"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="97"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeDasharray="3.5 11"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                </svg>

                {/* Orbiting nodes */}
                <div className="absolute inset-0 animate-orbit pointer-events-none">
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#086972] dark:bg-[#68b6c4] shadow-[0_0_14px_2px_rgba(8,105,114,0.65)] dark:shadow-[0_0_16px_2px_rgba(104,182,196,0.75)]" />
                  <span className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#086972]/80 dark:bg-[#68b6c4] shadow-[0_0_10px_1px_rgba(8,105,114,0.45)] dark:shadow-[0_0_10px_1px_rgba(104,182,196,0.55)]" />
                </div>

                {/* Avatar Portrait Card */}
                <div
                  className="relative w-64 h-64 sm:w-76 sm:h-76 rounded-full overflow-hidden border-2 border-[#086972]/70 dark:border-[#68b6c4]/75 shadow-2xl shadow-[#086972]/15 dark:shadow-black/30 cursor-pointer group bg-[#18242b]"
                  onClick={() => setAvatarModalOpen(true)}
                  title="Click to view full-size portrait"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover prompt overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-[2px]">
                    <span className="bg-[#121a20]/90 px-3.5 py-2 rounded-full border border-[#243640] flex items-center gap-1.5 shadow-lg">
                      <ExternalLink className="w-3.5 h-3.5 text-[#68b6c4]" />
                      View Full Size
                    </span>
                  </div>
                </div>
              </div>

              {/* Citation info below avatar */}
              {profile.currentCitations !== undefined && (
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-mono text-[#4a606a] dark:text-[#9bb0bb]">
                  <span>
                    Google Scholar Citations:{" "}
                    <strong className="text-[#086972] dark:text-[#68b6c4] font-bold">
                      {profile.currentCitations}+
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Grid */}
          {profile.stats && profile.stats.length > 0 && (
            <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {profile.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center"
                >
                  <p className="text-4xl sm:text-5xl font-extrabold text-[#086972] dark:text-[#68b6c4]">
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold text-[#768d97] dark:text-[#9bb0bb] mt-1.5 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full-size Avatar Modal */}
        <ImageModal
          isOpen={avatarModalOpen}
          src={profile.avatarUrl}
          alt={`${profile.name} Portrait`}
          caption={`${profile.name} - ${profile.tagline}`}
          onClose={() => setAvatarModalOpen(false)}
        />
      </div>
    </PageTransition>
  );
}
