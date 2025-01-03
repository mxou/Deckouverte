import React, { useEffect, useState } from 'react'; 
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image,  Pressable, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';

import Header from '../src/components/Header';
import styles from '../assets/styles/style.js';
import logo from '../assets/img/logo_deckouverte.png';
import { fetchData } from '../src/api'; 


export default function App() {


   type Deck = { 
    id_deck: number; 
    titre_deck: string; 
    date_fin_deck: string; 
    nb_cartes: string; 
    nb_jaime: number;
  }; 
    const [data, setData] = useState<Deck[] | null>(null); 
  // Déclaration de l'état `data`, initialisé à `null`, qui contiendra un tableau de tricks ou `null` s'il n'y a pas de données.

  const [error, setError] = useState<Error | null>(null); 
  // Déclaration de l'état `error`, initialisé à `null`, qui contiendra une erreur en cas de problème avec l'API.

useEffect(() => { 
  fetchData('https://srochedix.alwaysdata.net/ReignApi/api/v1/decks/playable')
    .then((result) => { 
      console.log('API Response:', result);
      if (result.status === 'success' && Array.isArray(result.decks)) {
        setData(result.decks); 
      } else {
        setError(new Error("Les données renvoyées par l'API ne sont pas valides."));
      }
    })
    .catch((err) => {
      console.error('API Error:', err);  // Affiche l'erreur complète dans la console pour le débogage
      setError(err);
    });
}, []);


if (error) { 
  return ( 
    <View style={styles.container}> 
      <Text style={{ color: 'red' }}>Error: {error.message}</Text>
      <Text style={{ color: 'red' }}>Stack Trace: {error.stack}</Text>
    </View>
  );
}

  if (!data) { 
    // Vérification si les données ne sont pas encore disponibles (`data` est toujours `null`).

    return ( 
      <View style={styles.container}> 
        <Text>Loading...</Text> 
      </View>
        // Affichage d'un message de chargement pendant que la requête est en cours.
    ); 
  }



  return (
    <View style={styles.container}>
      {/* <Image source={logo} style={styles.logo} /> */}
      <Header/>
      <Text style={styles.title}>Choisissez le deck que <Text style={{color: '#D2367A' }}>vous voulez jouer</Text></Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom de deck..."
        placeholderTextColor="#666"
      />

      <View style={styles.deckContainer}>
       
      <ScrollView contentContainerStyle={styles.deckContainer}>
      {/* Utilisation d'un conteneur défilable pour afficher les données */}

      {Array.isArray(data) ? ( 
        // Vérification que `data` est bien un tableau.

        data.map((deck: Deck) => ( 
          // Boucle sur chaque élément du tableau pour générer une vue correspondante.

          <View key={deck.id_deck} style={styles.deckCard}> 
            {/* Vue représentant une carte pour chaque deck */}

            <Text style={styles.deckTitle}>{deck.titre_deck}</Text> 
            {/* Affichage du nom du deck */}

            <Text>{deck.date_fin_deck}</Text> 
            {/* Affichage de la description du deck */}

            <Text>{deck.nb_cartes}</Text> 
            {/* Affichage du nombres de cartes du deck */}

             <Text style={styles.deckLikes}>{deck.nb_jaime}❤️</Text> 
            {/* Affichage du nombres de likes du deck */}
            <Link style={styles.playButton} href={`/cartes/${deck.id_deck}`}>Jouer</Link>

          </View>
        ))
      ) : ( 
        <Text>Les données ne sont pas disponibles.</Text> 
        // Message d'erreur alternatif si les données ne sont pas un tableau.
      )}
    </ScrollView>
      </View>
    </View>
  );
}