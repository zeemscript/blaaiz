import { NextResponse } from "next/server";
import { getBlaaizClient } from "@/lib/blaaiz";

export async function GET() {
  try {
    const blaaiz = getBlaaizClient();
    const currencies = await blaaiz.currencies.list();
    return NextResponse.json({ currencies: currencies.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
