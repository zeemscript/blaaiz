"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDataTransferVerticalIcon,
  ArrowDown01Icon,
  ArrowRight02Icon,
  FlashIcon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";

type Quote = {
  you_send: number;
  recipient_gets: number;
  total_fees: number;
  indicative?: boolean;
};

// Indicative USD→NGN rate shown only when live Blaaiz pricing isn't
// available (e.g. no sandbox keys configured yet) so the preview card
// never shows a dead "—" on the landing page.
const FALLBACK_USD_NGN_RATE = 1550;
const FALLBACK_FEE = 2.5;

function fallbackQuote(amount: number): Quote {
  const recipientGets = Math.max(0, amount - FALLBACK_FEE) * FALLBACK_USD_NGN_RATE;
  return {
    you_send: amount,
    recipient_gets: Math.round(recipientGets),
    total_fees: FALLBACK_FEE,
    indicative: true,
  };
}

const floatingChips = [
  {
    icon: FlashIcon,
    label: "Instant transfers",
    className: "-top-6 -left-6 sm:-left-10",
    duration: 5,
  },
  {
    icon: ShieldCheckIcon,
    label: "Bank-grade security",
    className: "-bottom-6 -right-6 sm:-right-10",
    duration: 6,
  },
];

function OrbitRings() {
  return (
    <>
      <motion.svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 opacity-70"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="ringA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="url(#ringA)"
          strokeWidth="1.5"
          strokeDasharray="3 11"
        />
      </motion.svg>
      <motion.svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 opacity-70"
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="ringB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="url(#ringB)"
          strokeWidth="1.5"
          strokeDasharray="2 9"
        />
      </motion.svg>
    </>
  );
}

export function HeroVisual() {
  const [amount, setAmount] = useState("500");
  // Seeded with an indicative quote so the card never renders a dead "—",
  // then replaced by the real one once/if the live quote request resolves.
  const [quote, setQuote] = useState<Quote | null>(() => fallbackQuote(500));

  useEffect(() => {
    const value = Number(amount);
    if (!value || value <= 0) return;

    const timeout = setTimeout(() => {
      fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_currency_id: "USD",
          to_currency_id: "NGN",
          from_amount: value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setQuote(data.error ? fallbackQuote(value) : data);
        })
        .catch(() => setQuote(fallbackQuote(value)));
    }, 400);

    return () => clearTimeout(timeout);
  }, [amount]);

  return (
    <div className="relative mx-auto flex w-full max-w-sm items-center justify-center py-10">
      <div className="absolute h-80 w-80 rounded-full bg-gradient-to-br from-violet-500/25 via-fuchsia-500/15 to-orange-400/20 blur-[90px]" />
      <OrbitRings />

      {floatingChips.map((chip) => (
        <motion.div
          key={chip.label}
          className={`absolute z-20 hidden items-center gap-2 rounded-full border border-black/[.08] bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow-lg sm:flex dark:border-white/[.1] dark:bg-zinc-900 dark:text-zinc-300 ${chip.className}`}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: chip.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <HugeiconsIcon icon={chip.icon} size={14} className="text-violet-500" />
          {chip.label}
        </motion.div>
      ))}

      <div className="relative z-10 w-full rounded-3xl border border-black/[.08] bg-white/90 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-white/[.08] dark:bg-zinc-900/90">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span>Convert &amp; send</span>
          {quote?.indicative ? (
            <span className="flex items-center gap-1 rounded-full bg-zinc-500/10 px-2 py-0.5 text-zinc-500 dark:text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              Indicative rate
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live rate
            </span>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-black/[.06] bg-zinc-50 p-4 dark:border-white/[.06] dark:bg-black">
          <p className="text-[11px] font-medium text-zinc-500">You send</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold text-black outline-none dark:text-zinc-50"
            />
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/[.08] bg-white px-2.5 py-1.5 text-sm font-medium text-black dark:border-white/[.08] dark:bg-zinc-900 dark:text-zinc-50">
              🇺🇸 USD
              <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-zinc-400" />
            </span>
          </div>
        </div>

        <div className="relative z-10 -my-3 flex justify-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[.08] bg-white text-violet-500 shadow-md dark:border-white/[.08] dark:bg-zinc-900">
            <HugeiconsIcon icon={ArrowDataTransferVerticalIcon} size={14} />
          </span>
        </div>

        <div className="rounded-2xl border border-black/[.06] bg-zinc-50 p-4 pt-5 dark:border-white/[.06] dark:bg-black">
          <p className="text-[11px] font-medium text-zinc-500">They receive</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={quote ? quote.recipient_gets : "placeholder"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="truncate text-2xl font-semibold text-black dark:text-zinc-50"
              >
                {quote ? quote.recipient_gets.toLocaleString() : "—"}
              </motion.span>
            </AnimatePresence>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/[.08] bg-white px-2.5 py-1.5 text-sm font-medium text-black dark:border-white/[.08] dark:bg-zinc-900 dark:text-zinc-50">
              🇳🇬 NGN
              <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-zinc-400" />
            </span>
          </div>
        </div>

        <p className="mt-2 min-h-[16px] px-1 text-[11px] text-zinc-400 dark:text-zinc-600">
          {quote
            ? quote.indicative
              ? `Indicative — fee: $${quote.total_fees}`
              : `Fee: $${quote.total_fees}`
            : "Live rate loading…"}
        </p>

        <a
          href="#demo"
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Send Money &amp; Track Status
          <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
        </a>
      </div>
    </div>
  );
}
