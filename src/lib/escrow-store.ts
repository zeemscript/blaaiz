import { randomUUID } from "crypto";

export type EscrowStatus = "pending_funding" | "funded" | "released" | "failed";

export type Escrow = {
  id: string;
  createdAt: string;
  employerFirstName: string;
  employerLastName: string;
  employerEmail: string;
  jobDescription: string;
  freelancerFirstName: string;
  freelancerLastName: string;
  freelancerEmail: string;
  fundingAsset: "USDT" | "USDC";
  fundingAmount: number;
  cryptoNetwork: string;
  depositDetails?: Record<string, unknown>;
  payout: {
    method: string;
    to_currency_id: string;
    fields: Record<string, unknown>;
  };
  status: EscrowStatus;
  payoutResult?: unknown;
  error?: string;
};

// In-memory for the demo: fine for a single long-lived `next dev`/`next start`
// process, but state resets on restart and won't survive a serverless deploy.
const escrows = new Map<string, Escrow>();

export function createEscrow(
  data: Omit<Escrow, "id" | "createdAt" | "status">
): Escrow {
  const escrow: Escrow = {
    ...data,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending_funding",
  };
  escrows.set(escrow.id, escrow);
  return escrow;
}

export function getEscrow(id: string): Escrow | undefined {
  return escrows.get(id);
}

export function updateEscrow(
  id: string,
  patch: Partial<Escrow>
): Escrow | undefined {
  const existing = escrows.get(id);
  if (!existing) return undefined;
  const updated = { ...existing, ...patch };
  escrows.set(id, updated);
  return updated;
}

export function listEscrows(): Escrow[] {
  return Array.from(escrows.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}
