"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((m) => m.WebGLShader),
  { ssr: false }
);

const fases = [
  {
    numero: "01",
    titulo: "Imersão e Definição do Problema",
    subtitulo: "Design Thinking: Empatia · Gestão: Iniciação e Planejamento",
    duracao: "1 semana",
    objetivo:
      "Definir um território de oportunidade e transformá-lo em um problema claro a ser investigado, criando o plano de trabalho da equipe.",
    atividades: [
      {
        nome: "Workshop de Alinhamento Estratégico",
        descricao:
          'Técnica "Jobs to be Done" — identificar as tarefas que as pessoas precisam realizar em suas vidas. Definição coletiva de uma área de interesse (mobilidade, educação, saúde, finanças, etc.).',
      },
      {
        nome: "Termo de Abertura do Projeto",
        descricao:
          "Elaboração do Project Charter: objetivo, escopo, equipe, cronograma macro e restrições.",
      },
      {
        nome: "Preparação para a Pesquisa",
        descricao:
          'Criação do roteiro de entrevista com perguntas abertas. Exemplos: "Conte-me sobre a última vez que..." e "O que te frustra em...?"',
      },
    ],
    entregaveis: [
      "Tema/território definido",
      "Termo de Abertura do Projeto preenchido",
      "Roteiro de entrevista preparado",
    ],
  },
  {
    numero: "02",
    titulo: "Observação e Empatia",
    subtitulo: "Design Thinking: Observação · Gestão: Execução e Comunicação",
    duracao: "1–2 semanas",
    objetivo:
      "Sair do prédio e coletar dados qualitativos profundos sobre as dores reais das pessoas.",
    atividades: [
      {
        nome: "A Saída a Campo",
        descricao:
          "Membros se dividem em duplas e vão aos locais onde o público-alvo está presente. Técnicas: entrevistas em profundidade (15–20 min) e observação participativa.",
      },
      {
        nome: "Registro e Documentação",
        descricao:
          "Diário de Bordo do Projeto atualizado após cada saída com fotos, áudios, citações literais e observações de comportamento.",
      },
    ],
    entregaveis: [
      "Mínimo de 10 entrevistas por equipe",
      "Diário de Bordo atualizado",
      "Primeiros insights registrados",
    ],
  },
  {
    numero: "03",
    titulo: "Síntese e Definição",
    subtitulo: "Design Thinking: Interpretação · Gestão: Análise",
    duracao: "1 semana",
    objetivo:
      "Transformar dados brutos em um ponto de vista claro e acionável sobre o problema.",
    atividades: [
      {
        nome: "Workshop de Síntese",
        descricao:
          'Técnica "Saturar e Agrupar": colocar em mural todos os post-its com insights, agrupar por temas e identificar padrões.',
      },
      {
        nome: "Criação de Personas",
        descricao:
          "Perfis semifictícios dos usuários entrevistados com nome, idade, profissão, comportamentos, dores e desejos.",
      },
      {
        nome: "Definição do Problema (POV)",
        descricao:
          'Frase-síntese: "[Usuário] precisa de uma forma de [necessidade] porque [insight surpreendente]."',
      },
    ],
    entregaveis: [
      "Mural de insights agrupados",
      "1 a 3 personas criadas",
      "Problema definido no formato POV",
      "Project Charter atualizado",
    ],
  },
  {
    numero: "04",
    titulo: "Ideação e Prototipação",
    subtitulo: "Design Thinking: Criatividade · Gestão: Desenvolvimento",
    duracao: "1 semana",
    objetivo:
      "Gerar o máximo de ideias para resolver o problema definido e construir algo tangível para testar.",
    atividades: [
      {
        nome: "Sessão de Brainstorming — Crazy 8s",
        descricao:
          "Cada membro dobra uma folha em 8 partes e tem 5 minutos para desenhar 8 ideias diferentes. Toda ideia é bem-vinda. Quantidade gera qualidade.",
      },
      {
        nome: "Seleção da Ideia",
        descricao:
          "Matriz de Esforço vs. Impacto: a equipe prioriza a ideia de maior impacto com menor esforço inicial.",
      },
      {
        nome: "Construção do Protótipo",
        descricao:
          "Prototipação rápida — não é o produto final. App: telas no papel. Serviço: storyboard. Produto físico: maquete. Negócio digital: landing page.",
      },
    ],
    entregaveis: [
      "Mínimo de 8 ideias por pessoa registradas",
      "Matriz de Esforço vs. Impacto preenchida",
      "Protótipo físico/tangível da solução escolhida",
    ],
  },
  {
    numero: "05",
    titulo: "Teste e Iteração",
    subtitulo: "Design Thinking: Validação · Gestão: Monitoramento e Encerramento",
    duracao: "1–2 semanas",
    objetivo:
      "Voltar para a rua, mostrar o protótipo para potenciais usuários, coletar feedback e refinar a solução.",
    atividades: [
      {
        nome: "Teste com Usuários",
        descricao:
          'A equipe retorna aos locais da Fase 2 e apresenta o protótipo: "Estamos pensando em criar [isso] para resolver [o problema]. O que você acha?" Observar entendimento, confusão, entusiasmo e disposição de uso.',
      },
      {
        nome: "Iteração",
        descricao:
          "Com base no feedback, refinar o protótipo. Podem ser necessários 2 ou 3 ciclos de teste-refinamento.",
      },
      {
        nome: "Preparação do Pitch Final",
        descricao:
          "Estrutura: Problema (falas reais) → Público (personas) → Solução (protótipo) → Validação → Próximos passos → Equipe.",
      },
    ],
    entregaveis: [
      "Registro dos testes com usuários",
      "Protótipo refinado (versão final)",
      "Documento de Lições Aprendidas",
      "Pitch deck",
      "Apresentação final realizada",
    ],
  },
];

