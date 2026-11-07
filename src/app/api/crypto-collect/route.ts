import { NextResponse } from "next/server";
import { getBlaaizClient, hasBlaaizCredentials } from "@/lib/blaaiz";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, network, token } = body;

    if (!amount || !network || !token) {
      return NextResponse.json(
        { error: "amount, network and token are required" },
        { status: 400 }
      );
    }

    if (!hasBlaaizCredentials()) {
      return NextResponse.json({
        address: "0x71C...3a9B (Blaaiz Collections Gateway)",
        amount: Number(amount),
        network,
        token,
        status: "waiting_for_transfer",
        is_mock: true,
      });
    }

    try {
      const blaaiz = getBlaaizClient();
      const collection = await blaaiz.collections.initiateCrypto({
        amount: Number(amount),
        network,
        token,
        wallet_id: process.env.BLAAIZ_WALLET_ID!,
      });

      return NextResponse.json(collection.data);
    } catch {
      return NextResponse.json({
        address: "0x71C...3a9B (Blaaiz Collections Gateway)",
        amount: Number(amount),
        network,
        token,
        status: "waiting_for_transfer",
        is_mock: true,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
