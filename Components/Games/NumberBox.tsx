"use client";

type NumberBoxProps = {
  number: number | null;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};

const NumberBox = ({ number, onClick, isActive = false, isDisabled = false }: NumberBoxProps) => {
  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      className={`w-16 h-16 flex items-center justify-center text-3xl font-bold rounded-lg transition-all ${
        isActive
          ? 'bg-blue-600 text-white scale-105'
          : isDisabled
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-70'
          : number
          ? 'bg-gray-700 text-blue-300 hover:bg-gray-600 hover:scale-105 cursor-pointer'
          : 'bg-gray-900 text-gray-500 border-2 border-dashed border-gray-600'
      }`}
    >
      {number ?? ''}
    </div>
  );
};

export default NumberBox;