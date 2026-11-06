import { NextResponse } from "next/server";
import { getBlaaizClient } from "@/lib/blaaiz";

export async function GET() {
  try {
    const blaaiz = getBlaaizClient();
    const networks = await blaaiz.collections.getCryptoNetworks({
      transaction_type: "collection",
    });
    return NextResponse.json({ networks: networks.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
