import { useState } from "react";
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

type Purchase = {
  id: string;
  amount: number;
  createdAt: string;
};

const PURCHASES_STORAGE_KEY = "triage:purchases";

export default function HomeScreen() {
  const [amountInput, setAmountInput] = useState("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  const purchaseAmount = Number(amountInput);
  const isValidAmount = Number.isFinite(purchaseAmount) && purchaseAmount > 0;
  const isInvalidAmount = !isValidAmount;

  const spentToday = purchases.reduce((total, purchase) => {
    return total + purchase.amount;
  }, 0);

  function formatCurrency(amount: number) {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  const formattedSpentToday = formatCurrency(spentToday);

  function addPurchase() {
    if (isInvalidAmount) {
      return;
    }

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      amount: purchaseAmount,
      createdAt: new Date().toISOString(),
    };

    Keyboard.dismiss();

    setPurchases((previousPurchases) => [newPurchase, ...previousPurchases]);

    setAmountInput("");
  }

  function resetTotal() {
    Keyboard.dismiss();
    setAmountInput("");
    setPurchases([]);
  }
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

            {purchases.map((purchase) => {
              return (
                <View key={purchase.id} style={styles.purchaseItem}>
                  <Text style={styles.purchaseAmount}>
                    {formatCurrency(purchase.amount)}
                  </Text>

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
