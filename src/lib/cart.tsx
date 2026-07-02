import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Book } from "./books";

type CartItem = { book: Book; qty: number };
type CartCtx = {
  items: CartItem[];
  add: (book: Book) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("bookcycle-cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("bookcycle-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartCtx>(() => ({
    items,
    add: (book) =>
      setItems((prev) => {
        const found = prev.find((i) => i.book.id === book.id);
        if (found) return prev.map((i) => (i.book.id === book.id ? { ...i, qty: i.qty + 1 } : i));
        return [...prev, { book, qty: 1 }];
      }),
    remove: (id) => setItems((prev) => prev.filter((i) => i.book.id !== id)),
    clear: () => setItems([]),
    count: items.reduce((n, i) => n + i.qty, 0),
    total: items.reduce((n, i) => n + i.qty * i.book.price, 0),
  }), [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
