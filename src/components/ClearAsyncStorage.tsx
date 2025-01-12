import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ClearAsyncStorage = () => {
  const clearStorage = async () => {
    try {
      await AsyncStorage.clear(); // Vide complètement le stockage
      Alert.alert("Succès", "Le stockage AsyncStorage a été vidé !");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de vider le stockage !");
      console.error("Erreur lors de la suppression d'AsyncStorage :", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Vider AsyncStorage" onPress={clearStorage} color="#FF0000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
});

export default ClearAsyncStorage;
