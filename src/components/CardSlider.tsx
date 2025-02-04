import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import "react-native-reanimated";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSpring, runOnJS, useAnimatedGestureHandler } from "react-native-reanimated";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import { Link } from "expo-router";
import { useGame } from "../context/GameContext";

import BackgroundSVG from "../../assets/img/backgroundCard.svg";
import LikeButton from "./LikeButton";
import HomeButton from "./HomeButton";

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
const getRandomColor = (): string => {
  const baseColors: string[] = ["#D2367A", "#693ED3", "#36206D"];
  const baseColor: string = baseColors[Math.floor(Math.random() * baseColors.length)]; // Choisir une couleur de base

  const mixWithBlack = (hex: string, factor: number = 0.4): string => {
    let r: number = parseInt(hex.substring(1, 3), 16);
    let g: number = parseInt(hex.substring(3, 5), 16);
    let b: number = parseInt(hex.substring(5, 7), 16);

    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));

    return `rgb(${r}, ${g}, ${b})`;
  };

  return mixWithBlack(baseColor);
};

export default function CardSlider({ cards, deckId }: CardSliderProps) {
  const { stats, updateStats, resetStats } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameFailed, setIsGameFailed] = useState(false);
  const [swipeText, setSwipeText] = useState("");
  const [bgColor, setBgColor] = useState(getRandomColor());
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [swipePosition, setSwipePosition] = useState<"left" | "right" | "">("");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [previousPopulation, setPreviousPopulation] = useState(stats.population);
  const [previousFinances, setPreviousFinances] = useState(stats.finances);

  const [populationColor, setPopulationColor] = useState("#444");
  const [financesColor, setFinancesColor] = useState("#444");

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0); // Variable animée pour l'opacité

  // Réinitialiser les stats au début de la game
  useEffect(() => {
    resetStats();
    playStartSound();
    setCurrentIndex(0);
    setIsGameWon(false);
    setIsGameFailed(false);
    setSwipeText("");
    setBgColor(getRandomColor());
    opacity.value = withTiming(1, { duration: 700 }); // La carte apparait en 700ms
  }, [cards]);

  const playSound = async (soundFile: any) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  const playSwipeSound = () => playSound(require("./../../assets/audio/swipeSound.mp3"));
  const playWinSound = () => playSound(require("./../../assets/audio/winBanjoSound.mp3"));
  const playLoseSound = () => playSound(require("./../../assets/audio/loseSound.mp3"));
  const playStartSound = () => playSound(require("./../../assets/audio/startSound.mp3"));

  const handleSwipeComplete = (direction: "left" | "right") => {
    const finalX = direction === "left" ? -width : width;

    // Déterminer les changements de stats
    let populationChange = 0;
    let financesChange = 0;

    if (direction === "left") {
      const { population, finances } = cards[currentIndex].valeurs_choix1;
      populationChange = population;
      financesChange = finances;
      playSwipeSound();
    } else {
      const { population, finances } = cards[currentIndex].valeurs_choix2;
      populationChange = population;
      financesChange = finances;
      playSwipeSound();
    }

    const newPopulation = Math.max(0, stats.population + populationChange);
    const newFinances = Math.max(0, stats.finances + financesChange);

    // Mettre à jour les stats globales
    updateStats(populationChange, financesChange);

    // Vérifier si la partie est perdue
    // if (newPopulation <= 0 || newFinances <= 0 || newPopulation >= 100 || newFinances >= 100) {
    //   setIsGameFailed(true);
    //   return; // Stop ici, inutile de mettre à jour l'index des cartes
    // }

    // Vérifier si la population a augmenté ou diminué
    if (newPopulation > previousPopulation) {
      setPopulationColor("green");
    } else if (newPopulation < previousPopulation) {
      setPopulationColor("red");
    }

    // Vérifier si les finances ont augmenté ou diminué
    if (newFinances > previousFinances) {
      setFinancesColor("green");
    } else if (newFinances < previousFinances) {
      setFinancesColor("red");
    }

    // Après 0.2s, revenir à la couleur par défaut
    setTimeout(() => {
      setPopulationColor("#444");
      setFinancesColor("#444");
    }, 800);

    // Mettre à jour les anciennes valeurs
    setPreviousPopulation(newPopulation);
    setPreviousFinances(newFinances);

    if (newPopulation <= 0) {
      setGameOverMessage("Votre population semble avoir été kidnappée...");
      setIsGameFailed(true);
      playLoseSound();
      return;
    } else if (newFinances <= 0) {
      setGameOverMessage("Alala... la crise des subprimes...");
      setIsGameFailed(true);
      playLoseSound();
      return;
    } else if (newPopulation >= 100) {
      setGameOverMessage("Votre population a explosé... Genre vraiment");
      setIsGameFailed(true);
      playLoseSound();
      return;
    } else if (newFinances >= 100) {
      setGameOverMessage("Un avare est un imbécile qui se laisse mourir de faim pour garder de quoi vivre");
      setIsGameFailed(true);
      playLoseSound();
      return;
    }

    // Passer à la carte suivante
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;

      if (nextIndex >= cards.length) {
        setIsGameWon(true);
        playWinSound();
        return prevIndex; // Stop si c'est la dernière carte
      }

      setBgColor(getRandomColor()); // Changer la couleur de fond
      return nextIndex;
    });

    // Animation de sortie de la carte
    translateX.value = withTiming(finalX, { duration: 300 }, () => {
      translateX.value = 0;
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 700 });
    });

    runOnJS(setSwipeText)("");
  };

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;

      // Détecter la direction du swipe et placer le container
      if (event.translationX > 40) {
        runOnJS(setSwipeText)(cards[currentIndex]?.valeurs_choix2?.texte || "");
        runOnJS(setSwipePosition)("right");
      } else if (event.translationX < -40) {
        runOnJS(setSwipeText)(cards[currentIndex]?.valeurs_choix1?.texte || "");
        runOnJS(setSwipePosition)("left");
      } else {
        runOnJS(setSwipeText)("");
        runOnJS(setSwipePosition)("");
      }
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
          <View style={styles.winContainer}>
            <Text style={styles.winText}>🎉 Gagné ! 🎉</Text>
            <Text style={styles.winVosStats}>Vos statistiques</Text>
            <View style={styles.winStatsContainer}>
              <Text style={styles.winStats}>👫 ​Population</Text>
              <Text style={[styles.winStats, { color: "#D2367A", fontWeight: "900" }]}>{stats.population}</Text>
            </View>
            <View style={styles.winStatsContainer}>
              <Text style={styles.winStats}>💸​ Finances</Text>
              <Text style={[styles.winStats, { color: "#D2367A", fontWeight: "900" }]}>{stats.finances}</Text>
            </View>
            {/* <HomeButton /> */}
            <Link href={`/`} style={styles.homeBtn}>
              Retour au menu
            </Link>
            <LikeButton deckId={parseInt(deckId)} />
          </View>
        ) : isGameFailed ? (
          <View style={styles.loseContainer}>
            <Text style={styles.loseText}>💀 Perdu 💀</Text>
            <Text style={styles.loseMessage}>{gameOverMessage}</Text>
            <Text style={styles.loseVosStats}>Vos statistiques</Text>
            <View style={styles.loseStatsContainer}>
              <Text style={styles.loseStats}>👫 ​Population</Text>
              <Text style={[styles.loseStats, { color: "#D2367A", fontWeight: "900" }]}>{stats.population}</Text>
            </View>
            <View style={styles.loseStatsContainer}>
              <Text style={styles.loseStats}>💸​ Finances</Text>
              <Text style={[styles.loseStats, { color: "#D2367A", fontWeight: "900" }]}>{stats.finances}</Text>
            </View>
            {/* <HomeButton /> */}
            <Link href={`/`} style={styles.homeBtn}>
              Retour au menu
            </Link>
          </View>
        ) : cards[currentIndex] ? (
          <>
            <View style={styles.fullScreenContainer}>
              {swipeText !== "" && (
                <View
                  style={[
                    styles.swipeTextContainer,
                    { backgroundColor: bgColor },
                    swipePosition === "left" ? styles.swipeContainerLeft : styles.swipeContainerRight,
                  ]}
                >
                  <Text style={styles.swipeText}>{swipeText}</Text>
                </View>
              )}

              <PanGestureHandler onGestureEvent={panGesture}>
                <Animated.View style={[styles.card, animatedStyle, opacityStyle, { backgroundColor: bgColor }]}>
                  <BackgroundSVG style={StyleSheet.absoluteFillObject} />
                  <Text style={styles.cardText}>{cards[currentIndex].texte_carte}</Text>
                </Animated.View>
              </PanGestureHandler>
            </View>
          </>
        ) : (
          <Text style={styles.noMoreCards}>Plus de cartes disponibles</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: populationColor }]}>👫​ Population: {stats.population}</Text>
        <Text style={[styles.statsText, { color: financesColor }]}>💸​ Finances: {stats.finances}</Text>
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
  fullScreenContainer: {
    position: "absolute",
    width: "100%", // Prend toute la largeur de l'écran
    height: "100%", // Prend toute la hauteur de l'écran
    justifyContent: "center",
    alignItems: "center",
  },
  swipeTextContainer: {
    position: "absolute",
    top: "90%",
    transform: [{ translateY: -20 }], // Centre verticalement sans flex
    // backgroundColor: "rgba(0, 0, 0, 0.7)",
    backgroundColor: "#D2367A",
    paddingVertical: 8,
    paddingHorizontal: 12,
    // borderRadius: 8,
    maxWidth: "70%",
  },
  swipeText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  swipeContainerLeft: {
    left: -21, // Bien collé au bord gauche
  },

  swipeContainerRight: {
    right: -21, // Bien collé au bord droit
  },
  winContainer: {
    alignItems: "center",
  },
  winText: {
    fontSize: 40,
    fontWeight: 700,
    textAlign: "center",
    color: "#36206D",
  },
  winVosStats: {
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    color: "#36206D",
  },
  winStatsContainer: {
    backgroundColor: "#FFC7C7",
    padding: 3,
    margin: 5,
    borderRadius: 5,
    width: 250,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  winStats: {
    fontSize: 20,
    fontWeight: 700,
    color: "#36206D",
  },
  loseContainer: {
    alignItems: "center",
  },
  loseText: {
    fontSize: 40,
    fontWeight: 700,
    textAlign: "center",
    color: "red",
  },
  loseMessage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D2367A",
    textAlign: "center",
    marginVertical: 10,
  },
  loseVosStats: {
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    color: "#36206D",
  },
  loseStatsContainer: {
    backgroundColor: "#FFC7C7",
    padding: 3,
    margin: 5,
    borderRadius: 5,
    width: 250,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  loseStats: {
    fontSize: 20,
    fontWeight: 700,
    color: "#36206D",
  },
  homeBtn: {
    textAlign: "center",
    backgroundColor: "#D2367A",
    padding: 6,
    marginTop: 15,
    borderRadius: 8,
    color: "white",
    fontWeight: 600,
    fontSize: 18,
    width: "100%",
  },
});
