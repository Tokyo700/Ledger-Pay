// Shared types for LedgerPay. Every app and package codes against these,
// so change them only after telling the whole team.
//
// Money convention: all amounts are USDC as decimal strings, e.g. "0.05".
// (USDC has 6 decimals on Hedera; convert to base units only at payment time.)

/** What a paid service can do. Add new capabilities here. */
export type Capability = "market-data" | "translate-summarize";

/** One entry in the service registry (registry.json). Owner: Utkarsh. */
export type ServiceListing = {
  id: string; // e.g. "market-data-cheap"
  name: string; // human-readable name
  capability: Capability;
  url: string; // x402-protected endpoint
  priceUsdc: string; // price per call, e.g. "0.01"
  merchantAccount: string; // Hedera account that gets paid, e.g. "0.0.11257515"
  description: string; // what the agent reads to decide
};

/** Spending rules for one agent. Owner: Aditya Pratap Singh. */
export type SpendingPolicy = {
  totalBudgetUsdc: string; // max the agent may spend in this run
  perMerchantLimitUsdc: string; // max total per merchant account
  approvalThresholdUsdc: string; // single payments above this need a human
  allowedMerchants: string[]; // account IDs the agent may pay
};

/** Result of checking a payment against the policy. Owner: Aditya Pratap Singh. */
export type PolicyDecision =
  | { status: "allow" }
  | { status: "needs_approval"; approvalId: string }
  | { status: "deny"; reason: string };

/** A payment waiting for a human on the dashboard. */
export type ApprovalRequest = {
  approvalId: string;
  serviceId: string;
  merchant: string;
  amountUsdc: string;
  reason: string; // why the agent wants to pay
  createdAt: string; // ISO timestamp
  status: "pending" | "approved" | "rejected";
};

/** One settled payment. Written to the HCS audit topic. Owner: Aditya Pratap Singh. */
export type SpendRecord = {
  agentId: string; // agent's Hedera account ID
  serviceId: string;
  merchant: string;
  amountUsdc: string;
  txId: string; // Hedera transaction ID, e.g. "0.0.11227643@1730400000.123456789"
  reason: string;
  timestamp: string; // ISO timestamp
};

/** Result of one paid call made by the agent. Owner: Aditya Parihar (client) / Prakhar (agent). */
export type PaidCallResult = {
  ok: boolean;
  serviceId: string;
  data?: unknown; // response body from the merchant
  txId?: string; // set when a payment settled
  error?: string;
};

/** What GET /api/state returns. Owner: Aditya Pratap Singh (server), Utkarsh (dashboard). */
export type DashboardState = {
  agentId: string;
  task: string | null; // what the agent is working on
  policy: SpendingPolicy;
  spentUsdc: string;
  remainingUsdc: string;
  pendingApprovals: ApprovalRequest[];
  payments: SpendRecord[]; // newest first
  auditTopicId: string;
};

/** HashScan link helpers, used by the agent report and the dashboard. */
export const hashscan = {
  tx: (txId: string) => `https://hashscan.io/testnet/transaction/${txId}`,
  account: (id: string) => `https://hashscan.io/testnet/account/${id}`,
  topic: (id: string) => `https://hashscan.io/testnet/topic/${id}`,
};
