"use client";

import { useEffect, useState } from "react";
import { supabase, type Project } from "@/lib/supabase";
import Link from "next/link";

export default function ClassificacaoPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Set to true when you want to reveal results
  const RESULTS_VISIBLE = false;

  useEffect(() => {
    if (!RESULTS_VISIBLE) { setLoading(false); return; }

    async function fetchRanking() {
      const res = await fetch("/api/projects");
      const data = await res.json();
      const sorted = (Array.isArray(data) ? data : []).sort(
        (a: Project, b: Project) => (b.vote_count ?? 0) - (a.vote_count ?? 0)
      );
      setProjects(sorted);
      setLoading(false);
    }
    fetchRanking();
  }, []);

  if (!RESULTS_VISIBLE) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-[#141414] border border-[#2a2a2a] rounded-2xl p-10 flex flex-col items-center text-center gap-5">
          {/* Lock icon */}
          <div className="w-16 h-16 rounded-full bg-[#4488ff]/15 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#4488ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path strokeLinecap="round" d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Classificação</h1>
          <p className="text-[#9ca3af] text-sm leading-relaxed max-w-sm">
            Os resultados serão divulgados ao final do evento,
            após o encerramento das votações.
          </p>
          <Link
            href="/"
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#4488ff] text-white text-sm font-semibold hover:bg-[#3377ee] transition-colors"
          >
            Ver Galeria de Projetos
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-[#6b7280]">
        <svg className="w-5 h-5 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Carregando...
      </div>
    );
  }

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10 flex items-center gap-3">
        <svg className="w-7 h-7 text-[#e8a020]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M8 21h8m-4-4v4M5 9h14l-1.598 7.192A2 2 0 0 1 15.42 18H8.58a2 2 0 0 1-1.958-1.808L5 9Z" />
        </svg>
        <h1 className="text-3xl font-bold text-white">Classificação</h1>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map((project, i) => (
          <div
            key={project.id}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
              i === 0
                ? "border-[#e8a020]/40 bg-[#e8a020]/5"
                : i === 1
                ? "border-[#9ca3af]/30 bg-white/5"
                : i === 2
                ? "border-[#cd7f32]/30 bg-[#cd7f32]/5"
                : "border-[#2a2a2a] bg-[#141414]"
            }`}
          >
            <span className="text-2xl w-8 text-center">{medals[i] ?? `#${i + 1}`}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold truncate">{project.name}</p>
              <p className="text-[#6b7280] text-xs truncate">{project.participants}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[#e8a020] font-bold tabular-nums">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5H6" />
              </svg>
              {project.vote_count ?? 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
