import { StyleSheet } from "react-native";

export const homeScreenStyles = StyleSheet.create({
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

  container: {
    flex: 1,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  headerCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#101010",
    borderColor: "#222222",
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  appName: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "700",
  },

  subtitle: {
    color: "#cfcfcf",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },

  dateNavigationRow: {
    width: "100%",
    maxWidth: 360,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  dateArrowButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 22,
  },

  dateArrowText: {
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 34,
  },

  dateButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  dateText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  dateHint: {
    color: "#777777",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
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
    marginBottom: 24,
  },

  purchaseListContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
  },

  purchaseList: {
    flex: 1,
    width: "100%",
    marginTop: 12,
    marginBottom: 12,
  },

  purchaseListBorder: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 16,
    overflow: "hidden",
  },

  purchaseListContent: {
    flexGrow: 1,
    paddingLeft: 14,
    paddingRight: 48,
    paddingVertical: 8,
  },

  emptyPurchaseListContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 14,
  },

  emptyPurchaseListText: {
    color: "#a8a8a8",
    fontSize: 15,
    textAlign: "center",
  },

  purchaseListExpandButton: {
    position: "absolute",
    top: 20,
    right: 8,
    zIndex: 1,
    elevation: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#444444",
  },

  purchaseListExpandIcon: {
    color: "#cfcfcf",
    fontSize: 15,
    fontWeight: "700",
  },

  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#222222",
    borderBottomWidth: 1,
  },

  activityDetails: {
    flex: 1,
    minWidth: 0,
    marginRight: 16,
  },

  activityDescription: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  activityMeta: {
    color: "#a8a8a8",
    fontSize: 13,
    marginTop: 4,
  },

  activityRightColumn: {
    flexShrink: 0,
    alignItems: "flex-end",
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

  datePickerWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "100%",
  },

  inputLabel: {
    color: "#a8a8a8",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 8,
  },

  characterCount: {
    color: "#777777",
    fontSize: 12,
    textAlign: "right",
    marginTop: 6,
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
    margin: 10,
  },

  secondaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },

  purchasesModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  purchasesModalCard: {
    width: "100%",
    maxWidth: 420,
    height: "50%",
    minHeight: 280,
    maxHeight: 460,
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 24,
    padding: 16,
  },

  purchasesModalHeader: {
    minHeight: 36,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  purchasesModalDate: {
    color: "#cfcfcf",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 40,
  },

  purchasesModalCloseButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  purchasesModalCloseText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "600",
  },

  purchasesModalList: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 16,
    overflow: "hidden",
  },

  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  datePickerModalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 1)",
    justifyContent: "flex-start",
    padding: 16,
    paddingTop: 150,
  },

  modalSheet: {
    backgroundColor: "#101010",
    borderRadius: 28,
    padding: 24,
    borderColor: "#222222",
    borderWidth: 1,
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
  },

  modalTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    alignSelf: "center",
  },

  modalKeyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#050505",
  },

  resetModalScreen: {
    flex: 1,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  resetModalCard: {
    backgroundColor: "#101010",
    borderRadius: 28,
    padding: 24,
    borderColor: "#222222",
    borderWidth: 1,
    width: "100%",
    maxWidth: 380,
  },

  resetModalTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },

  resetModalMessage: {
    color: "#a8a8a8",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },

  dangerButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 999,
    marginBottom: 14,
    width: "100%",
    alignItems: "center",
  },

  dangerButtonText: {
    color: "#050505",
    fontSize: 18,
    fontWeight: "700",
  },
});
