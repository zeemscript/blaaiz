"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDownRight01Icon } from "@hugeicons/core-free-icons";
import { fadeUp, staggerContainer } from "@/lib/motion";

const faqs = [
  {
    question: "Is Beam a real product?",
    answer:
      "Beam is a demo built for the Blaaiz Buildathon. It calls the real Blaaiz API — crypto deposit addresses, bank lookups, fee breakdowns, and payouts all run through Blaaiz's sandbox.",
  },
  {
    question: "How does the escrow step actually work?",
    answer:
      "A client funds a job in USDT or USDC via a real deposit address from Blaaiz's crypto collection API. In this demo, confirming the deposit landed is a manual step — in production that confirmation would come automatically from Blaaiz's crypto-collection webhooks. Once funded, releasing the escrow triggers a real payout.",
  },
  {
    question: "Which currencies and payout methods are supported?",
    answer:
      "This demo funds jobs in USDT or USDC and pays out via bank transfer to Nigeria or the UK, mobile money to Kenya or Ghana, or ACH to the US — all on the same Blaaiz payout API, which also supports Interac and wire transfer.",
  },
  {
    question: "How are fees calculated?",
    answer:
      "Every quote comes from Blaaiz's fees API in real time, so you see the exact exchange rate and fee breakdown before confirming a payout.",
  },
  {
    question: "Is recipient data verified?",
    answer:
      "Yes — customer KYC runs through Blaaiz's Signa verification flow before a payout is initiated.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl dark:text-zinc-50">
          Frequently asked
        </h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto flex max-w-3xl flex-col gap-3"
      >
        {faqs.map((faq, index) => {
          const isOpen = open === index;
          return (
            <motion.div
              key={faq.question}
              layout="position"
              transition={{ layout: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
              variants={fadeUp}
              className="overflow-hidden rounded-2xl border border-black/[.08] bg-white dark:border-white/[.08] dark:bg-zinc-900"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-medium text-black dark:text-zinc-50">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-zinc-400"
                >
                  <HugeiconsIcon icon={ArrowDownRight01Icon} size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
