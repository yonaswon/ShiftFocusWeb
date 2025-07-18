"use client";
import React, { useEffect, useState } from "react";
import api from "@/api";

const Second = ({ setOnBoardingIndex }: any) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();

  const getCategories = async () => {
    try {
      setLoading(true);
      const result = await api.get("content/category");
      if (result.data) {
        setCategories(result.data);
      }
      setLoading(false);
    } catch (error) {
      getCategories();
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onCategoryClickHandler = (l: string) => {
    if (selectedCategories.includes(l)) {
      const removed_category: string[] = selectedCategories.filter(
        (each: string) => each != l
      );
      setSelectedCategories(removed_category);
    } else {
      setSelectedCategories((prev: string[]) => [...prev, l]);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full max-h-[90vh] backdrop-blur-sm bg-black/30 rounded-xl shadow-2xl p-6 border border-gray-700/50 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
          Select What You Like The Most
        </h1>

        <div className="flex-grow overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {loading &&
              Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gray-800/40 border border-gray-600/30 animate-pulse"
                >
                  <div className="h-6 bg-gray-700/50 rounded"></div>
                </div>
              ))}

            {categories &&
              categories.map((l: any) => (
                <div
                  key={l.id}
                  onClick={() => onCategoryClickHandler(l.name)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border flex items-center justify-center ${
                    selectedCategories.includes(l.name)
                      ? "bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-400/50 shadow-lg"
                      : "bg-gray-800/40 border-gray-600/30 hover:bg-gray-700/50"
                  }`}
                >
                  <span
                    className={`text-center ${
                      selectedCategories.includes(l.name)
                        ? "text-white font-medium"
                        : "text-white/80"
                    }`}
                  >
                    {l.name}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {categories && (
          <button
            onClick={() => setOnBoardingIndex((p: any) => p + 1)}
            disabled={selectedCategories.length === 0}
            className={`mt-6 px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all ${
              selectedCategories.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-blue-500 hover:to-purple-500 hover:shadow-xl"
            }`}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
};

export default Second;