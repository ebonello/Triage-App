import type {
    BankTransaction,
    TransactionsSyncResponse,
} from "../types/bankTransaction";
import { applyBankTransactionSync } from "./bankTransactionSync";

/*
  Creates a complete BankTransaction for testing.

  Most tests only care about one or two properties, so this helper
  provides sensible defaults and lets each test override what matters.
*/
function createBankTransaction(
  transactionId: string,
  overrides: Partial<Omit<BankTransaction, "transaction_id">> = {},
): BankTransaction {
  return {
    transaction_id: transactionId,
    account_id: "fake_account_001",
    amount: 10,
    iso_currency_code: "USD",
    date: "2026-08-13",
    authorized_date: "2026-08-13",
    authorized_datetime: null,
    datetime: null,
    name: "FAKE TRANSACTION",
    merchant_name: "Fake Merchant",
    pending: false,
    pending_transaction_id: null,
    payment_channel: "in store",
    personal_finance_category: null,
    ...overrides,
  };
}

/*
  Creates a complete sync response.

  Individual tests can override added, modified, or removed without
  repeating the entire response structure every time.
*/
function createSyncResponse(
  overrides: Partial<TransactionsSyncResponse> = {},
): TransactionsSyncResponse {
  return {
    added: [],
    modified: [],
    removed: [],
    next_cursor: "fake_cursor_001",
    has_more: false,
    ...overrides,
  };
}

describe("bank transaction synchronization", () => {
  test("adds a new bank transaction", () => {
    const addedTransaction = createBankTransaction("bank-coffee-001", {
      amount: 6.5,
      merchant_name: "Coffee Shop",
    });

    const syncResponse = createSyncResponse({
      added: [addedTransaction],
    });

    const result = applyBankTransactionSync([], syncResponse);

    expect(result).toEqual([addedTransaction]);
  });

  test("does not create a duplicate when the same transaction ID is added again", () => {
    const existingTransaction = createBankTransaction("bank-coffee-001", {
      amount: 6.5,
      merchant_name: "Old Coffee Shop",
      pending: true,
    });

    const incomingTransaction = createBankTransaction("bank-coffee-001", {
      amount: 6.5,
      merchant_name: "Coffee Shop",
      pending: false,
    });

    const syncResponse = createSyncResponse({
      added: [incomingTransaction],
    });

    const result = applyBankTransactionSync(
      [existingTransaction],
      syncResponse,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(incomingTransaction);
  });

  test("replaces an existing transaction with its modified version", () => {
    const pendingTransaction = createBankTransaction("bank-lunch-001", {
      amount: 14.25,
      merchant_name: "Burger Place",
      pending: true,
    });

    const postedTransaction = createBankTransaction("bank-lunch-001", {
      amount: 14.25,
      merchant_name: "Burger Place",
      pending: false,
    });

    const syncResponse = createSyncResponse({
      modified: [postedTransaction],
    });

    const result = applyBankTransactionSync([pendingTransaction], syncResponse);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(postedTransaction);
    expect(result[0].pending).toBe(false);
  });

  test("removes a transaction listed in removed", () => {
    const coffeeTransaction = createBankTransaction("bank-coffee-001");

    const gasTransaction = createBankTransaction("bank-gas-001");

    const syncResponse = createSyncResponse({
      removed: [
        {
          transaction_id: "bank-coffee-001",
        },
      ],
    });

    const result = applyBankTransactionSync(
      [coffeeTransaction, gasTransaction],
      syncResponse,
    );

    expect(result).toEqual([gasTransaction]);
  });

  test("handles added, modified, and removed transactions in the same sync", () => {
    const existingCoffeeTransaction = createBankTransaction("bank-coffee-001", {
      amount: 6.5,
      pending: true,
    });

    const existingGasTransaction = createBankTransaction("bank-gas-001", {
      amount: 40,
    });

    const unchangedGroceryTransaction = createBankTransaction(
      "bank-grocery-001",
      {
        amount: 52,
        merchant_name: "Grocery Store",
      },
    );

    const modifiedCoffeeTransaction = createBankTransaction("bank-coffee-001", {
      amount: 6.5,
      pending: false,
    });

    const addedLunchTransaction = createBankTransaction("bank-lunch-001", {
      amount: 14.25,
      merchant_name: "Burger Place",
    });

    const syncResponse = createSyncResponse({
      added: [addedLunchTransaction],
      modified: [modifiedCoffeeTransaction],
      removed: [
        {
          transaction_id: "bank-gas-001",
        },
      ],
    });

    const result = applyBankTransactionSync(
      [
        existingCoffeeTransaction,
        existingGasTransaction,
        unchangedGroceryTransaction,
      ],
      syncResponse,
    );

    expect(result).toEqual([
      modifiedCoffeeTransaction,
      unchangedGroceryTransaction,
      addedLunchTransaction,
    ]);
  });

  test("leaves transaction data equivalent when the sync response contains no changes", () => {
    const existingTransactions = [
      createBankTransaction("bank-coffee-001"),
      createBankTransaction("bank-lunch-001"),
    ];

    const syncResponse = createSyncResponse();

    const result = applyBankTransactionSync(existingTransactions, syncResponse);

    expect(result).toEqual(existingTransactions);
  });

  test("returns a new array instead of mutating the original transaction array", () => {
    const existingTransaction = createBankTransaction("bank-coffee-001", {
      pending: true,
    });

    const existingTransactions = [existingTransaction];

    const modifiedTransaction = createBankTransaction("bank-coffee-001", {
      pending: false,
    });

    const syncResponse = createSyncResponse({
      modified: [modifiedTransaction],
    });

    const result = applyBankTransactionSync(existingTransactions, syncResponse);

    expect(result).not.toBe(existingTransactions);

    expect(existingTransactions).toEqual([existingTransaction]);

    expect(existingTransactions[0].pending).toBe(true);
  });
});
