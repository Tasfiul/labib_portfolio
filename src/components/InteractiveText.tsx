"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { HighlightToken } from "@/types";
import { ExternalLink, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface InteractiveTextProps {
  text: string;
  highlights?: HighlightToken[];
  className?: string;
  highlightClassName?: string;
}

interface HighlightItemProps {
  part: string;
  matchToken: HighlightToken;
  highlightClassName: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCloseImmediate: () => void;
  onToggle: () => void;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function HighlightItem({
  part,
  matchToken,
  highlightClassName,
  isOpen,
  onOpen,
  onClose,
  onCloseImmediate,
  onToggle,
}: HighlightItemProps) {
  const itemRef = useRef<HTMLSpanElement>(null);

  const [popoverPos, setPopoverPos] = useState<{
    left: number;
    width: number;
    placement: "bottom" | "top";
    isReady: boolean;
  }>({
    left: 0,
    width: 280,
    placement: "bottom",
    isReady: false,
  });

  const updatePosition = useCallback(() => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    const safeMargin = 12; // safe boundary padding from screen edges
    const targetWidth = Math.min(
      viewportWidth < 640 ? 268 : 288,
      viewportWidth - safeMargin * 2
    );

    // Desired horizontal center in viewport coordinates
    const triggerCenter = rect.left + rect.width / 2;
    const idealViewportLeft = triggerCenter - targetWidth / 2;

    // Clamp inside viewport: [safeMargin, viewportWidth - safeMargin - targetWidth]
    const minLeft = safeMargin;
    const maxLeft = Math.max(minLeft, viewportWidth - safeMargin - targetWidth);
    const clampedLeft = Math.max(minLeft, Math.min(idealViewportLeft, maxLeft));

    // Convert clampedLeft (viewport) to relative offset from itemRef (which has position: relative)
    const relativeLeft = clampedLeft - rect.left;

    // Vertical placement: flip above if tight on space below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedHeight = 220;
    const placeAbove = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;

    setPopoverPos({
      left: relativeLeft,
      width: targetWidth,
      placement: placeAbove ? "top" : "bottom",
      isReady: true,
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      setPopoverPos((prev) => ({ ...prev, isReady: false }));
    }
  }, [isOpen, updatePosition]);

  const handleMouseEnter = () => {
    updatePosition();
    onOpen();
  };

  const handleMouseLeave = () => {
    onClose();
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    const hasSubItems =
      matchToken.subItems && matchToken.subItems.length > 0;
    if (hasSubItems) {
      e.preventDefault();
      e.stopPropagation();
      updatePosition();
      onToggle();
    }
  };

  const hasSubItems = matchToken.subItems && matchToken.subItems.length > 0;
  const isExternalUrl = matchToken.url?.startsWith("http");

  return (
    <span
      ref={itemRef}
      className={`relative inline-block ${isOpen ? "z-50" : "z-auto"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {matchToken.url ? (
        isExternalUrl ? (
          <a
            href={matchToken.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-medium transition-colors duration-200 text-[#086972] dark:text-[#68b6c4] underline decoration-[#086972]/30 dark:decoration-[#68b6c4]/40 underline-offset-4 hover:decoration-[#086972] dark:hover:decoration-[#68b6c4] hover:text-[#06535a] dark:hover:text-[#85c8d4] cursor-pointer inline-flex items-center gap-0.5 ${highlightClassName}`}
            onClick={handleTriggerClick}
          >
            <span>{part}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60 inline" />
          </a>
        ) : (
          <Link
            href={matchToken.url}
            className={`font-medium transition-colors duration-200 text-[#086972] dark:text-[#68b6c4] underline decoration-[#086972]/30 dark:decoration-[#68b6c4]/40 underline-offset-4 hover:decoration-[#086972] dark:hover:decoration-[#68b6c4] hover:text-[#06535a] dark:hover:text-[#85c8d4] cursor-pointer ${highlightClassName}`}
            onClick={handleTriggerClick}
          >
            <span>{part}</span>
          </Link>
        )
      ) : (
        <span
          onClick={handleTriggerClick}
          className={`font-medium transition-colors duration-200 text-[#086972] dark:text-[#68b6c4] underline decoration-[#086972]/30 dark:decoration-[#68b6c4]/40 underline-offset-4 hover:decoration-[#086972] dark:hover:decoration-[#68b6c4] hover:text-[#06535a] dark:hover:text-[#85c8d4] cursor-pointer ${highlightClassName}`}
        >
          {part}
        </span>
      )}

      {/* Hover/Tap Sub-list Popover */}
      <AnimatePresence>
        {hasSubItems && isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: popoverPos.placement === "top" ? -4 : 4,
              scale: 0.97,
            }}
            animate={{ opacity: popoverPos.isReady ? 1 : 0, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: popoverPos.placement === "top" ? -3 : 3,
              scale: 0.97,
            }}
            transition={{ duration: 0.12 }}
            style={{
              left: `${popoverPos.left}px`,
              width: `${popoverPos.width}px`,
              maxWidth: "calc(100vw - 24px)",
            }}
            className={`absolute z-50 ${
              popoverPos.placement === "top"
                ? "bottom-full pb-1.5"
                : "top-full pt-1.5"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2.5 bg-white dark:bg-[#18242b] border border-[#d6e2e6] dark:border-[#243640] rounded-xl shadow-2xl backdrop-blur-xl">
              <div className="px-2.5 py-1.5 border-b border-[#edf1f2] dark:border-[#243640] flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#086972] dark:text-[#68b6c4] truncate">
                  {matchToken.phrase}
                </span>
                <div className="flex items-center gap-1.5 flex-none">
                  <span className="text-[11px] font-mono text-[#768d97] dark:text-[#9bb0bb]">
                    {matchToken.subItems.length} items
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseImmediate();
                    }}
                    className="sm:hidden p-0.5 -mr-1 text-[#768d97] hover:text-[#1c2830] dark:hover:text-white rounded cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-1 space-y-0.5 max-h-56 overflow-y-auto custom-scroll">
                {matchToken.subItems.map((sub) => {
                  const isSubExternal = !!sub.url?.startsWith("http");
                  const itemContent = (
                    <>
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="font-semibold flex items-center gap-1 break-words">
                          <span className="break-words">{sub.label}</span>
                          {isSubExternal && (
                            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 flex-none" />
                          )}
                        </span>
                        {sub.description && (
                          <span className="text-xs text-[#768d97] dark:text-[#9bb0bb] break-words mt-0.5">
                            {sub.description}
                          </span>
                        )}
                      </div>
                      {sub.url && (
                        <ChevronRight className="w-4 h-4 text-[#768d97] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-none" />
                      )}
                    </>
                  );

                  const linkClasses =
                    "flex items-center justify-between px-2.5 py-2 rounded-lg text-xs sm:text-sm text-[#1c2830] dark:text-[#f0f4f5] hover:bg-[#edf1f2] dark:hover:bg-[#1e2d36] hover:text-[#086972] dark:hover:text-[#68b6c4] transition-colors group";

                  return (
                    <div key={sub.id}>
                      {sub.url ? (
                        isSubExternal ? (
                          <a
                            href={sub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClasses}
                            onClick={onCloseImmediate}
                          >
                            {itemContent}
                          </a>
                        ) : (
                          <Link
                            href={sub.url}
                            className={linkClasses}
                            onClick={onCloseImmediate}
                          >
                            {itemContent}
                          </Link>
                        )
                      ) : (
                        <div className="px-2.5 py-2 rounded-lg text-xs sm:text-sm text-[#1c2830] dark:text-[#f0f4f5]">
                          <span className="font-semibold break-words">
                            {sub.label}
                          </span>
                          {sub.description && (
                            <p className="text-xs text-[#768d97] dark:text-[#9bb0bb] mt-0.5 break-words">
                              {sub.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function InteractiveText({
  text,
  highlights = [],
  className = "",
  highlightClassName = "",
}: InteractiveTextProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cancelClose = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleOpen = useCallback(
    (key: string) => {
      cancelClose();
      setActiveKey(key);
    },
    [cancelClose]
  );

  const handleClose = useCallback(() => {
    cancelClose();
    timeoutRef.current = setTimeout(() => {
      setActiveKey(null);
    }, 200);
  }, [cancelClose]);

  const handleCloseImmediate = useCallback(() => {
    cancelClose();
    setActiveKey(null);
  }, [cancelClose]);

  const handleToggle = useCallback(
    (key: string) => {
      cancelClose();
      setActiveKey((prev) => (prev === key ? null : key));
    },
    [cancelClose]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        cancelClose();
        setActiveKey(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, {
      passive: true,
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [cancelClose]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
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
  const escapedPhrases = phrases.map((p) =>
    p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`(${escapedPhrases.join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <span ref={containerRef} className={`relative leading-relaxed ${className}`}>
      {parts.map((part, index) => {
        const matchToken = highlights.find(
          (h) => h.phrase.toLowerCase() === part.toLowerCase()
        );

        if (!matchToken) {
          return <span key={index}>{part}</span>;
        }

        const itemKey = `${matchToken.id}-${index}`;
        const isOpen = activeKey === itemKey;

        return (
          <HighlightItem
            key={itemKey}
            part={part}
            matchToken={matchToken}
            highlightClassName={highlightClassName}
            isOpen={isOpen}
            onOpen={() => handleOpen(itemKey)}
            onClose={handleClose}
            onCloseImmediate={handleCloseImmediate}
            onToggle={() => handleToggle(itemKey)}
          />
        );
      })}
    </span>
  );
}


