"use client";
import { useState, useEffect } from 'react';
import { GameState } from './gametypes';

const useGameLogic = () => {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [shuffled, setShuffled] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<(number | null)[]>([]);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  // Reset when starting new level
  const generateSequence = () => {
    const length = level + 2;
    const sequence = [];
    const usedNumbers = new Set<number>();
    
    while (sequence.length < length) {
      const num = Math.floor(Math.random() * 9) + 1;
      if (!usedNumbers.has(num)) {
        usedNumbers.add(num);
        sequence.push(num);
      }
    }

    setSequence(sequence);
    setUserSequence(Array(length).fill(null));
    setCurrentIndex(0);
    setSelectedNumbers([]); // Reset selected numbers
  };

  const selectNumber = (num: number) => {
    if (gameState !== 'guessing') return;
    if (selectedNumbers.includes(num)) return; // Prevent duplicate selection

    const emptyIndex = userSequence.indexOf(null);
    if (emptyIndex === -1) return;

    const newUserSequence = [...userSequence];
    newUserSequence[emptyIndex] = num;
    setUserSequence(newUserSequence);
    setSelectedNumbers([...selectedNumbers, num]); // Track selected number

    if (newUserSequence.every(n => n !== null)) {
      const isCorrect = sequence.every((num, i) => num === newUserSequence[i]);
      setGameState(isCorrect ? 'correct' : 'incorrect');
    }
  };

  const clearNumber = (index: number) => {
    if (gameState !== 'guessing') return;
    
    const numberToClear = userSequence[index];
    if (numberToClear === null) return;

    const newUserSequence = [...userSequence];
    newUserSequence[index] = null;
    setUserSequence(newUserSequence);
    setSelectedNumbers(selectedNumbers.filter(n => n !== numberToClear));
  };

  // Shuffle the sequence for user to rearrange
  const shuffleSequence = () => {
    const shuffled = [...sequence].sort(() => Math.random() - 0.5);
    setShuffled(shuffled);
  };

  // Start the game
  const startGame = () => {
    generateSequence();
    setGameState('showing');
  };

  // Start a new level
  const nextLevel = () => {
    setLevel(prev => prev + 1);
    startGame();
  };

  // Retry current level
  const retryLevel = () => {
    generateSequence();
    setGameState('showing');
  };

  // Show the sequence to memorize
 useEffect(() => {
  if (gameState !== 'showing') return;

  // Add extra 500ms delay only for the first number
  const delay = currentIndex === 0 ? 2000 : 1000;

  const timer = setTimeout(() => {
    if (currentIndex < sequence.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameState('guessing');
      shuffleSequence();
    }
  }, delay);

  return () => clearTimeout(timer);
}, [gameState, currentIndex, sequence]);
  

  return {
    level,
    sequence,
    shuffled,
    userSequence,
    gameState,
    currentIndex,
    startGame,
    nextLevel,
    retryLevel,
    selectNumber,
    clearNumber,
    selectedNumbers
  };
};

export default useGameLogic;