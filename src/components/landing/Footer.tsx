import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ZapIcon } from "@hugeicons/core-free-icons";

export function Footer() {
  return (
    <footer className="border-t border-black/[.08] px-6 py-10 sm:px-10 dark:border-white/[.08]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 text-white">
            <HugeiconsIcon icon={ZapIcon} size={18} strokeWidth={2} />
          </span>
          <span className="text-sm font-semibold text-black dark:text-zinc-50">
            Beam
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          Built for the Blaaiz Buildathon — GDG Ilorin
        </p>
        <Link
          href="/send"
          className="text-xs font-medium text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Try the demo →
        </Link>
      </div>
    </footer>
  );
}
