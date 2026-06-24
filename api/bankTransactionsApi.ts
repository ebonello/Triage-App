import type { TransactionsSyncResponse } from "../types/bankTransaction";

const API_BASE_URL = "http://192.168.1.67:3001";

export async function fetchBankTransactionsSync(): Promise<TransactionsSyncResponse> {
  const response = await fetch(`${API_BASE_URL}/transactions/sync`);

  if (response.ok === false) {
    throw new Error(
      `Failed to fetch bank transactions. Status: ${response.status}`,
    );
  }

  const transactionsSyncResponse =
    (await response.json()) as TransactionsSyncResponse;

  return transactionsSyncResponse;
}
