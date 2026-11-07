import { Suspense } from "react";
import { SendClient, type Mode } from "@/app/send/SendClient";

const validModes: Mode[] = ["payout", "abroad", "escrow", "track"];

async function ModeResolver({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = validModes.includes(mode as Mode) ? (mode as Mode) : "payout";
  return <SendClient initialMode={initialMode} />;
}

export default function Send({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  return (
    <Suspense fallback={<SendClient initialMode="payout" />}>
      <ModeResolver searchParams={searchParams} />
    </Suspense>
  );
}
