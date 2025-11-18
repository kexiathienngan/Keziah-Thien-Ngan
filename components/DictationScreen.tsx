import React, { useState, useCallback, useEffect } from 'react';
import { ChallengeData } from '../types';
import { EarIcon } from './icons';
import GameResult from './GameResult';

interface DictationScreenProps {
  challengeData: ChallengeData;
  onNewVerse: () => void;
}

const DictationScreen: React.FC<DictationScreenProps> = ({ challengeData, onNewVerse }) => {
  const { originalVerse, reference } = challengeData;
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    if (isSpeaking) {
        window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(originalVerse);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [originalVerse, isSpeaking]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
      return () => {
          if (window.speechSynthesis) {
              window.speechSynthesis.cancel();
          }
      };
  }, []);

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
      <h2 className="text-xl text-secondary mb-2">Lắng nghe và gõ lại câu Kinh Thánh:</h2>
      <p className="text-right font-bold text-secondary text-xl mb-6">({reference})</p>

      <button
        onClick={speak}
        disabled={isSpeaking}
        className="mb-6 flex items-center justify-center gap-2 mx-auto px-6 py-3 text-lg font-bold text-primary-text bg-primary rounded-lg shadow-lg hover:bg-primary-hover transition-transform transform hover:scale-105 disabled:bg-secondary/50"
      >
        <EarIcon className="w-6 h-6"/> {isSpeaking ? 'Đang đọc...' : 'Nghe lại'}
      </button>

      <textarea
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Gõ lại những gì bạn nghe được..."
        className="w-full h-40 p-4 font-serif text-lg text-primary bg-white border-2 border-main rounded-lg focus:ring-2 ring-accent focus:border-accent transition duration-200"
        aria-label="Nhập câu Kinh Thánh bạn nghe được"
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

export default DictationScreen;
