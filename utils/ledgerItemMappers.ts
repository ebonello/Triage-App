import type { BankTransaction } from "../types/bankTransaction";
import type { LedgerItem } from "../types/ledgerItem";
import type { SpendingEntry } from "../types/spendingEntry";
import { getLocalDateStringFromTimestamp } from "./dateUtils";

export function mapSpendingEntryToLedgerItem(
  spendingEntry: SpendingEntry,
): LedgerItem {
  return {
    id: `manual:${spendingEntry.id}`,
    sourceId: spendingEntry.id,
    source: "manual",
    amount: spendingEntry.amount,
    description: spendingEntry.description,
    spentOn: getLocalDateStringFromTimestamp(spendingEntry.spentAt),
    isPending: false,
  };
}

export function mapBankTransactionToLedgerItem(
  bankTransaction: BankTransaction,
): LedgerItem {
  const description = bankTransaction.merchant_name ?? bankTransaction.name;

  const spentOn = bankTransaction.authorized_date ?? bankTransaction.date;

  const category = bankTransaction.personal_finance_category?.primary;

  const ledgerItem: LedgerItem = {
    id: `bank:${bankTransaction.transaction_id}`,
    sourceId: bankTransaction.transaction_id,
    source: "bank",
    amount: bankTransaction.amount,
    description,
    spentOn,
    isPending: bankTransaction.pending,
  };

  if (category !== undefined) {
    ledgerItem.category = category;
  }

  return ledgerItem;
}
