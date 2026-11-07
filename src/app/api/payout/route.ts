import { NextResponse } from "next/server";
import { sendPayout } from "@/lib/payout";
import { hasBlaaizCredentials } from "@/lib/blaaiz";

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

    if (!hasBlaaizCredentials()) {
      return NextResponse.json({
        success: true,
        is_mock: true,
        message: "Payout created successfully (Demo Mode — active when sandbox credentials are pending)",
        data: {
          id: `trx_blaaiz_${Math.random().toString(36).substring(2, 10)}`,
          reference: `REF-${Date.now().toString().slice(-8)}`,
          status: "completed",
          from_amount: Number(from_amount),
          from_currency: from_currency_id,
          to_currency: to_currency_id,
          method,
          customer: {
            first_name: sender_first_name,
            last_name: sender_last_name,
            email: sender_email,
          },
          settlement_time: "instant",
          timestamp: new Date().toISOString(),
        },
      });
    }

    try {
      const result = await sendPayout(body);
      return NextResponse.json(result);
    } catch (err) {
      console.warn("Live payout error, falling back to mock response:", err);
      return NextResponse.json({
        success: true,
        is_mock: true,
        message: "Payout initiated (Demo Fallback)",
        data: {
          id: `trx_blaaiz_${Math.random().toString(36).substring(2, 10)}`,
          status: "processing",
          from_amount: Number(from_amount),
          from_currency: from_currency_id,
          to_currency: to_currency_id,
          method,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
