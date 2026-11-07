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
  { icon: EarthIcon, value: 5, label: "Payout destinations" },
  { icon: Wallet01Icon, value: 3, label: "Funding options" },
  { icon: Clock01Icon, value: 5, prefix: "<", suffix: " min", label: "Typical settlement" },
  { icon: ShieldCheckIcon, value: 100, suffix: "%", label: "Escrow-protected" },
];

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 sm:grid-cols-4 sm:gap-6 sm:px-10"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="flex flex-col items-center gap-2 text-center"
          >
            <HugeiconsIcon icon={stat.icon} size={20} className="mb-1 text-violet-400" />
            <p className="bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </p>
            <p className="text-sm text-zinc-400">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
