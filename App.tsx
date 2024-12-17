import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from './assets/styles/style.js';
import logo from './assets/img/logo_deckouverte.png';


export default function App() {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Choisissez le deck que <Text style={{color: '#D2367A' }}>vous voulez jouer</Text></Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom de deck..."
        placeholderTextColor="#666"
      />

      <View style={styles.deckContainer}>
        <View style={styles.deckCard}>
          <Text style={styles.deckTitle}>Croisan</Text>
          <Text style={styles.deckInfo}>12 cartes</Text>
          <TouchableOpacity style={styles.deckButton}>
            <Text style={styles.deckButtonText}>Choisir</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deckCard}>
          <Text style={styles.deckTitle}>Croisantes</Text>
          <Text style={styles.deckInfo}>19 cartes</Text>
          <TouchableOpacity style={styles.deckButton}>
            <Text style={styles.deckButtonText}>Choisir</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deckCard}>
          <Text style={styles.deckTitle}>P1 écpise</Text>
          <Text style={styles.deckInfo}>25 cartes</Text>
          <TouchableOpacity style={styles.deckButton}>
            <Text style={styles.deckButtonText}>Choisir</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deckCard}>
          <Text style={styles.deckTitle}>Margerit</Text>
          <Text style={styles.deckInfo}>18 cartes</Text>
          <TouchableOpacity style={styles.deckButton}>
            <Text style={styles.deckButtonText}>Choisir</Text>
          </TouchableOpacity>
        </View>
        {/* Duplicate the deckCard component for the remaining decks */}
      </View>
    </View>
  );
}

