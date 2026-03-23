"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Trophy, FileText, Layers } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Galeria", icon: Layers },
  { href: "/classificacao", label: "Classificação", icon: Trophy },
  { href: "/escopo", label: "Escopo", icon: FileText },
  { href: "/painel", label: "Painel", icon: LayoutGrid },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync active tab with current route
  const activeLabel =
    navLinks.find((l) => l.href === pathname)?.label ?? navLinks[0].label;
  const [activeTab, setActiveTab] = useState(activeLabel);

  useEffect(() => {
    setActiveTab(activeLabel);
  }, [activeLabel]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1e1e1e] bg-[#0a0a0a]/95 backdrop-blur-md">
      {/* ── Desktop ─────────────────────────────────────────── */}
      <div className="hidden md:grid grid-cols-3 items-center h-14 px-5 lg:px-8">

        {/* Col 1 — Brand (esquerda) */}
        <div className="flex items-center">
          <Link href="/painel" className="flex items-center gap-1.5 group shrink-0">
            <span className="font-black text-white text-base tracking-tight uppercase">
              LEIBMEC
            </span>
            <span className="text-[#444] select-none text-sm">+</span>
            <span className="font-black text-[#4488ff] text-base tracking-tight uppercase font-mono group-hover:text-[#66aaff] transition-colors">
              LE.TECH
            </span>
            <span className="text-[#333] select-none mx-1 text-sm">|</span>
            <span className="text-[#6b7280] font-medium text-sm group-hover:text-white transition-colors">
              Gênese Lab
            </span>
          </Link>
        </div>

        {/* Col 2 — Tubelight nav (centro) */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.label;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveTab(link.label)}
                  className={cn(
                    "relative cursor-pointer text-sm font-medium px-4 py-1.5 rounded-full transition-colors select-none",
                    isActive
                      ? "text-white"
                      : "text-[#9ca3af] hover:text-white"
                  )}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="tubelight"
                      className="absolute inset-0 w-full bg-[#4488ff]/10 rounded-full -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#4488ff] rounded-t-full">
                        <div className="absolute w-12 h-6 bg-[#4488ff]/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-[#4488ff]/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-[#4488ff]/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Col 3 — Auth + Submeter (direita) */}
        <div className="flex items-center justify-end gap-2">
          <Link
            href="/submit"
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              pathname === "/submit"
                ? "bg-[#e8a020] text-black"
                : "bg-[#e8a020]/90 text-black hover:bg-[#e8a020]"
            }`}
          >
            Criar
          </Link>

          {!loading && (
            user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#1e1e1e]">
                <div
                  title={user.email}
                  className="w-7 h-7 rounded-full bg-[#4488ff] flex items-center justify-center text-white font-bold text-xs select-none"
                >
                  {userInitial}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-[#9ca3af] hover:text-white text-sm font-medium transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[#2a2a2a] text-[#9ca3af] hover:text-white hover:border-[#3a3a3a] transition-colors"
              >
                Entrar
              </Link>
            )
          )}
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────────────────── */}
      <div className="flex md:hidden items-center justify-between h-14 px-4">
        <Link href="/painel" className="flex items-center gap-1.5" onClick={() => setMobileOpen(false)}>
          <span className="font-black text-white text-sm tracking-tight uppercase">LEIBMEC</span>
          <span className="text-[#444] text-xs">+</span>
          <span className="font-black text-[#4488ff] text-sm tracking-tight uppercase font-mono">LE.TECH</span>
        </Link>

        <div className="flex items-center gap-2">
          {!loading && user && (
            <div className="w-7 h-7 rounded-full bg-[#4488ff] flex items-center justify-center text-white font-bold text-xs select-none">
              {userInitial}
            </div>
          )}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#161616] transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e1e1e] bg-[#0a0a0a] px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "text-white bg-[#1e1e1e]" : "text-[#9ca3af] hover:text-white hover:bg-[#161616]"
                }`}
              >
                <span className={isActive ? "text-[#4488ff]" : ""}>
                  <Icon size={14} strokeWidth={1.8} />
                </span>
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 pt-2 border-t border-[#1e1e1e] flex flex-col gap-1">
            <Link
              href="/submit"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-semibold bg-[#e8a020] text-black"
            >
              Criar Projeto
            </Link>
            {!loading && (
              user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#161616] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                  </svg>
                  Sair
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium border border-[#2a2a2a] text-[#9ca3af]"
                >
                  Entrar
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
