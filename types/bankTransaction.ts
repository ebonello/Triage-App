export type PersonalFinanceCategory = {
  primary: string;
  detailed: string;
  confidence_level: string;
};

export type BankTransaction = {
  transaction_id: string;
  account_id: string;
  amount: number;
  iso_currency_code: string;
  date: string;
  authorized_date: string | null;
  authorized_datetime: string | null;
  datetime: string | null;
  name: string;
  merchant_name: string | null;
  pending: boolean;
  pending_transaction_id: string | null;
  payment_channel: string;
  personal_finance_category: PersonalFinanceCategory | null;
};

export type TransactionsSyncResponse = {
  added: BankTransaction[];
  modified: BankTransaction[];
  removed: BankTransaction[];
  next_cursor: string;
  has_more: boolean;
};
