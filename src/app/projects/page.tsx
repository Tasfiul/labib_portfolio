"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/types";
import PageTransition from "@/components/PageTransition";
import {
  Layers,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  Search,
} from "lucide-react";
import SocialIcon from "@/components/SocialIcon";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load projects", err);
        setLoading(false);
      });
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category || "Engineering"))),
  ];

  const filteredProjects = projects.filter((proj) => {
    const matchesCategory =
      selectedCategory === "All" || proj.category === selectedCategory;
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#086972] dark:border-[#68b6c4] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#768d97] font-mono">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#086972] dark:text-[#68b6c4]">
              Hardware & Software Innovation
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1c2830] dark:text-white mt-1">
              Engineering Projects
            </h1>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#768d97] dark:text-[#9bb0bb] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6e2e6] dark:border-[#243640] bg-white dark:bg-[#18242b] text-sm text-[#1c2830] dark:text-white placeholder-[#768d97] focus:outline-none focus:border-[#086972] dark:focus:border-[#68b6c4]"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#086972] dark:bg-[#68b6c4] text-white dark:text-[#121a20] shadow-md shadow-[#086972]/15 dark:shadow-[#68b6c4]/15"
                  : "bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] text-[#4a606a] dark:text-[#9bb0bb] hover:text-[#086972] dark:hover:text-[#68b6c4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl border border-[#d6e2e6] dark:border-[#243640] bg-white dark:bg-[#18242b]/70 overflow-hidden shadow-sm hover:border-[#086972]/40 dark:hover:border-[#68b6c4]/40 hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail */}
              <Link
                href={`/projects/${project.slug || project.id}`}
                className="relative aspect-video overflow-hidden bg-slate-900 block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.thumbnail || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {project.featured && (
                  <span className="absolute top-3 right-3 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#086972] dark:bg-[#68b6c4] text-white dark:text-[#121a20] shadow-md">
                    Featured
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-[2px]">
                  <span className="bg-[#121a20]/90 px-3.5 py-2 rounded-full border border-[#243640] flex items-center gap-1.5 shadow-lg">
                    <span>Explore Case Study</span>
                    <ArrowUpRight className="w-4 h-4 text-[#68b6c4]" />
                  </span>
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#086972] dark:text-[#68b6c4] uppercase tracking-wider">
                      {project.category}
                    </span>
                    <span className="text-xs text-[#768d97] dark:text-[#9bb0bb] font-mono">
                      {project.createdAt?.split("T")[0]}
                    </span>
                  </div>

                  <Link href={`/projects/${project.slug || project.id}`}>
                    <h2 className="text-xl font-bold text-[#1c2830] dark:text-white group-hover:text-[#086972] dark:group-hover:text-[#68b6c4] transition-colors line-clamp-2 leading-snug">
                      {project.title}
                    </h2>
                  </Link>

                  <p className="text-sm sm:text-base text-[#334155] dark:text-[#d0dee4] line-clamp-3 leading-relaxed text-justify">
                    {project.summary || project.subtitle}
                  </p>
                </div>

                {/* Tags & Action Links */}
                <div className="space-y-3 pt-3 border-t border-[#edf1f2] dark:border-[#243640]">
                  {project.tags && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-mono text-[#768d97] dark:text-[#9bb0bb]">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx}>
                          #{tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs opacity-75">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/projects/${project.slug || project.id}`}
                      className="text-sm font-bold text-[#086972] dark:text-[#68b6c4] hover:underline inline-flex items-center gap-1 group-hover:gap-1.5 transition-all"
                    >
                      <span>Read More</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-[#768d97] hover:text-[#086972] dark:hover:text-white hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36] rounded-lg transition-colors"
                          title="GitHub Repository"
                        >
                          <SocialIcon platform="github" className="w-4 h-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-[#768d97] hover:text-[#086972] dark:hover:text-[#68b6c4] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36] rounded-lg transition-colors"
                          title="Live Demo / Publication"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#18242b]/40 border border-[#d6e2e6] dark:border-[#243640] text-[#768d97]">
            No projects matched your criteria.
          </div>
        )}
      </div>
    </PageTransition>
  );
}
