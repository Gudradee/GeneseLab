"use client";

import AtcShader from "@/components/ui/atc-shader";
import Link from "next/link";

const cronograma = [
  {
    horario: "09:00",
    titulo: "Check-in & Abertura",
    descricao: "Chegue, pegue seu crachá e encontre sua equipe.",
  },
  {
    horario: "09:30",
    titulo: "Cerimônia de Abertura",
    descricao: "Apresentação do evento, regras e formação de grupos.",
  },
  {
    horario: "10:00",
    titulo: "Início do Estudo de Campo",
    descricao: "Começa o tempo de construção. Mentores disponíveis.",
  },
  {
    horario: "16:30",
    titulo: "Prazo de Submissão",
    descricao: "Pare de construir. Envie seu projeto na plataforma.",
  },
  {
    horario: "17:00",
    titulo: "Pitches de 3 Minutos",
    descricao: "Cada equipe apresenta seu projeto para os avaliadores.",
  },
  {
    horario: "18:00",
    titulo: "Votação & Encerramento",
    descricao: "Votação pública, anúncio dos vencedores e encerramento.",
  },
];

export default function PainelPage() {
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
            Um dia inteiro para transformar ideias em produtos reais.
            Construa, apresente e receba feedback — tudo dentro da LEIbmec.
          </p>

          {/* CTA */}
          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/submit"
              className="px-6 py-3 rounded-xl bg-[#4488ff] text-white font-semibold text-sm hover:bg-[#3377ee] transition-colors"
            >
              Submeter Projeto
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
              Datas a confirmar
            </span>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-[#1e1e1e]" />

            <div className="flex flex-col gap-0">
              {cronograma.map((item, i) => (
                <div key={i} className="flex gap-8 group">
                  {/* Time */}
                  <div className="w-20 shrink-0 pt-1 text-right">
                    <span className="text-[#4488ff] font-mono font-semibold text-sm tabular-nums">
                      {item.horario}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-[#4488ff] border-2 border-[#0a0a0a] mt-1.5 z-10 shrink-0 group-hover:scale-125 transition-transform" />
                    {i < cronograma.length - 1 && (
                      <div className="w-px flex-1 bg-[#1e1e1e] mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-10 flex-1">
                    <p className="text-white font-semibold text-base">{item.titulo}</p>
                    <p className="text-[#6b7280] text-sm mt-0.5 leading-relaxed">{item.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
