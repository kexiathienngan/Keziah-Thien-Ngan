import React, { useRef, useEffect } from 'react';
import { ChallengeData } from '../types';
import { CheckCircleIcon, LightBulbIcon, SparklesIcon, XCircleIcon } from './icons';

interface ChallengeScreenProps {
  challengeData: ChallengeData;
  userAnswers: string[];
  setUserAnswers: (answers: string[]) => void;
  onCheckAnswers: (answers: string[]) => void;
  incorrectIndices: number[];
  isCorrect: boolean | null;
  onTryAgain: () => void;
  onNewVerse: () => void;
  onNextLevel: () => void;
  difficulty: number;
}

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({
  challengeData,
  userAnswers,
  setUserAnswers,
  onCheckAnswers,
  incorrectIndices,
  isCorrect,
  onTryAgain,
  onNewVerse,
  onNextLevel,
  difficulty,
}) => {
  const { challengeTemplate, answers, originalVerse, reference } = challengeData;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, answers.length);
  }, [answers]);

  useEffect(() => {
    // Focus the first incorrect input if there are errors
    if (isCorrect === false && incorrectIndices.length > 0) {
      const firstErrorIndex = incorrectIndices[0];
      inputRefs.current[firstErrorIndex]?.focus();
      inputRefs.current[firstErrorIndex]?.select();
    }
  }, [isCorrect, incorrectIndices]);


  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === 'Enter') {
        if(isCorrect === null) {
            onCheckAnswers(userAnswers);
        }
      }
  };

  const renderVerse = () => (
    <div className="font-serif text-2xl md:text-3xl leading-relaxed text-primary flex flex-wrap items-center gap-x-2 gap-y-4">
      {challengeTemplate.map((part, index) => (
        <React.Fragment key={index}>
          <span>{part}</span>
          {index < answers.length && (
            <input
              ref={el => inputRefs.current[index] = el}
              type="text"
              value={userAnswers[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder={incorrectIndices.includes(index) ? ` ${answers[index][0]}... ` : '...'}
              className={`inline-block w-36 text-center text-2xl md:text-3xl font-serif bg-input border-b-2 rounded-sm transition-colors duration-200
                ${incorrectIndices.includes(index) ? 'border-b-error focus:border-error-focus ring-error' : 'border-b-accent focus:border-accent-focus ring-accent'}
                focus:outline-none focus:ring-2`}
              disabled={isCorrect !== null}
              autoCapitalize="none"
              autoComplete="off"
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

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
              <h3 className="text-xl font-bold text-error-dark">Chưa đúng lắm, nhưng đừng nản lòng!</h3>
              <p className="mt-1 text-primary">Tôi đã gợi ý chữ cái đầu tiên cho bạn ở những chỗ sai. Hãy thử lại nhé!</p>
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
          onClick={() => onCheckAnswers(userAnswers)}
          className="mt-8 px-8 py-3 text-xl font-bold text-primary-text bg-primary rounded-lg shadow-lg hover:bg-primary-hover transition-transform transform hover:scale-105"
        >
          Kiểm tra
        </button>
      );
    }

    if (isCorrect) {
       const canIncreaseDifficulty = difficulty < 3 && answers.length > (difficulty * 2);
       return (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          {canIncreaseDifficulty && (
             <button
                onClick={onNextLevel}
                className="flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 transition-transform transform hover:scale-105"
            >
                <SparklesIcon className="w-5 h-5"/> Thử thách khó hơn
             </button>
          )}
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
                    onClick={onTryAgain}
                    className="px-6 py-3 text-lg font-semibold text-primary-text bg-primary rounded-lg shadow-md hover:bg-primary-hover transition-transform transform hover:scale-105"
                >
                    Thử lại
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
    <div className="p-6 md:p-10 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main text-center">
      <h2 className="text-xl text-secondary mb-6">Hãy điền vào chỗ trống:</h2>
      {renderVerse()}
      <p className="text-right font-bold text-secondary mt-6 text-xl">({reference})</p>
      {renderResult()}
      <div className="mt-4">{renderActions()}</div>
    </div>
  );
};

export default ChallengeScreen;