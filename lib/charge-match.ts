import type { Charge } from "./finance-data";

const MERCHANT_ALIASES: Record<string, string[]> = {
  aws: ["amazon web services"],
  "amazon web services": ["aws"],
};

/** Resolve a user or model reference to a charge row (id, partial merchant, alias). */
export function matchChargeRef(
  charges: Charge[],
  ref: string,
  amountHint?: number,
): Charge | undefined {
  const q = ref.trim().toLowerCase();
  if (!q) return undefined;

  let candidates = charges.filter((c) => {
    if (c.id.toLowerCase() === q) return true;
    if (c.merchant.toLowerCase().includes(q)) return true;
    const aliases = MERCHANT_ALIASES[q] ?? [];
    if (aliases.some((a) => c.merchant.toLowerCase().includes(a))) return true;
    for (const [key, values] of Object.entries(MERCHANT_ALIASES)) {
      if (q.includes(key) && values.some((a) => c.merchant.toLowerCase().includes(a))) {
        return true;
      }
    }
    return false;
  });

  if (amountHint != null && candidates.length > 1) {
    const byAmount = candidates.filter((c) => c.amount === amountHint);
    if (byAmount.length === 1) return byAmount[0];
  }

  if (candidates.length === 1) return candidates[0];

  if (amountHint != null) {
    const byAmount = charges.filter((c) => c.amount === amountHint);
    if (byAmount.length === 1) return byAmount[0];
  }

  return candidates.sort((a, b) => b.amount - a.amount)[0];
}
