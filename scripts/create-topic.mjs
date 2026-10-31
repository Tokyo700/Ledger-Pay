// Creates the HCS topic used as LedgerPay's tamper-evident audit log and writes
// AUDIT_TOPIC_ID into ../.env. Only the agent key can submit messages to it.
// Safe to re-run: does nothing if AUDIT_TOPIC_ID is already set.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { AccountId, Client, PrivateKey, TopicCreateTransaction } from "@hashgraph/sdk";

const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(here, "..", ".env");
dotenv.config({ path: envPath });

const existing = process.env.AUDIT_TOPIC_ID;
if (existing && !existing.includes("x")) {
  console.log(`AUDIT_TOPIC_ID already set (${existing}), skipping`);
  process.exit(0);
}

const agentKey = PrivateKey.fromStringECDSA(process.env.AGENT_PRIVATE_KEY);
const client = Client.forTestnet().setOperator(
  AccountId.fromString(process.env.AGENT_ACCOUNT_ID),
  agentKey,
);

const receipt = await (
  await new TopicCreateTransaction()
    .setTopicMemo("LedgerPay agent spend audit log")
    .setSubmitKey(agentKey.publicKey)
    .execute(client)
).getReceipt(client);
const topicId = receipt.topicId.toString();

const envText = fs.readFileSync(envPath, "utf8");
const re = /^AUDIT_TOPIC_ID=.*$/m;
const line = `AUDIT_TOPIC_ID=${topicId}`;
fs.writeFileSync(envPath, re.test(envText) ? envText.replace(re, line) : `${envText.trimEnd()}\n${line}\n`);

console.log(`Audit topic created: ${topicId}  https://hashscan.io/testnet/topic/${topicId}`);
console.log("Saved to .env");
client.close();
