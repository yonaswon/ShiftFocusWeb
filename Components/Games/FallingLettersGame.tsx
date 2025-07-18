"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

type LetterType = "safe" | "danger";
type GameState = "idle" | "playing" | "gameOver";

interface FallingLetter {
  id: string;
  char: string;
  type: LetterType;
  x: number;
  speed: number;
  delay: number;
  reachedBottom?: boolean;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SAFE_LETTER_LIMIT = 3;
const BASE_SPEED = 1;
const BASE_SPAWN_INTERVAL = 1200;
const SCORE_PER_LETTER = 5;
const LEVEL_UP_SCORE = 80; // Changed to 50 points
const DANGER_LETTER_RATIO = 0.4;
const MIN_DANGER_LETTERS = 3;
const MAX_DANGER_LETTERS = 5;

const Game = () => {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [letters, setLetters] = useState<FallingLetter[]>([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [safeLettersRemaining, setSafeLettersRemaining] =
    useState(SAFE_LETTER_LIMIT);
  const [dangerLetters, setDangerLetters] = useState<string[]>([]);
  const [currentDangerLetters, setCurrentDangerLetters] = useState<string[]>(
    []
  );
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Generate random danger letters (3-6 based on level)
  const generateDangerLetters = useCallback(() => {
    const dangerCount = Math.min(
      MIN_DANGER_LETTERS + Math.floor(level / 2),
      MAX_DANGER_LETTERS
    );
    const availableLetters = LETTERS.split("").filter(
      (l) => !currentDangerLetters.includes(l)
    );
    const newDangerLetters: string[] = [];

    while (
      newDangerLetters.length < dangerCount &&
      availableLetters.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      newDangerLetters.push(availableLetters[randomIndex]);
      availableLetters.splice(randomIndex, 1);
    }

    return newDangerLetters;
  }, [level, currentDangerLetters]);

  // Update danger letters when level changes
  useEffect(() => {
    if (gameState === "playing") {
      const newDangerLetters = generateDangerLetters();
      setCurrentDangerLetters(newDangerLetters);
    }
  }, [level, gameState]);

  const generateRandomLetter = useCallback(
    (type: LetterType): Omit<FallingLetter, "id"> => {
      if (type === "danger") {
        const char =
          currentDangerLetters[
            Math.floor(Math.random() * currentDangerLetters.length)
          ];
        return {
          char,
          type,
          x: Math.random() * 80 + 10,
          speed: BASE_SPEED,
          delay: Math.random() * 1000,
        };
      } else {
        // Safe letters must not be danger letters
        const safeLetters = LETTERS.split("").filter(
          (l) => !currentDangerLetters.includes(l)
        );
        const char =
          safeLetters[Math.floor(Math.random() * safeLetters.length)];
        return {
          char,
          type,
          x: Math.random() * 80 + 10,
          speed: BASE_SPEED,
          delay: Math.random() * 1000,
        };
      }
    },
    [currentDangerLetters]
  );

  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setLevel(1);
    setSafeLettersRemaining(SAFE_LETTER_LIMIT);
    setLetters([]);
    setDangerLetters([]);
    // Initialize with 3 danger letters
    const initialDangerLetters = generateDangerLetters();
    setCurrentDangerLetters(initialDangerLetters);
  }, [generateDangerLetters]);

  const handleLetterClick = useCallback(
    (letter: FallingLetter) => {
      if (gameState !== "playing") return;

      if (letter.type === "danger") {
        setGameState("gameOver");
        return;
      }

      setLetters((prev) => prev.filter((l) => l.id !== letter.id));
      setScore((prev) => prev + SCORE_PER_LETTER);
    },
    [gameState]
  );

  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnInterval = BASE_SPAWN_INTERVAL / level;

    const spawnLetter = () => {
      const safeLettersCount = letters.filter(
        (l) => l.type === "safe" && !l.reachedBottom
      ).length;
      const shouldSpawnSafe = safeLettersCount < SAFE_LETTER_LIMIT;

      // Increased chance for danger letters
      const spawnDanger =
        !shouldSpawnSafe || Math.random() < DANGER_LETTER_RATIO;
      const type = spawnDanger ? "danger" : "safe";

      const newLetter = generateRandomLetter(type);

      setLetters((prev) => [
        ...prev,
        {
          ...newLetter,
          id: Math.random().toString(36).substring(2, 9),
          speed: BASE_SPEED * level * (0.8 + Math.random() * 0.4),
        },
      ]);

      if (newLetter.type === "danger") {
        setDangerLetters((prev) => [...prev, newLetter.char]);
        setTimeout(() => {
          setDangerLetters((prev) => prev.filter((c) => c !== newLetter.char));
        }, 2000);
      }
    };

    const interval = setInterval(spawnLetter, spawnInterval);
    return () => clearInterval(interval);
  }, [gameState, letters, level]);

  // useEffect(() => {
  //   if (score > 0 && score % LEVEL_UP_SCORE === 0) {
  //     setLevel(prev => prev + 1);
  //   }
  // }, [score]);
  useEffect(() => {
    if (score > 0 && score % LEVEL_UP_SCORE === 0) {
      setLevel((prev) => {
        const newLevel = prev + 1;
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000); // Hide after 2 seconds
        return newLevel;
      });
    }
  }, [score]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const pressedKey = e.key.toUpperCase();
      if (!LETTERS.includes(pressedKey)) return;

      const letterToClick = letters.find(
        (l) => l.char === pressedKey && !l.reachedBottom
      );

      if (letterToClick) {
        handleLetterClick(letterToClick);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [gameState, letters, handleLetterClick]);

  // Game over when safe letter reaches bottom
  useEffect(() => {
    if (gameState !== "playing") return;

    const reachedBottomSafeLetters = letters.filter(
      (l) => l.reachedBottom && l.type === "safe"
    );

    if (reachedBottomSafeLetters.length > 0) {
      setGameState("gameOver");
    }
  }, [letters, gameState]);

  // Update safe letters remaining count
  useEffect(() => {
    if (gameState !== "playing") return;

    const activeSafeLetters = letters.filter(
      (l) => l.type === "safe" && !l.reachedBottom
    ).length;

    setSafeLettersRemaining(SAFE_LETTER_LIMIT - activeSafeLetters);
  }, [letters, gameState]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <Head>
        <title>Falling Letters Game</title>
      </Head>

      <h1 className="text-3xl font-bold mb-4">Falling Letters</h1>

      {gameState === "idle" && (
        <div className="text-center">
          <p className="mb-6 text-lg">Click blue letters, avoid red ones!</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-colors"
          >
            Play Game
          </button>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
          <p className="mb-2">Your score: {score}</p>
          <p className="mb-6">Level reached: {level}</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-colors"
          >
            Play Again
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className="w-full max-w-3xl mb-6 flex justify-between">
            <div className="text-lg">
              Level: <span className="font-bold">{level}</span>
            </div>
            <div className="text-lg">
              Score: <span className="font-bold">{score}</span>
            </div>
            <div
              className={`text-lg ${
                safeLettersRemaining <= 1 ? "text-red-400" : ""
              }`}
            >
              Safe Letters:{" "}
              <span className="font-bold">{safeLettersRemaining}</span>
            </div>
          </div>
          {showLevelUp && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
            >
              Level Up! Now level {level}
            </motion.div>
          )}

          <div className="relative w-full max-w-3xl h-96 border-2 border-gray-700 rounded-lg overflow-hidden">
            {/* Danger letters indicator */}
            {currentDangerLetters.length > 0 && (
              <div className="absolute top-2 left-0 right-0 flex justify-center gap-2 z-10">
                {currentDangerLetters.map((char, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-2 bg-red-500 rounded-md font-bold text-xl shadow-lg"
                  >
                    {char}
                  </motion.div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {letters.map((letter) => (
                <FallingLetterComponent
                  key={letter.id}
                  letter={letter}
                  onClick={handleLetterClick}
                  onReachBottom={() => {
                    setLetters((prev) =>
                      prev.map((l) =>
                        l.id === letter.id ? { ...l, reachedBottom: true } : l
                      )
                    );
                  }}
                />
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 text-gray-400">
            <p>Click all letters or press their keys !Except selected!</p>
            <p className="text-red-400 font-bold">
              Avoid these letters: {currentDangerLetters.join(", ")}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const FallingLetterComponent = ({
  letter,
  onClick,
  onReachBottom,
}: {
  letter: FallingLetter;
  onClick: (letter: FallingLetter) => void;
  onReachBottom: () => void;
}) => {
  return (
    <motion.div
      initial={{
        y: -50,
        opacity: 0,
      }}
      animate={{
        y: "100vh",
        opacity: 1,
      }}
      exit={{ opacity: 0 }}
      transition={{
        y: {
          duration: 10 / letter.speed,
          delay: letter.delay / 1000,
          ease: "linear",
        },
        opacity: { duration: 0.5 },
      }}
      className={`absolute text-2xl font-bold cursor-pointer select-none ${
        letter.type === "safe" ? "text-blue-400" : "text-blue-400"
      }`}
      style={{
        left: `${letter.x}%`, // This actually positions it left to right
        top: 0,
      }}
      onAnimationComplete={() => {
        if (!letter.reachedBottom) {
          onReachBottom();
        }
      }}
      onClick={() => onClick(letter)}
    >
      {letter.char}
    </motion.div>
  );
};
export default Game;
