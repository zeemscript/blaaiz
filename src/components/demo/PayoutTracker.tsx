"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Copy01Icon,
  ArrowRight02Icon,
  CodeIcon,
  Search01Icon,
  SparklesIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";
import type { PayoutRecord } from "@/lib/payout-store";

export function PayoutTracker({
  initialRecord,
  onReset,
}: {
  initialRecord?: PayoutRecord | null;
  onReset?: () => void;
}) {
  const [record, setRecord] = useState<PayoutRecord | null>(initialRecord || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showApiInspector, setShowApiInspector] = useState(false);

  async function handleSearch(refToSearch?: string) {
    const q = (refToSearch || searchQuery).trim();
    if (!q) return;
    setSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/payout/track?reference=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setSearchError(data.error || "No payout found with that reference.");
      } else {
        setRecord(data);
      }
    } catch {
      setSearchError("Failed to look up payout. Check reference ID.");
    } finally {
      setSearching(false);
    }
  }

  function copyReference() {
    if (!record) return;
    navigator.clipboard.writeText(record.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Lookup Bar & Preset Switcher */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Track Any Blaaiz Payout
        </label>
        <div className="mt-2 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter reference e.g. BLZ-8842109"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm font-mono text-zinc-900 outline-none transition-colors focus:border-violet-500 focus:bg-white dark:border-zinc-750 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={searching}
            className="flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-semibold text-background transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:hover:bg-zinc-200"
          >
            <HugeiconsIcon icon={Search01Icon} size={14} />
            {searching ? "Finding…" : "Track"}
          </button>
        </div>

        {searchError && (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">{searchError}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
          <span className="font-medium">Try test samples:</span>
          {["BLZ-8842109", "BLZ-7739102"].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setSearchQuery(sample);
                handleSearch(sample);
              }}
              className="rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-700 transition-colors hover:bg-violet-100 hover:text-violet-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-violet-950 dark:hover:text-violet-300"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Main Status & Receipt Card */}
      {record && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* Header Banner */}
          <div className="border-b border-zinc-100 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/5 to-emerald-500/10 p-5 dark:border-zinc-800/80">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    Settled &amp; Delivered
                  </span>
                  <span className="text-xs text-zinc-400">· Blaaiz RaaS Rail</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <h3 className="font-mono text-xl font-bold tracking-tight text-black dark:text-zinc-50">
                    {record.reference}
                  </h3>
                  <button
                    type="button"
                    onClick={copyReference}
                    title="Copy Reference"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    <HugeiconsIcon icon={Copy01Icon} size={14} />
                  </button>
                  {copied && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Copied!
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Recipient Received
                </span>
                <p className="text-2xl font-bold text-black dark:text-zinc-50">
                  {record.recipient.flag} {record.amount.toAmount.toLocaleString()}{" "}
                  <span className="text-sm font-semibold text-zinc-500">
                    {record.amount.toCurrency}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* 4-Step Animated Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Settlement Lifecycle
              </h4>
              <div className="mt-4 space-y-4">
                {record.timeline.map((evt, idx) => (
                  <div key={evt.step} className="relative flex items-start gap-3.5">
                    {/* Line connector */}
                    {idx < record.timeline.length - 1 && (
                      <div className="absolute left-[11px] top-6 h-full w-[2px] bg-emerald-500/40 dark:bg-emerald-500/30" />
                    )}

                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,.4)]">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-black dark:text-zinc-100">
                          {evt.title}
                        </span>
                        <span className="text-[11px] text-zinc-400">{evt.timestamp}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Receipt Summary Grid */}
            <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/50">
              <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
                <div>
                  <span className="text-zinc-400">Amount Sent</span>
                  <p className="mt-0.5 font-semibold text-black dark:text-zinc-100">
                    {record.amount.fromAmount} {record.amount.fromCurrency}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-400">Locked Rate</span>
                  <p className="mt-0.5 font-semibold text-black dark:text-zinc-100">
                    1 {record.amount.fromCurrency} = {record.amount.rate.toLocaleString()}{" "}
                    {record.amount.toCurrency}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-400">Blaaiz Fee</span>
                  <p className="mt-0.5 font-semibold text-black dark:text-zinc-100">
                    {record.amount.fee}
                  </p>
                </div>
                <div>
                  <span className="text-zinc-400">Destination Rail</span>
                  <p className="mt-0.5 font-semibold text-black dark:text-zinc-100">
                    {record.recipient.method.replace("_", " ").toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 border-t border-zinc-200/60 pt-3 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                <span className="font-medium text-black dark:text-zinc-200">
                  Beneficiary:
                </span>{" "}
                {record.recipient.name} ({record.recipient.account})
              </div>
            </div>

            {/* Blaaiz API Inspector Drawer */}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowApiInspector(!showApiInspector)}
                className="flex w-full items-center justify-between rounded-xl border border-violet-500/20 bg-violet-50/50 px-3.5 py-2.5 text-xs font-semibold text-violet-700 transition-colors hover:bg-violet-100/60 dark:border-violet-500/30 dark:bg-violet-950/30 dark:text-violet-300"
              >
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={CodeIcon} size={15} />
                  Blaaiz API Integration Inspector
                </span>
                <HugeiconsIcon
                  icon={showApiInspector ? ArrowUp01Icon : ArrowDown01Icon}
                  size={14}
                />
              </button>

              <AnimatePresence>
                {showApiInspector && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-2 rounded-xl border border-zinc-200 bg-zinc-950 p-4 font-mono text-[11px] text-zinc-300 dark:border-zinc-800">
                      <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-2">
                        <span>
                          SDK Method:{" "}
                          <strong className="text-violet-400">
                            {record.apiLog.sdkMethod}
                          </strong>
                        </span>
                        <span className="text-emerald-400">
                          {record.apiLog.durationMs}ms
                        </span>
                      </div>
                      <div className="pt-1">
                        <span className="text-zinc-500">Endpoint:</span>{" "}
                        <span className="text-amber-300">
                          {record.apiLog.endpoint}
                        </span>
                      </div>
                      <div className="pt-2">
                        <span className="text-zinc-500">Request Payload:</span>
                        <pre className="mt-1 overflow-x-auto text-[10.5px] text-zinc-300">
                          {JSON.stringify(record.apiLog.requestPayload, null, 2)}
                        </pre>
                      </div>
                      {record.apiLog.webhookSimulated && (
                        <div className="pt-2 border-t border-zinc-800">
                          <span className="text-zinc-500">
                            Webhook Verified Event:
                          </span>
                          <div className="text-emerald-400">
                            Event: {record.apiLog.webhookSimulated.event}
                          </div>
                          <div className="truncate text-zinc-500">
                            {record.apiLog.webhookSimulated.signatureHeader}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className="flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  <HugeiconsIcon icon={SparklesIcon} size={14} />
                  Create Another Payout
                </button>
              )}
              <a
                href="#how-it-works"
                className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-750 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Learn How Blaaiz Powers This
                <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
