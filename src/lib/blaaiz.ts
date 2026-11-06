import { Blaaiz } from "blaaiz-nodejs-sdk";

let client: Blaaiz | null = null;

export function getBlaaizClient(): Blaaiz {
  if (!process.env.BLAAIZ_API_KEY) {
    throw new Error(
      "BLAAIZ_API_KEY is not set. Add it to .env.local (see .env.local.example)."
    );
  }

  if (!client) {
    client = new Blaaiz(process.env.BLAAIZ_API_KEY, {
      baseURL: process.env.BLAAIZ_API_URL || "https://api-dev.blaaiz.com",
    });
  }

  return client;
}
