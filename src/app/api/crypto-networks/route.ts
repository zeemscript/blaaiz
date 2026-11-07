import { NextResponse } from "next/server";
import { getBlaaizClient, hasBlaaizCredentials } from "@/lib/blaaiz";

const fallbackNetworks = [
  { id: "ETHEREUM_MAINNET", name: "Ethereum (ERC20)" },
  { id: "BSC_MAINNET", name: "BNB Smart Chain (BEP20)" },
  { id: "TRON_MAINNET", name: "Tron (TRC20)" },
  { id: "MATIC_MAINNET", name: "Polygon (MATIC)" },
];

export async function GET() {
  try {
    if (!hasBlaaizCredentials()) {
      return NextResponse.json({ networks: fallbackNetworks, is_mock: true });
    }

    try {
      const blaaiz = getBlaaizClient();
      const networks = await blaaiz.collections.getCryptoNetworks({
        transaction_type: "collection",
      });
      return NextResponse.json({ networks: networks.data });
    } catch {
      return NextResponse.json({ networks: fallbackNetworks, is_mock: true });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
