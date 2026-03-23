"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
const AtcShader = dynamic(() => import("@/components/ui/atc-shader"), { ssr: false });
import Link from "next/link";

// ISO dates for comparison (same order as cronograma)
const cronogramaDates = [
  "2026-03-18",
  "2026-03-23",
  "2026-03-24",
  "2026-03-26",
  "2026-04-09",
  "2026-04-23",
  "2026-05-14",
  "2026-05-18",
  "2026-05-25",
];

const cronograma = [
  {
    data: "18 Mar 2026",
    titulo: "Início do Estudo de Campo",
    descricao: "Lançamento oficial do Gênese Lab. As equipes recebem o desafio e começam a explorar suas ideias.",
  },
  {
    data: "23 Mar 2026",
    titulo: "Alinhamento das Fases 1 e 2",
    descricao: "Reunião com o vice-presidente da liga para ouvir as ideias em desenvolvimento e oferecer direcionamento estratégico.",
  },
  {
    data: "24 Mar 2026",
    titulo: "Reunião de Presidência & Diretoria",
    descricao: "Alinhamento interno entre presidência e diretoria para definição do escopo do Gênese Lab e estruturação do suporte aos participantes.",
  },
  {
    data: "26 Mar 2026",
    titulo: "Início da Fase 2",
    descricao: "Sessão de acompanhamento com toda a diretoria. Mentoria coletiva para orientar o desenvolvimento dos projetos.",
  },
  {
    data: "09 Abr 2026",
    titulo: "Início da Fase 3",
    descricao: "Reunião de acompanhamento e aconselhamento para evolução dos projetos na terceira etapa do Gênese Lab.",
  },
  {
    data: "23 Abr 2026",
    titulo: "Início da Fase 4 — Prototipação",
    descricao: "Foco na construção dos protótipos. Sessão de ideação e aconselhamento para materializar as soluções.",
  },
  {
    data: "14 Mai 2026",
    titulo: "Refinamento do Pitch Deck",
    descricao: "Workshop de narrativa e apresentação. As equipes refinam seus decks para a banca avaliadora.",
  },
  {
    data: "18 Mai 2026",
    titulo: "Conferência Final de Progresso",
    descricao: "Última revisão antes da apresentação para a banca. Ajustes finais e preparação para o grande dia.",
  },
  {
    data: "25 Mai 2026",
    titulo: "Banca Final",
    descricao: "Apresentação dos projetos para os avaliadores. Pitches, perguntas e deliberação dos vencedores.",
    isFinal: true,
  },
];

