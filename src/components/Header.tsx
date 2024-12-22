import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import HomeButton from './HomeButton'; // Importation du bouton Accueil

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <Image
        source={require('./../../assets/img/logo_deckouverte.svg')}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* Bouton Retour Accueil */}
      <HomeButton />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    elevation: 5,
  },
  logo: {
    width: 230,             
    height: 80, 
    marginBottom: 5,
     resizeMode: 'contain',
  },
});

export default Header;
