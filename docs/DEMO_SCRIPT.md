# LedgerPay demo video script (target 4:30, hard limit 5:00)

Judges' hard requirements, so make sure the video shows them:
1. An x402 payment settling on Hedera testnet
2. A click-through to that transaction **on HashScan**
3. The agent paying with no human approving (at least once)

Anything marked **(if built)** depends on a feature that may not be finished. Cut it rather than fake it.

## Before recording

- [ ] Agent wallet has USDC and merchants are running (`apps/merchant-api` on port 4021)
- [ ] Dashboard open with `?api=...` and showing **Live**, not the mock-data banner
- [ ] Budget is reset to $0.50 and the approval threshold is set so the premium call needs approval
- [ ] Browser tabs ready: dashboard, HashScan (one settled tx), HashScan audit topic `0.0.11257604`
- [ ] Do one full dry run first, then record. Keep the first working run's tx ID for the README.
- [ ] Hide `.env`, terminals with keys, and password managers from the screen

## Script

### 0:00-0:30 The problem (face or title slide)
> "AI agents can plan and call tools, but they can't pay for what they use. Today that means API keys, subscriptions and a human with a credit card. x402 fixes this: a server answers HTTP 402 with a price, and the agent pays inside the request. We built LedgerPay on Hedera: the spending wallet that lets an agent pay safely, on its own."

### 0:30-1:00 The setup (architecture diagram from README)
> "A research agent powered by Claude gets a task and a budget. It reads a service registry, compares prices, and pays each merchant through x402. Payments settle in USDC on Hedera, and the facilitator pays the gas, so the agent holds no HBAR for fees. A policy engine sits in front of every payment, and every payment is written to an HCS topic as a tamper-evident log."

### 1:00-1:30 The task (dashboard + agent terminal side by side)
Type the task: *"Research today's HBAR market and give me a summary in Hindi. Budget: $0.50."*
> "The dashboard shows the budget, $0.50, and no payments yet."

### 1:30-2:30 Discovery and the first payment (no human involved)
Show the agent listing services and explaining its choice.
> "The agent finds two market-data providers: $0.01 and $0.03. It picks the cheaper one and tells us why."

Show the 402 response, then the payment going through.
> "The server replied 402 with the price. The agent signed a USDC payment and retried. No API key, no signup, no human."

**Switch to HashScan: open the first transaction.**
> "Here it is on Hedera: a USDC transfer from the agent to merchant one, settled in seconds."

*This is the required "payment settles + HashScan link" moment. Hold on this screen for about 5 seconds.*

### 2:30-3:30 Spending controls (the human-in-the-loop moment)
Agent asks for the premium service. The dashboard shows a pending approval.
> "The agent now wants deeper data from the $0.03 provider. That's above our approval threshold, so the policy engine stops the payment and asks a human."

Click **Approve** on the dashboard. **(if built: also show one deny, e.g. a merchant that isn't on the allowlist.)**
> "Budget, per-merchant limits, an allowlist, and human approval above a threshold. The agent can't overspend even if it wants to."

### 3:30-4:00 The audit trail
Open the HCS topic `0.0.11257604` on HashScan and scroll the messages.
> "Every payment is also logged to this Hedera Consensus Service topic. Nobody can edit it afterwards, so you can audit exactly what your agent spent and why."

### 4:00-4:30 The result
Show the agent's final answer: the Hindi summary plus the spend report.
> "The agent returns the Hindi summary and a spend report: each payment, its HashScan link, and the budget left."

### 4:30-5:00 Close (title slide)
> "LedgerPay: agents that can pay, with limits you control and a record you can trust. x402, USDC and HCS on Hedera. Code and transaction IDs are in the README. Thank you."

## Bonus items to mention (one sentence each, only if built)
- Settles in an HTS token (USDC): yes, say it
- HCS audit log: yes, say it
- Spending controls: yes, say it
- Hedera Agent Kit: only if actually used
- Agent identity (HCS-14 or ERC-8004), Scheduled Transactions, A2A negotiation: only if actually built

## Recording tips
- Someone with a high-end laptop records (OBS or the built-in screen recorder, 1080p).
- Record the screen and voice-over separately if anyone stumbles. Keep each section as its own take.
- Keep the final file under 5:00 and check it before uploading, since the limit is strict.
- Put the video link and the HashScan tx IDs in the README before submitting.
