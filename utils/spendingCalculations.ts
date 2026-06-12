import type { SpendingEntry } from "../types/spendingEntry";

export function isSpendingEntryFromDate(
  spendingEntry: SpendingEntry,
  targetDate: Date,
) {
  const spentDate = new Date(spendingEntry.spentAt);

  return (
    spentDate.getFullYear() === targetDate.getFullYear() &&
    spentDate.getMonth() === targetDate.getMonth() &&
    spentDate.getDate() === targetDate.getDate()
  );
}

export function getSpendingEntriesForDate(
  spendingEntries: SpendingEntry[],
  targetDate: Date,
) {
  return spendingEntries.filter((spendingEntry) => {
    return isSpendingEntryFromDate(spendingEntry, targetDate);
  });
}

export function calculateSpendingTotal(spendingEntries: SpendingEntry[]) {
  return spendingEntries.reduce((total, spendingEntry) => {
    return total + spendingEntry.amount;
  }, 0);
}
