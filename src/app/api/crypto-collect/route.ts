import { NextResponse } from "next/server";
import { getBlaaizClient } from "@/lib/blaaiz";

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

    if (!process.env.BLAAIZ_WALLET_ID) {
      return NextResponse.json(
        {
          error:
            "BLAAIZ_WALLET_ID is not set. Add your wallet id to .env.local.",
        },
        { status: 500 }
      );
    }

    const blaaiz = getBlaaizClient();
    const collection = await blaaiz.collections.initiateCrypto({
      amount: Number(amount),
      network,
      token,
      wallet_id: process.env.BLAAIZ_WALLET_ID,
    });

    return NextResponse.json(collection.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
