import { NextResponse } from "next/server";
import { getEscrow, updateEscrow } from "@/lib/escrow-store";

// Demo stand-in for Blaaiz's crypto-collection webhook (x-blaaiz-signature /
// x-blaaiz-timestamp), which would confirm on-chain receipt automatically in
// production. On-chain confirmation latency is too slow to demo live, so this
// lets the employer manually confirm they've sent the funds.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const escrow = getEscrow(id);
  if (!escrow) {
    return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
  }
  if (escrow.status !== "pending_funding") {
    return NextResponse.json(
      { error: `Escrow is already ${escrow.status}` },
      { status: 400 }
    );
  }

  const updated = updateEscrow(id, { status: "funded" });
  return NextResponse.json(updated);
}
