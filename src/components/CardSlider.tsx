import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useGame } from '../context/GameContext';

type Card = {
  id_carte: number;
  texte_carte: string;
  valeurs_choix1: { texte: string; population: number; finances: number };
  valeurs_choix2: { texte: string; population: number; finances: number };
};

const { width } = Dimensions.get('window');

interface CardSliderProps {
  cards: Card[];
}

export default function CardSlider({ cards }: CardSliderProps) {
  const { stats, updateStats, resetStats } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [swipeText, setSwipeText] = useState('');

  const translateX = useSharedValue(0);

  // 🆕 Réinitialiser les stats au début de la partie
  useEffect(() => {
    resetStats();
    setCurrentIndex(0); // Remet le deck au début
    setIsGameWon(false); // Réinitialise l'état de victoire
    setSwipeText('');
  }, [cards]);

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      const { population, finances } = cards[currentIndex].valeurs_choix1;
      updateStats(population, finances);
    } else if (direction === 'right') {
      const { population, finances } = cards[currentIndex].valeurs_choix2;
      updateStats(population, finances);
    }

    setSwipeText('');
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= cards.length) {
        setIsGameWon(true);
        return prevIndex;
      }
      return nextIndex;
    });

    translateX.value = 0;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      if (event.translationX > 50) {
        setSwipeText(cards[currentIndex]?.valeurs_choix2?.texte || '');
      } else if (event.translationX < -50) {
        setSwipeText(cards[currentIndex]?.valeurs_choix1?.texte || '');
      } else {
        setSwipeText('');
      }
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        runOnJS(handleSwipeComplete)('left');
      } else if (event.translationX > 100) {
        runOnJS(handleSwipeComplete)('right');
      } else {
        translateX.value = withSpring(0);
        setSwipeText('');
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {isGameWon ? (
          <Text style={styles.winText}>🎉 Gagné ! 🎉</Text>
        ) : cards[currentIndex] ? (
          <>
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[styles.card, animatedStyle]}>
                <Text style={styles.cardText}>{cards[currentIndex].texte_carte}</Text>
              </Animated.View>
            </GestureDetector>

            {swipeText !== '' && (
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
        <Text style={styles.statsText}>Population: {stats.population}</Text>
        <Text style={styles.statsText}>Finances: {stats.finances}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  card: {
    width: width * 0.8,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  noMoreCards: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  winText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  swipeTextContainer: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  swipeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
