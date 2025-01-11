import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

const LoadingDisplay = () => {
  return (
    <View style={styles.mainContainer}>
      <LottieView source={require("./../../assets/img/loading_animation.json")} autoPlay loop style={styles.animation} />
      <Text style={styles.oops}>Chargement...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  animation: {
    width: 150,
    height: 150,
  },
  oops: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#340061",
    marginTop: 20,
  },
});

export default LoadingDisplay;
