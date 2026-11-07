"use client";

import { useEffect, useState } from "react";
import { destinations, type Destination, type DestinationId } from "@/lib/destinations";

type Bank = { id: string; name: string; code: string; country: string };
type MomoOperator = { id: number; name: string; code: string; country_id: number };
type Currency = { id: string; code: string; name: string };

export type RecipientPayload = {
  destination: Destination;
  method: string;
  toCurrencyId: string | null;
  fields: Record<string, unknown>;
};

const inputClass =
  "rounded border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function RecipientPicker({
  label = "Recipient",
  onChange,
}: {
  label?: string;
  onChange: (payload: RecipientPayload) => void;
}) {
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

  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");

  useEffect(() => {
    let fields: Record<string, unknown>;
    const toCurrencyId =
      destination.method === "mobile_money" ? momoCurrencyId : destination.currencyCode;

    if (destination.method === "bank_transfer" && destination.id === "NGN") {
      fields = { bank_id: bankId, account_number: accountNumber, account_name: accountName };
    } else if (destination.method === "bank_transfer") {
      fields = { sort_code: sortCode, account_number: accountNumber, account_name: accountName };
    } else if (destination.method === "mobile_money") {
      fields = { phone_number: phoneNumber, mobile_money_operator_id: operatorId, account_name: accountName };
    } else {
      fields = {
        type: "individual",
        account_number: accountNumber,
        account_name: accountName,
        account_type: accountType,
        bank_name: bankName,
        routing_number: routingNumber,
      };
    }

    onChange({ destination, method: destination.method, toCurrencyId, fields });
    // onChange is a stable setState-style callback from the parent; omitting
    // it keeps this from re-firing on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    destination,
    bankId,
    accountNumber,
    accountName,
    sortCode,
    phoneNumber,
    operatorId,
    routingNumber,
    bankName,
    accountType,
    momoCurrencyId,
  ]);

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
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
  );
}

export { inputClass };
