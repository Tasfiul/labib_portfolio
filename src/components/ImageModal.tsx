"use client";

import React, { useEffect, useState } from "react";
import { X, ExternalLink, ZoomIn, ZoomOut, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageModalProps {
  isOpen: boolean;
  src: string;
  alt?: string;
  caption?: string;
  onClose: () => void;
}

export default function ImageModal({
  isOpen,
  src,
  alt = "Image Preview",
  caption,
  onClose,
}: ImageModalProps) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  const handleOpenInNewTab = () => {
    window.open(src, "_blank", "noopener,noreferrer");
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.25, 0.75));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        onClick={onClose}
      >
        {/* Top Control Bar */}
        <div
          className="absolute top-4 right-4 flex items-center gap-2 z-50 bg-slate-900/80 border border-slate-700/60 rounded-full px-3 py-1.5 shadow-2xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-400 font-mono px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <button
            onClick={handleOpenInNewTab}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#68b6c4] hover:bg-[#68b6c4]/10 rounded-full transition-colors"
            title="Open in Separate Window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Full Size</span>
          </button>

          <a
            href={src}
            download
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            title="Download"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-full transition-colors ml-1"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="overflow-auto max-h-[75vh] max-w-full rounded-lg border border-slate-800/80 shadow-2xl bg-slate-950/50 flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
              className="max-h-[70vh] w-auto object-contain rounded transition-transform duration-200 cursor-zoom-in"
              onClick={handleOpenInNewTab}
              title="Click to open original in new window"
            />
          </div>

          {/* Caption */}
          {caption && (
            <div className="mt-3 text-center max-w-2xl px-4 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-xs sm:text-sm">
              {caption}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
