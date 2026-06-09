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
    marginTop: 8,
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
