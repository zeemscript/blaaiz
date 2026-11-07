import { NextResponse } from "next/server";
import { sendPayout } from "@/lib/payout";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sender_first_name,
      sender_last_name,
      sender_email,
      from_amount,
      from_currency_id,
      to_currency_id,
      method,
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

    const result = await sendPayout(body);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
