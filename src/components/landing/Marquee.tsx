import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Coins01Icon } from "@hugeicons/core-free-icons";

type CurrencyItem = {
  code: string;
  flag?: string;
  icon?: IconSvgElement;
};

const rowA: CurrencyItem[] = [
  { code: "USD", flag: "🇺🇸" },
  { code: "GBP", flag: "🇬🇧" },
  { code: "EUR", flag: "🇪🇺" },
  { code: "CAD", flag: "🇨🇦" },
  { code: "USDT", icon: Coins01Icon },
  { code: "USDC", icon: Coins01Icon },
];

const rowB: CurrencyItem[] = [
  { code: "NGN", flag: "🇳🇬" },
  { code: "KES", flag: "🇰🇪" },
  { code: "GHS", flag: "🇬🇭" },
  { code: "UGX", flag: "🇺🇬" },
  { code: "TZS", flag: "🇹🇿" },
  { code: "XOF", flag: "🇨🇮" },
];

function Glyph({ item, muted }: { item: CurrencyItem; muted?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-3 whitespace-nowrap">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-base leading-none backdrop-blur-sm">
        {item.flag ?? (
          item.icon && <HugeiconsIcon icon={item.icon} size={16} />
        )}
      </span>
      <span
        className={`text-xl font-bold tracking-tight sm:text-2xl ${
          muted ? "text-zinc-400 dark:text-zinc-600" : "text-white"
        }`}
      >
        {item.code}
      </span>
      <span
        className={`mx-1 text-xl ${muted ? "text-zinc-700" : "text-white/40"}`}
      >
        ✦
      </span>
    </span>
  );
}

function Row({
  items,
  reverse,
  muted,
}: {
  items: CurrencyItem[];
  reverse?: boolean;
  muted?: boolean;
}) {
  const loop = [...items, ...items, ...items];

  return (
    <div
      className={`flex w-max items-center gap-6 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
    >
      {loop.map((item, index) => (
        <Glyph key={`${item.code}-${index}`} item={item} muted={muted} />
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      <div className="-mx-[8%] w-[116%] -rotate-2 shadow-[0_20px_60px_-20px_rgba(168,85,247,0.45)]">
        <div className="overflow-hidden bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 py-3.5">
          <Row items={rowA} />
        </div>
      </div>
      <div className="-mx-[8%] -mt-1.5 w-[116%] rotate-2">
        <div className="overflow-hidden border-y border-black/[.06] bg-zinc-100 py-3.5 dark:border-white/[.06] dark:bg-zinc-950">
          <Row items={rowB} reverse muted />
        </div>
      </div>
    </section>
  );
}
