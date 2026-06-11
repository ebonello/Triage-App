export type SpendingEntry = {
  id: string;
  source: "manual" | "bank";
  amount: number;
  description: string;
  spentAt: string;
  createdAt: string;
};
