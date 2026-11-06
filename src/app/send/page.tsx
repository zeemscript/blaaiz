"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  cryptoNetworkFallback,
  destinations,
  fundingAssets,
  type DestinationId,
} from "@/lib/destinations";

type Bank = { id: string; name: string; code: string; country: string };
type MomoOperator = { id: number; name: string; code: string; country_id: number };
type Currency = { id: string; code: string; name: string };

type Quote = {
  you_send: number;
  recipient_gets: number;
  total_fees: number;
};

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export default function Send() {
  // --- Step 1: fund with crypto (optional, independent demo of collections.initiateCrypto) ---
  const [cryptoToken, setCryptoToken] = useState<"USDT" | "USDC">("USDT");
  const [cryptoNetworks, setCryptoNetworks] = useState(cryptoNetworkFallback);
  const [cryptoNetwork, setCryptoNetwork] = useState(cryptoNetworkFallback[0].id);
  const [cryptoAmount, setCryptoAmount] = useState("200");
  const [cryptoDeposit, setCryptoDeposit] = useState<Record<string, unknown> | null>(null);
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const [cryptoLoading, setCryptoLoading] = useState(false);

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
      .catch(() => {
        // keep the static fallback list
      });
  }, []);

  async function handleGetDepositAddress() {
    setCryptoLoading(true);
    setCryptoError(null);
    setCryptoDeposit(null);
    try {
      const res = await fetch("/api/crypto-collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(cryptoAmount),
          network: cryptoNetwork,
          token: cryptoToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) setCryptoError(data.error ?? "Could not generate a deposit address");
      else setCryptoDeposit(data);
    } catch (err) {
      setCryptoError(String(err));
    } finally {
      setCryptoLoading(false);
    }
  }

  // --- Step 2: send a payout, from any currency, to any supported destination ---
  const [fromAsset, setFromAsset] = useState<"USD" | "USDT" | "USDC">("USD");
  const [amount, setAmount] = useState("500");

  const [destinationId, setDestinationId] = useState<DestinationId>("NGN");
  const destination = destinations.find((d) => d.id === destinationId)!;

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  useEffect(() => {
    fetch("/api/currencies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.currencies)) setCurrencies(data.currencies);
      })
      .catch(() => {});
  }, []);

  const momoCurrencyId =
    currencies.find((c) => c.code === destination.currencyCode)?.id ?? null;

  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksError, setBanksError] = useState<string | null>(null);
  const [bankId, setBankId] = useState("");

  useEffect(() => {
    if (destination.method !== "bank_transfer") return;

    fetch(`/api/banks?country=${destination.bankCountry}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setBanksError(data.error);
        else {
          setBanksError(null);
          setBanks(data.banks ?? []);
        }
      })
      .catch((err) => setBanksError(String(err)));
  }, [destination.method, destination.bankCountry]);

  const [operators, setOperators] = useState<MomoOperator[]>([]);
  const [operatorsError, setOperatorsError] = useState<string | null>(null);
  const [operatorId, setOperatorId] = useState("");

  useEffect(() => {
    if (destination.method !== "mobile_money" || !momoCurrencyId) return;

    fetch(`/api/momo-operators?currency_id=${momoCurrencyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setOperatorsError(data.error);
        else {
          setOperatorsError(null);
          setOperators(data.operators ?? []);
        }
      })
      .catch((err) => setOperatorsError(String(err)));
  }, [destination.method, momoCurrencyId]);

  // Recipient fields — only the ones relevant to the active destination are sent.
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");

  const [senderFirstName, setSenderFirstName] = useState("");
  const [senderLastName, setSenderLastName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  useEffect(() => {
    const value = Number(amount);
    const toCurrencyId =
      destination.method === "mobile_money"
        ? momoCurrencyId
        : destination.currencyCode;

    const timeout = setTimeout(() => {
      if (!value || value <= 0 || !toCurrencyId) {
        setQuote(null);
        setQuoteError(null);
        return;
      }

      fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_currency_id: fromAsset,
          to_currency_id: toCurrencyId,
          from_amount: value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setQuoteError(data.error);
            setQuote(null);
          } else {
            setQuoteError(null);
            setQuote(data);
          }
        })
        .catch((err) => setQuoteError(String(err)));
    }, 400);

    return () => clearTimeout(timeout);
  }, [amount, fromAsset, destination.method, destination.currencyCode, momoCurrencyId]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setResult(null);

    const base = {
      sender_first_name: senderFirstName,
      sender_last_name: senderLastName,
      sender_email: senderEmail,
      from_amount: Number(amount),
      from_currency_id: fromAsset,
      method: destination.method,
    };

    let payload: Record<string, unknown>;

    if (destination.method === "bank_transfer" && destination.id === "NGN") {
      payload = { ...base, to_currency_id: "NGN", bank_id: bankId, account_number: accountNumber, account_name: accountName };
    } else if (destination.method === "bank_transfer") {
      payload = { ...base, to_currency_id: destination.currencyCode, sort_code: sortCode, account_number: accountNumber, account_name: accountName };
    } else if (destination.method === "mobile_money") {
      payload = { ...base, to_currency_id: momoCurrencyId, phone_number: phoneNumber, mobile_money_operator_id: operatorId, account_name: accountName };
    } else {
      payload = {
        ...base,
        to_currency_id: "USD",
        type: "individual",
        account_number: accountNumber,
        account_name: accountName,
        account_type: accountType,
        bank_name: bankName,
        routing_number: routingNumber,
      };
    }

    try {
      const res = await fetch("/api/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-10 px-6 py-16">
        <div>
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-zinc-50"
          >
            ← Beam
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-black dark:text-zinc-50">
            Crypto in. Cash out, anywhere.
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Fund with USDT/USDC, or pay out directly in USD — the recipient
            gets bank transfer, mobile money, or ACH in their own currency.
            Built on the Blaaiz API.
          </p>
        </div>

        {/* Step 1 — fund with crypto (optional, independent demo of the collection API) */}
        <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Step 1 · Fund with crypto (optional)
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Generates a real deposit address via Blaaiz&rsquo;s crypto
            collection API. In production this credits your business wallet;
            it&rsquo;s independent of the payout below.
          </p>
          <div className="flex gap-2">
            {(["USDT", "USDC"] as const).map((token) => (
              <button
                key={token}
                type="button"
                onClick={() => setCryptoToken(token)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  cryptoToken === token
                    ? "bg-foreground text-background"
                    : "border border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                }`}
              >
                {token}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={cryptoNetwork}
              onChange={(e) => setCryptoNetwork(e.target.value)}
              className={inputClass}
            >
              {cryptoNetworks.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={cryptoAmount}
              onChange={(e) => setCryptoAmount(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={handleGetDepositAddress}
            disabled={cryptoLoading}
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-white/[.06]"
          >
            {cryptoLoading ? "Generating…" : "Get deposit address"}
          </button>
          {cryptoError && (
            <p className="text-xs text-red-600 dark:text-red-400">{cryptoError}</p>
          )}
          {cryptoDeposit != null && (
            <pre className="overflow-x-auto rounded bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              {JSON.stringify(cryptoDeposit, null, 2)}
            </pre>
          )}
        </section>

        {/* Step 2 — send the payout */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Step 2 · Send a payout
          </h2>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Sender
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <input required placeholder="First name" value={senderFirstName} onChange={(e) => setSenderFirstName(e.target.value)} className={inputClass} />
              <input required placeholder="Last name" value={senderLastName} onChange={(e) => setSenderLastName(e.target.value)} className={inputClass} />
            </div>
            <input required type="email" placeholder="Email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} className={inputClass} />
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Pay from
            </legend>
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
            {quote && (
              <div className="rounded border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">
                  Fees: <span className="font-medium text-black dark:text-zinc-50">{quote.total_fees}</span>
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Recipient gets:{" "}
                  <span className="font-medium text-black dark:text-zinc-50">
                    {destination.flag} {quote.recipient_gets.toLocaleString()} {destination.currencyCode}
                  </span>
                </p>
              </div>
            )}
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              They receive
            </legend>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value as DestinationId)}
              className={inputClass}
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.flag} {d.label}
                </option>
              ))}
            </select>

            {destination.method === "bank_transfer" && (
              <>
                {banksError && (
                  <p className="text-xs text-red-600 dark:text-red-400">Could not load banks: {banksError}</p>
                )}
                {destination.id === "NGN" ? (
                  <select required value={bankId} onChange={(e) => setBankId(e.target.value)} className={inputClass}>
                    <option value="">Select bank</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>{bank.name}</option>
                    ))}
                  </select>
                ) : (
                  <input required placeholder="Sort code" value={sortCode} onChange={(e) => setSortCode(e.target.value)} className={inputClass} />
                )}
                <input required placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className={inputClass} />
                <input placeholder="Account name" value={accountName} onChange={(e) => setAccountName(e.target.value)} className={inputClass} />
              </>
            )}

            {destination.method === "mobile_money" && (
              <>
                {operatorsError && (
                  <p className="text-xs text-red-600 dark:text-red-400">Could not load operators: {operatorsError}</p>
                )}
                <select required value={operatorId} onChange={(e) => setOperatorId(e.target.value)} className={inputClass}>
                  <option value="">Select mobile money operator</option>
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>{op.name}</option>
                  ))}
                </select>
                <input required placeholder="Phone number (+254…)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} />
                <input required placeholder="Account name" value={accountName} onChange={(e) => setAccountName(e.target.value)} className={inputClass} />
              </>
            )}

            {destination.method === "ach" && (
              <>
                <input required placeholder="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className={inputClass} />
                <input required placeholder="Routing number" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} className={inputClass} />
                <input required placeholder="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} className={inputClass} />
                <input required placeholder="Account name" value={accountName} onChange={(e) => setAccountName(e.target.value)} className={inputClass} />
                <select value={accountType} onChange={(e) => setAccountType(e.target.value as "checking" | "savings")} className={inputClass}>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </select>
              </>
            )}
          </fieldset>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            {submitting ? "Sending…" : "Send payout"}
          </button>
        </form>

        {submitError && (
          <p className="rounded bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {submitError}
          </p>
        )}

        {result != null && (
          <pre className="overflow-x-auto rounded bg-zinc-100 p-3 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </main>
    </div>
  );
}
