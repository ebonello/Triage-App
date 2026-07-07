import type { BankTransaction } from "../types/bankTransaction";
import type { LedgerItem } from "../types/ledgerItem";
import type { SpendingEntry } from "../types/spendingEntry";

export function getLocalDateStringFromTimestamp(timestamp: string) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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
