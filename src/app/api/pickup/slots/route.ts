import { NextResponse } from "next/server";
import { getSlotBookings } from "@/lib/auth/store";
import { generatePickupSlots } from "@/lib/pickup/slots";

export async function GET(request: Request) {
  const barId = new URL(request.url).searchParams.get("barId");
  if (!barId) {
    return NextResponse.json({ error: "barId richiesto" }, { status: 400 });
  }

  const slots = generatePickupSlots(barId, getSlotBookings);
  return NextResponse.json({ slots });
}
