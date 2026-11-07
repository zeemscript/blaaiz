import { NextResponse } from "next/server";
import { getBlaaizClient, hasBlaaizCredentials } from "@/lib/blaaiz";

const mockCurrencies = [
  { id: "NGN", code: "NGN", name: "Nigerian Naira" },
  { id: "KES", code: "KES", name: "Kenyan Shilling" },
  { id: "GHS", code: "GHS", name: "Ghanaian Cedi" },
  { id: "GBP", code: "GBP", name: "British Pound" },
  { id: "USD", code: "USD", name: "US Dollar" },
  { id: "USDT", code: "USDT", name: "Tether USD" },
  { id: "USDC", code: "USDC", name: "USD Coin" },
];

export async function GET() {
  try {
    if (!hasBlaaizCredentials()) {
      return NextResponse.json({ currencies: mockCurrencies, is_mock: true });
    }

    try {
      const blaaiz = getBlaaizClient();
      const currencies = await blaaiz.currencies.list();
      return NextResponse.json({ currencies: currencies.data });
    } catch {
      return NextResponse.json({ currencies: mockCurrencies, is_mock: true });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
