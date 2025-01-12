import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import "react-native-reanimated";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSpring, runOnJS, useAnimatedGestureHandler } from "react-native-reanimated";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
import { useGame } from "../context/GameContext";

import BackgroundSVG from "../../assets/img/backgroundCard.svg";
import LikeButton from "./LikeButton";

type Card = {
  id_carte: number;
  texte_carte: string;
  valeurs_choix1: { texte: string; population: number; finances: number };
  valeurs_choix2: { texte: string; population: number; finances: number };
};

const { width } = Dimensions.get("window");

interface CardSliderProps {
  cards: Card[];
  deckId: string;
}

// Fonction pour générer une couleur aléatoire (surtout pour le bgcolor des cartes)
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export default function CardSlider({ cards, deckId }: CardSliderProps) {
  const { stats, updateStats, resetStats } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameFailed, setIsGameFailed] = useState(false);
  const [swipeText, setSwipeText] = useState("");
  const [bgColor, setBgColor] = useState(getRandomColor());

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0); // Variable animée pour l'opacité

  // Réinitialiser les stats au début de la game
  useEffect(() => {
    resetStats();
    setCurrentIndex(0);
    setIsGameWon(false);
    setIsGameFailed(false);
    setSwipeText("");
    setBgColor(getRandomColor());
    opacity.value = withTiming(1, { duration: 700 }); // La carte apparait en 700ms
  }, [cards]);

  const handleSwipeComplete = (direction: "left" | "right") => {
    let populationChange = 0;
    let financesChange = 0;

    if (direction === "left") {
      const { population, finances } = cards[currentIndex].valeurs_choix1;
      populationChange = population;
      financesChange = finances;
    } else if (direction === "right") {
      const { population, finances } = cards[currentIndex].valeurs_choix2;
      populationChange = population;
      financesChange = finances;
    }

    // Calculer les nouvelles stats localement
    const newPopulation = Math.max(0, stats.population + populationChange);
    const newFinances = Math.max(0, stats.finances + financesChange);

    // Mettre à jour les stats dans le contexte global
    updateStats(populationChange, financesChange);

    // Log des nouvelles valeurs
    console.warn("Nouvelles stats : Population =", newPopulation, ", Finances =", newFinances);

    // Vérifier les conditions de défaite
    if (newPopulation <= 0 || newFinances <= 0 || newPopulation >= 100 || newFinances >= 100) {
      setIsGameFailed(true);
    }

    // // Ajout d'un log après mise à jour
    // setTimeout(() => {
    //   console.warn("Stats actuelles : Population =", stats.population, ", Finances =", stats.finances);
    // }, 0);

    setSwipeText("");
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= cards.length) {
        setIsGameWon(true);
        return prevIndex;
      }
      setBgColor(getRandomColor()); // Change la couleur pour la prochaine carte

      // Réinitialise et anime l'opacité
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 700 }); // Durée de 700ms

      return nextIndex;
    });

    translateX.value = 0;
  };

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      runOnJS(setSwipeText)(
        event.translationX > 40
          ? cards[currentIndex]?.valeurs_choix2?.texte || ""
          : event.translationX < -40
          ? cards[currentIndex]?.valeurs_choix1?.texte || ""
          : ""
      );
    },
    onEnd: (event) => {
      if (event.translationX < -100) {
        runOnJS(handleSwipeComplete)("left");
      } else if (event.translationX > 100) {
        runOnJS(handleSwipeComplete)("right");
      } else {
        translateX.value = withSpring(0);
        runOnJS(setSwipeText)("");
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <View style={styles.container}>
        {isGameWon ? (
          <View>
            <Text style={styles.winText}>🎉 Gagné ! 🎉</Text>
            <LikeButton deckId={parseInt(deckId)} />
          </View>
        ) : isGameFailed ? (
          <View>
            <Text style={styles.loseText}>💔 Perdu ! 💔</Text>
          </View>
        ) : cards[currentIndex] ? (
          <>
            <PanGestureHandler onGestureEvent={panGesture}>
              <Animated.View style={[styles.card, animatedStyle, opacityStyle, { backgroundColor: bgColor }]}>
                <BackgroundSVG style={StyleSheet.absoluteFillObject} />
                <Text style={styles.cardText}>{cards[currentIndex].texte_carte}</Text>
              </Animated.View>
            </PanGestureHandler>

            {swipeText !== "" && (
              <View style={styles.swipeTextContainer}>
                <Text style={styles.swipeText}>{swipeText}</Text>
              </View>
            )}
          </>
        ) : (
          <Text style={styles.noMoreCards}>Plus de cartes disponibles</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>👫​ Population: {stats.population}</Text>
        <Text style={styles.statsText}>💸​ Finances: {stats.finances}</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  statsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  card: {
    width: width * 0.8,
    height: 300,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Assurez-vous que le contenu reste dans les limites
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    textAlign: "center",
    color: "#fff", // Changez selon vos besoins
    zIndex: 1, // S'assurer que le texte est au-dessus du SVG
  },
  noMoreCards: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
  },
  winText: {
    fontSize: 50,
    fontWeight: 700,
    textAlign: "center",
    color: "#36206D",
  },
  loseText: {
    fontSize: 50,
    fontWeight: 700,
    textAlign: "center",
    color: "red",
  },
  swipeTextContainer: {
    position: "absolute",
    top: "50%",
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  swipeText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
