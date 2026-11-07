"use client";

import { useState } from "react";
import { localCurrencies } from "@/lib/destinations";
import { useQuote } from "@/lib/useQuote";
import { RecipientPicker, inputClass, type RecipientPayload } from "@/components/demo/RecipientPicker";
import { PayoutTracker } from "@/components/demo/PayoutTracker";
import type { PayoutRecord } from "@/lib/payout-store";

export function PayAbroadForm() {
  const [payerFirstName, setPayerFirstName] = useState("");
  const [payerLastName, setPayerLastName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");

  const [haveCurrency, setHaveCurrency] = useState("NGN");
  const [amount, setAmount] = useState("20000");

  const [recipient, setRecipient] = useState<RecipientPayload | null>(null);
  const { quote, error: quoteError } = useQuote(haveCurrency, recipient?.toCurrencyId ?? null, amount);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!recipient) return;
    setSubmitting(true);
    setSubmitError(null);
    setResult(null);

    try {
      const res = await fetch("/api/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_first_name: payerFirstName,
          sender_last_name: payerLastName,
          sender_email: payerEmail,
          from_amount: Number(amount),
          from_currency_id: haveCurrency,
          to_currency_id: recipient.toCurrencyId,
          method: recipient.method,
          ...recipient.fields,
        }),
      });
      const data = await res.json();
      if (!res.ok) setSubmitError(data.error ?? "Payment failed");
      else setResult(data);
    } catch (err) {
      setSubmitError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (result != null) {
    const resObj = result as { data?: PayoutRecord; payout?: PayoutRecord };
    const record = resObj.data || resObj.payout || (result as PayoutRecord);
    return (
      <PayoutTracker
        initialRecord={record}
        onReset={() => {
          setResult(null);
          setSubmitError(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Traveling and only have local currency on you? Pay a seller directly
        in whatever you&rsquo;re holding — they get their own currency in
        their bank account or mobile money, no manual conversion needed.
      </p>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">You are</legend>
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="First name" value={payerFirstName} onChange={(e) => setPayerFirstName(e.target.value)} className={inputClass} />
          <input required placeholder="Last name" value={payerLastName} onChange={(e) => setPayerLastName(e.target.value)} className={inputClass} />
        </div>
        <input required type="email" placeholder="Email" value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} className={inputClass} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">You have</legend>
        <div className="flex flex-wrap gap-2">
          {localCurrencies.map((currency) => (
            <button
              key={currency.code}
              type="button"
              onClick={() => setHaveCurrency(currency.code)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                haveCurrency === currency.code
                  ? "bg-foreground text-background"
                  : "border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              {currency.flag} {currency.label}
            </button>
          ))}
        </div>
        <input required type="number" min="1" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
        {quoteError && <p className="text-sm text-red-600 dark:text-red-400">{quoteError}</p>}
        {quote && recipient && (
          <div className="rounded 2xl border border-zinc-200 bg-white p-3.5 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Fees: <span className="font-medium text-black dark:text-zinc-50">{quote.total_fees}</span>
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              Seller receives:{" "}
              <span className="font-medium text-black dark:text-zinc-50">
                {recipient.destination.flag} {quote.recipient_gets.toLocaleString()} {recipient.destination.currencyCode}
              </span>
            </p>
          </div>
        )}
      </fieldset>

      <RecipientPicker label="Seller is in" onChange={setRecipient} />

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:hover:bg-zinc-200"
      >
        {submitting ? "Processing Settlement…" : "Pay Seller & Track Status →"}
      </button>

      {submitError && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{submitError}</p>
      )}
    </form>
  );
}
