**TRIAGE**

This is first an foremost a vehicle to learn a modern development workflow for a mobile-first app using a modern stack.

Triage is a mobile spending-tracking app designed to help users monitor their daily spending in real time. The main purpose of the app is to give users a quick, simple view of how much they have spent today, while also supporting longer-term spending history, weekly totals, and future budget breakdowns.
The app allows users to manually enter purchases with an amount, description, and purchase date.

These entries are saved locally so users can track spending immediately, even before bank transaction data becomes available. Each entry stores both the date the purchase occurred and the date the record was created, which supports backdated entries and more accurate daily totals.

The long-term goal is to support imported banking transactions from multiple accounts using a Plaid-style integration. Manual entries and bank-imported transactions will remain separate data sources so they can eventually be reconciled and matched without double-counting the same purchase.

The app is being built with React Native and Expo for the mobile front end, TypeScript for typed data models, AsyncStorage for local persistence, and Jest for testing core business logic. A local Express backend is being used during development to simulate Plaid-style transaction sync data before connecting to a real banking API.

At completion, the app is intended to provide a simple daily spending dashboard, purchase history by date, imported banking transaction support, and reconciliation logic between manual and bank-provided spending data.

Current Demo

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
