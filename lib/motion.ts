/** Shared motion system — one easing language across the whole site. */

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_MECH = [0.65, 0, 0.35, 1] as const;

export const DUR = {
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE, delay: i * 0.09 },
  }),
};

export const clipUp = {
  hidden: { y: "110%" },
  show: (i: number = 0) => ({
    y: "0%",
    transition: { duration: 0.9, ease: EASE, delay: 0.1 + i * 0.11 },
  }),
};

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
