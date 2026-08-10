export type SpendingEntry = {
  id: string;
  source: "manual";
  amount: number;
  description: string;
  spentAt: string;
  createdAt: string;
  reconciledBankTransactionId?: string;
};
