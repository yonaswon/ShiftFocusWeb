import { GameState } from "./gametypes";
import NumberSequence from "./NumberSequance";
import NumberBox from "./NumberBox";
import useGameLogic from "./useGameLogic";

type GameBoardProps = {
  level: number;
  sequence: number[];
  shuffled: number[];
  userSequence: (number | null)[];
  gameState: GameState;
  currentIndex: number;
  selectNumber: (num: number) => void;
  clearNumber: (index: number) => void;
  startGame: () => void;
  nextLevel: () => void;
  retryLevel: () => void;
};

const GameBoard = ({
  level,
  sequence,
  shuffled,
  userSequence,
  gameState,
  currentIndex,
  selectNumber,
  clearNumber,
  startGame,
  nextLevel,
  retryLevel,
}: GameBoardProps) => {
    const {selectedNumbers} = useGameLogic()
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-md text-white">
      <h1 className="text-2xl font-bold text-center mb-4">
        Memory Sequence Game
      </h1>
      <p className="text-center mb-6">Level: {level}</p>

      {gameState === "idle" && (
        <div className="text-center">
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === "showing" && (
        <div className="text-center">
          <p className="mb-4">Memorize the sequence:</p>
          <NumberSequence
            sequence={sequence}
            currentIndex={currentIndex}
            gameState={gameState}
          />
        </div>
      )}

      {(gameState === "guessing" ||
        gameState === "correct" ||
        gameState === "incorrect") && (
        <>
          <div className="mb-8">
            <p className="text-center mb-4">Recreate the sequence:</p>
            <div className="flex gap-4 justify-center mb-6">
              {userSequence.map((num, index) => (
                <NumberBox
                  key={index}
                  number={num}
                  onClick={() => clearNumber(index)}
                  isActive={gameState === "correct"}
                />
              ))}
            </div>
          </div>

          {gameState === "guessing" && (
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              {shuffled.map((num, index) => (
                <NumberBox
                  key={index}
                  number={num}
                  onClick={() => selectNumber(num)}
                  isDisabled={selectedNumbers.includes(num)}
                />
              ))}
            </div>
          )}

          {gameState === "correct" && (
            <div className="text-center mb-6">
              <p className="text-green-500 font-bold text-xl mb-4">
                ✅ Correct!
              </p>
              <button
                onClick={nextLevel}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
              >
                Next Level
              </button>
            </div>
          )}

          {gameState === "incorrect" && (
            <div className="text-center mb-6">
              <p className="text-red-500 font-bold text-xl mb-4">
                ❌ Try Again
              </p>
              <button
                onClick={retryLevel}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry Level
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameBoard;
