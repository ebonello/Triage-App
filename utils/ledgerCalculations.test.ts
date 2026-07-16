import type { LedgerItem } from "../types/ledgerItem";
import { calculateLedgerItemTotal } from "./ledgerCalculations";

describe("ledger calculations", () => {
  test("calculates the total for ledger items", () => {
    const ledgerItems: LedgerItem[] = [
      {
        id: "manual:manual-coffee-001",
        sourceId: "manual-coffee-001",
        source: "manual",
        amount: 6.5,
        description: "Coffee",
        spentOn: "2026-07-16",
        isPending: false,
      },
      {
        id: "bank:bank-lunch-001",
        sourceId: "bank-lunch-001",
        source: "bank",
        amount: 14.25,
        description: "Lunch",
        spentOn: "2026-07-16",
        isPending: false,
      },
    ];

    const result = calculateLedgerItemTotal(ledgerItems);

    expect(result).toBe(20.75);
  });

  test("returns zero when there are no ledger items", () => {
    const ledgerItems: LedgerItem[] = [];

    const result = calculateLedgerItemTotal(ledgerItems);

    expect(result).toBe(0);
  });

  test("includes pending ledger items in the total", () => {
    const ledgerItems: LedgerItem[] = [
      {
        id: "bank:bank-burger-001",
        sourceId: "bank-burger-001",
        source: "bank",
        amount: 12.75,
        description: "Burger Place",
        spentOn: "2026-07-16",
        isPending: true,
      },
    ];

    const result = calculateLedgerItemTotal(ledgerItems);

    expect(result).toBe(12.75);
  });
});
