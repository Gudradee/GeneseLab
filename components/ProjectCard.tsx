"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase, type Project } from "@/lib/supabase";

function getVoterId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("voter_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("voter_id", id);
  }
  return id;
}

function RocketPlaceholder() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C12 2 7 7 7 13C7 16.3137 9.68629 19 13 19C16.3137 19 19 16.3137 19 13C19 7 14 2 12 2Z" stroke="#4b5563" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7 13C7 13 5 14 4 17C4 17 7 17 8 15" stroke="#4b5563" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M19 13C19 13 21 14 22 17C22 17 19 17 18 15" stroke="#4b5563" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="13" cy="10" r="1.5" fill="#4b5563"/>
        <path d="M10 19L9 22M13 19L13 22M16 19L17 22" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [voteCount, setVoteCount] = useState(project.vote_count ?? 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const votedProjects = JSON.parse(localStorage.getItem("voted_projects") || "[]");
    setHasVoted(votedProjects.includes(project.id));
  }, [project.id]);

  const handleVote = async () => {
    if (loading) return;
    setLoading(true);

    const voterId = getVoterId();
    const votedProjects: string[] = JSON.parse(localStorage.getItem("voted_projects") || "[]");

    if (hasVoted) {
      // Remove vote
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("project_id", project.id)
        .eq("voter_id", voterId);

      if (!error) {
        setVoteCount((v) => v - 1);
        setHasVoted(false);
        localStorage.setItem(
          "voted_projects",
          JSON.stringify(votedProjects.filter((id) => id !== project.id))
        );
      }
    } else {
      // Add vote
      const { error } = await supabase
        .from("votes")
        .insert({ project_id: project.id, voter_id: voterId });

      if (!error) {
        setVoteCount((v) => v + 1);
        setHasVoted(true);
        localStorage.setItem(
          "voted_projects",
          JSON.stringify([...votedProjects, project.id])
        );
      }
    }

    setLoading(false);
  };

  const participantsList = project.participants
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden hover:border-[#3a3a3a] transition-all duration-200 hover:shadow-xl hover:shadow-black/30">
      {/* Image */}
      <div className="relative w-full h-44 bg-[#111] overflow-hidden">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <RocketPlaceholder />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-white font-bold text-lg leading-snug">{project.name}</h3>

        <p className="text-[#9ca3af] text-sm leading-relaxed line-clamp-4 flex-1">
          {project.description}
        </p>

        {/* Participants */}
        <div className="flex items-start gap-2 text-sm text-[#6b7280]">
          <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span className="line-clamp-2">
            {participantsList.join(", ")}
          </span>
        </div>

        {/* Project link */}
        {project.project_link && (
          <a
            href={project.project_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-[#2a2a2a] text-[#9ca3af] text-sm hover:text-white hover:border-[#3a3a3a] transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Ver Projeto
          </a>
        )}
      </div>

      {/* Vote section */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[#222] bg-[#141414]">
        <span className="text-[#6b7280] text-sm">Votos</span>
        <div className="flex items-center gap-3">
          <span className="text-white font-semibold tabular-nums">{voteCount}</span>
          <button
            onClick={handleVote}
            disabled={loading}
            title={hasVoted ? "Remover voto" : "Votar neste projeto"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              hasVoted
                ? "bg-[#e8a020]/20 text-[#e8a020] hover:bg-[#e8a020]/10 border border-[#e8a020]/30"
                : "bg-[#2a2a2a] text-[#9ca3af] hover:bg-[#333] hover:text-white border border-transparent"
            } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={hasVoted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
            </svg>
            {hasVoted ? "Votado" : "Votar"}
          </button>
        </div>
      </div>
    </div>
  );
}
