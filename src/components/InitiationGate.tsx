import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { initiationQuestion } from '../data/initiationQuestions';
import { Skull, ArrowRight } from 'lucide-react';

export const InitiationGate = ({ onComplete }: { onComplete: (moniker: string) => void }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [moniker, setMoniker] = useState('');
  const [showMonikerInput, setShowMonikerInput] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (optionIndex === initiationQuestion.correctAnswer) {
      setShowMonikerInput(true);
    } else {
      setShowOptions(false);
    }
  };

  const handleSkip = () => {
    setShowMonikerInput(true);
  };

  const handleMonikerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (moniker.trim()) {
      onComplete(moniker);
    }
  };

  if (showMonikerInput) {
    return (
      <div className="min-h-screen bg-crimson-darkest text-crimson flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <form onSubmit={handleMonikerSubmit} className="space-y-4">
            <div className="text-center mb-8">
              <Skull className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Enter Your Name</h2>
            </div>
            <input
              type="text"
              value={moniker}
              onChange={(e) => setMoniker(e.target.value)}
              className="w-full bg-crimson-darkest border-2 border-crimson p-3 text-crimson focus:outline-none focus:border-crimson-light"
              placeholder="Enter your name..."
            />
            <button
              type="submit"
              className="w-full bg-crimson text-crimson-darkest p-3 hover:bg-crimson-light transition-colors"
            >
              Enter the Sanctum
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crimson-darkest text-crimson flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {!showOptions ? (
          <>
            <TypeAnimation
              sequence={[
                initiationQuestion.question,
                1000,
                () => setShowOptions(true),
              ]}
              wrapper="h2"
              cursor={true}
              className="text-2xl font-bold mb-8 text-center"
            />
            <button
              onClick={handleSkip}
              className="w-full mt-4 border-2 border-crimson-dark p-3 rounded-lg hover:border-crimson transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Skip to Entry
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {initiationQuestion.question}
            </h2>
            {initiationQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full bg-crimson-darkest border-2 border-crimson p-3 hover:bg-crimson hover:text-crimson-darkest transition-colors"
              >
                {option}
              </button>
            ))}
            <button
              onClick={handleSkip}
              className="w-full border-2 border-crimson-dark p-3 rounded-lg hover:border-crimson transition-colors flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Skip to Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};