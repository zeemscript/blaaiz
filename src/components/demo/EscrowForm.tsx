"use client";

import { useEffect, useState } from "react";
import { cryptoNetworkFallback } from "@/lib/destinations";
import { useQuote } from "@/lib/useQuote";
import { RecipientPicker, inputClass, type RecipientPayload } from "@/components/demo/RecipientPicker";
import type { Escrow } from "@/lib/escrow-store";

const statusCopy: Record<Escrow["status"], string> = {
  pending_funding: "Waiting for funds",
  funded: "Funded — ready to release",
  released: "Released to freelancer",
  failed: "Failed",
};

export function EscrowForm() {
  const [employerFirstName, setEmployerFirstName] = useState("");
  const [employerLastName, setEmployerLastName] = useState("");
  const [employerEmail, setEmployerEmail] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [fundingAsset, setFundingAsset] = useState<"USDT" | "USDC">("USDT");
  const [cryptoNetworks, setCryptoNetworks] = useState(cryptoNetworkFallback);
  const [cryptoNetwork, setCryptoNetwork] = useState(cryptoNetworkFallback[0].id);
  const [fundingAmount, setFundingAmount] = useState("500");

  useEffect(() => {
    fetch("/api/crypto-networks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.networks) && data.networks.length > 0) {
          const list = data.networks.map(
            (n: { id?: string; network?: string; name?: string }) => ({
              id: n.id ?? n.network ?? String(n),
              label: n.name ?? n.network ?? String(n),
            })
          );
          setCryptoNetworks(list);
          setCryptoNetwork(list[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const [freelancerFirstName, setFreelancerFirstName] = useState("");
  const [freelancerLastName, setFreelancerLastName] = useState("");
  const [freelancerEmail, setFreelancerEmail] = useState("");

  const [recipient, setRecipient] = useState<RecipientPayload | null>(null);
  const { quote, error: quoteError } = useQuote(fundingAsset, recipient?.toCurrencyId ?? null, fundingAmount);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [escrow, setEscrow] = useState<Escrow | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!recipient) return;
    setCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerFirstName,
          employerLastName,
          employerEmail,
          jobDescription,
          fundingAsset,
          fundingAmount: Number(fundingAmount),
          cryptoNetwork,
          freelancerFirstName,
          freelancerLastName,
          freelancerEmail,
          payoutMethod: recipient.method,
          toCurrencyId: recipient.toCurrencyId,
          payoutFields: recipient.fields,
        }),
      });
      const data = await res.json();
      if (!res.ok) setCreateError(data.error ?? "Could not create escrow");
      else setEscrow(data);
    } catch (err) {
      setCreateError(String(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleConfirmFunding() {
    if (!escrow) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/escrow/${escrow.id}/confirm-funding`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) setActionError(data.error ?? "Could not confirm funding");
      else setEscrow(data);
    } catch (err) {
      setActionError(String(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRelease() {
    if (!escrow) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/escrow/${escrow.id}/release`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) setActionError(data.error ?? "Could not release payment");
      else setEscrow(data);
    } catch (err) {
      setActionError(String(err));
    } finally {
      setActionLoading(false);
    }
  }

  if (escrow) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Escrow {escrow.id.slice(0, 8)}
          </h2>
          <span className="rounded-full bg-black/[.06] px-3 py-1 text-xs font-medium text-black dark:bg-white/[.1] dark:text-zinc-50">
            {statusCopy[escrow.status]}
          </span>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {escrow.employerFirstName} {escrow.employerLastName} is paying{" "}
          {escrow.freelancerFirstName} {escrow.freelancerLastName}{" "}
          {escrow.fundingAmount} {escrow.fundingAsset}
          {escrow.jobDescription ? ` for "${escrow.jobDescription}"` : ""}.
        </p>

        {escrow.status === "pending_funding" && (
          <>
            {escrow.error && <p className="text-xs text-red-600 dark:text-red-400">{escrow.error}</p>}
            {escrow.depositDetails != null && (
              <pre className="overflow-x-auto rounded bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                {JSON.stringify(escrow.depositDetails, null, 2)}
              </pre>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              Send {escrow.fundingAmount} {escrow.fundingAsset} on {escrow.cryptoNetwork} to
              the address above. Once confirmed on-chain (via Blaaiz&rsquo;s webhook in
              production), funds are held until you release them below.
            </p>
            <button
              type="button"
              onClick={handleConfirmFunding}
              disabled={actionLoading}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-white/[.06]"
            >
              {actionLoading ? "Confirming…" : "I've sent the funds"}
            </button>
          </>
        )}

        {escrow.status === "funded" && (
          <button
            type="button"
            onClick={handleRelease}
            disabled={actionLoading}
            className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            {actionLoading ? "Releasing…" : "Release payment to freelancer"}
          </button>
        )}

        {escrow.status === "released" && (
          <>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Payment released.</p>
            <pre className="overflow-x-auto rounded bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {JSON.stringify(escrow.payoutResult, null, 2)}
            </pre>
          </>
        )}

        {escrow.status === "failed" && escrow.error && (
          <p className="rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{escrow.error}</p>
        )}

        {actionError && (
          <p className="rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{actionError}</p>
        )}

        {(escrow.status === "released" || escrow.status === "failed") && (
          <button
            type="button"
            onClick={() => setEscrow(null)}
            className="text-sm text-zinc-500 underline hover:text-black dark:text-zinc-500 dark:hover:text-zinc-50"
          >
            Start another escrow
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Employer</legend>
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="First name" value={employerFirstName} onChange={(e) => setEmployerFirstName(e.target.value)} className={inputClass} />
          <input required placeholder="Last name" value={employerLastName} onChange={(e) => setEmployerLastName(e.target.value)} className={inputClass} />
        </div>
        <input required type="email" placeholder="Email" value={employerEmail} onChange={(e) => setEmployerEmail(e.target.value)} className={inputClass} />
        <input placeholder="Job description (optional)" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className={inputClass} />
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Fund the escrow</legend>
        <div className="flex gap-2">
          {(["USDT", "USDC"] as const).map((token) => (
            <button
              key={token}
              type="button"
              onClick={() => setFundingAsset(token)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                fundingAsset === token
                  ? "bg-foreground text-background"
                  : "border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              {token}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={cryptoNetwork} onChange={(e) => setCryptoNetwork(e.target.value)} className={inputClass}>
            {cryptoNetworks.map((n) => (
              <option key={n.id} value={n.id}>{n.label}</option>
            ))}
          </select>
          <input required type="number" min="1" step="0.01" placeholder="Amount" value={fundingAmount} onChange={(e) => setFundingAmount(e.target.value)} className={inputClass} />
        </div>
        {quoteError && <p className="text-sm text-red-600 dark:text-red-400">{quoteError}</p>}
        {quote && recipient && (
          <div className="rounded border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Fee: <span className="font-medium text-black dark:text-zinc-50">{quote.total_fees}</span>
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              Freelancer receives:{" "}
              <span className="font-medium text-black dark:text-zinc-50">
                {recipient.destination.flag} {quote.recipient_gets.toLocaleString()} {recipient.destination.currencyCode}
              </span>
            </p>
          </div>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Freelancer</legend>
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="First name" value={freelancerFirstName} onChange={(e) => setFreelancerFirstName(e.target.value)} className={inputClass} />
          <input required placeholder="Last name" value={freelancerLastName} onChange={(e) => setFreelancerLastName(e.target.value)} className={inputClass} />
        </div>
        <input required type="email" placeholder="Email" value={freelancerEmail} onChange={(e) => setFreelancerEmail(e.target.value)} className={inputClass} />
      </fieldset>

      <RecipientPicker label="They receive" onChange={setRecipient} />

      {createError && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{createError}</p>
      )}

      <button
        type="submit"
        disabled={creating}
        className="mt-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        {creating ? "Creating escrow…" : "Create escrow & get deposit address"}
      </button>
    </form>
  );
}
