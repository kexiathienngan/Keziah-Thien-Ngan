import React, { useState, useMemo, useCallback } from 'react';
import { ChallengeData } from '../types';
import { CheckCircleIcon, LightBulbIcon } from './icons';
import GameResult from './GameResult';

interface MultipleChoiceScreenProps {
  challengeData: ChallengeData;
  onNewVerse: () => void;
}

const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

const MultipleChoiceScreen: React.FC<MultipleChoiceScreenProps> = ({ challengeData, onNewVerse }) => {
  const { originalVerse, reference, challengeTemplate, multipleChoiceOptions } = challengeData;
  
  const [currentBlankIndex, setCurrentBlankIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(new Array(multipleChoiceOptions.length).fill(null));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  
  const currentOptions = useMemo(() => {
    if (currentBlankIndex >= multipleChoiceOptions.length) return [];
    const { answer, distractors } = multipleChoiceOptions[currentBlankIndex];
    return shuffle([answer, ...distractors]);
  }, [currentBlankIndex, multipleChoiceOptions]);
  
  const handleOptionClick = (option: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentBlankIndex] = option;
    setUserAnswers(newAnswers);
    setShowHint(false);

    const isCurrentAnswerCorrect = option === multipleChoiceOptions[currentBlankIndex].answer;

    if (isCurrentAnswerCorrect) {
        if (currentBlankIndex < multipleChoiceOptions.length - 1) {
            setTimeout(() => setCurrentBlankIndex(prev => prev + 1), 300); // short delay for feedback
        } else {
            // Last question answered correctly
            checkFinalResult(newAnswers);
        }
    } else {
        setShowHint(true);
    }
  };

  const checkFinalResult = (finalAnswers: (string|null)[]) => {
     const allCorrect = finalAnswers.every((ans, i) => ans === multipleChoiceOptions[i].answer);
     setIsCorrect(allCorrect);
  };
  
  const handleTryAgain = () => {
    setIsCorrect(null);
    setCurrentBlankIndex(0);
    setUserAnswers(new Array(multipleChoiceOptions.length).fill(null));
    setShowHint(false);
  };
  
  const renderVerseWithBlanks = () => {
    return (
      <div className="font-serif text-2xl md:text-3xl leading-relaxed text-primary flex flex-wrap items-center gap-x-2 gap-y-4">
        {challengeTemplate.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < multipleChoiceOptions.length && (
              <span className={`inline-block px-4 py-1 rounded-md text-center text-2xl md:text-3xl font-serif border-b-2
                ${index < currentBlankIndex ? 'bg-success-light border-success text-success-dark' : ''}
                ${index === currentBlankIndex ? 'bg-secondary-bg border-accent animate-pulse' : ''}
                ${index > currentBlankIndex ? 'bg-input border-main' : ''}
              `}>
                {userAnswers[index] || '...'}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  if (isCorrect !== null) {
      return <GameResult isCorrect={isCorrect} originalVerse={originalVerse} reference={reference} onTryAgain={handleTryAgain} onNewVerse={onNewVerse} />;
  }

  return (
    <div className="p-6 md:p-10 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main text-center animate-fade-in">
      <h2 className="text-xl text-secondary mb-2">Hãy chọn từ đúng để điền vào chỗ trống:</h2>
      <p className="text-right font-bold text-secondary text-xl mb-6">({reference})</p>
      
      <div className="p-4 bg-primary/5 rounded-lg border border-main">
          {renderVerseWithBlanks()}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {currentOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleOptionClick(option)}
            className="p-4 text-lg font-semibold text-primary bg-white rounded-lg border-2 border-main hover:border-accent hover:bg-secondary-bg transition-all duration-200 shadow-sm"
          >
            {option}
          </button>
        ))}
      </div>
      
       {showHint && (
        <div className="mt-6 p-4 bg-error-light border-l-4 border-error rounded-r-lg text-left flex items-center">
            <LightBulbIcon className="w-6 h-6 text-error mr-3 flex-shrink-0"/>
            <p className="text-error-dark font-medium">Chưa đúng. Hãy thử lại nào!</p>
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceScreen;
