import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Sessione scaduta. Accedi di nuovo." }, { status: 401 });
    }

    if (!user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Conferma la tua email prima di ordinare." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const barId = typeof body.barId === "string" ? body.barId : "";
    const barName = typeof body.barName === "string" ? body.barName : "";
    const pickupAt = typeof body.pickupAt === "string" ? body.pickupAt : "";
    const pickupLabel =
      typeof body.pickupLabel === "string" ? body.pickupLabel : null;
    const total = typeof body.total === "number" ? body.total : 0;
    const items = Array.isArray(body.items) ? body.items : [];

    if (!barId || !pickupAt || items.length === 0) {
      return NextResponse.json(
        { error: "Dati ordine incompleti." },
        { status: 400 },
      );
    }

    const pickupCode = Math.random().toString(36).slice(2, 5).toUpperCase();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        bar_id: barId,
        bar_name: barName,
        items,
        pickup_at: pickupAt,
        pickup_label: pickupLabel,
        total,
        status: "confirmed",
        pickup_code: pickupCode,
      })
      .select("id, pickup_code")
      .single();

    if (error) {
      console.error("[orders]", error);
      return NextResponse.json(
        {
          error:
            error.code === "42P01"
              ? "Tabella orders mancante. Esegui supabase/schema.sql."
              : "Salvataggio ordine non riuscito.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      code: data.pickup_code,
      orderId: data.id,
      pickupAt,
    });
  } catch {
    return NextResponse.json({ error: "Ordine non riuscito." }, { status: 500 });
  }
}
