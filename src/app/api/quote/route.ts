import { NextResponse } from "next/server";
import { getBlaaizClient, hasBlaaizCredentials } from "@/lib/blaaiz";

const ratesToUSD: Record<string, number> = {
  USD: 1,
  USDT: 1,
  USDC: 1,
  NGN: 1650,
  KES: 129,
  GHS: 15.5,
  GBP: 0.78,
};

function getMockQuote(from: string, to: string, amount: number) {
  const fromRate = ratesToUSD[from] || 1;
  const toRate = ratesToUSD[to] || (to === "NGN" ? 1650 : 1);
  const conversionRate = toRate / fromRate;
  const fee = Number((amount * 0.008 + (from === "NGN" ? 500 : 1.5)).toFixed(2));
  const netAmount = Math.max(0, amount - fee);
  const recipientGets = Number((netAmount * conversionRate).toFixed(2));

  return {
    rate: conversionRate,
    fee,
    total_fees: `${fee} ${from}`,
    recipient_gets: recipientGets,
    from_currency: from,
    to_currency: to,
    is_mock: true,
  };
}

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

    if (!hasBlaaizCredentials()) {
      return NextResponse.json(
        getMockQuote(from_currency_id, to_currency_id, Number(from_amount))
      );
    }

    try {
      const blaaiz = getBlaaizClient();
      const breakdown = await blaaiz.fees.getBreakdown({
        from_currency_id,
        to_currency_id,
        from_amount: Number(from_amount),
      });

      return NextResponse.json(breakdown.data);
    } catch (err) {
      // Graceful fallback to mock quote if sandbox is down or unconfigured
      console.warn("Blaaiz live quote failed, falling back to mock:", err);
      return NextResponse.json(
        getMockQuote(from_currency_id, to_currency_id, Number(from_amount))
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
