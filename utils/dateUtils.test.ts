import { getLocalDateStringFromTimestamp } from "./dateUtils";

describe("date utilities", () => {
  test("gets a local date string from a timestamp", () => {
    const timestamp = new Date(2026, 5, 29, 14, 30, 0).toISOString();

    const result = getLocalDateStringFromTimestamp(timestamp);

    expect(result).toBe("2026-06-29");
  });
});
