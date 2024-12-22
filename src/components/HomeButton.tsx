import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const HomeButton = () => {
  const router = useRouter();

  const navigateHome = () => {
    router.push('/'); // Navigue vers la page d'accueil
  };

  return (
    <TouchableOpacity style={styles.button} onPress={navigateHome}>
      <Text style={styles.buttonText}>🏠</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#E8407C',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeButton;
