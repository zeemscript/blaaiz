import { Blaaiz } from "blaaiz-nodejs-sdk";

let client: Blaaiz | null = null;

export function hasBlaaizCredentials(): boolean {
  const clientId = process.env.BLAAIZ_CLIENT_ID;
  const clientSecret = process.env.BLAAIZ_CLIENT_SECRET;
  const apiKey = process.env.BLAAIZ_API_KEY;
  return Boolean((clientId && clientSecret) || apiKey);
}

export function hasBlaaizWallet(): boolean {
  return Boolean(process.env.BLAAIZ_WALLET_ID);
}

export function getBlaaizClient(): Blaaiz {
  const clientId = process.env.BLAAIZ_CLIENT_ID;
  const clientSecret = process.env.BLAAIZ_CLIENT_SECRET;
  const apiKey = process.env.BLAAIZ_API_KEY;

  if (!(clientId && clientSecret) && !apiKey) {
    throw new Error(
      "Blaaiz credentials are not set. Add BLAAIZ_CLIENT_ID and BLAAIZ_CLIENT_SECRET " +
        "(OAuth, from the API & Webhooks page) or BLAAIZ_API_KEY (legacy) to .env.local " +
        "(see .env.local.example)."
    );
  }

  if (!client) {
    client = new Blaaiz({
      api_key: apiKey,
      client_id: clientId,
      client_secret: clientSecret,
      baseURL: process.env.BLAAIZ_API_URL || "https://api-dev.blaaiz.com",
    });
  }

  return client;
}
