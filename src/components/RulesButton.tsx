import React, { useState } from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
import InfoIcon from "./../../assets/img/info.svg";

const RulesButton = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      {/* Bouton personnalisé dans le header */}
      <Pressable onPress={() => setModalVisible(true)} style={styles.rulesButton}>
        <Text style={styles.buttonText}>
          <InfoIcon width={80} height={80} stroke="#fff" />
        </Text>
      </Pressable>

      {/* Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>📜 Règles du Jeu</Text>
            <Text style={styles.text}>
              - Faites des choix en swipant à gauche ou à droite.{"\n"}
              {"\n"}- Chaque choix influence la population et les finances.{"\n"}
              {"\n"}- Le but est de survivre le plus longtemps possible !{"\n"}
              {"\n"}- Si vos statistiques passent en dessous de 0 ou au dessus de 100, c'est perdu !
            </Text>

            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  rulesButton: {
    paddingVertical: 10,
    backgroundColor: "#7f57de",
    borderRadius: 8,
    elevation: 3,
    width: 40,
    maxHeight: 40,
  },

  buttonText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default RulesButton;
