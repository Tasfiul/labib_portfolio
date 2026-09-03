"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Project } from "@/types";
import ProjectBlocksRenderer from "@/components/ProjectBlocksRenderer";
import ImageModal from "@/components/ImageModal";
import PageTransition from "@/components/PageTransition";
import {
  ArrowLeft,
  Calendar,
  Tag,
  ExternalLink,
  Share2,
  Maximize2,
} from "lucide-react";
import SocialIcon from "@/components/SocialIcon";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        const paramId = params.id as string;
        const found = data.find(
          (p) => p.slug === paramId || p.id === paramId
        );
        setProject(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load project", err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#086972] dark:border-[#68b6c4] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#768d97] font-mono">Loading case study...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#1c2830] dark:text-white">Project Not Found</h1>
        <p className="text-sm text-[#768d97]">The project you requested does not exist or has been moved.</p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#086972] dark:bg-[#68b6c4] text-white dark:text-[#121a20] font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4a606a] dark:text-[#9bb0bb] hover:text-[#086972] dark:hover:text-[#68b6c4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all projects</span>
          </Link>
        </div>

        {/* Header Title & Subtitle */}
        <header className="space-y-5 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-mono font-bold uppercase tracking-wider text-[#086972] dark:text-[#68b6c4]">
              {project.category}
            </span>
            <span className="text-[#cbd7dc] dark:text-[#2f4450]">•</span>
            <span className="text-sm text-[#768d97] dark:text-[#9bb0bb] font-mono">
              {project.createdAt?.split("T")[0]}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1c2830] dark:text-white leading-tight">
            {project.title}
          </h1>

          {project.subtitle && (
            <p className="text-xl sm:text-2xl text-[#4a606a] dark:text-[#d0dee4] font-medium leading-relaxed">
              {project.subtitle}
            </p>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold bg-[#086972] hover:bg-[#06535a] dark:bg-[#68b6c4] dark:hover:bg-[#85c8d4] text-white dark:text-[#121a20] shadow-md shadow-[#086972]/15 dark:shadow-[#68b6c4]/15"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Project / Paper</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-semibold bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] text-[#1c2830] dark:text-[#f0f4f5] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36]"
              >
                <SocialIcon platform="github" className="w-4 h-4" />
                <span>Source Code</span>
              </a>
            )}
          </div>
        </header>

        {/* Hero Thumbnail with Full-size Click Trigger */}
        {project.thumbnail && (
          <div className="mb-14">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden border border-[#d6e2e6] dark:border-[#243640] bg-slate-900 shadow-xl cursor-pointer group"
              onClick={() => setThumbnailModalOpen(true)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs sm:text-sm font-semibold backdrop-blur-[2px]">
                <span className="bg-[#121a20]/90 px-4 py-2 rounded-full border border-[#243640] flex items-center gap-2 shadow-lg">
                  <Maximize2 className="w-4 h-4 text-[#68b6c4]" />
                  View Full Resolution in Window
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Block-Based Content Area */}
        <section className="mt-8 space-y-8">
          <ProjectBlocksRenderer blocks={project.blocks} />
        </section>

        {/* Tags footer */}
        {project.tags && project.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#d6e2e6] dark:border-[#243640] space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#768d97] dark:text-[#9bb0bb]">
              Project Technologies & Tags
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-mono text-[#768d97] dark:text-[#9bb0bb]">
              {project.tags.map((t, idx) => (
                <span key={idx}>
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Thumbnail Modal with Open In Separate Window */}
        {project.thumbnail && (
          <ImageModal
            isOpen={thumbnailModalOpen}
            src={project.thumbnail}
            alt={project.title}
            caption={project.title}
            onClose={() => setThumbnailModalOpen(false)}
          />
        )}
      </article>
    </PageTransition>
  );
}
