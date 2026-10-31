// Creates the two merchant accounts (merchant1, merchant2) on Hedera testnet,
// paid for by the agent account, and writes their IDs and keys into ../.env.
// Safe to re-run: merchants that already have an account ID in .env are skipped.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import {
  AccountCreateTransaction,
  AccountId,
  Client,
  Hbar,
  PrivateKey,
} from "@hashgraph/sdk";

const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(here, "..", ".env");
dotenv.config({ path: envPath });

const { AGENT_ACCOUNT_ID, AGENT_PRIVATE_KEY } = process.env;
if (!AGENT_ACCOUNT_ID || !AGENT_PRIVATE_KEY || AGENT_ACCOUNT_ID.includes("x")) {
  console.error("Fill AGENT_ACCOUNT_ID and AGENT_PRIVATE_KEY in .env first.");
  process.exit(1);
}

const client = Client.forTestnet().setOperator(
  AccountId.fromString(AGENT_ACCOUNT_ID),
  PrivateKey.fromStringECDSA(AGENT_PRIVATE_KEY),
);

function setEnvValue(text, name, value) {
  const line = `${name}=${value}`;
  const re = new RegExp(`^${name}=.*$`, "m");
  return re.test(text) ? text.replace(re, line) : `${text.trimEnd()}\n${line}\n`;
}

let envText = fs.readFileSync(envPath, "utf8");

for (const name of ["MERCHANT1", "MERCHANT2"]) {
  const existing = process.env[`${name}_ACCOUNT_ID`];
  if (existing && !existing.includes("x")) {
    console.log(`${name}: already set (${existing}), skipping`);
    continue;
  }

  const key = PrivateKey.generateECDSA();
  const tx = new AccountCreateTransaction()
    .setInitialBalance(new Hbar(10))
    // -1 = unlimited automatic token associations, so the merchant can receive USDC
    .setMaxAutomaticTokenAssociations(-1);
  if (typeof tx.setKeyWithoutAlias === "function") tx.setKeyWithoutAlias(key.publicKey);
  else tx.setKey(key.publicKey);

  const receipt = await (await tx.execute(client)).getReceipt(client);
  const accountId = receipt.accountId.toString();

  envText = setEnvValue(envText, `${name}_ACCOUNT_ID`, accountId);
  envText = setEnvValue(envText, `${name}_PRIVATE_KEY`, `0x${key.toStringRaw()}`);
  console.log(`${name}: created ${accountId}  https://hashscan.io/testnet/account/${accountId}`);
}

fs.writeFileSync(envPath, envText);
console.log("Saved to .env");
client.close();
