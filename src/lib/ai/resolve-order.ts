import { BARS, formatPrice, getBarById, type MenuItem } from "@/data/bars";

export type OrderDraft = {
  barId: string;
  barName: string;
  itemId: string;
  itemName: string;
  price: number;
  time: string;
  pickupLabel: string;
  estimatedTotal: string;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function findBar(barName: string) {
  const q = normalize(barName);
  return (
    BARS.find((b) => normalize(b.name).includes(q) || normalize(b.id).includes(q)) ??
    BARS.find((b) => {
      if (q.includes("statale")) return b.id === "statale";
      if (q.includes("politecnico") || q.includes("polimi")) return b.id === "politecnico";
      if (q.includes("cordusio")) return b.id === "cordusio";
      if (q.includes("brera")) return b.id === "brera";
      return false;
    })
  );
}

function findMenuItem(menu: MenuItem[], itemQuery: string): MenuItem | undefined {
  const q = normalize(itemQuery);
  const aliases: Record<string, string[]> = {
    caffe: ["espresso", "caffè", "caffe", "americano"],
    cappuccino: ["cappuccino"],
    cornetto: ["cornetto", "brioche", "croissant"],
    panino: ["panino", "piadina", "toast", "tramezzino", "focaccia"],
  };

  let direct = menu.find(
    (m) =>
      normalize(m.name).includes(q) || q.includes(normalize(m.name)),
  );

  if (!direct) {
    for (const [key, words] of Object.entries(aliases)) {
      if (words.some((w) => q.includes(normalize(w)) || normalize(w).includes(q))) {
        direct = menu.find((m) => normalize(m.name).includes(key));
        if (direct) break;
      }
    }
  }

  if (!direct && (q.includes("caffe") || q === "caffe")) {
    direct = menu.find((m) => m.category === "caffè");
  }

  return direct;
}

function formatPickupLabel(time: string): string {
  const t = time.trim();
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const [h, m] = t.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return `Oggi alle ${d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return t;
}

function timeToIsoToday(time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  const d = new Date();
  if (match) {
    d.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
  } else {
    d.setMinutes(d.getMinutes() + 30);
  }
  return d.toISOString();
}

export function resolveOrderDraft(
  barName: string,
  item: string,
  time: string,
): OrderDraft | { error: string } {
  const bar = findBar(barName);
  if (!bar) {
    return {
      error: `Bar "${barName}" non trovato. Bar disponibili: ${BARS.map((b) => b.name).join(", ")}.`,
    };
  }

  const menuItem = findMenuItem(bar.menu, item);
  if (!menuItem) {
    return {
      error: `"${item}" non è nel menu di ${bar.name}. Prova: ${bar.menu.slice(0, 4).map((m) => m.name).join(", ")}.`,
    };
  }

  const pickupLabel = formatPickupLabel(time);

  return {
    barId: bar.id,
    barName: bar.name,
    itemId: menuItem.id,
    itemName: menuItem.name,
    price: menuItem.price,
    time: timeToIsoToday(time.includes(":") ? time : "09:00"),
    pickupLabel,
    estimatedTotal: formatPrice(menuItem.price),
  };
}

export function orderDraftToPickupIso(draft: OrderDraft): string {
  return draft.time;
}

export function getBarForDraft(draft: OrderDraft) {
  return getBarById(draft.barId);
}
