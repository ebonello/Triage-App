import { Pressable, Text, View } from "react-native";
import { homeScreenStyles as styles } from "../styles/homeScreenStyles";
import type { LedgerItem } from "../types/ledgerItem";

type PurchaseListItemProps = {
  ledgerItem: LedgerItem;
  formattedAmount: string;
  onDeleteManualEntry: (spendingEntryId: string) => void;
};

export function PurchaseListItem({
  ledgerItem,
  formattedAmount,
  onDeleteManualEntry,
}: PurchaseListItemProps) {
  const sourceLabel = ledgerItem.source === "manual" ? "Manual" : "Bank import";

  return (
    <View style={styles.activityItem}>
      <View style={styles.activityDetails}>
        <Text style={styles.activityDescription}>{ledgerItem.description}</Text>

        <Text style={styles.activityMeta}>
          {ledgerItem.spentOn} · {sourceLabel}
          {ledgerItem.isPending ? " · Pending" : ""}
        </Text>
      </View>

      <View style={styles.activityRightColumn}>
        <Text style={styles.purchaseAmount}>{formattedAmount}</Text>

        {ledgerItem.source === "manual" && (
          <Pressable
            hitSlop={12}
            onPress={() => {
              onDeleteManualEntry(ledgerItem.sourceId);
            }}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
