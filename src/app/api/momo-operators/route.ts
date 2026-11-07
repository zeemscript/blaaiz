import { NextResponse } from "next/server";
import { getBlaaizClient, hasBlaaizCredentials } from "@/lib/blaaiz";

const mockMomoOperators: Record<string, Array<{ id: number; name: string; code: string; country_id: number }>> = {
  KES: [
    { id: 1, name: "Safaricom M-Pesa", code: "MPESA", country_id: 112 },
    { id: 2, name: "Airtel Money Kenya", code: "AIRTEL", country_id: 112 },
  ],
  GHS: [
    { id: 3, name: "MTN Mobile Money", code: "MTN", country_id: 80 },
    { id: 4, name: "Vodafone Cash", code: "VODAFONE", country_id: 80 },
    { id: 5, name: "AirtelTigo Money", code: "AIRTELTIGO", country_id: 80 },
  ],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currencyId = searchParams.get("currency_id") || "KES";

    if (!hasBlaaizCredentials()) {
      return NextResponse.json({
        operators: mockMomoOperators[currencyId] || mockMomoOperators.KES,
        is_mock: true,
      });
    }

    try {
      const blaaiz = getBlaaizClient();
      const operators = await blaaiz.momoOperators.list({
        currency_id: currencyId,
      });
      return NextResponse.json({ operators: operators.data });
    } catch {
      return NextResponse.json({
        operators: mockMomoOperators[currencyId] || mockMomoOperators.KES,
        is_mock: true,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
