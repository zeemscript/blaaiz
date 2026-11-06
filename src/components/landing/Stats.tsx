"use client";

import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  EarthIcon,
  ShieldCheckIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { fadeUp, staggerContainer } from "@/lib/motion";

const stats = [
  { icon: EarthIcon, value: 180, suffix: "+", label: "Countries reached" },
  { icon: Wallet01Icon, value: 6, label: "Payout methods" },
  { icon: Clock01Icon, value: 5, prefix: "<", suffix: " min", label: "Typical settlement" },
  { icon: ShieldCheckIcon, value: 100, suffix: "%", label: "KYC-verified transfers" },
];

export function Stats() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/[.08] bg-black/[.08] sm:grid-cols-4 dark:border-white/[.08] dark:bg-white/[.08]"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="flex flex-col items-center gap-3 bg-white px-6 py-10 text-center dark:bg-zinc-950"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30">
              <HugeiconsIcon icon={stat.icon} size={22} />
            </span>
            <p className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
