import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Pressable, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";

import Header from "../src/components/Header";
import styles from "../assets/styles/style.js";
import LoadingDisplay from "../src/components/LoadingDisplay";
import logo from "../assets/img/logo_deckouverte.png";
import { fetchData } from "../src/api";

export default function App() {
  type Deck = {
    id_deck: number;
    titre_deck: string;
    date_fin_deck: string;
    nb_cartes: string;
    nb_cartes_atm: string;
    nb_jaime: number;
  };
  const [data, setData] = useState<Deck[] | null>(null);
  // Déclaration de l'état `data`, initialisé à `null`, qui contiendra un tableau de tricks ou `null` s'il n'y a pas de données.

  const [error, setError] = useState<Error | null>(null);
  // Déclaration de l'état `error`, initialisé à `null`, qui contiendra une erreur en cas de problème avec l'API.
  const [searchQuery, setSearchQuery] = useState("");
  // État pour la recherche

  useEffect(() => {
    fetchData("https://srochedix.alwaysdata.net/ReignApi/api/v1/decks")
      .then((result) => {
        console.log("API Response:", result);
        if (result.status === "success" && Array.isArray(result.decks)) {
          setData(result.decks);
        } else {
          setError(new Error("Les données renvoyées par l'API ne sont pas valides."));
        }
      })
      .catch((err) => {
        console.error("API Error:", err); // Affiche l'erreur complète dans la console pour le débogage
        setError(err);
      });
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>Error: {error.message}</Text>
        <Text style={{ color: "red" }}>Stack Trace: {error.stack}</Text>
      </View>
    );
  }

  if (!data) {
    // Vérification si les données ne sont pas encore disponibles (`data` est toujours `null`).

    return (
      <View style={styles.container}>
        <LoadingDisplay />
      </View>
      // Affichage d'un message de chargement pendant que la requête est en cours.
    );
  }

  const filteredDecks = data.filter((deck) => deck.titre_deck.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>
        Choisissez le deck que <Text style={{ color: "#D2367A" }}>vous voulez jouer</Text>
      </Text>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom de deck..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <View style={styles.deckContainer}>
        <ScrollView contentContainerStyle={styles.deckContainer}>
          {filteredDecks.length > 0 ? (
            filteredDecks.map((deck: Deck, index: number) => (
              <View key={deck.id_deck} style={[styles.deckCard, index % 3 === 0 ? styles.deckCardShort : styles.deckCardTall]}>
                <Text style={styles.deckTitle}>{deck.titre_deck}</Text>
                <Text>{deck.date_fin_deck}</Text>
                <Text>{deck.nb_cartes_atm}</Text>
                <Text style={styles.deckLikes}>{deck.nb_jaime}❤️</Text>
                <Link style={styles.playButton} href={`/cartes/${deck.id_deck}`}>
                  Jouer
                </Link>
              </View>
            ))
          ) : (
            <Text>Deck(s) indisponible(s)</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
