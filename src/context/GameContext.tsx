// src/context/GameContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

type GameStats = {
  population: number;
  finances: number;
};

type GameContextType = {
  stats: GameStats;
  updateStats: (populationChange: number, financesChange: number) => void;
  resetStats: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<GameStats>({
    population: 50, // Valeur initiale de la population
    finances: 50,   // Valeur initiale des finances
  });

  const updateStats = (populationChange: number, financesChange: number) => {
    setStats((prevStats) => ({
      population: Math.max(0, prevStats.population + populationChange),
      finances: Math.max(0, prevStats.finances + financesChange),
    }));
  };

  const resetStats = () => {
    setStats({ population: 50, finances: 50 });
  };

  return (
    <GameContext.Provider value={{ stats, updateStats, resetStats }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
