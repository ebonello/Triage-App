import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { homeScreenStyles as styles } from "../../styles/homeScreenStyles";
import type { SpendingEntry } from "../../types/spendingEntry";

// Storage key used by AsyncStorage to save the local ledger on the phone
const SPENDING_ENTRIES_STORAGE_KEY = "triage:spendingEntries";

// Max number of characters allowed in the description input
const MAX_DESCRIPTION_LENGTH = 25;

// Main screen component. This re-renders whenever one of its state setters is called.
export default function HomeScreen() {
  // Holds the raw text typed into the amount input
  const [amountInput, setAmountInput] = useState("");

  // Holds the raw text typed into the description input
  const [descriptionInput, setDescriptionInput] = useState("");

  // Main local ledger array. This replaces the old purchases array.
  const [spendingEntries, setSpendingEntries] = useState<SpendingEntry[]>([]);

  // Tracks whether AsyncStorage has finished loading saved data
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [isAddPurchaseModalVisible, setIsAddPurchaseModalVisible] =
    useState(false);

  /*
    useEffect runs AFTER the component renders.

    This useEffect loads saved spending entries from phone storage
    when the HomeScreen first opens.
  */
  useEffect(() => {
    async function loadSpendingEntries() {
      try {
        const savedSpendingEntries = await AsyncStorage.getItem(
          SPENDING_ENTRIES_STORAGE_KEY,
        );

        /*
          AsyncStorage stores data as strings.

          If savedSpendingEntries is not null, that means there was
          previously saved data. We parse it back into an array.
        */
        if (savedSpendingEntries !== null) {
          const parsedSpendingEntries: SpendingEntry[] =
            JSON.parse(savedSpendingEntries);

          setSpendingEntries(parsedSpendingEntries);
        }
      } catch (error) {
        console.log("Failed to load spending entries:", error);
      } finally {
        /*
          This runs whether the load succeeds or fails.

          It tells the app:
          "We are done trying to load storage, so it is safe to render
          the real screen and safe to start saving future changes."
        */
        setIsStorageLoaded(true);
      }
    }

    loadSpendingEntries();
  }, []);

  /*
    This useEffect saves spendingEntries to local phone storage.

    It runs whenever spendingEntries changes, but only after
    the first storage load has completed.
  */
  useEffect(() => {
    /*
      If storage has not loaded yet, stop.

      This prevents the app from accidentally saving an empty array
      before it has had a chance to load the saved data.
    */
    if (isStorageLoaded === false) {
      return;
    }

    async function saveSpendingEntries() {
      try {
        /*
          AsyncStorage can only store strings.

          JSON.stringify converts the spendingEntries array into a string.
        */
        const spendingEntriesAsString = JSON.stringify(spendingEntries);

        await AsyncStorage.setItem(
          SPENDING_ENTRIES_STORAGE_KEY,
          spendingEntriesAsString,
        );
      } catch (error) {
        console.log("Failed to save spending entries:", error);
      }
    }

    saveSpendingEntries();
  }, [spendingEntries, isStorageLoaded]);

  /*
    Show a loading screen while AsyncStorage is checking for saved data.

    This prevents the main UI from briefly rendering with empty data.
  */
  if (isStorageLoaded === false) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Triage...</Text>
      </View>
    );
  }

  /*
    Convert the amount input from a string into a number.

    TextInput always gives us text, so "12.50" needs to become 12.5
    before we can use it in math.
  */
  const spendingAmount = Number(amountInput);

  // Validate that the amount is a real number and greater than zero
  const isValidAmount = Number.isFinite(spendingAmount) && spendingAmount > 0;

  /*
    Trim the description so spaces at the beginning/end do not count.

    Example:
    " Coffee " becomes "Coffee"
    "     " becomes ""
  */
  const descriptionText = descriptionInput.trim();

  // Counts the characters currently typed into the description input
  const descriptionCharacterCount = descriptionInput.length;

  /*
    Description is valid only if:
    - trimmed text has at least 1 character
    - raw input does not exceed the max length
  */
  const isValidDescription =
    descriptionText.length > 0 &&
    descriptionCharacterCount <= MAX_DESCRIPTION_LENGTH;

  /*
    Combined form validation.

    The user can only add a spending entry if both fields are valid.
  */
  const canAddSpendingEntry = isValidAmount && isValidDescription;

  // More readable inverse used by the button disabled logic
  const cannotAddSpendingEntry = !canAddSpendingEntry;

  /*
    Create a new array of only today's spending entries.

    spendingEntries = full local ledger
    todaysSpendingEntries = only entries where spentAt is today
  */
  const todaysSpendingEntries = spendingEntries.filter((spendingEntry) => {
    return isSpendingEntryFromToday(spendingEntry);
  });

  /*
    Calculate today's running total.

    reduce() turns the todaysSpendingEntries array into one number.
    It starts at 0, then adds each spendingEntry.amount.
  */
  const spentToday = todaysSpendingEntries.reduce((total, spendingEntry) => {
    return total + spendingEntry.amount;
  }, 0);

  // Format the running total for display in the UI
  const formattedSpentToday = formatCurrency(spentToday);

  /*
    Helper function to format a number as US currency.

    Example:
    12.5 becomes "$12.50"
  */
  function formatCurrency(amount: number) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  /*
    Helper function that checks whether a spending entry belongs to today.

    Important:
    We use spentAt, not createdAt.

    spentAt = when the spending actually happened
    createdAt = when the record was created in the app
  */
  function isSpendingEntryFromToday(spendingEntry: SpendingEntry) {
    const spentDate = new Date(spendingEntry.spentAt);
    const today = new Date();

    return (
      spentDate.getFullYear() === today.getFullYear() &&
      spentDate.getMonth() === today.getMonth() &&
      spentDate.getDate() === today.getDate()
    );
  }

  /*
    Main function for manually adding a spending entry from the UI.

    This is still called when the user presses "Add Purchase",
    but internally we now store it as a SpendingEntry.
  */
  function addManualSpendingEntry() {
    // If either the amount or description is invalid, stop the function
    if (cannotAddSpendingEntry) {
      return;
    }

    const now = new Date().toISOString();

    const newSpendingEntry: SpendingEntry = {
      id: Date.now().toString(),
      source: "manual",
      amount: spendingAmount,
      description: descriptionText,
      spentAt: now,
      createdAt: now,
    };

    Keyboard.dismiss();

    /*
      Update the local ledger.
      This creates a new array with the newest entry at the top,
      followed by all previous entries.
    */
    setSpendingEntries((previousSpendingEntries) => [
      newSpendingEntry,
      ...previousSpendingEntries,
    ]);

    // Clear both input fields after the spending entry is added
    closeAddPurchaseModal();
  }

  /*
    Resets the local ledger and clears the input fields.

    Later, we may move this somewhere harder to accidentally press.
  */
  function resetTotal() {
    Keyboard.dismiss();
    setAmountInput("");
    setDescriptionInput("");
    setSpendingEntries([]);
  }

  /*
    Deletes one spending entry by id.

    filter() creates a new array that keeps every entry
    except the one whose id matches spendingEntryId.
  */
  function deleteSpendingEntry(spendingEntryId: string) {
    setSpendingEntries((previousSpendingEntries) =>
      previousSpendingEntries.filter(
        (spendingEntry) => spendingEntry.id !== spendingEntryId,
      ),
    );
  }

  function openAddPurchaseModal() {
    setIsAddPurchaseModalVisible(true);
  }

  function closeAddPurchaseModal() {
    Keyboard.dismiss();
    setAmountInput("");
    setDescriptionInput("");
    setIsAddPurchaseModalVisible(false);
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.appName}>Triage</Text>

          <Text style={styles.subtitle}>What's the damage?</Text>

          <Text style={styles.amount}>{formattedSpentToday}</Text>

          <Text style={styles.caption}>Spent today</Text>
          <Pressable
            style={styles.primaryButton}
            onPress={openAddPurchaseModal}
          >
            <Text style={styles.primaryButtonText}>+ Add Purchase</Text>
          </Pressable>
          <View style={styles.purchaseList}>
            <Text style={styles.sectionTitle}>Recent Spending:</Text>

            {/*
              map() loops through every item in todaysSpendingEntries.

              For each spendingEntry, it creates a visible row on screen.
            */}
            {todaysSpendingEntries.map((spendingEntry) => {
              return (
                <View key={spendingEntry.id} style={styles.purchaseItem}>
                  <Text style={styles.purchaseAmount}>
                    {formatCurrency(spendingEntry.amount)}
                  </Text>

                  <Text style={styles.purchaseAmount}>
                    {spendingEntry.description}
                  </Text>

                  {/*
                    This delete button is created inside the map() loop,
                    so it has access to the current spendingEntry.

                    The arrow function prevents deleteSpendingEntry from
                    running immediately. It only runs later, when pressed.
                  */}
                  <Pressable
                    onPress={() => deleteSpendingEntry(spendingEntry.id)}
                    hitSlop={12}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
          <Pressable style={styles.secondaryButton} onPress={resetTotal}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Modal
        visible={isAddPurchaseModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeAddPurchaseModal}
      >
        <KeyboardAvoidingView
          style={styles.modalKeyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Add Purchase</Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Purchase Amount</Text>

                <TextInput
                  style={styles.input}
                  value={amountInput}
                  onChangeText={setAmountInput}
                  placeholder="Example: 12.50"
                  placeholderTextColor="#777777"
                  keyboardType="decimal-pad"
                />

                <Text style={styles.inputLabel}>Description</Text>

                <TextInput
                  style={styles.input}
                  value={descriptionInput}
                  onChangeText={setDescriptionInput}
                  placeholder="Example: Coffee"
                  placeholderTextColor="#777777"
                  maxLength={MAX_DESCRIPTION_LENGTH}
                />

                <Text style={styles.characterCount}>
                  {descriptionCharacterCount} / {MAX_DESCRIPTION_LENGTH}
                </Text>
              </View>

              <Pressable
                style={[
                  styles.primaryButton,
                  cannotAddSpendingEntry && styles.disabledButton,
                ]}
                onPress={addManualSpendingEntry}
                disabled={cannotAddSpendingEntry}
              >
                <Text style={styles.primaryButtonText}>Add Purchase</Text>
              </Pressable>

              <Pressable
                style={styles.secondaryButton}
                onPress={closeAddPurchaseModal}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
