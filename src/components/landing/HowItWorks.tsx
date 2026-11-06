"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { BankIcon, MoneySendFlow02Icon, ZapIcon } from "@hugeicons/core-free-icons";
import { fadeUp, staggerContainer } from "@/lib/motion";

const steps = [
  {
    icon: ZapIcon,
    title: "Enter an amount",
    description:
      "See the live exchange rate and fees before you send a single dollar.",
  },
  {
    icon: BankIcon,
    title: "Add their bank details",
    description:
      "Pick their bank and drop in the account number — no IBANs, no SWIFT codes.",
  },
  {
    icon: MoneySendFlow02Icon,
    title: "It lands in their account",
    description:
      "Blaaiz converts and settles the payout directly, in their local currency.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20 sm:px-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-zinc-50">
          How it works
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Three steps, end to end — from quote to settlement.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative grid grid-cols-1 gap-6 sm:grid-cols-3"
      >
        <div className="absolute top-10 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-black/[.1] to-transparent sm:block dark:via-white/[.1]" />
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            className="relative flex flex-col gap-3 rounded-2xl border border-black/[.08] bg-white p-6 transition-shadow hover:shadow-lg dark:border-white/[.08] dark:bg-zinc-900"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              <HugeiconsIcon icon={step.icon} size={20} />
            </div>
            <span className="text-xs font-medium text-zinc-400">
              Step 0{index + 1}
            </span>
            <h3 className="font-semibold text-black dark:text-zinc-50">
              {step.title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
