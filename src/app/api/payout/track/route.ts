import { NextResponse } from "next/server";
import { getPayoutRecord, listRecentPayouts } from "@/lib/payout-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({
      recent: listRecentPayouts(),
    });
  }

  const record = getPayoutRecord(reference);
  if (!record) {
    return NextResponse.json(
      { error: `No payout found for reference "${reference}"` },
      { status: 404 }
    );
  }

  return NextResponse.json(record);
}

