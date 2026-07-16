import type { LedgerItem } from "../types/ledgerItem";

export function calculateLedgerItemTotal(ledgerItems: LedgerItem[]) {
  return ledgerItems.reduce((total, ledgerItem) => {
    return total + ledgerItem.amount;
  }, 0);
}
