// ```tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
];

const COLORS = [
  'bg-cyan-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
];

interface Position {
  x: number;
  y: number;
}

interface Piece {
  shape: number[][];
  color: string;
  position: Position;
}

const createEmptyBoard = (): (string | null)[][] =>
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));

const Tetris: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const generatePiece = useCallback((): Piece => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      color: COLORS[shapeIndex],
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    };
  }, []);

  const checkCollision = useCallback(
    (piece: Piece, board: (string | null)[][], offset: Position = { x: 0, y: 0 }): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = piece.position.x + x + offset.x;
            const newY = piece.position.y + y + offset.y;
            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && board[newY][newX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    []
  );

  const mergePieceToBoard = useCallback((piece: Piece, board: (string | null)[][]): (string | null)[][] => {
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.position.y + y;
          if (boardY >= 0) {
            newBoard[boardY][piece.position.x + x] = piece.color;
          }
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((board: (string | null)[][]): [number, (string | null)[][]] => {
    let linesCleared = 0;
    const newBoard = board.filter(row => row.some(cell => cell === null));
    linesCleared = BOARD_HEIGHT - newBoard.length;
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    return [linesCleared, newBoard];
  }, []);

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const newShape = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[row.length - 1 - index])
    );
    const newPiece = { ...piece, shape: newShape };
    if (!checkCollision(newPiece, board)) {
      return newPiece;
    }
    return piece;
  }, [board, checkCollision]);

  const movePiece = useCallback(
    (offset: Position): void => {
      if (!currentPiece || isPaused || gameOver) return;
      const newPiece = { ...currentPiece, position: { x: currentPiece.position.x + offset.x, y: currentPiece.position.y + offset.y } };
      if (!checkCollision(newPiece, board)) {
        setCurrentPiece(newPiece);
      } else if (offset.y > 0) {
        let newBoard = mergePieceToBoard(currentPiece, board);
        const [linesCleared, updatedBoard] = clearLines(newBoard);
        setBoard(updatedBoard);
        setScore(prev => prev + linesCleared * 100);
        const newPiece = generatePiece();
        if (checkCollision(newPiece, updatedBoard)) {
          setGameOver(true);
        } else {
          setCurrentPiece(newPiece);
        }
      }
    },
    [currentPiece, board, isPaused, gameOver, mergePieceToBoard, clearLines, generatePiece, checkCollision]
  );

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      setCurrentPiece(generatePiece());
    }
  }, [currentPiece, gameOver, generatePiece]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    const interval = setInterval(() => {
      movePiece({ x: 0, y: 1 });
    }, 1000);
    return () => clearInterval(interval);
  }, [movePiece, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver || isPaused) return;
      switch (e.key) {
        case 'ArrowLeft':
          movePiece({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          movePiece({ x: 1, y: 0 });
          break;
        case 'ArrowDown':
          movePiece({ x: 0, y: 1 });
          break;
        case 'ArrowUp':
          setCurrentPiece(prev => (prev ? rotatePiece(prev) : prev));
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece, rotatePiece, gameOver, isPaused]);

  const startNewGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(generatePiece());
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] && currentPiece.position.y + y >= 0) {
            displayBoard[currentPiece.position.y + y][currentPiece.position.x + x] = currentPiece.color;
          }
        }
      }
    }
    return displayBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`w-[${BLOCK_SIZE}px] h-[${BLOCK_SIZE}px] border border-gray-700 ${cell || 'bg-gray-800'}`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 text-white">
      <h1 className="text-4xl font-bold mb-4">Tetris</h1>
      <div className="mb-4">Score: {score}</div>
      <div className="relative">
        {renderBoard()}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center">
              <div className="text-2xl mb-4">Game Over</div>
              <button
                className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
                onClick={startNewGame}
              >
                New Game
              </button>
            </div>
          </div>
        )}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-2xl">Paused</div>
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <p>Controls:</p>
        <p>←/→: Move | ↑: Rotate | ↓: Drop | Space: Pause/Resume</p>
      </div>
    </div>
  );
};

export default Tetris;
