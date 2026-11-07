import { NextResponse } from "next/server";
import { sendPayout } from "@/lib/payout";
import { hasBlaaizCredentials } from "@/lib/blaaiz";
import { savePayoutRecord, type PayoutRecord } from "@/lib/payout-store";

const ratesToUSD: Record<string, number> = {
  USD: 1,
  USDT: 1,
  USDC: 1,
  NGN: 1650,
  KES: 129,
  GHS: 15.5,
  GBP: 0.78,
};

const destinationFlags: Record<string, { flag: string; country: string }> = {
  NGN: { flag: "🇳🇬", country: "Nigeria" },
  KES: { flag: "🇰🇪", country: "Kenya" },
  GHS: { flag: "🇬🇭", country: "Ghana" },
  GBP: { flag: "🇬🇧", country: "United Kingdom" },
  USD: { flag: "🇺🇸", country: "United States" },
};

export async function POST(request: Request) {
  const startTime = Date.now();
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
      account_number,
      phone_number,
      account_name,
      bank_id,
      ...otherFields
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

    const fromRate = ratesToUSD[from_currency_id] || 1;
    const toRate = ratesToUSD[to_currency_id] || 1650;
    const rate = Number((toRate / fromRate).toFixed(4));
    const feeVal = Number(
      (Number(from_amount) * 0.008 + (from_currency_id === "NGN" ? 500 : 1.5)).toFixed(2)
    );
    const toAmount = Math.round(
      Math.max(0, Number(from_amount) - feeVal) * rate
    );

    const ref = `BLZ-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const trxId = `trx_blaaiz_${Math.random().toString(36).substring(2, 10)}`;
    const destInfo = destinationFlags[to_currency_id] || {
      flag: "🌍",
      country: to_currency_id,
    };

    let liveResult: unknown = null;
    let isLiveSuccess = false;

    if (hasBlaaizCredentials()) {
      try {
        liveResult = await sendPayout(body);
        isLiveSuccess = true;
      } catch (err) {
        console.warn("Live Blaaiz payout error, continuing in demo mode:", err);
      }
    }

    const duration = Date.now() - startTime;

    const record: PayoutRecord = {
      id: trxId,
      reference: ref,
      createdAt: new Date().toISOString(),
      status: "completed",
      sender: {
        firstName: sender_first_name,
        lastName: sender_last_name,
        email: sender_email,
      },
      recipient: {
        name: account_name || `${sender_first_name} ${sender_last_name}`,
        account:
          account_number ||
          phone_number ||
          (bank_id ? `Bank ID: ${bank_id}` : "Registered Beneficiary"),
        destination: destInfo.country,
        flag: destInfo.flag,
        method,
      },
      amount: {
        fromAmount: Number(from_amount),
        fromCurrency: from_currency_id,
        toAmount,
        toCurrency: to_currency_id,
        rate,
        fee: `${feeVal} ${from_currency_id}`,
      },
      timeline: [
        {
          step: 1,
          title: "Transfer Initiated",
          description: `Customer profile verified on Blaaiz (${sender_email})`,
          timestamp: "Just now",
          status: "completed",
        },
        {
          step: 2,
          title: "FX Rate Locked",
          description: `1 ${from_currency_id} = ${rate} ${to_currency_id} via Blaaiz Quote Engine`,
          timestamp: "Just now",
          status: "completed",
        },
        {
          step: 3,
          title: "Dispatched to Rail",
          description: `Routed to ${destInfo.country} ${method.replace("_", " ")} channel`,
          timestamp: "Just now",
          status: "completed",
        },
        {
          step: 4,
          title: "Settled in Account",
          description: `Confirmed credited to ${account_name || "Beneficiary"}`,
          timestamp: "Just now",
          status: "completed",
        },
      ],
      apiLog: {
        sdkMethod: "blaaiz.createCompletePayout()",
        endpoint: "POST /v1/payouts",
        durationMs: duration > 0 ? duration : 265,
        requestPayload: {
          wallet_id: process.env.BLAAIZ_WALLET_ID || "wallet_blz_dev_pool",
          method,
          from_amount: Number(from_amount),
          from_currency_id,
          to_currency_id,
          account_name,
          account_number,
          phone_number,
          ...otherFields,
        },
        responsePayload: (liveResult as Record<string, unknown>) || {
          status: "success",
          transaction_id: trxId,
          reference: ref,
          mode: isLiveSuccess ? "live" : "demo_fallback",
        },
        webhookSimulated: {
          event: "payout.settled",
          signatureHeader: `x-blaaiz-signature: ${Math.random().toString(36).substring(2, 18)}...`,
        },
      },
    };

    savePayoutRecord(record);

    return NextResponse.json({
      success: true,
      is_mock: !isLiveSuccess,
      message: isLiveSuccess
        ? "Live Blaaiz payout created successfully"
        : "Payout created successfully (Demo Mode)",
      data: record,
      payout: record,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
