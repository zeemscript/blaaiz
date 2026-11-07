"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { GlobeIcon, ShieldCheckIcon, ZapIcon } from "@hugeicons/core-free-icons";
import { fadeUp, staggerContainer } from "@/lib/motion";

type Flow = {
  id: string;
  numeral: string;
  label: string;
  icon: IconSvgElement;
  accent: string;
  textAccent: string;
  dot: string;
  spotlight: string;
  blob: string;
  steps: { title: string; description: string }[];
};

const flows: Flow[] = [
  {
    id: "payout",
    numeral: "01",
    label: "Instant payout",
    icon: ZapIcon,
    accent: "from-violet-500 to-indigo-500",
    textAccent: "text-violet-400",
    dot: "bg-violet-400 shadow-[0_0_12px_2px_rgba(167,139,250,.8)]",
    spotlight: "rgba(167,139,250,.18)",
    blob: "bg-violet-600/25",
    steps: [
      { title: "Fund the payout", description: "A client pays you in USDT, USDC, or USD." },
      { title: "Blaaiz converts & routes", description: "A live FX quote locks in the rate and fee, upfront." },
      { title: "It lands in minutes", description: "Straight to your bank account or mobile money wallet." },
    ],
  },
  {
    id: "abroad",
    numeral: "02",
    label: "Pay abroad",
    icon: GlobeIcon,
    accent: "from-fuchsia-500 to-pink-500",
    textAccent: "text-fuchsia-400",
    dot: "bg-fuchsia-400 shadow-[0_0_12px_2px_rgba(244,114,182,.8)]",
    spotlight: "rgba(244,114,182,.18)",
    blob: "bg-fuchsia-600/25",
    steps: [
      { title: "Tell us what you're holding", description: "NGN, KES, GHS, GBP, or USD — whatever's in your account." },
      { title: "We find the live rate", description: "Real exchange rates and fees, quoted before you send." },
      { title: "The seller gets their currency", description: "No manual conversion, no third app, no guesswork." },
    ],
  },
  {
    id: "escrow",
    numeral: "03",
    label: "Escrow",
    icon: ShieldCheckIcon,
    accent: "from-orange-400 to-amber-500",
    textAccent: "text-orange-400",
    dot: "bg-orange-400 shadow-[0_0_12px_2px_rgba(251,146,60,.8)]",
    spotlight: "rgba(251,146,60,.18)",
    blob: "bg-orange-500/25",
    steps: [
      { title: "Fund the job", description: "A client pays in USDT or USDC via a real Blaaiz deposit address." },
      { title: "Held in escrow", description: "Funds sit safely until the work is confirmed done." },
      { title: "Released instantly", description: "One click pays the freelancer out, in their own currency." },
    ],
  },
];

function FlowCard({ flow, index }: { flow: Flow; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const rotateX = useSpring(useTransform(mouseY, [0, 100], [7, -7]), {
    stiffness: 250,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 100], [-7, 7]), {
    stiffness: 250,
    damping: 22,
  });
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${mouseX}% ${mouseY}%, ${flow.spotlight}, transparent 70%)`;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleMouseLeave() {
    mouseX.set(50);
    mouseY.set(50);
  }

  return (
    <motion.div variants={fadeUp} style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[.04] p-7 backdrop-blur-sm transition-colors hover:border-white/20"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-8 bg-gradient-to-br from-white/15 to-white/0 bg-clip-text text-[130px] font-black leading-none text-transparent select-none"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,.08)" }}
        >
          {flow.numeral}
        </span>

        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{ boxShadow: ["0 0 0px 0px", "0 0 18px 4px", "0 0 0px 0px"] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.4 }}
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${flow.accent} text-white`}
          >
            <HugeiconsIcon icon={flow.icon} size={19} />
          </motion.div>
          <h3 className="font-semibold text-white">{flow.label}</h3>
        </div>

        <div className="relative mt-7 flex flex-col gap-5">
          <div className="absolute left-[11px] top-1 bottom-1 w-px overflow-hidden bg-white/10">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ transformOrigin: "top" }}
              className={`h-full w-full bg-gradient-to-b ${flow.accent}`}
            />
            <motion.div
              animate={{ top: ["0%", "100%"] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.5,
              }}
              className={`absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${flow.dot}`}
            />
          </div>
          {flow.steps.map((step, i) => (
            <div key={step.title} className="relative flex gap-3.5">
              <span
                className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-[11px] font-semibold ring-1 ring-white/15 ${flow.textAccent}`}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{step.title}</p>
                <p className="mt-0.5 text-sm text-zinc-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-white/[.06] bg-zinc-950 px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[100px]" />
        <div className="absolute right-[8%] top-10 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mx-auto mb-14 max-w-6xl text-center"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 text-zinc-400">
          Three flows, running in parallel — every step on the real Blaaiz API.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-3"
      >
        {flows.map((flow, index) => (
          <FlowCard key={flow.id} flow={flow} index={index} />
        ))}
      </motion.div>
    </section>
  );
}
