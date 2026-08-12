import type { BankTransaction } from "../types/bankTransaction";
import type { SpendingEntry } from "../types/spendingEntry";
import { findReconciliationCandidates } from "./reconciliation";

/*
  Creates a manual spending entry for tests.

  Using a helper keeps each individual test focused on the
  properties that actually matter to that scenario.
*/
function createSpendingEntry(
  id: string,
  amount: number,
  description: string,
  year: number,
  monthIndex: number,
  day: number,
  reconciledBankTransactionId?: string,
): SpendingEntry {
  const spentAt = new Date(year, monthIndex, day, 12, 0, 0).toISOString();

  const spendingEntry: SpendingEntry = {
    id,
    source: "manual",
    amount,
    description,
    spentAt,
    createdAt: spentAt,
  };

  if (reconciledBankTransactionId !== undefined) {
    spendingEntry.reconciledBankTransactionId = reconciledBankTransactionId;
  }

  return spendingEntry;
}

/*
  Creates a bank transaction for tests.

  Most of BankTransaction's properties are irrelevant to
  reconciliation, so this gives them sensible defaults.
*/
function createBankTransaction(
  transactionId: string,
  amount: number,
  merchantName: string,
  date: string,
): BankTransaction {
  return {
    transaction_id: transactionId,
    account_id: "fake_account_001",
    amount,
    iso_currency_code: "USD",
    date,
    authorized_date: date,
    authorized_datetime: null,
    datetime: null,
    name: merchantName,
    merchant_name: merchantName,
    pending: false,
    pending_transaction_id: null,
    payment_channel: "in store",
    personal_finance_category: null,
  };
}

describe("reconciliation", () => {
  test("finds a candidate when amount and date match exactly", () => {
    const manualEntry = createSpendingEntry(
      "manual-coffee-001",
      6.5,
      "Coffee",
      2026,
      7,
      10,
    );

    const bankTransaction = createBankTransaction(
      "bank-coffee-001",
      6.5,
      "Starbucks",
      "2026-08-10",
    );

    const result = findReconciliationCandidates(
      [manualEntry],
      [bankTransaction],
    );

    expect(result).toHaveLength(1);

    expect(result[0]).toEqual({
      spendingEntry: manualEntry,
      bankTransaction,
      daysApart: 0,
    });
  });

  test("finds a candidate when matching transactions are within three days", () => {
    const manualEntry = createSpendingEntry(
      "manual-lunch-001",
      14.25,
      "Lunch",
      2026,
      7,
      10,
    );

    const bankTransaction = createBankTransaction(
      "bank-lunch-001",
      14.25,
      "Burger Place",
      "2026-08-13",
    );

    const result = findReconciliationCandidates(
      [manualEntry],
      [bankTransaction],
    );

    expect(result).toHaveLength(1);
    expect(result[0].daysApart).toBe(3);
  });

  test("does not match transactions more than three days apart", () => {
    const manualEntry = createSpendingEntry(
      "manual-gas-001",
      40,
      "Gas",
      2026,
      7,
      10,
    );

    const bankTransaction = createBankTransaction(
      "bank-gas-001",
      40,
      "Shell",
      "2026-08-14",
    );

    const result = findReconciliationCandidates(
      [manualEntry],
      [bankTransaction],
    );

    expect(result).toEqual([]);
  });

  test("does not match transactions with different amounts", () => {
    const manualEntry = createSpendingEntry(
      "manual-coffee-001",
      6.5,
      "Coffee",
      2026,
      7,
      10,
    );

    const bankTransaction = createBankTransaction(
      "bank-coffee-001",
      7.25,
      "Starbucks",
      "2026-08-10",
    );

    const result = findReconciliationCandidates(
      [manualEntry],
      [bankTransaction],
    );

    expect(result).toEqual([]);
  });

  test("does not reuse a manual entry that has already been reconciled", () => {
    const manualEntry = createSpendingEntry(
      "manual-coffee-001",
      6.5,
      "Coffee",
      2026,
      7,
      10,
      "old-bank-transaction-001",
    );

    const bankTransaction = createBankTransaction(
      "bank-coffee-002",
      6.5,
      "Starbucks",
      "2026-08-10",
    );

    const result = findReconciliationCandidates(
      [manualEntry],
      [bankTransaction],
    );

    expect(result).toEqual([]);
  });

  test("does not match the same manual entry to two different bank transactions", () => {
    const manualEntry = createSpendingEntry(
      "manual-coffee-001",
      6.5,
      "Coffee",
      2026,
      7,
      10,
    );

    const firstBankTransaction = createBankTransaction(
      "bank-coffee-001",
      6.5,
      "Starbucks",
      "2026-08-10",
    );

    const secondBankTransaction = createBankTransaction(
      "bank-coffee-002",
      6.5,
      "Coffee Shop",
      "2026-08-10",
    );

    const result = findReconciliationCandidates(
      [manualEntry],
      [firstBankTransaction, secondBankTransaction],
    );

    expect(result).toHaveLength(1);

    expect(result[0].spendingEntry.id).toBe("manual-coffee-001");
  });

  test("prefers the manual entry with the closest purchase date", () => {
    const olderManualEntry = createSpendingEntry(
      "manual-lunch-old",
      20,
      "Lunch",
      2026,
      7,
      8,
    );

    const closerManualEntry = createSpendingEntry(
      "manual-lunch-close",
      20,
      "Lunch",
      2026,
      7,
      10,
    );

    const bankTransaction = createBankTransaction(
      "bank-lunch-001",
      20,
      "Restaurant",
      "2026-08-11",
    );

    const result = findReconciliationCandidates(
      [olderManualEntry, closerManualEntry],
      [bankTransaction],
    );

    expect(result).toHaveLength(1);

    expect(result[0].spendingEntry.id).toBe("manual-lunch-close");

    expect(result[0].daysApart).toBe(1);
  });

  test("uses description similarity when multiple matches are equally close", () => {
    const unrelatedManualEntry = createSpendingEntry(
      "manual-other-001",
      12,
      "Groceries",
      2026,
      7,
      10,
    );

    const similarManualEntry = createSpendingEntry(
      "manual-coffee-001",
      12,
      "Starbucks Coffee",
      2026,
      7,
      10,
    );

    const bankTransaction = createBankTransaction(
      "bank-coffee-001",
      12,
      "Starbucks",
      "2026-08-10",
    );

    const result = findReconciliationCandidates(
      [unrelatedManualEntry, similarManualEntry],
      [bankTransaction],
    );

    expect(result).toHaveLength(1);

    expect(result[0].spendingEntry.id).toBe("manual-coffee-001");
  });
});
