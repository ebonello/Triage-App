import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BankTransaction } from "../types/bankTransaction";
import type { SpendingEntry } from "../types/spendingEntry";
import {
    loadBankTransactions,
    loadSpendingEntries,
    saveBankTransactions,
    saveSpendingEntries,
} from "./triageStorage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe("Triage storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("loadSpendingEntries", () => {
    test("returns an empty array when no spending entries are stored", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const result = await loadSpendingEntries();

      expect(result).toEqual([]);

      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(
        "triage:spendingEntries",
      );
    });

    test("loads and parses stored spending entries", async () => {
      const spendingEntries: SpendingEntry[] = [
        {
          id: "manual-lunch-001",
          source: "manual",
          amount: 14.25,
          description: "Lunch",
          spentAt: "2026-07-30T12:00:00.000Z",
          createdAt: "2026-07-30T12:00:00.000Z",
        },
      ];

      mockedAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify(spendingEntries),
      );

      const result = await loadSpendingEntries();

      expect(result).toEqual(spendingEntries);
    });

    test("rejects when stored spending-entry data is not an array", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({
          id: "invalid-spending-entry",
        }),
      );

      await expect(loadSpendingEntries()).rejects.toThrow(
        'Stored value for "triage:spendingEntries" is not an array.',
      );
    });
  });

  describe("saveSpendingEntries", () => {
    test("serializes and saves spending entries using the correct storage key", async () => {
      const spendingEntries: SpendingEntry[] = [
        {
          id: "manual-coffee-001",
          source: "manual",
          amount: 6.5,
          description: "Coffee",
          spentAt: "2026-07-30T09:00:00.000Z",
          createdAt: "2026-07-30T09:00:00.000Z",
        },
      ];

      mockedAsyncStorage.setItem.mockResolvedValue();

      await saveSpendingEntries(spendingEntries);

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "triage:spendingEntries",
        JSON.stringify(spendingEntries),
      );
    });
  });

  describe("loadBankTransactions", () => {
    test("returns an empty array when no bank transactions are stored", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const result = await loadBankTransactions();

      expect(result).toEqual([]);

      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(
        "triage:bankTransactions",
      );
    });

    test("loads and parses stored bank transactions", async () => {
      const bankTransactions: BankTransaction[] = [
        {
          transaction_id: "fake_txn_coffee_001",
          account_id: "fake_account_checking_001",
          amount: 6.5,
          iso_currency_code: "USD",
          date: "2026-07-30",
          authorized_date: "2026-07-30",
          authorized_datetime: "2026-07-30T16:42:00Z",
          datetime: "2026-07-30T16:43:00Z",
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
        },
      ];

      mockedAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify(bankTransactions),
      );

      const result = await loadBankTransactions();

      expect(result).toEqual(bankTransactions);
    });

    test("rejects when stored bank-transaction data is not an array", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({
          transaction_id: "invalid-bank-transaction",
        }),
      );

      await expect(loadBankTransactions()).rejects.toThrow(
        'Stored value for "triage:bankTransactions" is not an array.',
      );
    });
  });

  describe("saveBankTransactions", () => {
    test("serializes and saves bank transactions using the correct storage key", async () => {
      const bankTransactions: BankTransaction[] = [
        {
          transaction_id: "fake_txn_gas_001",
          account_id: "fake_account_credit_001",
          amount: 38.1,
          iso_currency_code: "USD",
          date: "2026-07-29",
          authorized_date: "2026-07-29",
          authorized_datetime: null,
          datetime: "2026-07-29T22:15:00Z",
          name: "SHELL OIL 123456",
          merchant_name: "Shell",
          pending: false,
          pending_transaction_id: null,
          payment_channel: "in store",
          personal_finance_category: {
            primary: "TRANSPORTATION",
            detailed: "TRANSPORTATION_GAS",
            confidence_level: "HIGH",
          },
        },
      ];

      mockedAsyncStorage.setItem.mockResolvedValue();

      await saveBankTransactions(bankTransactions);

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "triage:bankTransactions",
        JSON.stringify(bankTransactions),
      );
    });
  });
});
