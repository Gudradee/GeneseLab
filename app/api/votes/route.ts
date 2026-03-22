import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(req: Request) {
  const supabase = getSupabase();
  const { project_id, voter_id } = await req.json();

  if (!project_id || !voter_id) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("votes")
    .insert({ project_id, voter_id })
    .select()
    .single();

  if (error) {
    // Unique constraint violation = já votou
    if (error.code === "23505") {
      return NextResponse.json({ error: "Já votou neste projeto." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: Request) {
  const supabase = getSupabase();
  const { project_id, voter_id } = await req.json();

  if (!project_id || !voter_id) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("project_id", project_id)
    .eq("voter_id", voter_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
