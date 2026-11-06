import { NextResponse } from "next/server";
import { getBlaaizClient } from "@/lib/blaaiz";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from_currency_id, to_currency_id, from_amount } = body;

    if (!from_currency_id || !to_currency_id || !from_amount) {
      return NextResponse.json(
        { error: "from_currency_id, to_currency_id and from_amount are required" },
        { status: 400 }
      );
    }

    const blaaiz = getBlaaizClient();
    const breakdown = await blaaiz.fees.getBreakdown({
      from_currency_id,
      to_currency_id,
      from_amount: Number(from_amount),
    });

    return NextResponse.json(breakdown.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
