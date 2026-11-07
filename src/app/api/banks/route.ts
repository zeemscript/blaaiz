import { NextResponse } from "next/server";
import { getBlaaizClient, hasBlaaizCredentials } from "@/lib/blaaiz";

const mockBanksNG = [
  { id: "044", name: "Access Bank", code: "044", country: "NG" },
  { id: "058", name: "Guaranty Trust Bank (GTBank)", code: "058", country: "NG" },
  { id: "057", name: "Zenith Bank", code: "057", country: "NG" },
  { id: "033", name: "United Bank for Africa (UBA)", code: "033", country: "NG" },
  { id: "011", name: "First Bank of Nigeria", code: "011", country: "NG" },
  { id: "070", name: "Fidelity Bank", code: "070", country: "NG" },
  { id: "999992", name: "OPay Digital Services", code: "999992", country: "NG" },
  { id: "999991", name: "Kuda Microfinance Bank", code: "999991", country: "NG" },
];

const mockBanksGB = [
  { id: "barclays", name: "Barclays Bank", code: "20-00-00", country: "GB" },
  { id: "hsbc", name: "HSBC UK", code: "40-00-00", country: "GB" },
  { id: "revolut", name: "Revolut Ltd", code: "04-00-75", country: "GB" },
  { id: "lloyds", name: "Lloyds Bank", code: "30-00-00", country: "GB" },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "NG";

    if (!hasBlaaizCredentials()) {
      return NextResponse.json({
        banks: country === "GB" ? mockBanksGB : mockBanksNG,
        is_mock: true,
      });
    }

    try {
      const blaaiz = getBlaaizClient();
      const banks = await blaaiz.banks.list({ country });
      return NextResponse.json({ banks: banks.data });
    } catch {
      return NextResponse.json({
        banks: country === "GB" ? mockBanksGB : mockBanksNG,
        is_mock: true,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
