import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchBankTransactionsSync } from "../../api/bankTransactionsApi";
import { homeScreenStyles as styles } from "../../styles/homeScreenStyles";
import type { BankTransaction } from "../../types/bankTransaction";
import type { SpendingEntry } from "../../types/spendingEntry";
import { calculateLedgerItemTotal } from "../../utils/ledgerCalculations";
import {
  getLocalDateStringFromTimestamp,
  mapBankTransactionToLedgerItem,
  mapSpendingEntryToLedgerItem,
} from "../../utils/ledgerItemMappers";

// Storage key used by AsyncStorage to save the local ledger on the phone
const SPENDING_ENTRIES_STORAGE_KEY = "triage:spendingEntries";

// Max number of characters allowed in the description input
const MAX_DESCRIPTION_LENGTH = 25;

// Main screen component. This re-renders whenever one of its state setters is called.
export default function HomeScreen() {
  const [amountInput, setAmountInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  const [selectedSpentDate, setSelectedSpentDate] = useState(new Date());

  const [selectedDashboardDate, setSelectedDashboardDate] = useState(
    new Date(),
  );

  const [spendingEntries, setSpendingEntries] = useState<SpendingEntry[]>([]);

  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(
    [],
  );

  const [isBankTransactionsLoading, setIsBankTransactionsLoading] =
    useState(false);

  const [bankTransactionsError, setBankTransactionsError] = useState<
    string | null
  >(null);

  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  const [isAddPurchaseModalVisible, setIsAddPurchaseModalVisible] =
    useState(false);

  const [isResetConfirmModalVisible, setIsResetConfirmModalVisible] =
    useState(false);

  const [isDashboardDatePickerVisible, setIsDashboardDatePickerVisible] =
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

  const spendingAmount = Number(amountInput);

  // Validate that the amount is a real number and greater than zero
  const isValidAmount = Number.isFinite(spendingAmount) && spendingAmount > 0;

  const descriptionText = descriptionInput.trim();

  // Counts the characters currently typed into the description input
  const descriptionCharacterCount = descriptionInput.length;

  const isValidDescription =
    descriptionText.length > 0 &&
    descriptionCharacterCount <= MAX_DESCRIPTION_LENGTH;

  /*
    Combined form validation.
    The user can only add a spending entry if both fields are valid.
  */
  const canAddSpendingEntry = isValidAmount && isValidDescription;
  const cannotAddSpendingEntry = !canAddSpendingEntry;

  function formatCurrency(amount: number) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  const manualLedgerItems = spendingEntries.map((spendingEntry) => {
    return mapSpendingEntryToLedgerItem(spendingEntry);
  });

  const bankLedgerItems = bankTransactions.map((bankTransaction) => {
    return mapBankTransactionToLedgerItem(bankTransaction);
  });

  const ledgerItems = [...manualLedgerItems, ...bankLedgerItems];

  const sortedLedgerItems = [...ledgerItems].sort((firstItem, secondItem) => {
    return secondItem.spentOn.localeCompare(firstItem.spentOn);
  });

  /*
    Convert the currently selected dashboard date into the same
    YYYY-MM-DD format used by LedgerItem.spentOn.
  */
  const selectedDashboardDateString = getLocalDateStringFromTimestamp(
    selectedDashboardDate.toISOString(),
  );

  /*
    Filter the complete ledger so the dashboard only displays
    purchases from the selected date.
  */
  const selectedDateLedgerItems = sortedLedgerItems.filter((ledgerItem) => {
    return ledgerItem.spentOn === selectedDashboardDateString;
  });

  /*
    Calculate the displayed total from the same items shown
    in the purchase list.
  */
  const selectedDateTotal = calculateLedgerItemTotal(selectedDateLedgerItems);

  const formattedSelectedDateTotal = formatCurrency(selectedDateTotal);

  /*
    This text appears above the total.
    Example: Monday, July 27, 2026
  */
  const formattedDashboardDate = selectedDashboardDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  const todayDateString = getLocalDateStringFromTimestamp(
    new Date().toISOString(),
  );

  const isViewingToday = selectedDashboardDateString === todayDateString;

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
      spentAt: selectedSpentDate.toISOString(),
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

    closeAddPurchaseModal();
  }

  function confirmResetTotal() {
    Keyboard.dismiss();
    setAmountInput("");
    setDescriptionInput("");
    setSpendingEntries([]);
    setBankTransactions([]);
    closeResetConfirmModal();
  }

  async function importFakeBankTransactions() {
    setIsBankTransactionsLoading(true);
    setBankTransactionsError(null);

    try {
      const transactionsSyncResponse = await fetchBankTransactionsSync();

      setBankTransactions(transactionsSyncResponse.added);

      console.log(
        "Imported fake bank transactions:",
        transactionsSyncResponse.added,
      );
    } catch (error) {
      console.log("Failed to import bank transactions:", error);

      setBankTransactionsError(
        "Unable to import bank transactions. Please try again.",
      );
    } finally {
      setIsBankTransactionsLoading(false);
    }
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
    /*
      Default the purchase date to whichever date the user
      is currently viewing on the dashboard.
    */
    setSelectedSpentDate(new Date(selectedDashboardDate));
    setIsAddPurchaseModalVisible(true);
  }

  function closeAddPurchaseModal() {
    Keyboard.dismiss();
    setAmountInput("");
    setDescriptionInput("");
    setSelectedSpentDate(new Date());
    setIsAddPurchaseModalVisible(false);
  }

  function openResetConfirmModal() {
    setIsResetConfirmModalVisible(true);
  }

  function closeResetConfirmModal() {
    setIsResetConfirmModalVisible(false);
  }

  /*
    Move the dashboard backward or forward by a specific
    number of calendar days.
  */
  function changeDashboardDateByDays(numberOfDays: number) {
    setSelectedDashboardDate((previousDate) => {
      const updatedDate = new Date(previousDate);

      updatedDate.setDate(updatedDate.getDate() + numberOfDays);

      return updatedDate;
    });
  }

  function showPreviousDashboardDate() {
    changeDashboardDateByDays(-1);
  }

  function showNextDashboardDate() {
    /*
      The user cannot navigate beyond today.
    */
    if (isViewingToday) {
      return;
    }

    changeDashboardDateByDays(1);
  }

  function openDashboardDatePicker() {
    setIsDashboardDatePickerVisible(true);
  }

  function closeDashboardDatePicker() {
    setIsDashboardDatePickerVisible(false);
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <Text style={styles.appName}>Triage</Text>

        <Text style={styles.subtitle}>{"What's the damage?"}</Text>

        <View style={styles.dateNavigationRow}>
          <Pressable
            style={styles.dateArrowButton}
            onPress={showPreviousDashboardDate}
            accessibilityLabel="Show previous day"
          >
            <Text style={styles.dateArrowText}>‹</Text>
          </Pressable>

          <Pressable
            style={styles.dateButton}
            onPress={openDashboardDatePicker}
            accessibilityLabel="Choose dashboard date"
          >
            <Text style={styles.dateText}>{formattedDashboardDate}</Text>

            <Text style={styles.dateHint}>Tap to choose a date</Text>
          </Pressable>

          <Pressable
            style={[
              styles.dateArrowButton,
              isViewingToday && styles.disabledButton,
            ]}
            onPress={showNextDashboardDate}
            disabled={isViewingToday}
            accessibilityLabel="Show next day"
          >
            <Text style={styles.dateArrowText}>›</Text>
          </Pressable>
        </View>

        <Text style={styles.amount}>{formattedSelectedDateTotal}</Text>

        <Text style={styles.caption}>Total Spending</Text>

        <Pressable style={styles.primaryButton} onPress={openAddPurchaseModal}>
          <Text style={styles.primaryButtonText}>+ Add Purchase</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Purchases</Text>

        <FlatList
          style={[
            styles.purchaseList,
            {
              borderWidth: 1,
              borderColor: "#333333",
              borderRadius: 16,
              overflow: "hidden",
            },
          ]}
          contentContainerStyle={[
            {
              paddingLeft: 14,
              paddingRight: 36,
              paddingVertical: 8,
            },
            selectedDateLedgerItems.length === 0
              ? {
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }
              : undefined,
          ]}
          data={selectedDateLedgerItems}
          keyExtractor={(ledgerItem) => ledgerItem.id}
          showsVerticalScrollIndicator={true}
          indicatorStyle="white"
          ListEmptyComponent={
            <Text
              style={{
                color: "#a8a8a8",
                fontSize: 15,
                textAlign: "center",
              }}
            >
              No purchases recorded for this date.
            </Text>
          }
          renderItem={({ item: ledgerItem }) => {
            const sourceLabel =
              ledgerItem.source === "manual" ? "Manual" : "Bank import";

            return (
              <View style={styles.activityItem}>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityDescription}>
                    {ledgerItem.description}
                  </Text>

                  <Text style={styles.activityMeta}>
                    {ledgerItem.spentOn} · {sourceLabel}
                    {ledgerItem.isPending ? " · Pending" : ""}
                  </Text>
                </View>

                <View style={styles.activityRightColumn}>
                  <Text style={styles.purchaseAmount}>
                    {formatCurrency(ledgerItem.amount)}
                  </Text>

                  {ledgerItem.source === "manual" && (
                    <Pressable
                      hitSlop={12}
                      onPress={() => {
                        deleteSpendingEntry(ledgerItem.sourceId);
                      }}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          }}
        />

        <Pressable
          style={styles.secondaryButton}
          onPress={openResetConfirmModal}
        >
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </Pressable>

        <Pressable
          style={[
            styles.secondaryButton,
            isBankTransactionsLoading && styles.disabledButton,
          ]}
          onPress={importFakeBankTransactions}
          disabled={isBankTransactionsLoading}
        >
          <Text style={styles.secondaryButtonText}>
            {isBankTransactionsLoading
              ? "Importing Fake Bank Transactions..."
              : "Import Fake Bank Transactions"}
          </Text>
        </Pressable>

        {bankTransactionsError !== null && (
          <Text style={styles.caption}>{bankTransactionsError}</Text>
        )}

        {bankTransactions.length > 0 && (
          <Text style={styles.caption}>
            Imported {bankTransactions.length} fake bank transaction
            {bankTransactions.length === 1 ? "" : "s"}.
          </Text>
        )}
      </View>

      <Modal
        visible={isDashboardDatePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDashboardDatePicker}
      >
        <View style={styles.datePickerModalOverlay}>
          <View style={styles.datePickerModalCard}>
            <Text style={styles.modalTitle}>Choose a Date</Text>

            <DateTimePicker
              value={selectedDashboardDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              maximumDate={new Date()}
              onChange={(_event, selectedDate) => {
                if (selectedDate !== undefined) {
                  setSelectedDashboardDate(selectedDate);
                }

                /*
                  Android uses a native date dialog, so close our
                  wrapper modal after the user selects or dismisses it.
                */
                if (Platform.OS === "android") {
                  closeDashboardDatePicker();
                }
              }}
            />

            {Platform.OS === "ios" && (
              <Pressable
                style={styles.primaryButton}
                onPress={closeDashboardDatePicker}
              >
                <Text style={styles.primaryButtonText}>Done</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={isAddPurchaseModalVisible}
        transparent={false}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={closeAddPurchaseModal}
      >
        <KeyboardAvoidingView
          style={styles.modalKeyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Add Purchase</Text>

              <Text style={styles.inputLabel}>Purchase Date</Text>

              <View style={styles.inputWrapper}>
                <View style={styles.datePickerWrapper}>
                  <DateTimePicker
                    value={selectedSpentDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "compact" : "default"}
                    maximumDate={new Date()}
                    onChange={(_event, selectedDate) => {
                      if (selectedDate !== undefined) {
                        setSelectedSpentDate(selectedDate);
                      }
                    }}
                  />
                </View>

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

      <Modal
        visible={isResetConfirmModalVisible}
        transparent={false}
        animationType="none"
        presentationStyle="fullScreen"
        onRequestClose={closeResetConfirmModal}
      >
        <View style={styles.resetModalScreen}>
          <View style={styles.resetModalCard}>
            <Text style={styles.resetModalTitle}>Reset all spending?</Text>

            <Text style={styles.resetModalMessage}>
              This will clear all saved spending entries from the app. This
              cannot be undone.
            </Text>

            <Pressable style={styles.dangerButton} onPress={confirmResetTotal}>
              <Text style={styles.dangerButtonText}>Clear Everything</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={closeResetConfirmModal}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
