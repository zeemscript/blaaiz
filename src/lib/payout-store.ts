export type PayoutTimelineEvent = {
  step: number;
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "processing" | "pending";
};

export type PayoutRecord = {
  id: string;
  reference: string;
  createdAt: string;
  status: "completed" | "processing" | "pending";
  sender: {
    firstName: string;
    lastName: string;
    email: string;
  };
  recipient: {
    name: string;
    account: string;
    destination: string;
    flag: string;
    method: string;
  };
  amount: {
    fromAmount: number;
    fromCurrency: string;
    toAmount: number;
    toCurrency: string;
    rate: number;
    fee: string;
  };
  timeline: PayoutTimelineEvent[];
  apiLog: {
    sdkMethod: string;
    endpoint: string;
    durationMs: number;
    requestPayload: Record<string, unknown>;
    responsePayload: Record<string, unknown>;
    webhookSimulated?: {
      event: string;
      signatureHeader: string;
    };
  };
};

const defaultSeedPayouts: PayoutRecord[] = [
  {
    id: "trx_blz_seed_01",
    reference: "BLZ-8842109",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: "completed",
    sender: {
      firstName: "Alex",
      lastName: "Morrison",
      email: "alex.m@clientdesign.com",
    },
    recipient: {
      name: "Chukwudi Eze",
      account: "Access Bank · 0441234567",
      destination: "Nigeria",
      flag: "🇳🇬",
      method: "bank_transfer",
    },
    amount: {
      fromAmount: 500,
      fromCurrency: "USDT",
      toAmount: 825000,
      toCurrency: "NGN",
      rate: 1650,
      fee: "1.50 USDT",
    },
    timeline: [
      {
        step: 1,
        title: "Transfer Initiated",
        description: "Blaaiz customer profile created & compliance verified",
        timestamp: "12 mins ago",
        status: "completed",
      },
      {
        step: 2,
        title: "FX Rate Locked",
        description: "1 USDT = 1,650 NGN locked via Blaaiz Quote Engine",
        timestamp: "12 mins ago",
        status: "completed",
      },
      {
        step: 3,
        title: "Dispatched to Rail",
        description: "Dispatched to Nigeria Inter-Bank Settlement System (NIBSS)",
        timestamp: "11 mins ago",
        status: "completed",
      },
      {
        step: 4,
        title: "Funds Delivered",
        description: "Credited to Access Bank account 0441234567",
        timestamp: "10 mins ago",
        status: "completed",
      },
    ],
    apiLog: {
      sdkMethod: "blaaiz.createCompletePayout()",
      endpoint: "POST /v1/payouts",
      durationMs: 284,
      requestPayload: {
        wallet_id: "wallet_blz_sandbox_99a",
        method: "bank_transfer",
        from_amount: 500,
        from_currency_id: "USDT",
        to_currency_id: "NGN",
        bank_id: "044",
        account_number: "0441234567",
      },
      responsePayload: {
        status: "success",
        code: 200,
        transaction_id: "trx_blz_seed_01",
        payout_status: "settled",
      },
      webhookSimulated: {
        event: "transfer.completed",
        signatureHeader: "x-blaaiz-signature: 4f9c819a...",
      },
    },
  },
  {
    id: "trx_blz_seed_02",
    reference: "BLZ-7739102",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: "completed",
    sender: {
      firstName: "Sarah",
      lastName: "Jenkins",
      email: "sarah@techpartners.io",
    },
    recipient: {
      name: "Faith Wanjiku",
      account: "Safaricom M-Pesa · +254 712 345 678",
      destination: "Kenya",
      flag: "🇰🇪",
      method: "mobile_money",
    },
    amount: {
      fromAmount: 250,
      fromCurrency: "USD",
      toAmount: 32250,
      toCurrency: "KES",
      rate: 129,
      fee: "2.00 USD",
    },
    timeline: [
      {
        step: 1,
        title: "Transfer Initiated",
        description: "Customer verification passed on Blaaiz RaaS",
        timestamp: "35 mins ago",
        status: "completed",
      },
      {
        step: 2,
        title: "FX Rate Locked",
        description: "1 USD = 129 KES locked via fees.getBreakdown",
        timestamp: "35 mins ago",
        status: "completed",
      },
      {
        step: 3,
        title: "Dispatched to Rail",
        description: "Dispatched to Safaricom Kenya M-Pesa gateway",
        timestamp: "34 mins ago",
        status: "completed",
      },
      {
        step: 4,
        title: "Funds Delivered",
        description: "Credited instantly to Safaricom mobile wallet",
        timestamp: "33 mins ago",
        status: "completed",
      },
    ],
    apiLog: {
      sdkMethod: "blaaiz.createCompletePayout()",
      endpoint: "POST /v1/payouts",
      durationMs: 310,
      requestPayload: {
        wallet_id: "wallet_blz_sandbox_99a",
        method: "mobile_money",
        from_amount: 250,
        from_currency_id: "USD",
        to_currency_id: "KES",
        mobile_money_operator_id: 1,
        phone_number: "+254712345678",
      },
      responsePayload: {
        status: "success",
        code: 200,
        transaction_id: "trx_blz_seed_02",
        payout_status: "settled",
      },
      webhookSimulated: {
        event: "transfer.completed",
        signatureHeader: "x-blaaiz-signature: 89b2f0a1...",
      },
    },
  },
];

const store = new Map<string, PayoutRecord>(
  defaultSeedPayouts.map((p) => [p.reference.toUpperCase(), p])
);

export function savePayoutRecord(record: PayoutRecord): PayoutRecord {
  store.set(record.reference.toUpperCase(), record);
  return record;
}

export function getPayoutRecord(referenceOrId: string): PayoutRecord | undefined {
  const query = referenceOrId.trim().toUpperCase();
  for (const record of store.values()) {
    if (
      record.reference.toUpperCase() === query ||
      record.id.toUpperCase() === query
    ) {
      return record;
    }
  }
  return undefined;
}

export function listRecentPayouts(): PayoutRecord[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

