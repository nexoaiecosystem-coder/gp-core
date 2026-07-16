"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartItem } from "@/lib/types";
import { products } from "@/lib/data";
import { usePriceOverrides } from "./PriceOverridesContext";

type ToastInfo = { name: string; quantity: number; key: number } | null;

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, quantity: number, productName?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setNote: (productId: string, note: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  lastAdded: ToastInfo;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "gp-core-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { getEffectivePrice } = usePriceOverrides();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<ToastInfo>(null);

  // Load from localStorage on mount (client-only, runs once before first paint of cart UI)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only available client-side, so hydration must happen in an effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (productId: string, quantity: number, productName?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });
    if (productName) {
      const key = Date.now();
      setLastAdded({ name: productName, quantity, key });
      window.setTimeout(() => {
        setLastAdded((cur) => (cur?.key === key ? null : cur));
      }, 2600);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const setNote = (productId: string, note: string) => {
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, note } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () =>
      items.reduce((sum, i) => {
        const product = products.find((p) => p.id === i.productId);
        return sum + (product ? getEffectivePrice(product) * i.quantity : 0);
      }, 0),
    [items, getEffectivePrice]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        setNote,
        clearCart,
        totalItems,
        totalAmount,
        lastAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
