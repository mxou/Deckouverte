import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

type Card = {
  id_carte: number;
  texte_carte: string;
};

const { width } = Dimensions.get('window');

interface CardSliderProps {
  cards: Card[];
}

export default function CardSlider({ cards }: CardSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false); // Ajout de l'état gagné
  const translateX = useSharedValue(0);

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (direction === 'left' || direction === 'right') {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= cards.length) {
          setIsGameWon(true); // Déclenche la condition gagnée
          return prevIndex; // Empêche de dépasser le tableau
        }
        return nextIndex;
      });
    }
    translateX.value = 0;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -100) {
        runOnJS(handleSwipeComplete)('left');
      } else if (event.translationX > 100) {
        runOnJS(handleSwipeComplete)('right');
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      {isGameWon ? ( // Condition pour vérifier si la partie est gagnée
        <Text style={styles.winText}>🎉 Gagné ! 🎉</Text>
      ) : cards[currentIndex] ? (
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.cardText}>{cards[currentIndex].texte_carte}</Text>
          </Animated.View>
        </GestureDetector>
      ) : (
        <Text style={styles.noMoreCards}>Plus de cartes disponibles</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
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
});
