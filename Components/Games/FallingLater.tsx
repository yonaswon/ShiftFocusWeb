'use client'
import { useState } from "react";
import {motion} from 'framer-motion'
type Letter = {
  char: string;
  isDanger: boolean;
  id: number;
  x: number;
  speed: number;
};
type FallingLetterProps = {
  letter: Letter;
  onClick: () => void;
  onReachBottom: () => void;
  containerHeight: number;
};

const FalllingLetter: React.FC<FallingLetterProps> = ({
  letter,
  onClick,
  onReachBottom,
  containerHeight,
}) => {
  const [reachedBottom, setReachedBottom] = useState(false);

  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{
        y: reachedBottom ? containerHeight - 30 : containerHeight - 30,
      }}
      transition={{
        duration: 5 / letter.speed,
        ease: "linear",
      }}
      onAnimationComplete={() => {
        if (!reachedBottom) {
          setReachedBottom(true);
          onReachBottom();
        }
      }}
      onClick={onClick}
      className={`absolute cursor-pointer text-3xl font-bold select-none ${
        letter.isDanger ? "text-red-600" : "text-blue-600"
      }`}
      style={{
        left: `${letter.x}px`,
      }}
    >
      {letter.char}
    </motion.div>
  );
};


export default FalllingLetter