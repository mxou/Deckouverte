import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchData } from '../../src/api';
import styles from './../../assets/styles/carte_style.js';

type Card = {
  id_carte: number;
  contenu: string;
};

export default function CartesScreen() {
  const { id } = useLocalSearchParams(); // Récupère l'ID du deck depuis l'URL
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData(`https://srochedix.alwaysdata.net/ReignApi/api/v1/cartes/deck/${id}`)
      .then((result) => {
        if (result.status === 'success' && Array.isArray(result.cartes)) {
          setCards(result.cartes);
        } else {
          setError(new Error("Les données renvoyées par l'API ne sont pas valides."));
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cartes du deck</Text>
      {cards.length > 0 ? (
        cards.map((card) => (
          <View key={card.id_carte} style={styles.card}>
            <Text style={styles.cardText}>{card.contenu}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noCardsText}>Aucune carte disponible pour ce deck.</Text>
      )}
    </ScrollView>
  );
}


