import React from "react";
import { Activity, BookOpen, Layers } from "lucide-react";

export const Navbar: React.FC<{ isHealthy: boolean }> = ({ isHealthy }) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-wide text-zinc-100">FULLSTACK STUDIO</h1>
            <p className="text-xs text-zinc-500">FastAPI & Next.js Monorepo</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
            <span className={`h-2 w-2 rounded-full ${isHealthy ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
            <span className="text-zinc-300 font-mono">{isHealthy ? "API ONLINE" : "API OFFLINE"}</span>
          </div>

          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-indigo-400 transition"
          >
            <BookOpen className="h-4 w-4" />
            <span>OpenAPI Docs</span>
          </a>
        </div>
      </div>
    </header>
  );
};
