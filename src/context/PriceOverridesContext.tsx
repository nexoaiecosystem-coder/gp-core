"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/lib/types";

type Overrides = Record<string, number>;

type PriceOverridesContextValue = {
  overrides: Overrides;
  getEffectivePrice: (product: Product) => number;
  setOverride: (productId: string, price: number) => void;
  resetOverride: (productId: string) => void;
  resetAll: () => void;
};

const PriceOverridesContext = createContext<PriceOverridesContextValue | undefined>(
  undefined
);
const STORAGE_KEY = "gp-core-price-overrides";

export function PriceOverridesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only available client-side, so hydration must happen in an effect
      if (raw) setOverrides(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }, [overrides, hydrated]);

  function getEffectivePrice(product: Product) {
    return overrides[product.id] ?? product.price;
  }

  function setOverride(productId: string, price: number) {
    setOverrides((prev) => ({ ...prev, [productId]: price }));
  }

  function resetOverride(productId: string) {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }

  function resetAll() {
    setOverrides({});
  }

  return (
    <PriceOverridesContext.Provider
      value={{ overrides, getEffectivePrice, setOverride, resetOverride, resetAll }}
    >
      {children}
    </PriceOverridesContext.Provider>
  );
}

export function usePriceOverrides() {
  const ctx = useContext(PriceOverridesContext);
  if (!ctx)
    throw new Error("usePriceOverrides debe usarse dentro de <PriceOverridesProvider>");
  return ctx;
}
