import type { BankTransaction } from "../types/bankTransaction";
import type { SpendingEntry } from "../types/spendingEntry";
import {
  getLocalDateStringFromTimestamp,
  mapBankTransactionToLedgerItem,
  mapSpendingEntryToLedgerItem,
} from "./ledgerItemMappers";

describe("ledger item mappers", () => {
  test("gets a local date string from a timestamp", () => {
    const timestamp = new Date(2026, 5, 29, 14, 30, 0).toISOString();

    const result = getLocalDateStringFromTimestamp(timestamp);

    expect(result).toBe("2026-06-29");
  });

  test("maps a manual spending entry to a ledger item", () => {
    const spentAt = new Date(2026, 5, 29, 14, 30, 0).toISOString();

    const spendingEntry: SpendingEntry = {
      id: "manual-lunch-001",
      source: "manual",
      amount: 14.25,
      description: "Lunch",
      spentAt,
      createdAt: spentAt,
    };

    const result = mapSpendingEntryToLedgerItem(spendingEntry);

    expect(result).toEqual({
      id: "manual:manual-lunch-001",
      sourceId: "manual-lunch-001",
      source: "manual",
      amount: 14.25,
      description: "Lunch",
      spentOn: "2026-06-29",
      isPending: false,
    });
  });

  test("maps a bank transaction using the preferred date and merchant fields", () => {
    const bankTransaction: BankTransaction = {
      transaction_id: "fake_txn_coffee_001",
      account_id: "fake_account_checking_001",
      amount: 6.5,
      iso_currency_code: "USD",
      date: "2026-06-29",
      authorized_date: "2026-06-29",
      authorized_datetime: "2026-06-29T16:42:00Z",
      datetime: "2026-06-29T16:43:00Z",
      name: "COFFEE SHOP POS PURCHASE",
      merchant_name: "Coffee Shop",
      pending: false,
      pending_transaction_id: null,
      payment_channel: "in store",
      personal_finance_category: {
        primary: "FOOD_AND_DRINK",
        detailed: "FOOD_AND_DRINK_COFFEE",
        confidence_level: "VERY_HIGH",
      },
    };

    const result = mapBankTransactionToLedgerItem(bankTransaction);

    expect(result).toEqual({
      id: "bank:fake_txn_coffee_001",
      sourceId: "fake_txn_coffee_001",
      source: "bank",
      amount: 6.5,
      description: "Coffee Shop",
      spentOn: "2026-06-29",
      category: "FOOD_AND_DRINK",
      isPending: false,
    });
  });

  test("maps a bank transaction using fallback fields when preferred values are missing", () => {
    const bankTransaction: BankTransaction = {
      transaction_id: "fake_txn_gas_001",
      account_id: "fake_account_credit_001",
      amount: 38.1,
      iso_currency_code: "USD",
      date: "2026-06-28",
      authorized_date: null,
      authorized_datetime: null,
      datetime: "2026-06-28T22:15:00Z",
      name: "SHELL OIL 123456",
      merchant_name: null,
      pending: false,
      pending_transaction_id: null,
      payment_channel: "in store",
      personal_finance_category: null,
    };

    const result = mapBankTransactionToLedgerItem(bankTransaction);

    expect(result).toEqual({
      id: "bank:fake_txn_gas_001",
      sourceId: "fake_txn_gas_001",
      source: "bank",
      amount: 38.1,
      description: "SHELL OIL 123456",
      spentOn: "2026-06-28",
      isPending: false,
    });
  });

  test("maps a date-only bank transaction without adding time data to the ledger item", () => {
    const bankTransaction: BankTransaction = {
      transaction_id: "fake_txn_lunch_001",
      account_id: "fake_account_credit_001",
      amount: 14.25,
      iso_currency_code: "USD",
      date: "2026-06-29",
      authorized_date: "2026-06-29",
      authorized_datetime: null,
      datetime: null,
      name: "BURGER PLACE CARD PURCHASE",
      merchant_name: "Burger Place",
      pending: true,
      pending_transaction_id: null,
      payment_channel: "in store",
      personal_finance_category: {
        primary: "FOOD_AND_DRINK",
        detailed: "FOOD_AND_DRINK_FAST_FOOD",
        confidence_level: "VERY_HIGH",
      },
    };

    const result = mapBankTransactionToLedgerItem(bankTransaction);

    expect(result).toEqual({
      id: "bank:fake_txn_lunch_001",
      sourceId: "fake_txn_lunch_001",
      source: "bank",
      amount: 14.25,
      description: "Burger Place",
      spentOn: "2026-06-29",
      category: "FOOD_AND_DRINK",
      isPending: true,
    });
  });
});