const stats = [
  { label: "Duração", value: "4–8 semanas" },
  { label: "Metodologia", value: "Design Thinking + PMBOK" },
  { label: "Entregável", value: "Pitch deck + Protótipo" },
  { label: "Fases", value: "5 fases" },
];

export default function EscopoPage() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <div className="relative min-h-[calc(100vh-56px)] overflow-hidden">
      <WebGLShader />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-14">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#4488ff]/15 text-[#4488ff] text-xs font-semibold border border-[#4488ff]/30 uppercase tracking-wide">
              Liga de Empreendedorismo do Ibmec
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
            Descobrir para<br />
            <span className="text-[#4488ff]">Empreender</span>
          </h1>
          <p className="text-[#9ca3af] text-base max-w-2xl leading-relaxed">
            Uma jornada do problema à solução validada. O Programa de Estudo de Campo combina
            Design Thinking (IDEO/David Kelley) com Gestão de Projetos (PMBOK) para capacitar
            membros a desenvolverem empreendimentos inovadores a partir de problemas reais.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-[#0e0e0e]/80 border border-[#1e1e1e] backdrop-blur">
              <p className="text-[#4488ff] text-xs font-semibold uppercase tracking-wide mb-1">{s.label}</p>
              <p className="text-white font-bold text-sm leading-snug">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Objetivo geral */}
        <div className="mb-10 p-5 rounded-xl bg-[#4488ff]/5 border border-[#4488ff]/20">
          <p className="text-xs font-semibold text-[#4488ff] uppercase tracking-wide mb-1">Objetivo Geral</p>
          <p className="text-white text-sm leading-relaxed">
            Capacitar os membros da Liga a desenvolverem empreendimentos inovadores a partir da
            identificação e validação de problemas reais, utilizando metodologias ágeis e centradas
            no usuário.
          </p>
        </div>

        {/* Fases */}
        <div className="flex items-center gap-3 mb-6">
          <svg className="w-5 h-5 text-[#4488ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
          </svg>
          <h2 className="text-xl font-bold text-white">Fases do Programa</h2>
        </div>

        <div className="flex flex-col gap-3">
          {fases.map((fase, i) => {
            const isOpen = aberta === i;
            return (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-[#4488ff]/40 bg-[#0a0f1a]/90" : "border-[#1e1e1e] bg-[#0e0e0e]/80"
                } backdrop-blur`}
              >
                {/* Header row */}
                <button
                  onClick={() => setAberta(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left group"
                >
                  <span className={`shrink-0 font-black font-mono text-2xl tabular-nums transition-colors ${isOpen ? "text-[#4488ff]" : "text-[#2a3a50]"}`}>
                    {fase.numero}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-base leading-snug transition-colors ${isOpen ? "text-white" : "text-[#9ca3af] group-hover:text-white"}`}>
                      {fase.titulo}
                    </p>
                    <p className="text-[#4a5a6a] text-xs mt-0.5 hidden sm:block">{fase.subtitulo}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:block px-2 py-0.5 rounded-full bg-[#1e1e1e] text-[#6b7280] text-xs border border-[#2a2a2a]">
                      {fase.duracao}
                    </span>
                    <svg
                      className={`w-4 h-4 text-[#4a5a6a] transition-transform duration-200 ${isOpen ? "rotate-180 text-[#4488ff]" : ""}`}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-5 pb-6 border-t border-[#1e2a40]">
                    {/* Objetivo */}
                    <div className="mt-4 mb-5">
                      <p className="text-xs font-semibold text-[#4488ff] uppercase tracking-wide mb-1">Objetivo</p>
                      <p className="text-[#9ca3af] text-sm leading-relaxed">{fase.objetivo}</p>
                    </div>

                    {/* Atividades */}
                    <div className="mb-5">
                      <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Atividades</p>
                      <div className="flex flex-col gap-3">
                        {fase.atividades.map((a, j) => (
                          <div key={j} className="flex gap-3">
                            <div className="shrink-0 w-5 h-5 rounded-full bg-[#4488ff]/15 flex items-center justify-center mt-0.5">
                              <span className="text-[#4488ff] text-[10px] font-bold">{j + 1}</span>
                            </div>
                            <div>
                              <p className="text-white text-sm font-semibold leading-snug">{a.nome}</p>
                              <p className="text-[#6b7280] text-sm leading-relaxed mt-0.5">{a.descricao}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Entregáveis */}
                    <div>
                      <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Entregáveis</p>
                      <div className="flex flex-wrap gap-2">
                        {fase.entregaveis.map((e, j) => (
                          <span key={j} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4488ff]/10 border border-[#4488ff]/20 text-[#6699cc] text-xs">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pitch structure */}
        <div className="mt-10 p-5 rounded-xl bg-[#e8a020]/5 border border-[#e8a020]/20">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-[#e8a020] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
            </svg>
            <p className="text-[#e8a020] font-bold text-sm">Estrutura do Pitch Final — Banca 25 Mai 2026</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["Problema (falas reais)", "Público (personas)", "Solução (protótipo)", "Validação (testes)", "Próximos passos", "Equipe"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#9ca3af]">
                <span className="text-[#e8a020] font-mono text-xs font-bold">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
