"use client";
import React, { Component, useState } from "react";
import PlayListDisplayer from "@/Components/Distract/PlayListDisplayer";
import GameHome from "@/Components/Games/GameHome";
import FallingLetter from "@/Components/Games/FallingLettersGame";

import dynamic from "next/dynamic";

const HextrisGame = dynamic(() => import("@/Components/Games/HextrisGame"), {
  ssr: false,
});

const gameComponents = [
  {id:0, name: "HEXTRIS", component: <HextrisGame /> },
  {id:1, name: "SQUANCIAL", component: <GameHome />},
  {id:2,name:"FALLING LETTER",component:<FallingLetter />}
 
];


const Page = () => {
  const [selectedGameIndex, setSelectedGameIndex] = useState<number>(0);
  const [showChoosePanel, setShowChoosePanel] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleClosePanel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowChoosePanel(false);
      setIsClosing(false);
    }, 300); // Match this with the animation duration
  };

  const handleGameSelect = (id: number) => {
    setSelectedGameIndex(id);
    handleClosePanel();
  };

  return (
    <div className="flex relative">
      <PlayListDisplayer />
      <div className="w-[50vw] h-[100vh] bg-gray-900 flex justify-center items-center flex-col">
        {gameComponents[selectedGameIndex].component}
        <div 
          onClick={() => setShowChoosePanel(true)} 
          className="text-white cursor-pointer p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          Choose Game
        </div>
      </div>
      
      {showChoosePanel && (
        <div className={`
          absolute right-0 bottom-0 bg-gray-800 w-[50vw] 
          origin-bottom 
          ${isClosing ? 'animate-shrink' : 'animate-expand'}
          overflow-hidden
        `}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Select a Game</h2>
            <div className="space-y-4">
              {gameComponents?.map((e) => (
                <div
                  key={e.id}
                  onClick={() => handleGameSelect(e.id)}
                  className="p-4 bg-gray-400 hover:bg-gray-500 rounded-lg cursor-pointer transition 
                           transform hover:scale-105 active:scale-95"
                >
                  <h2 className="text-xl font-semibold text-gray-900">{e.name}</h2>
                </div>
              ))}
            </div>
            <button
              onClick={handleClosePanel}
              className="mt-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;