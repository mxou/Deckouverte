import React from "react";
import { View, StyleSheet } from "react-native";
import HomeButton from "./HomeButton";
import RulesButton from "./RulesButton";
import Logo from "./../../assets/img/logo_deckouverte.svg";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Logo width={230} height={80} />
      <RulesButton />
      <HomeButton />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    elevation: 5,
  },
});

export default Header;
