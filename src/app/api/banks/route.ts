import { NextResponse } from "next/server";
import { getBlaaizClient } from "@/lib/blaaiz";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "NG";
    const blaaiz = getBlaaizClient();
    const banks = await blaaiz.banks.list({ country });
    return NextResponse.json({ banks: banks.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
