
import React from 'react';
import { GameProvider } from '../src/context/GameContext';
import { Slot } from 'expo-router'; // Si tu utilises Expo Router

export default function RootLayout() {
 return (
    <GameProvider>
      <Slot />
    </GameProvider>
  );
}
