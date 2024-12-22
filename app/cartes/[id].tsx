import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { fetchData } from '../../src/api';
import CardSlider from '../../src/components/CardSlider';
import styles from './../../assets/styles/carte_style.js';

type Card = {
  id_carte: number;
  texte_carte: string;
};

export default function CartesScreen() {
  const { id } = useLocalSearchParams(); // Récupère l'ID du deck depuis l'URL
  console.log(id);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setError(new Error("ID du deck manquant."));
      setLoading(false);
      return;
    }
    
    fetchData(`https://srochedix.alwaysdata.net/ReignApi/api/v1/cartes/deck/${id}`)
      .then((result) => {
        console.log('Réponse API :', result);
        if (result.status === 'success' && result.deck && Array.isArray(result.deck.cartes)) {
          setCards(result.deck.cartes);
        } else {
          setError(new Error("Les données renvoyées par l'API ne sont pas valides."));
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#fc035e" />;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cartes du deck</Text>
      {cards.length > 0 ? (
        <CardSlider cards={cards} />
      ) : (
        <Text style={styles.noCardsText}>Aucune carte disponible pour ce deck.</Text>
      )}
    </View>
  );
}
