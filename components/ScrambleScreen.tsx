import React, { useState, useMemo } from 'react';
import { ChallengeData } from '../types';
import { CheckCircleIcon, LightBulbIcon, ArrowPathIcon } from './icons';

interface ScrambleScreenProps {
  challengeData: ChallengeData;
  onNewVerse: () => void;
}

const ScrambleScreen: React.FC<ScrambleScreenProps> = ({ challengeData, onNewVerse }) => {
  const { originalVerse, reference, orderedChunks = [] } = challengeData;
  
  const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);

  const initialShuffledChunks = useMemo(() => shuffle(orderedChunks), [orderedChunks]);
  
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [remainingChunks, setRemainingChunks] = useState<string[]>(initialShuffledChunks);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleChunkClick = (chunk: string, index: number) => {
    setUserAnswer([...userAnswer, chunk]);
    const newRemaining = [...remainingChunks];
    newRemaining.splice(index, 1);
    setRemainingChunks(newRemaining);
  };

  const handleAnswerClick = (chunk: string, index: number) => {
    setRemainingChunks([...remainingChunks, chunk]);
    const newAnswer = [...userAnswer];
    newAnswer.splice(index, 1);
    setUserAnswer(newAnswer);
  };

  const handleCheckAnswer = () => {
    if (userAnswer.join(' ') === orderedChunks.join(' ')) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleTryAgain = () => {
    setIsCorrect(null);
    setUserAnswer([]);
    setRemainingChunks(initialShuffledChunks);
  };
  
  const renderResult = () => {
    if (isCorrect === null) return null;

    if (isCorrect) {
      return (
        <div className="mt-8 p-6 bg-success-light border-l-4 border-success rounded-r-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="w-8 h-8 text-success mr-4" />
            <div>
              <h3 className="text-xl font-bold text-success-dark">Chính xác! Hoan hô bạn!</h3>
              <p className="font-serif text-xl mt-2 text-primary">{originalVerse}</p>
              <p className="text-right font-semibold text-secondary mt-2">({reference})</p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-8 p-6 bg-error-light border-l-4 border-error rounded-r-lg">
          <div className="flex items-center">
            <LightBulbIcon className="w-8 h-8 text-error mr-4" />
            <div>
              <h3 className="text-xl font-bold text-error-dark">Chưa đúng lắm.</h3>
              <p className="mt-1 text-primary">Hãy xem lại thứ tự các cụm từ và thử lại nhé!</p>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderActions = () => {
    if (isCorrect === null) {
      return (
        <button
          onClick={handleCheckAnswer}
          disabled={remainingChunks.length > 0}
          className="mt-8 px-8 py-3 text-xl font-bold text-primary-text bg-primary rounded-lg shadow-lg hover:bg-primary-hover transition-transform transform hover:scale-105 disabled:bg-secondary/50 disabled:cursor-not-allowed"
        >
          Kiểm tra
        </button>
      );
    }

    if (isCorrect) {
       return (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNewVerse}
            className="px-6 py-3 text-lg font-semibold text-secondary-text bg-secondary-bg rounded-lg shadow-md hover:bg-secondary-hover transition-transform transform hover:scale-105"
          >
            Học câu mới
          </button>
        </div>
      );
    } else {
        return (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={handleTryAgain}
                    className="flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-primary-text bg-primary rounded-lg shadow-md hover:bg-primary-hover transition-transform transform hover:scale-105"
                >
                   <ArrowPathIcon className="w-5 h-5"/> Thử lại
                </button>
                 <button
                    onClick={onNewVerse}
                    className="px-6 py-3 text-lg font-semibold text-secondary-text bg-secondary-bg rounded-lg shadow-md hover:bg-secondary-hover transition-transform transform hover:scale-105"
                >
                    Học câu mới
                </button>
            </div>
        )
    }
  };
  
  return (
    <div className="p-6 md:p-10 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main text-center animate-fade-in">
      <h2 className="text-xl text-secondary mb-2">Hãy sắp xếp lại câu sau:</h2>
      <p className="text-right font-bold text-secondary text-xl mb-6">({reference})</p>

      {/* Answer Area */}
      <div className="min-h-[100px] bg-primary/5 p-3 rounded-lg border-2 border-dashed border-main flex flex-wrap gap-2 items-center justify-center">
        {userAnswer.length === 0 && isCorrect === null && <p className="text-secondary">Nhấn vào các cụm từ bên dưới để sắp xếp...</p>}
        {userAnswer.map((chunk, index) => (
          <button key={index} onClick={() => isCorrect === null && handleAnswerClick(chunk, index)} className="p-2 text-lg font-serif bg-secondary-bg text-secondary-text rounded-md shadow-sm cursor-pointer hover:opacity-80 transition-opacity">
            {chunk}
          </button>
        ))}
      </div>

      {/* Word Bank */}
      <div className="min-h-[100px] mt-6 flex flex-wrap gap-2 items-center justify-center">
        {remainingChunks.map((chunk, index) => (
          <button key={index} onClick={() => isCorrect === null && handleChunkClick(chunk, index)} className="p-2 text-lg font-serif bg-surface shadow-md border border-main rounded-md cursor-pointer hover:bg-primary/10 transition-colors">
            {chunk}
          </button>
        ))}
      </div>
      
      {renderResult()}
      <div className="mt-4">{renderActions()}</div>
    </div>
  );
};

export default ScrambleScreen;
