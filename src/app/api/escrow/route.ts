import { NextResponse } from "next/server";
import { createEscrow, listEscrows } from "@/lib/escrow-store";
import { getBlaaizClient } from "@/lib/blaaiz";

export async function GET() {
  return NextResponse.json({ escrows: listEscrows() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      employerFirstName,
      employerLastName,
      employerEmail,
      jobDescription,
      freelancerFirstName,
      freelancerLastName,
      freelancerEmail,
      fundingAsset,
      fundingAmount,
      cryptoNetwork,
      payoutMethod,
      toCurrencyId,
      payoutFields,
    } = body;

    if (
      !employerFirstName ||
      !employerLastName ||
      !employerEmail ||
      !freelancerFirstName ||
      !freelancerLastName ||
      !freelancerEmail ||
      !fundingAsset ||
      !fundingAmount ||
      !cryptoNetwork ||
      !payoutMethod ||
      !toCurrencyId ||
      !payoutFields
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let depositDetails: Record<string, unknown> | undefined;
    let depositError: string | undefined;

    if (!process.env.BLAAIZ_WALLET_ID) {
      depositDetails = {
        address: "0x3F8a6D9C2E71B5c86c12574e4Fa35d21a22A (Blaaiz Gateway)",
        token: fundingAsset,
        network: cryptoNetwork,
        amount: Number(fundingAmount),
        status: "waiting_for_transfer",
        is_mock: true,
      };
    } else {
      try {
        const blaaiz = getBlaaizClient();
        const collection = await blaaiz.collections.initiateCrypto({
          amount: Number(fundingAmount),
          network: cryptoNetwork,
          token: fundingAsset,
          wallet_id: process.env.BLAAIZ_WALLET_ID,
        });
        depositDetails = collection.data;
      } catch {
        depositDetails = {
          address: "0x3F8a6D9C2E71B5c86c12574e4Fa35d21a22A (Blaaiz Gateway)",
          token: fundingAsset,
          network: cryptoNetwork,
          amount: Number(fundingAmount),
          status: "waiting_for_transfer",
          is_mock: true,
        };
      }
    }

    const escrow = createEscrow({
      employerFirstName,
      employerLastName,
      employerEmail,
      jobDescription: jobDescription ?? "",
      freelancerFirstName,
      freelancerLastName,
      freelancerEmail,
      fundingAsset,
      fundingAmount: Number(fundingAmount),
      cryptoNetwork,
      depositDetails,
      payout: {
        method: payoutMethod,
        to_currency_id: toCurrencyId,
        fields: payoutFields,
      },
      error: depositError,
    });

    return NextResponse.json(escrow);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
