export type LedgerItem = {
  id: string;
  sourceId: string;
  source: "manual" | "bank";
  amount: number;
  description: string;
  spentOn: string;
  occurredAt?: string;
  category?: string;
  isPending: boolean;
};
