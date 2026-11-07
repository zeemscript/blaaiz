"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Coins01Icon,
  GlobeIcon,
  IdVerifiedIcon,
  ReceiptDollarIcon,
  ShieldCheckIcon,
  TerminalIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { fadeUp, staggerContainer } from "@/lib/motion";

const pillars = [
  {
    href: "/send?mode=payout",
    icon: ZapIcon,
    accent: "from-violet-500 to-indigo-500",
    glow: "bg-violet-500/20",
    title: "Instant payout",
    description:
      "Get paid in crypto or USD, out in your own currency — bank transfer, mobile money, or ACH, in minutes.",
  },
  {
    href: "/send?mode=abroad",
    icon: GlobeIcon,
    accent: "from-fuchsia-500 to-pink-500",
    glow: "bg-fuchsia-500/20",
    title: "Pay abroad",
    description:
      "Holding naira in Lagos but buying something in Accra? Pay in what you have — the seller gets their own currency, automatically.",
  },
  {
    href: "/send?mode=escrow",
    icon: ShieldCheckIcon,
    accent: "from-orange-400 to-amber-500",
    glow: "bg-orange-400/20",
    title: "Escrow for hiring",
    description:
      "A client funds the job in crypto. Beam holds it until the work is done, then releases it in one click.",
  },
];

const extras = [
  {
    icon: Coins01Icon,
    title: "Multi-chain crypto",
    description: "USDT or USDC, on Ethereum, BSC, Tron, or Polygon.",
  },
  {
    icon: GlobeIcon,
    title: "Real-time FX rates",
    description: "Live exchange rates pulled straight from Blaaiz, not a markup guess.",
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
    icon: TerminalIcon,
    title: "API-first",
    description: "Built on the Blaaiz Node SDK, with webhooks driving escrow confirmations.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-zinc-50">
          Three ways to move money, one platform
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
        className="grid grid-cols-1 gap-5 sm:grid-cols-3"
      >
        {pillars.map((pillar) => (
          <motion.div key={pillar.title} variants={fadeUp}>
            <Link
              href={pillar.href}
              className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-black/[.08] bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-2xl dark:border-white/[.08] dark:bg-zinc-900"
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full ${pillar.glow} blur-2xl transition-opacity group-hover:opacity-80`}
              />
              <div
                className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.accent} text-white shadow-lg`}
              >
                <HugeiconsIcon icon={pillar.icon} size={22} />
              </div>
              <h3 className="relative text-xl font-semibold text-black dark:text-zinc-50">
                {pillar.title}
              </h3>
              <p className="relative flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                {pillar.description}
              </p>
              <span className="relative flex items-center gap-1.5 text-sm font-medium text-black dark:text-zinc-50">
                Try it
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {extras.map((extra) => (
          <motion.div
            key={extra.title}
            variants={fadeUp}
            className="flex flex-col gap-2 rounded-2xl border border-black/[.08] bg-white p-5 dark:border-white/[.08] dark:bg-zinc-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
              <HugeiconsIcon icon={extra.icon} size={18} />
            </div>
            <h4 className="font-medium text-black dark:text-zinc-50">{extra.title}</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{extra.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
