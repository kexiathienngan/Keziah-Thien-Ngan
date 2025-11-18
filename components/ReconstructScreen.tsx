import React, { useState } from 'react';
import { ChallengeData } from '../types';
import GameResult from './GameResult';

interface ReconstructScreenProps {
  challengeData: ChallengeData;
  onNewVerse: () => void;
}

const ReconstructScreen: React.FC<ReconstructScreenProps> = ({ challengeData, onNewVerse }) => {
  const { originalVerse, reference } = challengeData;
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
      return <GameResult isCorrect={isCorrect} originalVerse={originalVerse} reference={reference} userAnswer={userAnswer} onTryAgain={handleTryAgain} onNewVerse={onNewVerse} />;
  }
  
  return (
    <div className="p-6 md:p-10 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main text-center animate-fade-in">
      <h2 className="text-xl text-secondary mb-2">Hãy gõ lại câu gốc từ trí nhớ của bạn:</h2>
      <p className="text-right font-bold text-secondary text-xl mb-6">({reference})</p>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Gõ lại toàn bộ câu Kinh Thánh ở đây..."
        className="w-full h-48 p-4 font-serif text-lg text-primary bg-white border-2 border-main rounded-lg focus:ring-2 ring-accent focus:border-accent transition duration-200"
        aria-label="Nhập câu Kinh Thánh từ trí nhớ"
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

export default ReconstructScreen;