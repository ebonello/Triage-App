import type {
    BankTransaction,
    TransactionsSyncResponse,
} from "../types/bankTransaction";

export function applyBankTransactionSync(
  existingBankTransactions: readonly BankTransaction[],
  transactionsSyncResponse: TransactionsSyncResponse,
): BankTransaction[] {
  const bankTransactionsById = new Map<string, BankTransaction>();

  for (const bankTransaction of existingBankTransactions) {
    bankTransactionsById.set(bankTransaction.transaction_id, bankTransaction);
  }

  /*
    Remove transactions the bank says no longer exist.
  */
  for (const removedBankTransaction of transactionsSyncResponse.removed) {
    bankTransactionsById.delete(removedBankTransaction.transaction_id);
  }

  /*
    Modified records replace their older local version.
  */
  for (const modifiedBankTransaction of transactionsSyncResponse.modified) {
    bankTransactionsById.set(
      modifiedBankTransaction.transaction_id,
      modifiedBankTransaction,
    );
  }

  /*
    Added transactions are inserted.

    Map.set also prevents duplicate transaction IDs if the server
    accidentally sends the same transaction again.
  */
  for (const addedBankTransaction of transactionsSyncResponse.added) {
    bankTransactionsById.set(
      addedBankTransaction.transaction_id,
      addedBankTransaction,
    );
  }

  return Array.from(bankTransactionsById.values());
}
