import { NextResponse } from "next/server";
import { getEscrow, updateEscrow } from "@/lib/escrow-store";
import { sendPayout } from "@/lib/payout";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const escrow = getEscrow(id);
  if (!escrow) {
    return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
  }
  if (escrow.status !== "funded") {
    return NextResponse.json(
      { error: `Escrow must be funded before release (current: ${escrow.status})` },
      { status: 400 }
    );
  }

  try {
    const result = await sendPayout({
      sender_first_name: escrow.employerFirstName,
      sender_last_name: escrow.employerLastName,
      sender_email: escrow.employerEmail,
      from_amount: escrow.fundingAmount,
      from_currency_id: escrow.fundingAsset,
      to_currency_id: escrow.payout.to_currency_id,
      method: escrow.payout.method,
      ...escrow.payout.fields,
    });
    const updated = updateEscrow(id, {
      status: "released",
      payoutResult: result,
    });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    updateEscrow(id, { status: "failed", error: message });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
