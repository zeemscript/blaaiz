"use client";

import { useState } from "react";
import { fundingAssets } from "@/lib/destinations";
import { useQuote } from "@/lib/useQuote";
import { RecipientPicker, inputClass, type RecipientPayload } from "@/components/demo/RecipientPicker";
import { PayoutTracker } from "@/components/demo/PayoutTracker";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import type { PayoutRecord } from "@/lib/payout-store";

export function InstantPayoutForm() {
  const [senderFirstName, setSenderFirstName] = useState("");
  const [senderLastName, setSenderLastName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  const [fromAsset, setFromAsset] = useState<"USD" | "USDT" | "USDC">("USDT");
  const [amount, setAmount] = useState("500");

  const [recipient, setRecipient] = useState<RecipientPayload | null>(null);
  const { quote, error: quoteError } = useQuote(fromAsset, recipient?.toCurrencyId ?? null, amount);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function applyPreset(type: "nigeria" | "kenya" | "ghana") {
    if (type === "nigeria") {
      setSenderFirstName("Alex");
      setSenderLastName("Morrison");
      setSenderEmail("alex.client@designstudio.com");
      setFromAsset("USDT");
      setAmount("500");
    } else if (type === "kenya") {
      setSenderFirstName("Sarah");
      setSenderLastName("Jenkins");
      setSenderEmail("sarah.j@globalremote.io");
      setFromAsset("USD");
      setAmount("250");
    } else {
      setSenderFirstName("David");
      setSenderLastName("Kramer");
      setSenderEmail("david.k@contractors.org");
      setFromAsset("USDC");
      setAmount("150");
    }
  }

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
      {/* 1-Click Test Presets */}
      <div className="flex flex-col gap-2 rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-orange-500/5 p-3.5 dark:border-violet-500/30">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
            <HugeiconsIcon icon={SparklesIcon} size={14} />
            Quick Test Presets (1-Click Auto-Fill)
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
            Blaaiz RaaS
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset("nigeria")}
            className="rounded-lg border border-violet-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-800 transition-colors hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-violet-950"
          >
            🇳🇬 500 USDT → Nigeria Bank
          </button>
          <button
            type="button"
            onClick={() => applyPreset("kenya")}
            className="rounded-lg border border-violet-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-800 transition-colors hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-violet-950"
          >
            🇰🇪 $250 USD → Kenya M-Pesa
          </button>
          <button
            type="button"
            onClick={() => applyPreset("ghana")}
            className="rounded-lg border border-violet-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-800 transition-colors hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-violet-950"
          >
            🇬🇭 150 USDC → Ghana MoMo
          </button>
        </div>
      </div>

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
          <div className="rounded-2xl border border-zinc-200 bg-white p-3.5 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Blaaiz FX Quote</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Locked</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Total fees:</span>
              <span className="font-medium text-black dark:text-zinc-50">{quote.total_fees}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Recipient gets:</span>
              <span className="font-bold text-black dark:text-zinc-50">
                {recipient.destination.flag} {quote.recipient_gets.toLocaleString()} {recipient.destination.currencyCode}
              </span>
            </div>
          </div>
        )}
      </fieldset>

      <RecipientPicker label="They receive" onChange={setRecipient} />

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:hover:bg-zinc-200"
      >
        {submitting ? "Processing Blaaiz Payout…" : "Send Payout & Track Status →"}
      </button>

      {submitError && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{submitError}</p>
      )}
    </form>
  );
}
