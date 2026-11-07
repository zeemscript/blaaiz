import type { PayoutData } from "blaaiz-nodejs-sdk";
import { getBlaaizClient } from "@/lib/blaaiz";

export type PayoutRequest = {
  sender_first_name: string;
  sender_last_name: string;
  sender_email: string;
  sender_country?: string;
  from_amount: number;
  from_currency_id: string;
  to_currency_id: string;
  method: string;
  [key: string]: unknown;
};

export async function sendPayout(request: PayoutRequest) {
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
  } = request;

  if (!process.env.BLAAIZ_WALLET_ID) {
    throw new Error(
      "BLAAIZ_WALLET_ID is not set. Add your wallet id to .env.local."
    );
  }

  const blaaiz = getBlaaizClient();

  return blaaiz.createCompletePayout({
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
}
