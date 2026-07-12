import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-mono text-xs font-semibold uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        chrome:
          "chrome-ring text-chrome hover:text-white hover:shadow-[0_0_28px_rgba(255,255,255,0.12)]",
        accent:
          "bg-accent text-void hover:shadow-[0_0_32px_var(--glow)] hover:brightness-110",
        ghost: "border border-white/10 text-silver hover:border-white/30 hover:text-white",
        red: "border border-accent-red/50 text-accent-red hover:bg-accent-red hover:text-void hover:shadow-[0_0_32px_var(--glow-red)]",
      },
      size: {
        sm: "h-9 px-5",
        md: "h-11 px-7",
        lg: "h-14 px-10 text-sm",
      },
    },
    defaultVariants: { variant: "chrome", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
