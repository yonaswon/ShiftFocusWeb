"use client";
import GameBoard from './GameBoard';
import useGameLogic from './useGameLogic';

export default function GameHome() {
  const gameLogic = useGameLogic();

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <GameBoard {...gameLogic} />
    </main>
  );
}