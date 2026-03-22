"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import dynamic from "next/dynamic";
const DottedSurface = dynamic(
  () => import("@/components/ui/dotted-surface").then((m) => m.DottedSurface),
  { ssr: false }
);

export default function SubmitPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    participants: "",
    project_link: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande. Máximo 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("project-images")
      .upload(fileName, file, { upsert: false });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data } = supabase.storage.from("project-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.description.trim() || !form.participants.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);

    let finalImageUrl: string | null = null;

    if (!useUrlInput && imageFile) {
      finalImageUrl = await uploadImage(imageFile);
      if (!finalImageUrl) {
        setError("Erro ao fazer upload da imagem. Verifique se o bucket 'project-images' existe no Supabase Storage.");
        setSubmitting(false);
        return;
      }
    } else if (useUrlInput && imageUrl.trim()) {
      finalImageUrl = imageUrl.trim();
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          participants: form.participants.trim(),
          image_url: finalImageUrl,
          project_link: form.project_link.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao submeter projeto.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#e8a020]/20 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#e8a020]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Projeto submetido!</h2>
        <p className="text-[#9ca3af]">Redirecionando para a galeria...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Dotted surface background */}
      <DottedSurface className="fixed inset-0 z-0" />
      {/* Subtle overlay — low opacity to keep dots visible */}
      <div className="fixed inset-0 z-0 bg-black/30" />

    <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Submeter Projeto</h1>
        <p className="text-[#9ca3af] mt-1">Compartilhe seu projeto com a comunidade.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        {/* Nome */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#d1d5db]">
            Nome do Projeto <span className="text-[#e8a020]">*</span>
          </label>
          <div className="field-glow">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex: Meu Projeto Incrível"
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#2a2a2a] text-white text-sm placeholder-[#6b7280] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#d1d5db]">
            Descrição <span className="text-[#e8a020]">*</span>
          </label>
          <div className="field-glow">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descreva o seu projeto, o problema que resolve e como funciona..."
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#2a2a2a] text-white text-sm placeholder-[#6b7280] focus:outline-none transition-colors resize-none"
            />
          </div>
          <span className="text-xs text-[#6b7280] text-right">{form.description.length}/1000</span>
        </div>

        {/* Participantes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#d1d5db]">
            Participantes <span className="text-[#e8a020]">*</span>
          </label>
          <div className="field-glow">
            <input
              type="text"
              name="participants"
              value={form.participants}
              onChange={handleChange}
              placeholder="João Silva, Maria Santos, Pedro Alves"
              className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#2a2a2a] text-white text-sm placeholder-[#6b7280] focus:outline-none transition-colors"
            />
          </div>
          <span className="text-xs text-[#6b7280]">Separe os nomes por vírgula</span>
        </div>

        {/* Imagem */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#d1d5db]">Imagem do Projeto</label>
            <button
              type="button"
              onClick={() => {
                setUseUrlInput(!useUrlInput);
                setImageFile(null);
                setImagePreview(null);
                setImageUrl("");
              }}
              className="text-xs text-[#9ca3af] hover:text-white underline transition-colors"
            >
              {useUrlInput ? "Fazer upload de arquivo" : "Usar URL de imagem"}
            </button>
          </div>

          {useUrlInput ? (
            <div className="field-glow">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.png"
                className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#2a2a2a] text-white text-sm placeholder-[#6b7280] focus:outline-none transition-colors"
              />
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                imagePreview ? "border-[#3a3a3a]" : "border-[#2a2a2a] hover:border-[#e8a020]/40"
              } bg-[#111] overflow-hidden`}
            >
              {imagePreview ? (
                <div className="relative w-full h-52">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="672px"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Clique para trocar</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-[#6b7280]">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  <span className="text-sm">Clique para selecionar uma imagem</span>
                  <span className="text-xs">PNG, JPG, GIF — máx. 5MB</span>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Link do Projeto */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#d1d5db]">Link do Projeto</label>
          <div className="field-glow">
            <input
              type="url"
              name="project_link"
              value={form.project_link}
              onChange={handleChange}
              placeholder="https://meu-projeto.vercel.app"
              className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-[#2a2a2a] text-white text-sm placeholder-[#6b7280] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${
            submitting
              ? "bg-[#e8a020]/50 text-black/50 cursor-not-allowed"
              : "bg-[#e8a020] text-black hover:bg-[#d4911c] active:scale-[0.98]"
          }`}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submetendo...
            </span>
          ) : (
            "Submeter Projeto"
          )}
        </button>
      </form>
    </div>
    </div>
  );
}
