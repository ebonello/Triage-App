import AsyncStorage from "@react-native-async-storage/async-storage";
import type { BankTransaction } from "../types/bankTransaction";
import type { SpendingEntry } from "../types/spendingEntry";

const SPENDING_ENTRIES_STORAGE_KEY = "triage:spendingEntries";
const BANK_TRANSACTIONS_STORAGE_KEY = "triage:bankTransactions";

/*
  Load one array from AsyncStorage.

  AsyncStorage returns strings, so this helper parses the stored JSON.
  A missing key represents an empty collection.
*/
async function loadStoredArray<T>(storageKey: string): Promise<T[]> {
  const storedValue = await AsyncStorage.getItem(storageKey);

  if (storedValue === null) {
    return [];
  }

  const parsedValue: unknown = JSON.parse(storedValue);

  if (Array.isArray(parsedValue) === false) {
    throw new Error(`Stored value for "${storageKey}" is not an array.`);
  }

  return parsedValue as T[];
}

/*
  Save one array to AsyncStorage after converting it to JSON.
*/
async function saveStoredArray<T>(
  storageKey: string,
  items: T[],
): Promise<void> {
  const serializedItems = JSON.stringify(items);

  await AsyncStorage.setItem(storageKey, serializedItems);
}

export function loadSpendingEntries(): Promise<SpendingEntry[]> {
  return loadStoredArray<SpendingEntry>(SPENDING_ENTRIES_STORAGE_KEY);
}

export function saveSpendingEntries(
  spendingEntries: SpendingEntry[],
): Promise<void> {
  return saveStoredArray(SPENDING_ENTRIES_STORAGE_KEY, spendingEntries);
}

export function loadBankTransactions(): Promise<BankTransaction[]> {
  return loadStoredArray<BankTransaction>(BANK_TRANSACTIONS_STORAGE_KEY);
}

export function saveBankTransactions(
  bankTransactions: BankTransaction[],
): Promise<void> {
  return saveStoredArray(BANK_TRANSACTIONS_STORAGE_KEY, bankTransactions);
}
