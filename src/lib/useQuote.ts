"use client";

import { useEffect, useState } from "react";

export type Quote = {
  you_send: number;
  recipient_gets: number;
  total_fees: number;
};

export function useQuote(
  fromCurrencyId: string | null,
  toCurrencyId: string | null,
  amount: string
) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const value = Number(amount);

    const timeout = setTimeout(() => {
      if (!value || value <= 0 || !fromCurrencyId || !toCurrencyId) {
        setQuote(null);
        setError(null);
        return;
      }

      fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_currency_id: fromCurrencyId,
          to_currency_id: toCurrencyId,
          from_amount: value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setQuote(null);
          } else {
            setError(null);
            setQuote(data);
          }
        })
        .catch((err) => setError(String(err)));
    }, 400);

    return () => clearTimeout(timeout);
  }, [fromCurrencyId, toCurrencyId, amount]);

  return { quote, error };
}
