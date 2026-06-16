const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayDateString() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday.toISOString().slice(0, 10);
}

app.get("/health", (request, response) => {
  response.json({
    status: "ok",
    message: "Fake Triage bank backend is running",
  });
});

app.get("/transactions/sync", (request, response) => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  response.json({
    added: [
      {
        transaction_id: "fake_txn_coffee_001",
        account_id: "fake_account_checking_001",
        amount: 6.5,
        iso_currency_code: "USD",
        date: today,
        authorized_date: today,
        name: "COFFEE SHOP POS PURCHASE",
        merchant_name: "Coffee Shop",
        pending: false,
        pending_transaction_id: null,
        payment_channel: "in store",
        personal_finance_category: {
          primary: "FOOD_AND_DRINK",
          detailed: "FOOD_AND_DRINK_COFFEE",
          confidence_level: "VERY_HIGH",
        },
      },
      {
        transaction_id: "fake_txn_lunch_001",
        account_id: "fake_account_credit_001",
        amount: 14.25,
        iso_currency_code: "USD",
        date: today,
        authorized_date: today,
        name: "BURGER PLACE CARD PURCHASE",
        merchant_name: "Burger Place",
        pending: true,
        pending_transaction_id: null,
        payment_channel: "in store",
        personal_finance_category: {
          primary: "FOOD_AND_DRINK",
          detailed: "FOOD_AND_DRINK_FAST_FOOD",
          confidence_level: "VERY_HIGH",
        },
      },
      {
        transaction_id: "fake_txn_gas_001",
        account_id: "fake_account_credit_001",
        amount: 38.1,
        iso_currency_code: "USD",
        date: yesterday,
        authorized_date: yesterday,
        name: "SHELL OIL 123456",
        merchant_name: "Shell",
        pending: false,
        pending_transaction_id: null,
        payment_channel: "in store",
        personal_finance_category: {
          primary: "TRANSPORTATION",
          detailed: "TRANSPORTATION_GAS",
          confidence_level: "HIGH",
        },
      },
    ],
    modified: [],
    removed: [],
    next_cursor: "fake_cursor_001",
    has_more: false,
  });
});

app.listen(PORT, () => {
  console.log(`Fake Triage bank backend running on port ${PORT}`);
});
