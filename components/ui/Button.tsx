"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  href?: string;
  asChild?: boolean;
}

const buttonVariants = {
  primary: "bg-fg-primary text-background hover:bg-fg-primary/90 glow-hover",
  outline: "border border-fg-primary/20 bg-transparent text-fg-primary hover:bg-fg-primary/10 glow-hover",
  ghost: "bg-transparent text-fg-muted hover:text-fg-primary hover:bg-surface",
  link: "bg-transparent text-fg-primary underline-offset-4 hover:underline",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-meta",
  md: "px-4 py-2 text-body-sm",
  lg: "px-6 py-3 text-body",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    const classNames = cn(
      "inline-flex items-center justify-center rounded-full font-mono uppercase tracking-[0.15em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg-primary/50 disabled:pointer-events-none disabled:opacity-50",
      buttonVariants[variant],
      buttonSizes[size],
      className
    );

    if (href) {
      return (
        <Link href={href} className={classNames}>
          {children as React.ReactNode}
        </Link>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classNames}
        whileHover={variant !== 'link' ? { scale: 1.02 } : undefined}
        whileTap={variant !== 'link' ? { scale: 0.98 } : undefined}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
