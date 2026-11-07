"use client";

import { useState } from "react";
import { fundingAssets } from "@/lib/destinations";
import { useQuote } from "@/lib/useQuote";
import { RecipientPicker, inputClass, type RecipientPayload } from "@/components/demo/RecipientPicker";

export function InstantPayoutForm() {
  const [senderFirstName, setSenderFirstName] = useState("");
  const [senderLastName, setSenderLastName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  const [fromAsset, setFromAsset] = useState<"USD" | "USDT" | "USDC">("USD");
  const [amount, setAmount] = useState("500");

  const [recipient, setRecipient] = useState<RecipientPayload | null>(null);
  const { quote, error: quoteError } = useQuote(fromAsset, recipient?.toCurrencyId ?? null, amount);

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
          sender_first_name: senderFirstName,
          sender_last_name: senderLastName,
          sender_email: senderEmail,
          from_amount: Number(amount),
          from_currency_id: fromAsset,
          to_currency_id: recipient.toCurrencyId,
          method: recipient.method,
          ...recipient.fields,
        }),
      });
      const data = await res.json();
      if (!res.ok) setSubmitError(data.error ?? "Payout failed");
      else setResult(data);
    } catch (err) {
      setSubmitError(String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sender</legend>
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="First name" value={senderFirstName} onChange={(e) => setSenderFirstName(e.target.value)} className={inputClass} />
          <input required placeholder="Last name" value={senderLastName} onChange={(e) => setSenderLastName(e.target.value)} className={inputClass} />
        </div>
        <input required type="email" placeholder="Email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} className={inputClass} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Pay from</legend>
        <div className="flex gap-2">
          {fundingAssets.map((asset) => (
            <button
              key={asset.code}
              type="button"
              onClick={() => setFromAsset(asset.code as "USD" | "USDT" | "USDC")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                fromAsset === asset.code
                  ? "bg-foreground text-background"
                  : "border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              {asset.flag} {asset.label}
            </button>
          ))}
        </div>
        <input required type="number" min="1" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
        {quoteError && <p className="text-sm text-red-600 dark:text-red-400">{quoteError}</p>}
        {quote && recipient && (
          <div className="rounded border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Fees: <span className="font-medium text-black dark:text-zinc-50">{quote.total_fees}</span>
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              Recipient gets:{" "}
              <span className="font-medium text-black dark:text-zinc-50">
                {recipient.destination.flag} {quote.recipient_gets.toLocaleString()} {recipient.destination.currencyCode}
              </span>
            </p>
          </div>
        )}
      </fieldset>

      <RecipientPicker label="They receive" onChange={setRecipient} />

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {submitting ? "Sending…" : "Send payout"}
      </button>

      {submitError && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{submitError}</p>
      )}
      {result != null && (
        <pre className="overflow-x-auto rounded bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </form>
  );
}
