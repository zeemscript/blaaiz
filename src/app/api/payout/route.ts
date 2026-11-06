import { NextResponse } from "next/server";
import type { PayoutData } from "blaaiz-nodejs-sdk";
import { getBlaaizClient } from "@/lib/blaaiz";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sender_first_name,
      sender_last_name,
      sender_email,
      sender_country,
      from_amount,
      from_currency_id,
      to_currency_id,
      method,
      ...payoutFields
    } = body;

    if (
      !sender_first_name ||
      !sender_last_name ||
      !sender_email ||
      !from_amount ||
      !from_currency_id ||
      !to_currency_id ||
      !method
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const result = await blaaiz.createCompletePayout({
      customerData: {
        first_name: sender_first_name,
        last_name: sender_last_name,
        type: "individual",
        email: sender_email,
        country: sender_country || "NG",
        id_type: "passport",
        id_number: "A12345678",
      },
      // `customer_id` is required by PayoutData's type, but createCompletePayout
      // injects it itself after creating the customer (see SDK README), so it's
      // intentionally omitted here.
      payoutData: {
        wallet_id: process.env.BLAAIZ_WALLET_ID,
        method,
        from_amount: Number(from_amount),
        from_currency_id,
        to_currency_id,
        ...payoutFields,
      } as unknown as PayoutData,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
