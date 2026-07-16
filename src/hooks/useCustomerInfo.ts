"use client";

import { useEffect, useState } from "react";
import { CustomerForm, emptyCustomer } from "@/lib/order";

const STORAGE_KEY = "gp-core-customer";

/**
 * Persists the buyer's contact data in localStorage so a returning client
 * doesn't have to retype it on every order. Mirrors the cart persistence
 * pattern used in CartContext.
 */
export function useCustomerInfo() {
  const [form, setForm] = useState<CustomerForm>(emptyCustomer);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only available client-side, so hydration must happen in an effect
      if (raw) setForm({ ...emptyCustomer, ...JSON.parse(raw) });
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form, hydrated]);

  return { form, setForm };
}
