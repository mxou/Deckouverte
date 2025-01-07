import React from 'react'; 
import { StyleSheet, Text, View } from 'react-native';
import HomeButton from './HomeButton';

interface ErrorDisplayProps {
  error: { message: string }; // Définition du prop error avec un objet qui a un message
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <View style={styles.mainContainer}>
    <View style={styles.errorContainer}>
        <Text style={styles.oops}>Oops</Text>
        <Text>Une erreur est survenue 😢</Text>
        <Text>Erreur: {error?.message || 'Erreur inconnue'}</Text>
      <HomeButton />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  errorContainer: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    elevation: 5,
  },
  oops: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#340061',
  }
});

export default ErrorDisplay;
