import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  const supabase = getSupabase();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*, votes(count)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten vote count
  const enriched = (projects ?? []).map((p: Record<string, unknown>) => ({
    ...p,
    vote_count: Array.isArray(p.votes) && p.votes[0] ? (p.votes[0] as Record<string, unknown>).count : 0,
    votes: undefined,
  }));

  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const supabase = getSupabase();
  const body = await req.json();

  const { name, description, participants, image_url, project_link } = body;

  if (!name || !description || !participants) {
    return NextResponse.json(
      { error: "Nome, descrição e participantes são obrigatórios." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ name, description, participants, image_url, project_link })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
