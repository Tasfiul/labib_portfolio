"use client";

import React, { useEffect, useState } from "react";
import { GalleryItem, GalleryCategory } from "@/types";
import ImageModal from "@/components/ImageModal";
import PageTransition from "@/components/PageTransition";
import { Image as ImageIcon, Maximize2, Calendar, Tag } from "lucide-react";

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<{
    src: string;
    caption?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load gallery", err);
        setLoading(false);
      });
  }, []);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "all") return true;
    return item.categories?.includes(selectedCategory);
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#086972] dark:border-[#68b6c4] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#768d97] font-mono">Loading gallery moments...</span>
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
            Moments, Lab Experiments & Community
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1c2830] dark:text-white mt-1">
            Visual Gallery
          </h1>
        </div>

        {/* Categories / Section Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.slug
                    ? "bg-[#086972] dark:bg-[#68b6c4] text-white dark:text-[#121a20] shadow-md shadow-[#086972]/15 dark:shadow-[#68b6c4]/15"
                    : "bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] text-[#4a606a] dark:text-[#9bb0bb] hover:text-[#086972] dark:hover:text-[#68b6c4]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#d6e2e6] dark:border-[#243640] bg-white dark:bg-[#18242b]/70 overflow-hidden shadow-sm hover:border-[#086972]/40 dark:hover:border-[#68b6c4]/40 hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() =>
                setModalImage({
                  src: item.imageUrl,
                  caption: item.caption || item.title,
                })
              }
            >
              {/* Image Box */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Gallery item"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-[2px]">
                  <span className="bg-[#121a20]/90 px-3.5 py-2 rounded-full border border-[#243640] flex items-center gap-1.5 shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-[#68b6c4]" />
                    Open in Window
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-2.5">
                {item.title && (
                  <h3 className="text-base sm:text-lg font-bold text-[#1c2830] dark:text-white group-hover:text-[#086972] dark:group-hover:text-[#68b6c4] transition-colors leading-snug">
                    {item.title}
                  </h3>
                )}
                <p className="text-sm sm:text-base text-[#334155] dark:text-[#d0dee4] leading-relaxed text-justify">
                  {item.caption}
                </p>

                {item.date && (
                  <div className="pt-2 text-xs font-mono text-[#768d97] dark:text-[#9bb0bb]">
                    <span>{item.date}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#18242b]/40 border border-[#d6e2e6] dark:border-[#243640] text-[#768d97]">
            No pictures in this category yet.
          </div>
        )}

        {/* Modal with Open In Separate Window */}
        {modalImage && (
          <ImageModal
            isOpen={true}
            src={modalImage.src}
            caption={modalImage.caption}
            onClose={() => setModalImage(null)}
          />
        )}
      </div>
    </PageTransition>
  );
}
