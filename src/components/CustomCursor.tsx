"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TapRipple {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tapRipples, setTapRipples] = useState<TapRipple[]>([]);

  const lastTouchTime = useRef(0);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trailing spring physics
  const springConfig = { damping: 24, stiffness: 260, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if element under coordinates is interactive
    const checkInteractive = (x: number, y: number) => {
      const elem = document.elementFromPoint(x, y);
      return Boolean(
        elem?.closest(
          'a, button, [role="button"], input, textarea, select, label, .cursor-pointer, [onclick], [data-hoverable="true"], [data-tap-circle="true"]'
        )
      );
    };

    // --- Desktop / Fine Pointer Mouse Handlers ---
    const handleMouseMove = (e: MouseEvent) => {
      // Ignore synthetic mousemove events triggered by mobile touches
      if (Date.now() - lastTouchTime.current < 800) return;

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const isInteractive = checkInteractive(e.clientX, e.clientY);
      setIsHovered(isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      if (Date.now() - lastTouchTime.current < 800) return;
      setIsVisible(true);
    };

    // --- Touch / Swipe Handlers for Mobile ---
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchTime.current = Date.now();
      if (!e.touches[0]) return;
      const touch = e.touches[0];

      // Snap spring position directly to the touch location so it doesn't fly in
      cursorX.jump(touch.clientX);
      cursorY.jump(touch.clientY);
      mouseX.set(touch.clientX);
      mouseY.set(touch.clientY);
      setIsVisible(true);

      const isInteractive = checkInteractive(touch.clientX, touch.clientY);
      setIsHovered(isInteractive);
    };

    const handleTouchMove = (e: TouchEvent) => {
      lastTouchTime.current = Date.now();
      if (!e.touches[0]) return;
      const touch = e.touches[0];

      mouseX.set(touch.clientX);
      mouseY.set(touch.clientY);
      if (!isVisible) setIsVisible(true);

      const isInteractive = checkInteractive(touch.clientX, touch.clientY);
      setIsHovered(isInteractive);
    };

    const handleTouchEnd = () => {
      lastTouchTime.current = Date.now();
      setIsVisible(false);
      setIsHovered(false);
    };

    // --- Tap/Click Circle Bloom Handler ---
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      const isHoverable = Boolean(
        target.closest('[data-hoverable="true"], [data-tap-circle="true"], .interactive-highlight')
      );
      const isHeaderOrMenu = Boolean(
        target.closest('header button, header a, [data-mobile-menu] a, [data-mobile-menu] button')
      );

      if (isHoverable || isHeaderOrMenu) {
        const rect = target.getBoundingClientRect();
        const x = typeof e.clientX === "number" && e.clientX !== 0 ? e.clientX : (rect.left + rect.width / 2);
        const y = typeof e.clientY === "number" && e.clientY !== 0 ? e.clientY : (rect.top + rect.height / 2);
        const id = Date.now() + Math.random();
        setTapRipples((prev) => [...prev, { id, x, y }]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);

      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [mouseX, mouseY, cursorX, cursorY, isVisible]);

  const removeRipple = (id: number) => {
    setTapRipples((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <>
      {/* Outer expanding ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-transparent"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 52 : 24,
          height: isHovered ? 52 : 24,
          opacity: isVisible ? 1 : 0,
          scale: isHovered ? 1.15 : 1,
          backgroundColor: isHovered ? "rgba(104, 182, 196, 0.18)" : "rgba(104, 182, 196, 0)",
          borderColor: isHovered ? "rgba(8, 105, 114, 0.9)" : "rgba(104, 182, 196, 0.6)",
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          mass: 0.3,
        }}
      />

      {/* Center pinpoint dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#086972] dark:bg-[#68b6c4]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 6 : 5,
          height: isHovered ? 6 : 5,
          opacity: isVisible ? 0.9 : 0,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Tap/Click Ripples that enlarge for a bit and then close */}
      {tapRipples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-[9999] rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 border border-[#086972]/85 dark:border-[#68b6c4]/80 bg-[#68b6c4]/20 dark:bg-[#68b6c4]/20 shadow-sm"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 52,
            height: 52,
          }}
          initial={{ scale: 0.35, opacity: 0.95 }}
          animate={{
            scale: [0.35, 1.25, 1.45],
            opacity: [0.95, 0.85, 0],
          }}
          transition={{
            duration: 0.45,
            times: [0, 0.6, 1],
            ease: "easeOut",
          }}
          onAnimationComplete={() => removeRipple(ripple.id)}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#086972] dark:bg-[#68b6c4]" />
        </motion.div>
      ))}
    </>
  );
}
