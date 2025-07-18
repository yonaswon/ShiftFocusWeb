'use client';
import React from 'react';

export default function HextrisGame() {
  return (
    <div className="w-[90%] h-[90vh] flex justify-center">
      <iframe
        src="/hextris/index.html"
        className="w-full h-[90vh] border-none"
        title="Hextris"
      />
    </div>
  );
}
