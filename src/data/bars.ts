export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: "caffè" | "colazione" | "panini" | "bevande";
};

export type Bar = {
  id: string;
  name: string;
  tagline: string;
  address: string;
  campus?: string;
  waitMinutes: number;
  emoji: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3;
  cuisine: string;
  menu: MenuItem[];
};

export const BARS: Bar[] = [
  {
    id: "statale",
    name: "Bar Centrale",
    tagline: "Il cuore della pausa caffè",
    address: "Via Festa del Perdono, 7 — Milano",
    campus: "Duomo",
    waitMinutes: 2,
    emoji: "☕",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop&q=80",
    rating: 4.7,
    reviewCount: 214,
    priceLevel: 1,
    cuisine: "Caffè · Colazione",
    menu: [
      { id: "s1", name: "Espresso", price: 1.2, category: "caffè" },
      { id: "s2", name: "Cappuccino", price: 1.5, category: "caffè" },
      { id: "s3", name: "Caffè shakerato", price: 2.0, category: "caffè" },
      { id: "s4", name: "Cornetto classico", price: 1.3, category: "colazione" },
      { id: "s5", name: "Cornetto pistacchio", price: 1.8, category: "colazione" },
      { id: "s6", name: "Spremuta arancia", price: 2.5, category: "bevande" },
      { id: "s7", name: "Tramezzino prosciutto", price: 3.5, category: "panini" },
      { id: "s8", name: "Panino mozzarella & pomodoro", price: 4.5, category: "panini" },
    ],
  },
  {
    id: "politecnico",
    name: "Tech Coffee",
    tagline: "Innovazione e gusto",
    address: "Piazza Leonardo da Vinci, 32 — Milano",
    campus: "Leonardo",
    waitMinutes: 3,
    emoji: "⚡",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop&q=80",
    rating: 4.5,
    reviewCount: 189,
    priceLevel: 1,
    cuisine: "Caffè · Panini",
    menu: [
      { id: "p1", name: "Espresso", price: 1.1, category: "caffè" },
      { id: "p2", name: "Cappuccino XL", price: 1.7, category: "caffè" },
      { id: "p3", name: "Americano", price: 1.4, category: "caffè" },
      { id: "p4", name: "Brioche vuota", price: 1.2, category: "colazione" },
      { id: "p5", name: "Brioche crema", price: 1.6, category: "colazione" },
      { id: "p6", name: "Acqua 50cl", price: 1.0, category: "bevande" },
      { id: "p7", name: "Toast prosciutto & fontina", price: 4.0, category: "panini" },
      { id: "p8", name: "Piadina crudo", price: 5.0, category: "panini" },
    ],
  },
  {
    id: "cordusio",
    name: "Caffè Cordusio",
    tagline: "Centro storico — Milano",
    address: "Piazza Cordusio, 1 — Milano",
    waitMinutes: 4,
    emoji: "☕",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop&q=80",
    rating: 4.6,
    reviewCount: 342,
    priceLevel: 2,
    cuisine: "Caffè · Dolci",
    menu: [
      { id: "c1", name: "Espresso", price: 1.5, category: "caffè" },
      { id: "c2", name: "Marocchino", price: 2.2, category: "caffè" },
      { id: "c3", name: "Cappuccino", price: 2.0, category: "caffè" },
      { id: "c4", name: "Croissant burro", price: 2.0, category: "colazione" },
      { id: "c5", name: "Torta del giorno", price: 3.5, category: "colazione" },
      { id: "c6", name: "Succo detox", price: 4.0, category: "bevande" },
    ],
  },
  {
    id: "brera",
    name: "Bottega Brera",
    tagline: "Quartiere Brera — Milano",
    address: "Via Brera, 15 — Milano",
    waitMinutes: 5,
    emoji: "🥐",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e736b0e98?w=800&h=500&fit=crop&q=80",
    rating: 4.8,
    reviewCount: 276,
    priceLevel: 2,
    cuisine: "Brunch · Specialty coffee",
    menu: [
      { id: "b1", name: "Espresso", price: 1.6, category: "caffè" },
      { id: "b2", name: "Flat white", price: 2.8, category: "caffè" },
      { id: "b3", name: "Caffè freddo", price: 2.5, category: "caffè" },
      { id: "b4", name: "Bombolone", price: 2.2, category: "colazione" },
      { id: "b5", name: "Focaccia olive", price: 3.0, category: "panini" },
      { id: "b6", name: "Panino salmone", price: 7.5, category: "panini" },
      { id: "b7", name: "Tè freddo pesca", price: 3.0, category: "bevande" },
    ],
  },
];

export function getBarById(id: string): Bar | undefined {
  return BARS.find((b) => b.id === id);
}

export function formatPrice(eur: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(eur);
}

export function priceLevelLabel(level: Bar["priceLevel"]): string {
  return "€".repeat(level);
}
