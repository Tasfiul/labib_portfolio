"use client";

import React, { useState } from "react";
import { ProjectBlock, HighlightToken } from "@/types";
import InteractiveText from "./InteractiveText";
import ImageModal from "./ImageModal";
import { Play, ExternalLink } from "lucide-react";

interface ProjectBlocksRendererProps {
  blocks: ProjectBlock[];
  highlights?: HighlightToken[];
}

export default function ProjectBlocksRenderer({
  blocks,
  highlights = [],
}: ProjectBlocksRendererProps) {
  const [modalImage, setModalImage] = useState<{
    src: string;
    caption?: string;
  } | null>(null);

  if (!blocks || blocks.length === 0) return null;

  const renderVideoEmbed = (url: string) => {
    // YouTube parser
    const ytMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (ytMatch && ytMatch[1]) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytMatch[1]}?rel=0`}
          title="Video player"
          className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // Google Drive parser
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${driveMatch[1]}/preview`}
          title="Google Drive Video"
          className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800"
          allow="autoplay"
          allowFullScreen
        />
      );
    }

    // Direct MP4 fallback
    return (
      <video
        src={url}
        controls
        className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800"
      >
        Your browser does not support video playback.
      </video>
    );
  };

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "title":
            return (
              <h2
                key={block.id}
                className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                  block.highlight
                    ? "text-[#086972] dark:text-[#68b6c4]"
                    : "text-[#1c2830] dark:text-white"
                }`}
              >
                {block.url ? (
                  <a
                    href={block.url}
                    target={block.url.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1.5"
                  >
                    <span>{block.content}</span>
                    <ExternalLink className="w-5 h-5 opacity-70" />
                  </a>
                ) : (
                  block.content
                )}
              </h2>
            );

          case "subtitle":
            return (
              <h3
                key={block.id}
                className={`text-xl sm:text-2xl font-semibold ${
                  block.highlight
                    ? "text-[#086972] dark:text-[#68b6c4]"
                    : "text-[#1c2830] dark:text-[#f0f4f5]"
                }`}
              >
                {block.url ? (
                  <a
                    href={block.url}
                    target={block.url.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>{block.content}</span>
                    <ExternalLink className="w-4 h-4 opacity-70" />
                  </a>
                ) : (
                  block.content
                )}
              </h3>
            );

          case "text":
            return (
              <div
                key={block.id}
                className={`text-base sm:text-lg leading-relaxed text-justify ${
                  block.highlight
                    ? "p-5 sm:p-6 rounded-xl border-l-4 border-[#086972] dark:border-[#68b6c4] bg-white dark:bg-[#18242b] border-y border-r border-[#d6e2e6] dark:border-[#243640] text-[#1c2830] dark:text-[#f0f4f5]"
                    : "text-[#334155] dark:text-[#d0dee4]"
                }`}
              >
                <InteractiveText text={block.content} highlights={highlights} />
              </div>
            );

          case "image":
            return (
              <figure key={block.id} className="my-8">
                <div
                  className="relative group rounded-2xl overflow-hidden border border-[#d6e2e6] dark:border-[#243640] bg-[#f4f6f5] dark:bg-[#18242b] cursor-pointer shadow-md"
                  onClick={() =>
                    setModalImage({
                      src: block.content,
                      caption: block.caption,
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.content}
                    alt={block.caption || "Project Image"}
                    className="w-full max-h-[550px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-semibold backdrop-blur-[2px]">
                    <span className="bg-[#121a20]/90 px-4 py-2 rounded-full border border-[#243640] flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-[#68b6c4]" />
                      Click to expand / open full size
                    </span>
                  </div>
                </div>
                {block.caption && (
                  <figcaption className="mt-2.5 text-center text-xs sm:text-sm text-[#768d97] dark:text-[#9bb0bb] italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "video":
            return (
              <div key={block.id} className="my-8 space-y-2">
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black/80">
                  {renderVideoEmbed(block.content)}
                </div>
                {block.caption && (
                  <p className="text-center text-xs sm:text-sm text-[#768d97] dark:text-[#9bb0bb] italic">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          case "callout":
            return (
              <div
                key={block.id}
                className="my-6 p-5 sm:p-6 rounded-xl border-l-4 border-[#086972] dark:border-[#68b6c4] bg-white dark:bg-[#18242b] border-y border-r border-[#d6e2e6] dark:border-[#243640] text-[#1c2830] dark:text-[#f0f4f5] text-base sm:text-lg leading-relaxed text-justify"
              >
                <InteractiveText text={block.content} highlights={highlights} />
              </div>
            );

          default:
            return null;
        }
      })}

      {/* High-res Image Modal */}
      {modalImage && (
        <ImageModal
          isOpen={true}
          src={modalImage.src}
          caption={modalImage.caption}
          onClose={() => setModalImage(null)}
        />
      )}
    </div>
  );
}
