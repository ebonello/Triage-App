# Triage

Triage is a React Native spending-tracking application designed to give users a simple view of how much they have spent on a given day.

The application supports both manually entered purchases and imported bank transactions. Because bank transactions may not appear immediately, users can enter purchases manually and later reconcile those entries with imported bank data to prevent the same purchase from being counted twice.

Triage is currently under active development. Bank data is provided by a local mock API while the application architecture and persistence layer are being developed.

## Current Features

- Add manual spending entries with an amount, description, and purchase date.
- Navigate between daily spending views.
- Select a date using a calendar picker.
- Display purchases associated with the selected date.
- Calculate daily spending totals from the displayed ledger.
- Persist manual spending entries locally using AsyncStorage.
- Import mock bank transactions from a local Express API.
- Persist imported bank transactions locally.
- Synchronize imported bank transactions using unique transaction IDs.
- Handle added, modified, and removed bank transactions.
- Detect likely matches between manual entries and newly imported bank transactions.
- Prompt the user to either replace a manual entry with the matching bank transaction or keep both records.
- Preserve reconciled manual records for historical purposes while excluding them from displayed spending totals.
- Display pending bank transactions.
- Reset locally stored spending data.
- Run automated tests covering date utilities, ledger calculations, data mapping, storage, reconciliation, and bank synchronization.

## Technology Stack

### Mobile Application

- React Native
- Expo
- TypeScript
- React Hooks
- AsyncStorage
- React Native Community DateTimePicker

### Backend

- Node.js
- Express
- CORS
- Local mock bank-transaction API

### Testing

- Jest
- TypeScript compiler checks

## Application Architecture

Triage currently maintains two primary sources of spending data:

1. **Manual spending entries**, represented by `SpendingEntry`.
2. **Imported bank transactions**, represented by `BankTransaction`.

These source models intentionally remain separate because they contain different information and originate from different systems.

Before displaying the data, Triage converts both sources into a normalized `LedgerItem` model.

```text
Manual SpendingEntry[]
          │
          ├── Reconciliation
          │
          ▼
Unreconciled Manual Entries
          │
          │ map
          ▼
      LedgerItem[]
          │
          │
          ├──────────────┐
                         │
BankTransaction[]        │
        │                │
        │ map            │
        ▼                │
   LedgerItem[] ─────────┘
        │
        ▼
Combined Ledger
        │
        ├── Sort
        ├── Filter by selected date
        └── Calculate total
        │
        ▼
       UI
```

### Bank Synchronization

Imported bank data is synchronized with transactions already stored by the application.

The synchronization process handles:

- `added` transactions
- `modified` transactions
- `removed` transactions
- Duplicate transaction IDs

A bank transaction's `transaction_id` is used as its unique identity.

### Reconciliation

Reconciliation addresses a different problem from bank synchronization.

**Synchronization** compares incoming bank data with bank data already stored by the application.

**Reconciliation** compares newly imported bank transactions with manually entered purchases.

Triage currently considers a manual entry a possible match when:

- The monetary amounts match exactly.
- The purchase dates are within three days of one another.

Description similarity may be used to choose the strongest candidate when multiple manual entries qualify.

The application does not automatically reconcile transactions. The user is prompted to choose between:

- **Replace Manual Entry**
- **Keep Both**

When a manual entry is replaced, the original record is preserved and its `reconciledBankTransactionId` property references the corresponding bank transaction.

Reconciled manual entries are excluded from the displayed ledger so the same purchase is not counted twice.

## Persistence

Triage currently uses AsyncStorage for local persistence.

The application stores:

- Manual `SpendingEntry` records
- Imported `BankTransaction` records
- Reconciliation information stored on manual entries

The final `LedgerItem` collection and daily spending totals are **not** independently persisted. They are derived from the underlying transaction data.

Long term, the project is intended to move persistent application data to a server-side relational database while AsyncStorage may remain useful as a local cache.

## Project Structure

```text
TRIAGE-APP/
├── api/
│   └── bankTransactionsApi.ts
│
├── app/
│   └── (tabs)/
│       └── index.tsx
│
├── components/
│   ├── PurchaseListItem.tsx
│   └── ReconciliationModal.tsx
│
├── server/
│   └── server.js
│
├── storage/
│   ├── triageStorage.ts
│   └── triageStorage.test.ts
│
├── styles/
│   └── homeScreenStyles.ts
│
├── types/
│   ├── bankTransaction.ts
│   ├── ledgerItem.ts
│   └── spendingEntry.ts
│
├── utils/
│   ├── bankTransactionSync.ts
│   ├── bankTransactionSync.test.ts
│   ├── dateUtils.ts
│   ├── dateUtils.test.ts
│   ├── ledgerCalculations.ts
│   ├── ledgerCalculations.test.ts
│   ├── ledgerItemMappers.ts
│   ├── ledgerItemMappers.test.ts
│   ├── reconciliation.ts
│   └── reconciliation.test.ts
│
├── package.json
└── README.md
```

### Major Responsibilities

- `app/` — screen state, user interaction, and application orchestration.
- `api/` — communication between the React Native client and backend.
- `components/` — reusable UI components.
- `storage/` — local persistence through AsyncStorage.
- `types/` — TypeScript definitions for application data.
- `utils/` — reusable business logic including mapping, calculations, synchronization, reconciliation, and date handling.
- `server/` — local Express backend and mock bank API.
- `styles/` — centralized React Native presentation styles.

## Running the Application

Install the client dependencies from the project root:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

The mobile application currently expects the local Express server to be running for mock bank imports.

From the `server` directory:

```bash
cd server
npm install
node server.js
```

The mock server currently exposes a transaction synchronization endpoint used to simulate a future banking integration.

> The API base URL is currently configured for local development and may need to be updated to match the development machine's local network address.

## Testing

Run the automated test suite:

```bash
npm run test:once
```

Run a TypeScript compilation check without generating build output:

```bash
npx tsc --noEmit
```

Current automated test coverage includes:

- Date conversion utilities
- Ledger-item mapping
- Ledger total calculations
- AsyncStorage persistence
- Reconciliation candidate detection
- Bank transaction synchronization
- Duplicate prevention
- Added, modified, and removed bank transaction handling
- Immutability of synchronization inputs

## Current Development Status

The core spending workflow is functional:

```text
Manual Entry
     +
Mock Bank Import
     +
Bank Synchronization
     +
Manual/Bank Reconciliation
     +
Normalized Ledger
     +
Daily Total
```

The application is still a development prototype and does not currently connect to a real financial institution.

## Planned Development

Upcoming work includes:

- Introduce a relational database for server-side persistence.
- Move manual spending entries from local-only persistence to the backend.
- Persist bank transactions server-side.
- Persist reconciliation relationships in the database.
- Add API endpoints for creating, reading, updating, and deleting spending data.
- Introduce user accounts and authentication.
- Add weekly and monthly spending views.
- Add category-based spending summaries.
- Add transaction search and filtering.
- Add reconciliation history and undo functionality.
- Replace mock bank data with a real bank integration.
- Add production configuration, security, and deployment infrastructure.

## Data Design Direction

The planned database layer will store underlying financial records rather than calculated display values.

For example, monetary values are expected to be stored as integer cents rather than floating-point dollar values:

```text
$14.25 → 1425
```

Daily, weekly, and monthly totals can then be calculated from the underlying records instead of being stored as separate sources of truth.

The initial database design is currently being planned around a relational SQL model.

## Project Status

Triage is an actively developed project focused on building a maintainable foundation for manual spending tracking, transaction synchronization, reconciliation, and eventually database-backed financial data.
