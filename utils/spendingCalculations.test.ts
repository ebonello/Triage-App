import type { SpendingEntry } from "../types/spendingEntry";
import {
    calculateSpendingTotal,
    getSpendingEntriesForDate,
    isSpendingEntryFromDate,
} from "./spendingCalculations";

const testSpendingEntries: SpendingEntry[] = [
  {
    id: "manual-coffee",
    source: "manual",
    amount: 6.5,
    description: "Coffee",
    spentAt: "2026-06-10T12:00:00.000Z",
    createdAt: "2026-06-10T12:00:00.000Z",
  },
  {
    id: "manual-lunch",
    source: "manual",
    amount: 14.25,
    description: "Lunch",
    spentAt: "2026-06-10T13:00:00.000Z",
    createdAt: "2026-06-10T13:00:00.000Z",
  },
  {
    id: "bank-gas",
    source: "bank",
    amount: 38.1,
    description: "Gas",
    spentAt: "2026-06-09T12:00:00.000Z",
    createdAt: "2026-06-10T15:00:00.000Z",
  },
];

describe("spending calculations", () => {
  test("checks whether a spending entry belongs to a specific date", () => {
    const targetDate = new Date("2026-06-10T12:00:00.000Z");

    const result = isSpendingEntryFromDate(testSpendingEntries[0], targetDate);

    expect(result).toBe(true);
  });

  test("filters spending entries for a specific date", () => {
    const targetDate = new Date("2026-06-10T12:00:00.000Z");

    const result = getSpendingEntriesForDate(testSpendingEntries, targetDate);

    expect(result).toHaveLength(2);
    expect(result[0].description).toBe("Coffee");
    expect(result[1].description).toBe("Lunch");
  });

  test("calculates the total amount from spending entries", () => {
    const targetDate = new Date("2026-06-10T12:00:00.000Z");

    const todaysEntries = getSpendingEntriesForDate(
      testSpendingEntries,
      targetDate,
    );

    const result = calculateSpendingTotal(todaysEntries);

    expect(result).toBeCloseTo(20.75);
  });

  test("uses spentAt instead of createdAt when filtering by date", () => {
    const targetDate = new Date("2026-06-10T12:00:00.000Z");

    const result = getSpendingEntriesForDate(testSpendingEntries, targetDate);

    const gasEntry = result.find((spendingEntry) => {
      return spendingEntry.description === "Gas";
    });

    expect(gasEntry).toBeUndefined();
  });
});
