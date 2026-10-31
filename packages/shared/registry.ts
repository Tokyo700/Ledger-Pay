// Typed access to the service registry. The agent imports `registry` from here
// instead of reading registry.json directly, so a typo in the JSON fails the build.

import type { ServiceListing } from "./types.ts";
import data from "./registry.json" with { type: "json" };

export const registry: ServiceListing[] = data as ServiceListing[];

for (const s of registry) {
  if (!/^0\.0\.\d+$/.test(s.merchantAccount)) throw new Error(`Bad merchantAccount in ${s.id}`);
  if (!/^\d+(\.\d{1,6})?$/.test(s.priceUsdc)) throw new Error(`Bad priceUsdc in ${s.id}`);
}
