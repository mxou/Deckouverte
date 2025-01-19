import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE5E5",
    alignItems: "center",
    justifyContent: "start",
    paddingHorizontal: 20,
    paddingVertical: 40,
    position: "relative",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#36206D",
    marginBottom: 20,
  },
  searchInput: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
    elevation: 8,
  },
  deckContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  deckCard: {
    width: "48%", // 48% pour avoir un espace entre les colonnes
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    elevation: 3,
  },
  cardStack: {
    width: "40%",
    aspectRatio: 0.8,
    position: "relative",
    marginVertical: 12,
  },
  stackedCard: {
    width: "90%",
    height: "90%",
    borderWidth: 2,
    borderColor: "#D2367A",
    borderRadius: 8,
    backgroundColor: "#fff",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  stackedCardBack: {
    backgroundColor: "#fff",
    elevation: 1,
  },
  stackedCardLeft: {
    transform: [{ rotate: "-8deg" }],
    left: -2,
  },
  stackedCardRight: {
    transform: [{ rotate: "8deg" }],
    right: -2,
  },
  stackedCardFront: {
    elevation: 2,
  },

  deckTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#D2367A",
    marginBottom: 8,
    marginTop: 8,
    width: "100%",
    textAlign: "center",
  },
  deckCartesAtmContainer: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#D2367A",
    padding: 1,
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
  },
  deckCartesAtm: {
    color: "#36206D",
    fontSize: 18,
    fontWeight: 700,
  },
  deckDateFin: {
    marginBottom: 8,
  },
  deckInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  deckLikes: {
    position: "absolute",
    top: 5,
    left: 5,
  },
  deckButton: {
    backgroundColor: "#E8407C",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  deckButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  playButton: {
    textAlign: "center",
    backgroundColor: "#D2367A",
    padding: 6,
    borderRadius: 8,
    color: "white",
    fontWeight: 600,
    width: "90%",
  },
});

export default styles;
