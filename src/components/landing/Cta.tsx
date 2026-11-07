"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { fadeUp } from "@/lib/motion";

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 px-8 py-16 text-center sm:px-16"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,.25),transparent_55%)]" />
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Payouts, cross-border spending, escrow — one API.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-white/80">
          Try the live demo and see a real Blaaiz-powered transaction,
          end to end.
        </p>
        <Link
          href="/send"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
        >
          Try the demo
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </motion.div>
    </section>
  );
}
