"use client";

import { useState } from "react";
import { Search, Loader2, FolderGit, CheckCircle2, FileText } from "lucide-react";

export default function RepoGradeDemo() {
  const [repo, setRepo] = useState("");
  const [status, setStatus] = useState<"idle" | "analyzing" | "complete">("idle");

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repo) return;
    
    setStatus("analyzing");
    // Simulate complex background processing (cloning, AI analysis, scoring)
    setTimeout(() => setStatus("complete"), 2500);
  };

  return (
    <div className="flex w-full items-center justify-center p-4 py-10 md:py-20">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        
        {/* App Chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <div className="ml-4 flex-1 text-xs text-foreground/40 font-mono">repograde.dev / analyze</div>
        </div>

        <div className="p-6 md:p-10">
          {status === "idle" && (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="mb-6 rounded-full bg-foreground/5 p-4 text-foreground/80">
                <FolderGit className="h-12 w-12" />
              </div>
              <h2 className="font-display text-3xl font-medium tracking-tight">Grade your repository</h2>
              <p className="mt-3 max-w-md text-foreground/60">
                Enter any public GitHub repository to generate an AI-powered code quality score and an optimized README.
              </p>
              
              <form onSubmit={handleAnalyze} className="mt-8 flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background p-1 focus-within:ring-2 focus-within:ring-foreground/20 transition-shadow">
                <span className="pl-3 text-foreground/40"><Search className="h-4 w-4" /></span>
                <input
                  type="text"
                  placeholder="github.com/user/repo"
                  className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-foreground/30"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!repo}
                  className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
                >
                  Analyze
                </button>
              </form>
            </div>
          )}

          {status === "analyzing" && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
              <h3 className="mt-6 font-display text-xl font-medium">Analyzing Codebase</h3>
              <div className="mt-4 flex flex-col gap-2 text-sm font-mono text-foreground/50">
                <p className="animate-pulse">Fetching AST and dependency tree...</p>
                <p className="opacity-40">Evaluating architecture patterns...</p>
                <p className="opacity-20">Prompting Gemini for README generation...</p>
              </div>
            </div>
          )}

          {status === "complete" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-mono text-sm text-foreground/60">{repo || "github.com/example/repo"}</h3>
                  <h2 className="font-display text-2xl font-medium">Analysis Complete</h2>
                </div>
                <button onClick={() => setStatus("idle")} className="text-sm font-mono text-blue-500 hover:underline">New Analysis</button>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Score Column */}
                <div className="flex flex-col rounded-xl border border-border bg-muted/10 p-6">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/50">Quality Score</h4>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="font-display text-6xl font-semibold tracking-tighter text-green-500">92</span>
                    <span className="mb-2 font-mono text-lg text-foreground/40">/ 100</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {["Excellent modularity", "Strong test coverage", "Clear documentation", "Minor dependency bloat"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                        {i === 3 ? (
                          <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        )}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* README Preview Column */}
                <div className="flex flex-col rounded-xl border border-border bg-background p-0 overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
                    <FileText className="h-4 w-4 text-foreground/50" />
                    <span className="font-mono text-xs text-foreground/70">README.md (Generated)</span>
                  </div>
                  <div className="p-4 font-mono text-xs leading-relaxed text-foreground/60 opacity-80 h-48 overflow-hidden relative">
                    <span className="text-blue-400"># Project Title</span><br/><br/>
                    This project is a blazing fast application built with React and Tailwind CSS. It features a robust architecture and...<br/><br/>
                    <span className="text-blue-400">## Installation</span><br/>
                    ```bash<br/>
                    npm install<br/>
                    ```<br/><br/>
                    <span className="text-blue-400">## Usage</span><br/>
                    Run the development server...
                    
                    {/* Fade out gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
