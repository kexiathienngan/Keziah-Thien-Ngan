import React, { useState } from 'react';
import { ChallengeData } from '../types';
import GameResult from './GameResult';

interface FirstLetterScreenProps {
  challengeData: ChallengeData;
  onNewVerse: () => void;
}

const FirstLetterScreen: React.FC<FirstLetterScreenProps> = ({ challengeData, onNewVerse }) => {
  const { originalVerse, reference, firstLetters } = challengeData;
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const normalizeText = (text: string) => {
    return text.trim().toLowerCase().replace(/[.,;:!?"]/g, '').replace(/\s+/g, ' ');
  };
  
  const handleCheckAnswer = () => {
    setIsCorrect(normalizeText(userAnswer) === normalizeText(originalVerse));
  };
  
  const handleTryAgain = () => {
    setIsCorrect(null);
    setUserAnswer('');
  };
  
  if (isCorrect !== null) {
      return <GameResult isCorrect={isCorrect} originalVerse={originalVerse} reference={reference} onTryAgain={handleTryAgain} onNewVerse={onNewVerse} />;
  }
  
  return (
    <div className="p-6 md:p-10 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main text-center animate-fade-in">
      <h2 className="text-xl text-secondary mb-2">Gõ lại câu gốc dựa theo các chữ cái đầu:</h2>
      <p className="text-right font-bold text-secondary text-xl mb-6">({reference})</p>

      <div className="p-4 bg-primary/5 rounded-lg border border-main text-left">
        <p className="font-mono text-lg md:text-xl text-accent tracking-wider">{firstLetters}</p>
      </div>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Gõ lại câu Kinh Thánh ở đây..."
        className="mt-6 w-full h-40 p-4 font-serif text-lg text-primary bg-white border-2 border-main rounded-lg focus:ring-2 ring-accent focus:border-accent transition duration-200"
        aria-label="Nhập câu Kinh Thánh"
      />
      
      <div className="mt-6">
        <button
          onClick={handleCheckAnswer}
          disabled={!userAnswer.trim()}
          className="px-8 py-3 text-xl font-bold text-primary-text bg-primary rounded-lg shadow-lg hover:bg-primary-hover transition-transform transform hover:scale-105 disabled:bg-secondary/50 disabled:cursor-not-allowed"
        >
          Kiểm tra
        </button>
      </div>
    </div>
  );
};

export default FirstLetterScreen;
