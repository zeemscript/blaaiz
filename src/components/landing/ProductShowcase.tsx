"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ZapIcon,
  ShieldCheckIcon,
  Search01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { fadeUp } from "@/lib/motion";
import { InstantPayoutForm } from "@/components/demo/InstantPayoutForm";
import { PayoutTracker } from "@/components/demo/PayoutTracker";
import { EscrowForm } from "@/components/demo/EscrowForm";

export function ProductShowcase() {
  return (
    <div className="flex flex-col">
      {/* SECTION 1: INSTANT PAYOUT ENGINE */}
      <section
        id="demo"
        className="relative scroll-mt-20 overflow-hidden border-t border-black/[.06] px-6 py-20 sm:px-10 sm:py-28 dark:border-white/[.06]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-violet-500/15 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Copy Column */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-700 dark:border-violet-500/30 dark:text-violet-300">
                <HugeiconsIcon icon={ZapIcon} size={14} />
                Feature 01 · Receivables &amp; Payouts
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl dark:text-zinc-50">
                Get paid internationally,{" "}
                <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  cash out locally.
                </span>
              </h2>

              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                Clients pay you in USD or crypto (USDT/USDC). Beam connects directly
                with Blaaiz’s Remittance-as-a-Service API to calculate live FX rates,
                lock transparent fees, and disburse spendable local currency in minutes.
              </p>

              <div className="mt-8 space-y-3.5">
                {[
                  "Real-time FX quotes from Blaaiz fees.getBreakdown",
                  "Direct settlement to Nigerian Banks (Access, GTBank, Zenith)",
                  "Instant Mobile Money payouts (M-Pesa Kenya, MTN Ghana)",
                  "US ACH & UK Faster Payments multi-rail routing",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Interactive Tool */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="lg:col-span-7"
            >
              <div className="rounded-3xl border border-black/[.08] bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-white/[.1] dark:bg-zinc-900/90">
                <div className="mb-5 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                      LIVE_PAYOUT_ENGINE
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                    Interactive Demo
                  </span>
                </div>
                <InstantPayoutForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: LIVE PAYOUT TRACKER & API AUDIT */}
      <section
        id="tracker"
        className="relative scroll-mt-20 overflow-hidden border-t border-black/[.06] bg-zinc-100/40 px-6 py-20 sm:px-10 sm:py-28 dark:border-white/[.06] dark:bg-zinc-950/40"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Copy Column */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400">
                <HugeiconsIcon icon={Search01Icon} size={14} />
                Feature 02 · Status Tracker &amp; Audit
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl dark:text-zinc-50">
                Follow every transfer with{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  zero blindspots.
                </span>
              </h2>

              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                The exact starter requirement requested by the Buildathon: enter any
                transaction reference, follow its 4-step settlement progression, and
                inspect the exact Blaaiz API payloads, endpoints, and webhook events.
              </p>

              <div className="mt-8 space-y-3.5">
                {[
                  "Step-by-step lifecycle from Customer KYC to Bank Settlement",
                  "Search by Reference ID or pick preloaded test transfers",
                  "Digital receipt with locked FX rates and exact fees",
                  "Integrated Blaaiz API Inspector drawer with live payloads",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Interactive Tool */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="lg:col-span-7"
            >
              <PayoutTracker />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: MILESTONE ESCROW ENGINE */}
      <section
        id="escrow"
        className="relative scroll-mt-20 overflow-hidden border-t border-black/[.06] px-6 py-20 sm:px-10 sm:py-28 dark:border-white/[.06]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/3 h-96 w-96 rounded-full bg-orange-400/15 blur-[130px]" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Copy Column */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-semibold text-orange-600 dark:border-orange-500/30 dark:text-orange-400">
                <HugeiconsIcon icon={ShieldCheckIcon} size={14} />
                Feature 03 · Milestone Escrow
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight text-black sm:text-4xl dark:text-zinc-50">
                Hire across borders.{" "}
                <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                  Pay with confidence.
                </span>
              </h2>

              <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
                Solve cross-border contract trust. An employer funds the project in
                USDT or USDC through a dynamic on-chain deposit address. Funds sit safely
                in escrow until work is delivered, then release directly to the freelancer’s
                local bank account.
              </p>

              <div className="mt-8 space-y-3.5">
                {[
                  "Dynamic crypto deposit generation across 4 blockchains",
                  "Ethereum, BNB Smart Chain, Tron, and Polygon support",
                  "Safe escrow holding state machine (pending → funded → released)",
                  "1-Click automated release straight to contractor bank/MoMo",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Interactive Tool */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="lg:col-span-7"
            >
              <div className="rounded-3xl border border-black/[.08] bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-white/[.1] dark:bg-zinc-900/90">
                <div className="mb-5 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500" />
                    <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                      ESCROW_STATE_MACHINE
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                    Interactive Contract Flow
                  </span>
                </div>
                <EscrowForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
