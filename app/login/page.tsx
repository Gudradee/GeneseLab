"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — send OTP code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });

    if (error) {
      setError(error.message);
    } else {
      setStep("code");
    }
    setLoading(false);
  };

  // Step 2 — verify 6-digit code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });

    if (error) {
      setError("Código inválido ou expirado. Tente novamente.");
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-black text-white text-xl tracking-tight uppercase">LEIBMEC</span>
            <span className="text-[#3a3a3a]">+</span>
            <span className="font-bold text-[#4488ff] text-xl tracking-tight font-mono uppercase">LE.TECH</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Gênese Lab</h1>
          <p className="text-[#9ca3af] text-sm">
            {step === "email"
              ? "Entre com seu e-mail para acessar"
              : "Digite o código enviado para seu e-mail"}
          </p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
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
              {loading ? "Enviando..." : "Enviar código"}
            </button>

            <p className="text-center text-xs text-[#6b7280]">
              Você receberá um código de 6 dígitos no e-mail.
              <br />Sem senha necessária.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#d1d5db]">
                Código enviado para <span className="text-white">{email}</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="00000000"
                required
                maxLength={8}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xl text-center font-mono tracking-[0.5em] placeholder-[#3a3a3a] focus:outline-none focus:border-[#e8a020]/50 transition-colors"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="w-full py-3 rounded-lg bg-[#e8a020] text-black font-semibold text-sm hover:bg-[#d4911c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>

            <button
              type="button"
              onClick={() => { setStep("email"); setCode(""); setError(""); }}
              className="text-sm text-[#6b7280] hover:text-white transition-colors text-center"
            >
              ← Usar outro e-mail
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-[#2a2a2a] text-center">
          <Link href="/" className="text-sm text-[#6b7280] hover:text-white transition-colors">
            ← Voltar para a Galeria
          </Link>
        </div>
      </div>
    </div>
  );
}
