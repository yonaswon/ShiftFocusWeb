const questions = [
  {
    question: "What is your main reason for quitting porn?",
    type: "single_choice",
    options: [
      "Improve mental health",
      "Improve relationships",
      "Religious or spiritual reasons",
      "Improve focus/productivity",
      "Regain self-control",
      "Other",
    ],  
  },  
  {
    question: "How often do you currently watch porn?",
    type: "single_choice",
    options: [
      "Multiple times a day",
      "Once a day",
      "A few times a week",
      "Once a week",
      "A few times a month",
      "Rarely",
    ],  
  },  
  {
    question: "What usually triggers your urge to watch porn?",
    type: "multiple_choice",
    options: [
      "Boredom",
      "Loneliness",
      "Stress or anxiety",
      "Late-night browsing",
      "Social media or ads",
      "Curiosity",
      "Other",
    ],  
  },  
  {
    question: "When do you most often get urges?",
    type: "single_choice",
    options: [
      "Morning",
      "Afternoon",
      "Evening",
      "Late night",
      "Randomly throughout the day",
    ],  
  },  
  {
    question: "Where are you most likely to relapse?",
    type: "single_choice",
    options: [
      "At home (alone)",
      "In bed",
      "In the bathroom",
      "At work/school",
      "When traveling",
      "Other",
    ],  
  },  
  {
    question: "What helps you resist the urge?",
    type: "multiple_choice",
    options: [
      "Going for a walk or working out",
      "Watching motivational videos",
      "Calling or texting a friend",
      "Cold showers",
      "Breathing or mindfulness exercises",
      "Playing a game or doing a hobby",
      "Nothing really helps",
    ],  
  },  
  {
    question: "How long do you want to quit for?",
    type: "single_choice",
    options: [
      "Just testing for a few days",
      "One week",
      "30 days",
      "90 days (reboot)",
      "Forever",
    ],  
  },  
  {
    question: "Would you like daily motivation or tips sent to you?",
    type: "single_choice",
    options: ["Yes, daily", "Yes, a few times a week", "No, thanks"],
  },  
];  


import React, { useState } from "react";
import { useRouter } from 'next/navigation'

type Answer = string | string[];



const Thired = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerChange = (option: string) => {
    if (currentQuestion.type === "multiple_choice") {
      const currentAnswers = (answers[currentQuestionIndex] as string[]) || [];
      const newAnswers = currentAnswers.includes(option)
        ? currentAnswers.filter((a) => a !== option)
        : [...currentAnswers, option];
      setAnswers({ ...answers, [currentQuestionIndex]: newAnswers });
    } else {
      setAnswers({ ...answers, [currentQuestionIndex]: option });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      localStorage.setItem("questionnaireAnswers", JSON.stringify(answers));

      router.push("/auth");
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isAnswerSelected = (option: string) => {
    const currentAnswer = answers[currentQuestionIndex];
    if (!currentAnswer) return false;
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.includes(option);
    }
    return currentAnswer === option;
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-2xl w-full max-h-[90vh] backdrop-blur-sm bg-black/30 rounded-xl shadow-2xl p-6 border border-gray-700/50 flex flex-col">
        {/* Progress indicator */}
        <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
          Self-Reflection Questionnaire
        </h1>

        <div className="mb-4 flex-grow overflow-y-auto">
          <h2 className="text-lg font-medium mb-4 text-white/90">
            {currentQuestion.question}
          </h2>
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <div
                key={option}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                  isAnswerSelected(option)
                    ? "bg-gradient-to-r from-blue-900/40 to-purple-900/40 border-blue-400/50 shadow-md"
                    : "bg-gray-800/40 border-gray-600/30 hover:bg-gray-700/50"
                }`}
                onClick={() => handleAnswerChange(option)}
              >
                <div
                  className={`flex items-center justify-center w-5 h-5 rounded-full mr-3 border-2 ${
                    isAnswerSelected(option)
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-400"
                  } ${
                    currentQuestion.type === "multiple_choice" ? "rounded" : "rounded-full"
                  }`}
                >
                  {isAnswerSelected(option) && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {currentQuestion.type === "multiple_choice" ? (
                        <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" />
                      ) : (
                        <circle cx="12" cy="12" r="8" fill="currentColor" />
                      )}
                    </svg>
                  )}
                </div>
                <label
                  htmlFor={option}
                  className={`text-sm ${
                    isAnswerSelected(option) ? "text-white font-medium" : "text-white/80"
                  }`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentQuestionIndex === 0
                ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                : "bg-gray-700/70 hover:bg-gray-600/70 text-white shadow-md"
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={
              !answers[currentQuestionIndex] ||
              (Array.isArray(answers[currentQuestionIndex]) &&
                (answers[currentQuestionIndex] as string[]).length === 0)
            }
            className={`px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transition-all ${
              !answers[currentQuestionIndex] ||
              (Array.isArray(answers[currentQuestionIndex]) &&
                (answers[currentQuestionIndex] as string[]).length === 0)
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-blue-500 hover:to-purple-500 hover:shadow-xl"
            }`}
          >
            {isLastQuestion ? "Complete Journey" : "Continue →"}
          </button>
        </div>

        <div className="mt-2 text-center text-xs text-white/50">
          Step {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
};

export default Thired;