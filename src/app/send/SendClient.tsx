"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InstantPayoutForm } from "@/components/demo/InstantPayoutForm";
import { PayAbroadForm } from "@/components/demo/PayAbroadForm";
import { EscrowForm } from "@/components/demo/EscrowForm";
import { PayoutTracker } from "@/components/demo/PayoutTracker";

export const modes = [
  {
    id: "payout",
    label: "Instant payout",
    title: "Get paid for work, from anywhere.",
    subtitle:
      "A client funds you in crypto or USD. You get paid out in your own currency — bank transfer, mobile money, or ACH.",
  },
  {
    id: "abroad",
    label: "Pay abroad",
    title: "Spend what you have, anywhere.",
    subtitle:
      "Pay a seller directly in your own currency — they receive theirs, automatically, no manual conversion.",
  },
  {
    id: "escrow",
    label: "Escrow",
    title: "Hire across borders. Pay with confidence.",
    subtitle:
      "Funds are held safely until the work is confirmed done, then released instantly to the freelancer.",
  },
  {
    id: "track",
    label: "Track payout",
    title: "Live Payout Tracker & Audit.",
    subtitle:
      "Follow any payout in real-time, view the step-by-step settlement lifecycle, and inspect Blaaiz API payloads.",
  },
] as const;

export type Mode = (typeof modes)[number]["id"];

export function SendClient({
  initialMode = "payout",
  isLanding = false,
}: {
  initialMode?: Mode;
  isLanding?: boolean;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const active = modes.find((m) => m.id === mode) || modes[0];

  return (
    <div
      className={
        isLanding
          ? "w-full max-w-xl mx-auto"
          : "flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black"
      }
    >
      <main
        className={
          isLanding
            ? "flex w-full flex-col gap-6"
            : "flex w-full max-w-xl flex-col gap-8 px-6 py-16"
        }
      >
        <div>
          {!isLanding && (
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-zinc-50"
            >
              ← Beam Home
            </Link>
          )}
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {active.title}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {active.subtitle}
          </p>
        </div>

        <div className="relative flex gap-1 rounded-full border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className="relative flex-1 rounded-full px-2.5 py-2 text-xs font-medium sm:text-sm"
            >
              {mode === m.id && (
                <motion.span
                  layoutId={isLanding ? "landing-mode-pill" : "mode-pill"}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-foreground"
                />
              )}
              <span
                className={`relative z-10 truncate ${
                  mode === m.id ? "text-background" : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {m.label}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {mode === "payout" && <InstantPayoutForm />}
            {mode === "abroad" && <PayAbroadForm />}
            {mode === "escrow" && <EscrowForm />}
            {mode === "track" && <PayoutTracker />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
