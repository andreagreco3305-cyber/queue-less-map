export type PickupSlot = {
  iso: string;
  label: string;
  shortLabel: string;
  spotsLeft: number;
  available: boolean;
};

const SLOT_MINUTES = 15;
const MAX_PER_SLOT = 5;
const HOURS_AHEAD = 4;

function roundToSlot(date: Date): Date {
  const d = new Date(date);
  const mins = d.getMinutes();
  const rounded = Math.ceil(mins / SLOT_MINUTES) * SLOT_MINUTES;
  d.setMinutes(rounded, 0, 0);
  if (rounded === 60) {
    d.setHours(d.getHours() + 1);
    d.setMinutes(0, 0, 0);
  }
  return d;
}

function formatSlotLabel(date: Date): { label: string; shortLabel: string } {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const day = isToday
    ? "Oggi"
    : date.toLocaleDateString("it-IT", { weekday: "short", day: "numeric" });
  return {
    label: `${day} alle ${time}`,
    shortLabel: time,
  };
}

export function generateSlots(): PickupSlot[] {
  const slots: PickupSlot[] = [];
  const now = new Date();
  
  // Arrotonda al prossimo slot di 15 minuti + un piccolo buffer di 10 min
  const start = roundToSlot(new Date(now.getTime() + 10 * 60 * 1000));
  
  for (let i = 0; i < 8; i++) {
    const d = new Date(start.getTime() + i * 15 * 60 * 1000);
    const { label, shortLabel } = formatSlotLabel(d);
    
    slots.push({
      iso: d.toISOString(),
      label,
      shortLabel,
      spotsLeft: 5,
      available: true,
    });
  }
  
  return slots;
}

export function generatePickupSlots(
  barId: string,
  getBookings: (barId: string, iso: string) => number,
): PickupSlot[] {
  const now = new Date();
  const start = roundToSlot(new Date(now.getTime() + 20 * 60 * 1000));
  const end = new Date(start.getTime() + HOURS_AHEAD * 60 * 60 * 1000);
  const slots: PickupSlot[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const iso = cursor.toISOString();
    const booked = getBookings(barId, iso);
    const spotsLeft = Math.max(0, MAX_PER_SLOT - booked);
    const { label, shortLabel } = formatSlotLabel(cursor);

    slots.push({
      iso,
      label,
      shortLabel,
      spotsLeft,
      available: spotsLeft > 0,
    });

    cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
  }

  return slots;
}
