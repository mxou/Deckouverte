import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import HomeIcon from './../../assets/img/home.svg';

const HomeButton = () => {
  const router = useRouter();

  const navigateHome = () => {
    router.push('/'); // Navigue vers la page d'accueil
  };

  return (
    <TouchableOpacity style={styles.button} onPress={navigateHome}>
       <HomeIcon width={20} height={20} stroke="#fff" />
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
    justifyContent: 'center',
    elevation: 3,
  },
});

export default HomeButton;
