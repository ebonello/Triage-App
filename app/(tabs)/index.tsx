import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

//Custom type for purchases array of Purchase objects
type Purchase = {
  id: string;
  amount: number;
  createdAt: string;
};

// Purchase key in order to use AsnycStorage
const PURCHASES_STORAGE_KEY = "triage:purchases";

//Main Function that re-renders the screen when one of the state functions is called
export default function HomeScreen() {
  const [amountInput, setAmountInput] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // useEffect runs AFTER the component renders.
  // This useEffect loads saved purchases from phone storage when the HomeScreen first opens.
  useEffect(() => {
    async function loadPurchases() {
      try {
        const savedPurchases = await AsyncStorage.getItem(
          PURCHASES_STORAGE_KEY,
        );

        if (savedPurchases !== null) {
          const parsedPurchases: Purchase[] = JSON.parse(savedPurchases);
          setPurchases(parsedPurchases);
        }
      } catch (error) {
        console.log("Failed to load purchases:", error);
      } finally {
        setIsStorageLoaded(true);
      }
    }

    loadPurchases();
  }, []);

  /*This useEffect checks is used to save Purchases to local storage
    but first checks to see if the storage first loaded from local memory
    so that it doesnt overwrite the saved storage with empty array before load*/
  useEffect(() => {
    if (!isStorageLoaded) {
      return;
    }

    async function savePurchases() {
      try {
        const purchasesAsString = JSON.stringify(purchases);
        await AsyncStorage.setItem(PURCHASES_STORAGE_KEY, purchasesAsString);
      } catch (error) {
        console.log("Failed to save purchases:", error);
      }
    }

    savePurchases();
  }, [purchases, isStorageLoaded]);

  //This simply checks to see if storage is laoded so it can display a loading
  //when async function is grabbing data.
  if (isStorageLoaded === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Triage...</Text>
      </View>
    );
  }

  //Const declaration to turn amountInput string into number and set it to purchaseAmount
  const purchaseAmount = Number(amountInput);
  //Checks toi make sure purchaseAmount is valid number
  const isValidAmount = Number.isFinite(purchaseAmount) && purchaseAmount > 0;
  //A const declaration to make later functions more descriptive and less symbolic
  const isInvalidAmount = !isValidAmount;

  // Create a new array of only today's purchases.
  // filter() keeps a purchase only when isPurchaseFromToday(purchase) returns true.
  const todaysPurchases = purchases.filter((purchase) => {
    return isPurchaseFromToday(purchase);
  });

  //This function creates a running total of todays purchases and calls it "spentToday"
  const spentToday = todaysPurchases.reduce((total, purchase) => {
    return total + purchase.amount;
  }, 0);

  //Helper function to format number to currency for output to dashbaord past purchases list
  function formatCurrency(amount: number) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  //const used to hold properly formated total for display
  const formattedSpentToday = formatCurrency(spentToday);

  //Helper function for todaysPurchases to determine which purchases match todays date
  function isPurchaseFromToday(purchase: Purchase) {
    const purchaseDate = new Date(purchase.createdAt);
    const today = new Date();

    return (
      purchaseDate.getFullYear() === today.getFullYear() &&
      purchaseDate.getMonth() === today.getMonth() &&
      purchaseDate.getDate() === today.getDate()
    );
  }

  //Main function for processing purchases submitted in UI
  function addPurchase() {
    //checks to see if amount is valid, if not, stop
    if (isInvalidAmount) {
      return;
    }

    /*Creating constant for a new purchasse of type "Purchase" with "amount" coming
    from the field input submission.*/
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      amount: purchaseAmount,
      createdAt: new Date().toISOString(),
    };

    //Makes keyboard dissapear after submission
    Keyboard.dismiss();

    /*This updates the state of the "purchase" array by creating a new array
    with the new purchase added to the top of the previous array*/
    setPurchases((previousPurchases) => [newPurchase, ...previousPurchases]);

    //This clears the UI input are after submission
    setAmountInput("");
  }

  //Handles a total reset of the purchases array and clears it out
  function resetTotal() {
    Keyboard.dismiss();
    setAmountInput("");
    setPurchases([]);
  }

  /*This triggers on button press to remove a specific purchase and create a new array
  without the specific purchase that matches the id.*/
  function deletePurchase(purchaseId: string) {
    setPurchases((previousPurchases) =>
      previousPurchases.filter((purchase) => purchase.id !== purchaseId),
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.appName}>Triage</Text>

          <Text style={styles.subtitle}>What's the damage?</Text>

          <Text style={styles.amount}>{formattedSpentToday}</Text>

          <Text style={styles.caption}>Spent today</Text>

          <Text style={styles.caption}>
            Purchases logged: {purchases.length}
          </Text>

          <View style={styles.purchaseList}>
            <Text style={styles.sectionTitle}>Recent purchases</Text>

            {/*
    purchases is an array of purchase objects.

    map() loops through every item in the purchases array.
    Each item is temporarily named "purchase".*/}

            {purchases.map((purchase) => {
              return (
                <View key={purchase.id} style={styles.purchaseItem}>
                  <Text style={styles.purchaseAmount}>
                    {formatCurrency(purchase.amount)}
                  </Text>

                  {/*
          This delete button is created inside the map() loop,
          so it has access to the current purchase.

          When pressed, it calls deletePurchase()
          and passes in this specific purchase's id.

          The arrow function prevents deletePurchase from running immediately.
          It only runs later, when the user presses the button.
        */}
                  <Pressable onPress={() => deletePurchase(purchase.id)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Purchase amount</Text>

            <TextInput
              style={styles.input}
              value={amountInput}
              onChangeText={setAmountInput}
              placeholder="Example: 12.50"
              placeholderTextColor="#777777"
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={addPurchase}
            />
          </View>

          <Pressable
            style={[
              styles.primaryButton,
              isInvalidAmount && styles.disabledButton,
            ]}
            onPress={addPurchase}
            disabled={isInvalidAmount}
          >
            <Text style={styles.primaryButtonText}>Add Purchase</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={resetTotal}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#050505",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },

  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  appName: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    color: "#cfcfcf",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
  },
  amount: {
    color: "#ffffff",
    fontSize: 64,
    fontWeight: "800",
    marginBottom: 8,
  },
  caption: {
    color: "#a8a8a8",
    fontSize: 18,
    marginBottom: 40,
  },

  purchaseList: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 24,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  purchaseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomColor: "#222222",
    borderBottomWidth: 1,
  },

  purchaseAmount: {
    color: "#cfcfcf",
    fontSize: 16,
  },

  deleteText: {
    color: "#ff6b6b",
    fontSize: 14,
    fontWeight: "700",
  },

  inputWrapper: {
    width: "100%",
    maxWidth: 320,
    marginBottom: 18,
  },
  inputLabel: {
    color: "#a8a8a8",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#151515",
    color: "#ffffff",
    borderColor: "#333333",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 20,
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 999,
    marginBottom: 14,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.35,
  },
  primaryButtonText: {
    color: "#050505",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryButton: {
    borderColor: "#555555",
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
