import React from "react";
import { GameProvider } from "../src/context/GameContext";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <GameProvider>
      <Slot />
    </GameProvider>
  );
}
