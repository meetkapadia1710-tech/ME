"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { TOOLS } from "@/lib/coreToolsData";
import { WORKS } from "@/lib/worksData";
import { prefersReducedMotion } from "@/lib/reveal";

type OutputLine = {
  id: string;
  type: "command" | "system" | "result" | "error";
  content: React.ReactNode;
};

const BOOT_SEQUENCE = [
  "Initializing retro interface...",
  "Loading core modules: OK",
  "Mounting memory banks: OK",
  "Establishing secure connection: OK",
  "Welcome to portfolio-os v2.0.",
  "Type 'help' for a list of available commands."
];

export default function RetroTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [booting, setBooting] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  
  const bufferRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Listen for "sudo" sequence globally
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // Don't intercept if an input is focused
      if (document.activeElement) {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea" || (document.activeElement as HTMLElement).isContentEditable) {
          return;
        }
      }

      if (e.key === "Escape") {
        if (isOpen) {
          setIsOpen(false);
          bufferRef.current = "";
        }
        return;
      }

      // Buffer logic for "sudo"
      if (!isOpen && e.key.length === 1) {
        bufferRef.current += e.key.toLowerCase();
        if (bufferRef.current.length > 4) {
          bufferRef.current = bufferRef.current.slice(-4);
        }
        
        if (bufferRef.current === "sudo") {
          prevFocusRef.current = document.activeElement as HTMLElement;
          setIsOpen(true);
          bufferRef.current = "";
          startBootSequence();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen]);

  // Trap focus when open
  useEffect(() => {
    if (isOpen && inputRef.current && !booting) {
      inputRef.current.focus();
    }
  }, [isOpen, booting]);

  // Focus trap
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      return;
    }
    
    // Simple focus trap (since only input and maybe some links are focusable)
    if (e.key === "Tab") {
      const focusableElements = terminalRef.current?.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  // Restore focus on close
  useEffect(() => {
    if (!isOpen && prevFocusRef.current) {
      prevFocusRef.current.focus();
      prevFocusRef.current = null;
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [output, bootLines, inputValue]);

  const startBootSequence = () => {
    const reduced = prefersReducedMotion();
    setBootLines([]);
    setOutput([]);
    
    if (reduced) {
      setBooting(false);
      setBootLines(BOOT_SEQUENCE);
      return;
    }

    setBooting(true);
    let lineIndex = 0;
    
    const interval = setInterval(() => {
      if (lineIndex < BOOT_SEQUENCE.length) {
        setBootLines(prev => [...prev, BOOT_SEQUENCE[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setBooting(false);
      }
    }, 250);
  };

  const addOutput = (type: OutputLine["type"], content: React.ReactNode) => {
    setOutput(prev => [...prev, { id: Math.random().toString(), type, content }]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const cmd = inputValue.trim();
    addOutput("command", `meet@portfolio:~$ ${cmd}`);
    
    // Add to history
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputValue("");

    const args = cmd.toLowerCase().split(" ");
    const command = args[0];

    switch (command) {
      case "whoami":
        addOutput("result", "Meet Kapadia — Full-Stack Developer / SDE. Based in Gujarat, India.");
        break;
      case "skills":
        addOutput("result", (
          <ul className="list-disc list-inside">
            {TOOLS.map((t) => (
              <li key={t.name} className="mt-1">
                <span className="font-bold">{t.name}</span> - {t.description}
              </li>
            ))}
          </ul>
        ));
        break;
      case "projects":
        addOutput("result", (
          <ul className="list-decimal list-inside space-y-1">
            {WORKS.map((w) => (
              <li key={w.slug}>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/work/${w.slug}`);
                  }}
                  className="hover:underline hover:text-emerald-300 text-left"
                >
                  {w.name} - {w.brief}
                </button>
              </li>
            ))}
          </ul>
        ));
        break;
      case "resume":
        addOutput("system", "Triggering resume download...");
        window.open("/meet_kapadia_resume.pdf", "_blank");
        break;
      case "contact":
        addOutput("result", (
          <div className="flex flex-col gap-1">
            <a href="mailto:meetkapadia1710@gmail.com" className="hover:underline hover:text-emerald-300">Email: meetkapadia1710@gmail.com</a>
            <a href="https://github.com/meetkapadia1710-tech" target="_blank" className="hover:underline hover:text-emerald-300">GitHub: meetkapadia1710-tech</a>
            <a href="https://linkedin.com/in/meet-kapadia17" target="_blank" className="hover:underline hover:text-emerald-300">LinkedIn: meet-kapadia17</a>
          </div>
        ));
        break;
      case "sudo":
        if (args.join(" ") === "sudo make me a sandwich") {
          addOutput("error", "Nice try.");
        } else {
          addOutput("error", "sudo: access denied for other commands");
        }
        break;
      case "clear":
        setOutput([]);
        setBootLines([]);
        break;
      case "help":
        addOutput("result", (
          <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1">
            <span className="text-emerald-400">whoami</span><span>Identity</span>
            <span className="text-emerald-400">skills</span><span>Core stack</span>
            <span className="text-emerald-400">projects</span><span>Selected works</span>
            <span className="text-emerald-400">resume</span><span>Download resume</span>
            <span className="text-emerald-400">contact</span><span>Contact info</span>
            <span className="text-emerald-400">clear</span><span>Clear output</span>
          </div>
        ));
        break;
      default:
        addOutput("error", `command not found: ${command}. Type 'help' for a list of commands.`);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIndex);
        setInputValue(history[history.length - 1 - nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInputValue(history[history.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue("");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-12"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div 
        ref={terminalRef}
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-4xl h-[80vh] bg-black border border-emerald-900 rounded-lg shadow-2xl overflow-hidden flex flex-col font-mono text-emerald-500/90 retro-terminal"
      >
        {/* CSS for CRT effects */}
        <style dangerouslySetInnerHTML={{__html: `
          .retro-terminal::before {
            content: " ";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 2;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
          }
        `}} />
        
        {/* Header bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/30 border-b border-emerald-900/50">
          <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIsOpen(false)} />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-emerald-700 select-none">portfolio-os</span>
        </div>

        {/* Terminal body */}
        <div 
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 relative z-10"
          onClick={() => inputRef.current?.focus()}
        >
          {bootLines.map((line, i) => (
            <div key={i} className="text-emerald-600">{line}</div>
          ))}

          {output.map((out) => (
            <div 
              key={out.id} 
              className={
                out.type === "command" ? "text-emerald-300 font-bold" :
                out.type === "error" ? "text-red-400" :
                out.type === "system" ? "text-emerald-600/70" :
                "text-emerald-500"
              }
            >
              {out.content}
            </div>
          ))}

          {!booting && (
            <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2">
              <span className="text-emerald-300 font-bold shrink-0">meet@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent outline-none border-none text-emerald-500 placeholder:text-emerald-800/50 caret-emerald-500"
                autoComplete="off"
                spellCheck="false"
                autoFocus
              />
            </form>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
