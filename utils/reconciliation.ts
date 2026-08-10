import type { BankTransaction } from "../types/bankTransaction";
import type { SpendingEntry } from "../types/spendingEntry";
import { getLocalDateStringFromTimestamp } from "./dateUtils";

const MAX_RECONCILIATION_DATE_DISTANCE_DAYS = 3;

export type ReconciliationCandidate = {
  spendingEntry: SpendingEntry;
  bankTransaction: BankTransaction;
  daysApart: number;
};

/*
  Convert dollars into integer cents before comparing amounts.

  Comparing 650 === 650 is safer than relying directly on
  floating-point dollar values such as 6.5.
*/
function convertAmountToCents(amount: number) {
  return Math.round(amount * 100);
}

function getBankTransactionDate(bankTransaction: BankTransaction) {
  return bankTransaction.authorized_date ?? bankTransaction.date;
}

/*
  Date-only strings such as 2026-08-07 are safe to compare by UTC
  because we only care about the number of calendar days between them.
*/
function getDateDistanceInDays(
  firstDateString: string,
  secondDateString: string,
) {
  const firstDate = new Date(`${firstDateString}T00:00:00Z`);
  const secondDate = new Date(`${secondDateString}T00:00:00Z`);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.abs(
    Math.round(
      (firstDate.getTime() - secondDate.getTime()) / millisecondsPerDay,
    ),
  );
}

function normalizeDescription(description: string) {
  return description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
  Description similarity is used only to rank multiple possible
  matches. It is NOT required for a candidate to exist.

  This is important because a user might enter "Coffee" while
  the bank eventually reports "STARBUCKS STORE 01234".
*/
function getDescriptionMatchScore(
  manualDescription: string,
  bankDescription: string,
) {
  const normalizedManualDescription = normalizeDescription(manualDescription);

  const normalizedBankDescription = normalizeDescription(bankDescription);

  if (
    normalizedManualDescription.length === 0 ||
    normalizedBankDescription.length === 0
  ) {
    return 0;
  }

  if (normalizedManualDescription === normalizedBankDescription) {
    return 3;
  }

  if (
    normalizedManualDescription.includes(normalizedBankDescription) ||
    normalizedBankDescription.includes(normalizedManualDescription)
  ) {
    return 2;
  }

  const manualWords = normalizedManualDescription.split(" ");
  const bankWords = new Set(normalizedBankDescription.split(" "));

  const hasMatchingWord = manualWords.some((word) => bankWords.has(word));

  return hasMatchingWord ? 1 : 0;
}

/*
  Find the best manual match for each newly imported bank transaction.

  Requirements:
  - exact amount in cents
  - purchase dates no more than 3 days apart
  - manual entry has not already been reconciled

  Each manual entry and bank transaction can only participate
  in one reconciliation candidate.
*/
export function findReconciliationCandidates(
  spendingEntries: readonly SpendingEntry[],
  newBankTransactions: readonly BankTransaction[],
): ReconciliationCandidate[] {
  const availableSpendingEntries = spendingEntries.filter(
    (spendingEntry) => spendingEntry.reconciledBankTransactionId === undefined,
  );

  const usedSpendingEntryIds = new Set<string>();

  const reconciliationCandidates: ReconciliationCandidate[] = [];

  for (const bankTransaction of newBankTransactions) {
    const bankAmountInCents = convertAmountToCents(bankTransaction.amount);

    const bankDate = getBankTransactionDate(bankTransaction);

    const possibleMatches = availableSpendingEntries
      .filter((spendingEntry) => {
        if (usedSpendingEntryIds.has(spendingEntry.id)) {
          return false;
        }

        const manualAmountInCents = convertAmountToCents(spendingEntry.amount);

        if (manualAmountInCents !== bankAmountInCents) {
          return false;
        }

        const manualDate = getLocalDateStringFromTimestamp(
          spendingEntry.spentAt,
        );

        const daysApart = getDateDistanceInDays(manualDate, bankDate);

        return daysApart <= MAX_RECONCILIATION_DATE_DISTANCE_DAYS;
      })
      .map((spendingEntry) => {
        const manualDate = getLocalDateStringFromTimestamp(
          spendingEntry.spentAt,
        );

        const daysApart = getDateDistanceInDays(manualDate, bankDate);

        const bankDescription =
          bankTransaction.merchant_name ?? bankTransaction.name;

        const descriptionScore = getDescriptionMatchScore(
          spendingEntry.description,
          bankDescription,
        );

        return {
          spendingEntry,
          daysApart,
          descriptionScore,
        };
      })
      .sort((firstMatch, secondMatch) => {
        /*
          First prefer the closest date.
        */
        if (firstMatch.daysApart !== secondMatch.daysApart) {
          return firstMatch.daysApart - secondMatch.daysApart;
        }

        /*
          If dates are equally close, prefer the descriptions
          that look most similar.
        */
        return secondMatch.descriptionScore - firstMatch.descriptionScore;
      });

    const bestMatch = possibleMatches[0];

    if (bestMatch === undefined) {
      continue;
    }

    usedSpendingEntryIds.add(bestMatch.spendingEntry.id);

    reconciliationCandidates.push({
      spendingEntry: bestMatch.spendingEntry,
      bankTransaction,
      daysApart: bestMatch.daysApart,
    });
  }

  return reconciliationCandidates;
}
