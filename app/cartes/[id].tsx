import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import { fetchData } from "../../src/api";
import "react-native-reanimated";

import Header from "../../src/components/Header";
import CardSlider from "../../src/components/CardSlider";
import styles from "./../../assets/styles/carte_style.js";
import HomeButton from "../../src/components/HomeButton";
import ErrorDisplay from "../../src/components/ErrorDisplay";
import LoadingDisplay from "../../src/components/LoadingDisplay";

type Card = {
  id_carte: number;
  texte_carte: string;
  valeurs_choix1: { texte: string; population: number; finances: number };
  valeurs_choix2: { texte: string; population: number; finances: number };
};

export default function CartesScreen() {
  const { id } = useLocalSearchParams(); // Récupère l'ID du deck depuis l'URL
  console.log(id);
  const [cards, setCards] = useState<Card[]>([]);
  const [deckTitle, setDeckTitle] = useState<string>(""); // Ajout du titre
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
        console.log("Réponse API :", result);
        if (result.status === "success" && result.deck && Array.isArray(result.deck.cartes)) {
          setCards(result.deck.cartes);
          setDeckTitle(result.deck.titre_deck || "Deck Inconnu"); //Récupération du titre
        } else {
          setError(new Error("Les données renvoyées par l'API ne sont pas valides."));
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  // if (loading) return <ActivityIndicator size="large" color="#fc035e" />;
  if (loading) return <LoadingDisplay />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>{deckTitle}</Text>
      {cards.length > 0 ? <CardSlider cards={cards} /> : <Text style={styles.noCardsText}>Aucune carte disponible pour ce deck.</Text>}
    </View>
  );
}
