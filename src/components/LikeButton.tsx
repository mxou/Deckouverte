import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LikeIcon from "./../../assets/img/like_icon.svg";

interface LikeButtonProps {
  deckId: number; // Assurez-vous que le type est cohérent
}

const LikeButton: React.FC<LikeButtonProps> = ({ deckId }) => {
  const [canLike, setCanLike] = useState(false);

  const checkLikeStatus = async () => {
    try {
      const likedDecks = JSON.parse((await AsyncStorage.getItem("likedDecks")) || "[]");
      setCanLike(!likedDecks.includes(deckId)); // Si pas encore liké, autorise le like
    } catch (error) {
      console.error("Erreur lors de la vérification des likes :", error);
    }
  };

  const likeDeckApi = async () => {
    try {
      const response = await fetch(`https://srochedix.alwaysdata.net/ReignApi/api/v1/decks/like/${deckId}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Erreur lors du like sur l'API");
      }

      console.log("Deck liké avec succès via l'API");
    } catch (error) {
      console.error("Erreur lors de la requête à l'API :", error);
      alert("Impossible de liker le deck pour le moment.");
    }
  };

  const playSound = async (soundFile: any) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  const playYaySound = () => playSound(require("./../../assets/audio/winYaySound.mp3"));

  const handleLikeDeck = async () => {
    try {
      const likedDecks = JSON.parse((await AsyncStorage.getItem("likedDecks")) || "[]");

      if (!likedDecks.includes(deckId)) {
        playYaySound();
        likedDecks.push(deckId);
        await AsyncStorage.setItem("likedDecks", JSON.stringify(likedDecks));

        await likeDeckApi();

        alert("Merci d'avoir liké ce deck !");
        console.log("Deck liké : ", deckId);
        setCanLike(false);
      }
    } catch (error) {
      console.error("Erreur lors du like :", error);
    }
  };

  useEffect(() => {
    checkLikeStatus();
  }, [deckId]);

  return (
    <View style={styles.container}>
      {canLike ? <Button title="Mettre un like" onPress={handleLikeDeck} /> : <Text style={styles.likedText}>Vous avez déjà liké ce deck.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
  },
  likedText: {
    fontSize: 16,
    color: "gray",
    fontStyle: "italic",
  },
});

export default LikeButton;
