import { NextResponse } from "next/server";
import { getBlaaizClient } from "@/lib/blaaiz";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const currencyId = searchParams.get("currency_id");

    if (!currencyId) {
      return NextResponse.json(
        { error: "currency_id is required" },
        { status: 400 }
      );
    }

    const blaaiz = getBlaaizClient();
    const operators = await blaaiz.momoOperators.list({
      currency_id: currencyId,
    });
    return NextResponse.json({ operators: operators.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
