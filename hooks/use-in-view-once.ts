"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One-shot IntersectionObserver. The animation itself is a CSS transition —
 * this only flips the class, so a section costs one observer instead of a
 * JavaScript animation loop per element.
 */
export function useInViewOnce<T extends HTMLElement>(rootMargin = "-12% 0px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, rootMargin]);

  return [ref, seen] as const;
}
