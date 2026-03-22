"use client";

import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { type Project } from "@/lib/supabase";
import Link from "next/link";

type SortMode = "recent" | "votes";

export default function GalleryPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortMode>("recent");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch {
        /* empty */
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filtered = projects
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.participants.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "votes") return (b.vote_count ?? 0) - (a.vote_count ?? 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Galeria de Projetos</h1>
        <p className="text-[#9ca3af] mt-1">Explore o que foi construído.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#3a3a3a]"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-[#6b7280] text-sm shrink-0">Ordenar:</span>
          <div className="flex rounded-lg border border-[#2a2a2a] overflow-hidden">
            {(["recent", "votes"] as SortMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSort(mode)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  sort === mode
                    ? "bg-[#2a2a2a] text-white"
                    : "text-[#6b7280] hover:text-white hover:bg-[#1e1e1e]"
                }`}
              >
                {mode === "recent" ? "Recentes" : "Mais votados"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24 text-[#6b7280]">
          <svg className="w-5 h-5 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Carregando projetos...
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg className="w-12 h-12 text-[#3a3a3a] mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C12 2 7 7 7 13c0 3.314 2.686 6 6 6s6-2.686 6-6c0-6-5-11-7-11Z" />
            <circle cx="12" cy="10" r="1.5" fill="currentColor" />
          </svg>
          <p className="text-[#6b7280] text-lg font-medium">
            {search ? "Nenhum projeto encontrado." : "Nenhum projeto ainda."}
          </p>
          {!search && (
            <Link
              href="/submit"
              className="mt-4 px-4 py-2 rounded-lg bg-[#e8a020] text-black text-sm font-semibold hover:bg-[#d4911c] transition-colors"
            >
              Submeter o primeiro projeto
            </Link>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
