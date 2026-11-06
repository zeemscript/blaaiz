"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { HeroVisual } from "@/components/landing/HeroVisual";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-16 sm:px-10 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[110px]" />
        <div className="absolute -top-10 right-0 h-[24rem] w-[24rem] rounded-full bg-orange-400/15 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_10%,black,transparent)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.06)_1px,transparent_1px)]" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left"
        >
          <motion.p
            variants={fadeUp}
            className="flex items-center gap-1.5 rounded-full bg-black/[.04] px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300"
          >
            <HugeiconsIcon icon={SparklesIcon} size={14} />
            Built on the Blaaiz API · Blaaiz Buildathon
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-semibold tracking-tight text-black sm:text-6xl dark:text-zinc-50"
          >
            Send money home,{" "}
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              instantly.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-lg text-lg text-zinc-600 dark:text-zinc-400"
          >
            Beam moves money across borders with real exchange rates and
            direct bank payouts — no middlemen, no guesswork on fees.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/send"
              className="group flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Send a payout
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center justify-center rounded-full border border-black/[.08] px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
            >
              See how it works
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
