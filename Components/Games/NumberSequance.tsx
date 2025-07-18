import { GameState } from './gametypes'

type NumberSequenceProps = {
  sequence: number[];
  currentIndex: number;
  gameState: GameState;
};

const NumberSequence = ({ sequence, currentIndex, gameState }: NumberSequenceProps) => {
  if (gameState !== 'showing') return null;

  return (
    <div className="flex gap-4 justify-center mb-8">
      {sequence.map((num, index) => (
        <div
          key={index}
          className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg transition-all duration-300 ${
            index <= currentIndex
              ? 'bg-blue-600 text-white scale-110'
              : 'bg-gray-700 text-gray-400 scale-100'
          }`}
        >
          {index <= currentIndex ? num : '?'}
        </div>
      ))}
    </div>
  );
};

export default NumberSequence;