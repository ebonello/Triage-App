import { Modal, Pressable, Text, View } from "react-native";
import { homeScreenStyles as styles } from "../styles/homeScreenStyles";
import { getLocalDateStringFromTimestamp } from "../utils/dateUtils";
import type { ReconciliationCandidate } from "../utils/reconciliation";

type ReconciliationModalProps = {
  candidate: ReconciliationCandidate | null;
  onReplaceManualEntry: () => void;
  onKeepBoth: () => void;
};

export function ReconciliationModal({
  candidate,
  onReplaceManualEntry,
  onKeepBoth,
}: ReconciliationModalProps) {
  if (candidate === null) {
    return null;
  }

  const { spendingEntry, bankTransaction, daysApart } = candidate;

  const manualDate = getLocalDateStringFromTimestamp(spendingEntry.spentAt);

  const bankDate = bankTransaction.authorized_date ?? bankTransaction.date;

  const bankDescription = bankTransaction.merchant_name ?? bankTransaction.name;

  const formattedManualAmount = spendingEntry.amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedBankAmount = bankTransaction.amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onKeepBoth}
    >
      <View style={styles.reconciliationModalOverlay}>
        <View style={styles.reconciliationModalCard}>
          <Text style={styles.reconciliationEyebrow}>POSSIBLE MATCH</Text>

          <Text style={styles.reconciliationTitle}>
            Replace manual purchase?
          </Text>

          <Text style={styles.reconciliationMessage}>
            This bank transaction looks like a purchase you entered manually.
          </Text>

          <View style={styles.reconciliationTransactionCard}>
            <Text style={styles.reconciliationSourceLabel}>MANUAL ENTRY</Text>

            <View style={styles.reconciliationTransactionRow}>
              <View style={styles.reconciliationTransactionDetails}>
                <Text style={styles.reconciliationDescription}>
                  {spendingEntry.description}
                </Text>

                <Text style={styles.reconciliationDate}>{manualDate}</Text>
              </View>

              <Text style={styles.reconciliationAmount}>
                {formattedManualAmount}
              </Text>
            </View>
          </View>

          <Text style={styles.reconciliationArrow}>↓</Text>

          <View style={styles.reconciliationTransactionCard}>
            <Text style={styles.reconciliationSourceLabel}>
              BANK TRANSACTION
            </Text>

            <View style={styles.reconciliationTransactionRow}>
              <View style={styles.reconciliationTransactionDetails}>
                <Text style={styles.reconciliationDescription}>
                  {bankDescription}
                </Text>

                <Text style={styles.reconciliationDate}>
                  {bankDate}
                  {bankTransaction.pending ? " · Pending" : ""}
                </Text>
              </View>

              <Text style={styles.reconciliationAmount}>
                {formattedBankAmount}
              </Text>
            </View>
          </View>

          <Text style={styles.reconciliationMatchReason}>
            Same amount
            {daysApart === 0
              ? " · Same day"
              : ` · ${daysApart} day${daysApart === 1 ? "" : "s"} apart`}
          </Text>

          <Pressable
            style={styles.reconciliationReplaceButton}
            onPress={onReplaceManualEntry}
          >
            <Text style={styles.reconciliationReplaceButtonText}>
              Replace Manual Entry
            </Text>
          </Pressable>

          <Pressable
            style={styles.reconciliationKeepButton}
            onPress={onKeepBoth}
          >
            <Text style={styles.reconciliationKeepButtonText}>Keep Both</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
