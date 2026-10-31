// Associates testnet USDC with the agent and both merchant accounts, so they can
// hold and receive it. Writes USDC_TOKEN_ID into ../.env if it isn't set yet.
// Safe to re-run: accounts that are already associated are reported and skipped.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import {
  AccountId,
  Client,
  PrivateKey,
  Status,
  TokenAssociateTransaction,
  TokenId,
} from "@hashgraph/sdk";

// Circle's testnet USDC on Hedera
const DEFAULT_USDC_TOKEN_ID = "0.0.429274";

const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(here, "..", ".env");
dotenv.config({ path: envPath });

let tokenId = process.env.USDC_TOKEN_ID;
if (!tokenId || tokenId.includes("x")) {
  tokenId = DEFAULT_USDC_TOKEN_ID;
  const envText = fs.readFileSync(envPath, "utf8");
  const re = /^USDC_TOKEN_ID=.*$/m;
  const line = `USDC_TOKEN_ID=${tokenId}`;
  fs.writeFileSync(envPath, re.test(envText) ? envText.replace(re, line) : `${envText.trimEnd()}\n${line}\n`);
}

const client = Client.forTestnet().setOperator(
  AccountId.fromString(process.env.AGENT_ACCOUNT_ID),
  PrivateKey.fromStringECDSA(process.env.AGENT_PRIVATE_KEY),
);

for (const name of ["AGENT", "MERCHANT1", "MERCHANT2"]) {
  const accountId = process.env[`${name}_ACCOUNT_ID`];
  const key = PrivateKey.fromStringECDSA(process.env[`${name}_PRIVATE_KEY`]);

  const tx = await new TokenAssociateTransaction()
    .setAccountId(AccountId.fromString(accountId))
    .setTokenIds([TokenId.fromString(tokenId)])
    .freezeWith(client)
    .sign(key);

  try {
    await (await tx.execute(client)).getReceipt(client);
    console.log(`${name} (${accountId}): USDC associated`);
  } catch (err) {
    if (err.status === Status.TokenAlreadyAssociatedToAccount) {
      console.log(`${name} (${accountId}): already associated`);
    } else {
      throw err;
    }
  }
}

console.log(`USDC token: ${tokenId}  https://hashscan.io/testnet/token/${tokenId}`);
client.close();
