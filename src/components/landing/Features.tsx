"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GlobeIcon,
  IdVerifiedIcon,
  MapPinIcon,
  ReceiptDollarIcon,
  TerminalIcon,
  WebhookIcon,
  Wallet01Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { fadeUp, staggerContainer } from "@/lib/motion";

const features = [
  {
    icon: GlobeIcon,
    title: "Real-time FX rates",
    description:
      "Live exchange rates pulled straight from Blaaiz, not a markup guess — see exactly what the recipient gets before you send.",
    big: true,
  },
  {
    icon: MapPinIcon,
    title: "180+ countries",
    description: "Payouts across Africa, Europe, North America and beyond.",
  },
  {
    icon: Wallet01Icon,
    title: "Bank, mobile money & crypto",
    description: "Bank transfer, mobile money, Interac, ACH, wire, or USDT/USDC.",
  },
  {
    icon: ZapIcon,
    title: "Instant live quotes",
    description: "See fees and the recipient amount update as you type.",
  },
  {
    icon: IdVerifiedIcon,
    title: "Built-in KYC & compliance",
    description: "Customer verification handled through Blaaiz's Signa flow.",
  },
  {
    icon: ReceiptDollarIcon,
    title: "Transparent fees",
    description: "Full fee breakdown before you confirm — no hidden charges.",
  },
  {
    icon: WebhookIcon,
    title: "Real-time status tracking",
    description: "Payout and collection webhooks keep every transfer in sync.",
  },
  {
    icon: TerminalIcon,
    title: "API-first",
    description: "Built on the Blaaiz Node SDK — ready to extend or automate.",
    wide: true,
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20 sm:px-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-zinc-50">
          Everything a cross-border payout needs
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Powered end to end by the Blaaiz RaaS API.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-4"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-black/[.08] bg-white p-5 transition-shadow hover:shadow-xl dark:border-white/[.08] dark:bg-zinc-900 ${
              feature.big
                ? "min-h-[180px] sm:col-span-2 sm:row-span-2 sm:min-h-[372px] sm:p-7"
                : feature.wide
                  ? "min-h-[180px] sm:col-span-2"
                  : "min-h-[180px]"
            }`}
          >
            {feature.big && (
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 blur-2xl transition-opacity group-hover:opacity-80" />
            )}
            <div
              className={`relative flex items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 ${
                feature.big ? "h-14 w-14" : "h-10 w-10"
              }`}
            >
              <HugeiconsIcon icon={feature.icon} size={feature.big ? 26 : 20} />
            </div>
            <h3
              className={`relative font-semibold text-black dark:text-zinc-50 ${feature.big ? "text-xl" : ""}`}
            >
              {feature.title}
            </h3>
            <p className="relative text-sm text-zinc-600 dark:text-zinc-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
