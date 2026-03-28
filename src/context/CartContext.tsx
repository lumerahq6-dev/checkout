"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/data/products";

const STORAGE_KEY = "kaimatsu-cart";

export type CartLine = {
  slug: string;
  title: string;
  paddlePriceId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  setQty: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const priceId = product.paddlePriceId;
    if (!priceId) return;
    setItems((prev) => {
      const existing = prev.find((l) => l.slug === product.slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === product.slug
            ? { ...l, quantity: Math.min(99, l.quantity + quantity) }
            : l
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          title: product.title,
          paddlePriceId: priceId,
          quantity,
          unitPrice: product.price,
          currency: product.currency,
        },
      ];
    });
  }, []);

  const setQty = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((l) => l.slug !== slug));
      return;
    }
    const q = Math.min(99, quantity);
    setItems((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, quantity: q } : l))
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((n, l) => n + l.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addItem,
      setQty,
      removeItem,
      clear,
    }),
    [items, itemCount, addItem, setQty, removeItem, clear]
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
