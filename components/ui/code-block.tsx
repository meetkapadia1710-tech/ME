"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Code2 } from "lucide-react";

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  writing = true,
  className,
}: {
  code: string;
  language?: string;
  filename?: string;
  writing?: boolean;
  className?: string;
}) {
  const [displayedCode, setDisplayedCode] = useState("");
  const [isComplete, setIsComplete] = useState(!writing);

  useEffect(() => {
    if (!writing) {
      setDisplayedCode(code);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i <= code.length) {
        setDisplayedCode(code.slice(0, i));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [code, writing]);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-fg-primary/20 bg-black", className)}>
      <div className="flex items-center justify-between border-b border-fg-primary/20 bg-fg-primary/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-emerald-500" />
          <span className="font-mono text-xs text-muted-foreground">
            {filename || language}
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-emerald-400">
          <code>
            {displayedCode}
            {!isComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block h-4 w-2 bg-emerald-400 align-middle ml-1"
              />
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}
