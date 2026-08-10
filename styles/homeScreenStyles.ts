import { StyleSheet } from "react-native";

const colors = {
  background: "#0A0C11",
  backgroundRaised: "#0E1118",

  surface: "#131720",
  surfaceRaised: "#191E29",
  surfacePressed: "#202635",

  border: "#252C3A",
  borderStrong: "#333C4D",

  textPrimary: "#F7F8FC",
  textSecondary: "#A4ADBD",
  textMuted: "#697386",

  accent: "#7C6FF2",
  accentBright: "#9186FF",
  accentSoft: "#262241",

  danger: "#FF6B7C",
  dangerSoft: "#3A1F29",
};

export const homeScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },

  headerCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: "center",
    paddingVertical: 17,
    paddingHorizontal: 20,
    marginBottom: 18,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },

  appName: {
    color: colors.textPrimary,
    fontSize: 31,
    fontWeight: "800",
    letterSpacing: -0.8,
    textAlign: "center",
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "500",
    marginTop: 3,
    textAlign: "center",
  },

  dateNavigationRow: {
    width: "100%",
    maxWidth: 420,
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 24,
  },

  dateArrowButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  },

  dateArrowText: {
    color: colors.accentBright,
    fontSize: 30,
    fontWeight: "400",
    lineHeight: 32,
  },

  dateButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  dateText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.15,
  },

  dateHint: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "500",
    marginTop: 3,
    textAlign: "center",
  },

  amount: {
    color: colors.textPrimary,
    fontSize: 60,
    fontWeight: "800",
    letterSpacing: -2.4,
    fontVariant: ["tabular-nums"],
    marginBottom: 1,
  },

  caption: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.15,
    marginBottom: 20,
  },

  purchaseListContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 420,
    minHeight: 120,
    position: "relative",
  },

  purchaseList: {
    flex: 1,
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
  },

  purchaseListBorder: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: "hidden",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 3,
  },

  purchaseListContent: {
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 52,
    paddingVertical: 7,
  },

  emptyPurchaseListContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },

  emptyPurchaseListText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    textAlign: "center",
  },

  purchaseListExpandButton: {
    position: "absolute",
    top: 21,
    right: 9,
    zIndex: 1,
    elevation: 5,
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.accentBright,

    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  purchaseListExpandIcon: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  activityItem: {
    minHeight: 66,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  activityDetails: {
    flex: 1,
    minWidth: 0,
    marginRight: 16,
  },

  activityDescription: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  activityMeta: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 5,
  },

  activityRightColumn: {
    flexShrink: 0,
    alignItems: "flex-end",
  },

  purchaseAmount: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },

  deleteText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
  },

  inputWrapper: {
    width: "100%",
    maxWidth: 350,
    marginBottom: 20,
  },

  datePickerWrapper: {
    width: "100%",
    minHeight: 52,
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 12,
  },

  inputLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 8,
    marginTop: 15,
  },

  characterCount: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "500",
    textAlign: "right",
    marginTop: 6,
  },

  input: {
    width: "100%",
    minHeight: 54,
    backgroundColor: colors.surfaceRaised,
    color: colors.textPrimary,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 13,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: "500",
  },

  primaryButton: {
    width: "100%",
    maxWidth: 420,
    minHeight: 54,
    backgroundColor: colors.accent,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.24,
    shadowRadius: 12,
    elevation: 4,
  },

  disabledButton: {
    opacity: 0.35,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.1,
  },

  secondaryButton: {
    width: "100%",
    maxWidth: 420,
    minHeight: 50,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 5,
  },

  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
  },

  purchasesModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(3, 5, 9, 0.86)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  purchasesModalCard: {
    width: "100%",
    maxWidth: 430,
    height: "58%",
    minHeight: 320,
    maxHeight: 560,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 26,
    padding: 16,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 12,
  },

  purchasesModalHeader: {
    minHeight: 42,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  purchasesModalDate: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 44,
  },

  purchasesModalCloseButton: {
    position: "absolute",
    top: 2,
    right: 0,
    width: 36,
    height: 36,
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  purchasesModalCloseText: {
    color: colors.textSecondary,
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 24,
  },

  purchasesModalList: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.backgroundRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    overflow: "hidden",
  },

  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(3, 5, 9, 0.88)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  datePickerModalCard: {
    width: "100%",
    maxWidth: 390,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 26,
    padding: 22,
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "flex-start",
    paddingHorizontal: 18,
    paddingTop: 105,
  },

  modalSheet: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 24,
    borderColor: colors.border,
    borderWidth: 1,
    alignSelf: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 10,
  },

  modalTitle: {
    color: colors.textPrimary,
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 20,
    alignSelf: "center",
  },

  modalKeyboardAvoidingView: {
    flex: 1,
    backgroundColor: colors.background,
  },

  resetModalScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  resetModalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 24,
    borderColor: colors.border,
    borderWidth: 1,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 10,
  },

  resetModalTitle: {
    color: colors.textPrimary,
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 11,
  },

  resetModalMessage: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
    marginBottom: 24,
  },

  dangerButton: {
    width: "100%",
    minHeight: 52,
    backgroundColor: colors.danger,
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: colors.danger,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },

  dangerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  /*
    Reconciliation modal
  */

  reconciliationModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(3, 5, 9, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  reconciliationModalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 28,
    padding: 22,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.42,
    shadowRadius: 28,
    elevation: 12,
  },

  reconciliationEyebrow: {
    color: colors.accentBright,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
    textAlign: "center",
    marginBottom: 8,
  },

  reconciliationTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },

  reconciliationMessage: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  reconciliationTransactionCard: {
    width: "100%",
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 15,
  },

  reconciliationSourceLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 9,
  },

  reconciliationTransactionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  reconciliationTransactionDetails: {
    flex: 1,
    marginRight: 16,
  },

  reconciliationDescription: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },

  reconciliationDate: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },

  reconciliationAmount: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },

  reconciliationArrow: {
    color: colors.accentBright,
    fontSize: 23,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 7,
  },

  reconciliationMatchReason: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 13,
    marginBottom: 18,
  },

  reconciliationReplaceButton: {
    width: "100%",
    minHeight: 52,
    backgroundColor: colors.accent,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 10,
  },

  reconciliationReplaceButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  reconciliationKeepButton: {
    width: "100%",
    minHeight: 50,
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  reconciliationKeepButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "700",
  },
});
