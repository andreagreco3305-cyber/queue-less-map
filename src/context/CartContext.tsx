"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CartLine, PickupSelection } from "@/lib/cart/types";
import type { MenuItem } from "@/data/bars";

const STORAGE_KEY = "queueless_cart";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  barId: string | null;
  pickup: PickupSelection | null;
  barSwitchPrompt: string | null;
  addItem: (barId: string, barName: string, item: MenuItem) => void;
  confirmBarSwitch: () => void;
  cancelBarSwitch: () => void;
  removeLine: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setPickup: (pickup: PickupSelection | null) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): { lines: CartLine[]; pickup: PickupSelection | null } {
  if (typeof window === "undefined") return { lines: [], pickup: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lines: [], pickup: null };
    const parsed = JSON.parse(raw) as {
      lines?: CartLine[];
      pickup?: PickupSelection | null;
    };
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      pickup: parsed.pickup ?? null,
    };
  } catch {
    return { lines: [], pickup: null };
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [pickup, setPickupState] = useState<PickupSelection | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [barSwitchPrompt, setBarSwitchPrompt] = useState<string | null>(null);
  const pendingAdd = useRef<{
    barId: string;
    barName: string;
    item: MenuItem;
  } | null>(null);

  useEffect(() => {
    const data = loadCart();
    setLines(data.lines);
    setPickupState(data.pickup);
    setHydrated(true);
  }, []);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lines, pickup }),
      );
    }, 200);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [lines, pickup, hydrated]);

  const barId = lines[0]?.barId ?? null;

  const applyAdd = useCallback(
    (nextBarId: string, barName: string, item: MenuItem) => {
      setLines((prev) => {
        const base = prev.length > 0 && prev[0].barId !== nextBarId ? [] : prev;
        if (base !== prev) setPickupState(null);

        const existing = base.find((l) => l.itemId === item.id);
        if (existing) {
          return base.map((l) =>
            l.itemId === item.id
              ? { ...l, quantity: l.quantity + 1 }
              : l,
          );
        }
        return [
          ...base,
          {
            barId: nextBarId,
            barName,
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            quantity: 1,
          },
        ];
      });
    },
    [],
  );

  const addItem = useCallback(
    (nextBarId: string, barName: string, item: MenuItem) => {
      setLines((prev) => {
        if (prev.length > 0 && prev[0].barId !== nextBarId) {
          pendingAdd.current = { barId: nextBarId, barName, item };
          setBarSwitchPrompt(barName);
          return prev;
        }

        const existing = prev.find((l) => l.itemId === item.id);
        if (existing) {
          return prev.map((l) =>
            l.itemId === item.id
              ? { ...l, quantity: l.quantity + 1 }
              : l,
          );
        }

        return [
          ...prev,
          {
            barId: nextBarId,
            barName,
            itemId: item.id,
            itemName: item.name,
            price: item.price,
            quantity: 1,
          },
        ];
      });
    },
    [],
  );

  const confirmBarSwitch = useCallback(() => {
    const pending = pendingAdd.current;
    if (!pending) return;
    setBarSwitchPrompt(null);
    setPickupState(null);
    pendingAdd.current = null;
    applyAdd(pending.barId, pending.barName, pending.item);
  }, [applyAdd]);

  const cancelBarSwitch = useCallback(() => {
    pendingAdd.current = null;
    setBarSwitchPrompt(null);
  }, []);

  const removeLine = useCallback((itemId: string) => {
    setLines((prev) => {
      const next = prev.filter((l) => l.itemId !== itemId);
      if (next.length === 0) setPickupState(null);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeLine(itemId);
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.itemId === itemId ? { ...l, quantity } : l)),
    );
  }, []);

  const setPickup = useCallback((next: PickupSelection | null) => {
    setPickupState(next);
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setPickupState(null);
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      barId,
      pickup,
      barSwitchPrompt,
      addItem,
      confirmBarSwitch,
      cancelBarSwitch,
      removeLine,
      updateQuantity,
      setPickup,
      clearCart,
    }),
    [
      lines,
      itemCount,
      subtotal,
      barId,
      pickup,
      barSwitchPrompt,
      addItem,
      confirmBarSwitch,
      cancelBarSwitch,
      removeLine,
      updateQuantity,
      setPickup,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
