"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-[#e8a020]/20 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-[#e8a020]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Verifique seu e-mail</h2>
        <p className="text-[#9ca3af] max-w-sm text-sm leading-relaxed">
          Enviamos um link de acesso para{" "}
          <span className="text-white font-medium">{email}</span>.
          <br />Clique nele para entrar no Gênese Lab.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-[#6b7280] hover:text-white transition-colors underline"
        >
          Usar outro e-mail
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-black text-white text-xl tracking-tight">LEIBMEC</span>
            <span className="text-[#3a3a3a]">+</span>
            <span className="font-bold text-[#4488ff] text-xl tracking-tight font-mono">LE.tech</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Gênese Lab</h1>
          <p className="text-[#9ca3af] text-sm">Entre com seu e-mail para acessar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#d1d5db]">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#e8a020]/50 transition-colors"
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3 rounded-lg bg-[#e8a020] text-black font-semibold text-sm hover:bg-[#d4911c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar link de acesso"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#6b7280]">
          Você receberá um link mágico no seu e-mail.
          <br />Sem senha necessária.
        </p>

        <div className="mt-8 pt-6 border-t border-[#2a2a2a] text-center">
          <Link href="/" className="text-sm text-[#6b7280] hover:text-white transition-colors">
            ← Voltar para a Galeria
          </Link>
        </div>
      </div>
    </div>
  );
}
