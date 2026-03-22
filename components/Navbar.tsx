"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const navLinks = [
  {
    href: "/",
    label: "Galeria",
    // stacked layers — 3 cards
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
      </svg>
    ),
  },
  {
    href: "/classificacao",
    label: "Classificação",
    // trophy
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
      </svg>
    ),
  },
  {
    href: "/escopo",
    label: "Escopo",
    // document with text lines (clipboard style)
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    href: "/painel",
    label: "Painel",
    // 2×2 grid squares
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1e1e1e] bg-[#0a0a0a]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[68px] flex items-center justify-between gap-4">

          {/* Brand */}
          <Link
            href="/painel"
            className="flex items-center gap-2 shrink-0 group"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-black text-white text-lg sm:text-xl tracking-tight">
              LEIBMEC
            </span>
            <span className="text-[#333] select-none">+</span>
            <span className="font-bold text-[#4488ff] text-lg sm:text-xl tracking-tight font-mono group-hover:text-[#66aaff] transition-colors">
              LE.tech
            </span>
            <span className="hidden lg:block text-[#333] select-none mx-1">|</span>
            <span className="hidden lg:block text-[#9ca3af] font-semibold text-sm group-hover:text-white transition-colors">
              Gênese Lab
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-white bg-[#1e1e1e]"
                      : "text-[#9ca3af] hover:text-white hover:bg-[#161616]"
                  }`}
                >
                  <span className={isActive ? "text-[#4488ff]" : ""}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop right: Submeter + Auth */}
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#1e1e1e]">
            <Link
              href="/submit"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                pathname === "/submit"
                  ? "bg-[#e8a020] text-black"
                  : "bg-[#e8a020]/90 text-black hover:bg-[#e8a020]"
              }`}
            >
              Submeter
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <div
                      title={user.email}
                      className="w-8 h-8 rounded-full bg-[#4488ff] flex items-center justify-center text-white font-bold text-sm select-none"
                    >
                      {userInitial}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1 text-[#9ca3af] hover:text-white text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                      </svg>
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="px-3 py-2 rounded-lg text-sm font-medium border border-[#2a2a2a] text-[#9ca3af] hover:text-white hover:border-[#3a3a3a] transition-colors"
                  >
                    Entrar
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile right: avatar + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {!loading && user && (
              <div className="w-8 h-8 rounded-full bg-[#4488ff] flex items-center justify-center text-white font-bold text-sm select-none">
                {userInitial}
              </div>
            )}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#161616] transition-colors"
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
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e1e1e] bg-[#0a0a0a] px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "text-white bg-[#1e1e1e]"
                    : "text-[#9ca3af] hover:text-white hover:bg-[#161616]"
                }`}
              >
                <span className={isActive ? "text-[#4488ff]" : ""}>{link.icon}</span>
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
              Submeter Projeto
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
                  Sair ({user.email})
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
