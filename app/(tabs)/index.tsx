import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { homeScreenStyles as styles } from "../../styles/homeScreenStyles";

//Custom type for purchases array of Purchase objects
type Purchase = {
  id: string;
  amount: number;
  createdAt: string;
  description: string;
};

// Purchase key in order to use AsnycStorage
const PURCHASES_STORAGE_KEY = "triage:purchases";

//Main Function that re-renders the screen when one of the state functions is called
export default function HomeScreen() {
  const [amountInput, setAmountInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
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

  //Const declaration to turn string value from form and turn it into number
  const purchaseAmount = Number(amountInput);
  //Checks to make sure purchaseAmount is valid number
  const isValidAmount = Number.isFinite(purchaseAmount) && purchaseAmount > 0;
  const descrTxt = descriptionInput.trim();
  const isValidDescr = descrTxt.length > 0 && descrTxt.length < 26;
  const canAddPurchase = isValidAmount && isValidDescr;
  const cannotAddPurchase = !canAddPurchase;

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
    if (cannotAddPurchase) {
      return;
    }

    /*Creating constant for a new purchase of type "Purchase" with "amount" coming
    from the field input submission.*/
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      amount: purchaseAmount,
      createdAt: new Date().toISOString(),
      description: descrTxt,
    };

    //Makes keyboard dissapear after submission
    Keyboard.dismiss();

    /*This updates the state of the "purchase" array by creating a new array
    with the new purchase added to the top of the previous array*/
    setPurchases((previousPurchases) => [newPurchase, ...previousPurchases]);

    //This clears the UI input are after submission
    setAmountInput("");
    setDescriptionInput("");
  }

  //Handles a total reset of the purchases array and clears it out
  function resetTotal() {
    Keyboard.dismiss();
    setAmountInput("");
    setDescriptionInput("");
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

          {/* <Text style={styles.caption}>
            Purchases logged: {purchases.length}
          </Text> */}

          <View style={styles.purchaseList}>
            <Text style={styles.sectionTitle}>Recent Purchases:</Text>

            {/*
    map() loops through every item in the todaysPurchases array and creates 
    a new array and each item in the array it creates a new view and 
    displays it on screen with a button*/}

            {todaysPurchases.map((purchase) => {
              return (
                <View key={purchase.id} style={styles.purchaseItem}>
                  <Text style={styles.purchaseAmount}>
                    {formatCurrency(purchase.amount)}
                  </Text>
                  <Text style={styles.purchaseAmount}>
                    {purchase.description}
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

            {/*Input for amount*/}
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
            <Text style={styles.inputLabel}>Description</Text>

            {/*Input for description*/}
            <TextInput
              style={styles.input}
              value={descriptionInput}
              onChangeText={setDescriptionInput}
              placeholder="Example: Coffee"
              placeholderTextColor="#777777"
              returnKeyType="done"
              onSubmitEditing={addPurchase}
            />
          </View>

          {/* If cannotAddPurchase is true, apply the disabled button style */}
          <Pressable
            style={[
              styles.primaryButton,
              cannotAddPurchase && styles.disabledButton,
            ]}
            onPress={addPurchase}
            disabled={cannotAddPurchase}
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
