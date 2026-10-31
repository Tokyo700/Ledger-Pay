# LedgerPay

**A spending wallet and policy layer for AI agents that pay for APIs with x402 on Hedera.**

Built for ETHGlobal Mumbai, Hedera track: _AI Agents That Pay: x402 on Hedera_.

## What it does

An AI research agent (Claude) gets a task and a budget. It:

1. **Discovers** paid APIs from a service registry.
2. **Compares** their prices and picks the best one.
3. **Pays** for each call using x402 (HTTP 402 Payment Required), with no API keys, signups or human approval.
4. **Settles** each payment in testnet USDC on Hedera through an x402 facilitator.
5. **Stays within limits** set by the LedgerPay policy engine: total budget, per-merchant caps, allowlist, and human approval above a threshold.
6. **Logs** every payment to a Hedera Consensus Service (HCS) topic as a tamper-evident audit trail.

### Demo scenario

> "Research today's HBAR market and give me a summary in Hindi. Budget: $0.50."

The agent picks the cheaper market-data provider, pays per call, asks for human approval when it goes over a merchant limit, and returns the summary with a spend report linking every payment on HashScan.

## Architecture

```
          ┌──────────────┐   list services   ┌──────────────┐
 task ──▶ │  Agent       │ ────────────────▶ │  Registry    │
 budget   │  (Claude)    │                   └──────────────┘
          └──────┬───────┘
                 │ wants to pay
          ┌──────▼───────┐  needs approval   ┌──────────────┐
          │ Policy engine│ ────────────────▶ │  Dashboard   │ ◀── human
          └──────┬───────┘                   └──────────────┘
                 │ allowed
          ┌──────▼───────┐  402 → X-PAYMENT  ┌──────────────┐
          │ x402 client  │ ────────────────▶ │ Merchant APIs│
          └──────┬───────┘                   └──────┬───────┘
                 │                                  │ verify + settle
                 │                           ┌──────▼───────┐
                 │                           │ Facilitator  │ ──▶ Hedera testnet
                 │                           └──────────────┘
          ┌──────▼───────┐
          │ HCS audit log│ ──▶ Hedera topic
          └──────────────┘
```

## Repo layout (planned)

| Path                | What                                 | Owner               |
| ------------------- | ------------------------------------ | ------------------- |
| `apps/merchant-api` | Paid APIs behind x402 middleware     | Aditya Parihar      |
| `apps/agent`        | Claude agent with payment tools      | Prakhar Raj         |
| `packages/policy`   | Budget, limits, allowlist, approvals | Aditya Pratap Singh |
| `packages/audit`    | HCS audit log writer/reader          | Aditya Pratap Singh |
| `packages/shared`   | Shared types                         | Utkarsh Awasthi     |
| `apps/dashboard`    | Static spend dashboard               | Utkarsh Awasthi     |

## Tech stack

TypeScript (Node 20+, pnpm workspaces) · Hedera SDK · x402 · Claude (Anthropic SDK) · Hedera Consensus Service · testnet USDC (HTS)

## Setup

_Coming soon._

## Settled payments

_Hedera transaction IDs and HashScan links will be listed here._

## Team

- Utkarsh Awasthi: lead, setup, dashboard, docs
- Aditya Parihar: payments and merchant APIs
- Prakhar Raj: AI agent
- Aditya Pratap Singh: policy engine and audit log