export default function PainelPage() {
  // Find index of the nearest upcoming (or current) event
  const [cardIndex, setCardIndex] = useState(0);
  const [visible, setVisible] = useState(4);
  const TOTAL = 7;

  useEffect(() => {
    const update = () => setVisible(window.innerWidth < 640 ? 2 : 4);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const canPrev = cardIndex > 0;
  const canNext = cardIndex + visible < TOTAL;

  const nextIndex = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Find the last event that has already passed or is today, then highlight the next one
    let idx = cronogramaDates.findIndex((d) => new Date(d) >= today);
    if (idx === -1) idx = cronogramaDates.length - 1;
    return idx;
  }, []);

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* ATC shader full-bleed */}
        <div className="absolute inset-0 z-0">
          <AtcShader />
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 gap-6">
          {/* Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#4488ff] animate-pulse" />
            Estudo de Campo · LEIbmec · 2026
          </div>

          {/* Title */}
          <h1
            className="text-7xl sm:text-8xl font-black tracking-tighter text-white leading-none"
            style={{ fontFamily: "inherit" }}
          >
            Gênese Lab
          </h1>

          {/* Sub-title with blue highlight */}
          <p className="text-2xl sm:text-3xl font-semibold text-[#4488ff] tracking-tight">
            Explore sua criatividade,{" "}
            <span className="text-white">crie e lance.</span>
          </p>

          {/* Description */}
          <p className="max-w-xl text-[#9ca3af] text-base leading-relaxed">
            Um semestre inteiro para transformar ideias em produtos reais.
            Construa, apresente e receba feedback — tudo dentro da LEIbmec.
          </p>

          {/* CTA */}
          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/submit"
              className="px-6 py-3 rounded-xl bg-[#4488ff] text-white font-semibold text-sm hover:bg-[#3377ee] transition-colors"
            >
              Criar Projeto
            </Link>
            <Link
              href="/escopo"
              className="px-6 py-3 rounded-xl border border-white/20 text-white/80 font-semibold text-sm hover:text-white hover:border-white/40 transition-colors"
            >
              Ver Escopo
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40 text-xs">
          <span>Cronograma</span>
          <svg className="w-4 h-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Cronograma ───────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] border-t border-[#1e1e1e] py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-14">
            <svg className="w-7 h-7 text-[#4488ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <h2 className="text-3xl font-bold text-white">Cronograma</h2>
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[#4488ff]/15 text-[#4488ff] text-xs font-medium border border-[#4488ff]/30">
              Mar — Mai 2026
            </span>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7.5rem] top-0 bottom-0 w-px bg-[#1e1e1e]" />

            <div className="flex flex-col gap-0">
              {cronograma.map((item, i) => {
                const isNext = i === nextIndex;
                const isPast = i < nextIndex;
                const isFinal = !!item.isFinal;

                return (
                  <div key={i} className={`flex gap-8 group relative ${isNext ? "z-10" : ""}`}>
  
                    {/* Date */}
                    <div className="w-24 shrink-0 pt-1.5 text-right">
                      <span className={`font-mono font-semibold tabular-nums leading-tight text-sm ${
                        isNext ? "text-white" : isPast ? "text-[#3a5080]" : isFinal ? "text-[#e8a020]" : "text-[#4488ff]"
                      }`}>
                        {item.data}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="relative flex flex-col items-center">
                      <div className={`rounded-full border-2 border-[#0a0a0a] z-10 shrink-0 transition-transform group-hover:scale-125 ${
                        isNext
                          ? "w-3 h-3 bg-[#4488ff] mt-1.5 shadow-[0_0_8px_2px_rgba(68,136,255,0.5)]"
                          : isPast
                          ? "w-2.5 h-2.5 bg-[#2a3a50] mt-2"
                          : isFinal
                          ? "w-3 h-3 bg-[#e8a020] mt-1.5"
                          : "w-3 h-3 bg-[#4488ff] mt-1.5"
                      }`} />
                      {i < cronograma.length - 1 && (
                        <div className={`w-px flex-1 mt-1 ${isPast ? "bg-[#1e2a38]" : "bg-[#1e1e1e]"}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-12 flex-1 pt-0.5">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold leading-snug ${
                          isNext ? "text-white text-lg" : isPast ? "text-[#3a4a5a] text-base" : isFinal ? "text-[#e8a020] text-lg" : "text-white text-lg"
                        }`}>
                          {item.titulo}
                        </p>
                        {isNext && (
                          <span className="px-1.5 py-0.5 rounded text-[#4488ff] text-[10px] font-semibold border border-[#4488ff]/40 leading-none">
                            próximo
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 leading-relaxed ${isPast ? "text-[#2e3e4e]" : "text-[#6b7280]"}`}>
                        {item.descricao}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Avaliadores */}
          <div className="mt-6 pt-14 border-t border-[#1e1e1e]">
            <div className="flex items-center gap-3 mb-8">
              <svg className="w-6 h-6 text-[#e8a020]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <h3 className="text-2xl font-bold text-white">Banca Avaliadora</h3>
              <span className="ml-1 px-2.5 py-0.5 rounded-full bg-[#e8a020]/15 text-[#e8a020] text-xs font-medium border border-[#e8a020]/30">
                25 Mai 2026
              </span>
            </div>

            <div className="relative flex items-center gap-3">
              {/* Prev arrow */}
              <button
                onClick={() => setCardIndex((v) => Math.max(0, v - 1))}
                disabled={!canPrev}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-[#2a2a2a] bg-[#0e0e0e] text-[#4a4a4a] hover:border-[#e8a020]/50 hover:text-[#e8a020] disabled:opacity-20 disabled:pointer-events-none transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Cards */}
              <div className={`flex-1 grid gap-3 ${visible === 2 ? "grid-cols-2" : "grid-cols-4"}`}>
                {Array.from({ length: TOTAL }, (_, i) => {
                  if (i < cardIndex || i >= cardIndex + visible) return null;
                  return (
                    <div
                      key={i}
                      className="group flex flex-col rounded-2xl bg-[#0e0e0e] border border-[#222] hover:border-[#e8a020]/40 hover:bg-[#111008] transition-all duration-300 cursor-default overflow-hidden"
                    >
                      {/* Photo area */}
                      <div className="relative w-full aspect-[3/4] bg-[#141414] flex items-center justify-center overflow-hidden group-hover:shadow-[inset_0_0_30px_rgba(232,160,32,0.05)] transition-all duration-300">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/4 to-transparent" />
                        <svg className="w-16 h-16 text-[#222] group-hover:text-[#2a2a1a] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                      {/* Name */}
                      <div className="px-4 py-3 border-t border-[#1a1a1a]">
                        <p className="text-[#383838] group-hover:text-[#555] text-sm font-semibold transition-colors duration-300 truncate">
                          Avaliador {i + 1}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1 h-1 rounded-full bg-[#e8a020]/25 animate-pulse" />
                          <p className="text-[#2a2a2a] text-xs transition-colors duration-300">A revelar em breve</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next arrow */}
              <button
                onClick={() => setCardIndex((v) => Math.min(TOTAL - visible, v + 1))}
                disabled={!canNext}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-[#2a2a2a] bg-[#0e0e0e] text-[#4a4a4a] hover:border-[#e8a020]/50 hover:text-[#e8a020] disabled:opacity-20 disabled:pointer-events-none transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {Array.from({ length: TOTAL - visible + 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCardIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === cardIndex ? "w-4 h-1.5 bg-[#e8a020]" : "w-1.5 h-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
