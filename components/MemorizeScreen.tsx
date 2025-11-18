import React from 'react';
import { ChallengeData } from '../types';
import { SparklesIcon } from './icons';

interface MemorizeScreenProps {
  challengeData: ChallengeData;
  onStartChallenge: () => void;
}

const MemorizeScreen: React.FC<MemorizeScreenProps> = ({ challengeData, onStartChallenge }) => {
  const { originalVerse, reference } = challengeData;

  return (
    <div className="text-center p-8 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main animate-fade-in">
      <h2 className="text-xl text-secondary mb-4">Hãy ghi nhớ câu gốc sau:</h2>
      <div className="p-6 bg-primary/5 rounded-lg border border-main">
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-primary">{originalVerse}</p>
          <p className="text-right font-bold text-secondary mt-4 text-xl">({reference})</p>
      </div>
      <button
        onClick={onStartChallenge}
        className="mt-8 flex items-center justify-center gap-2 mx-auto px-8 py-3 text-xl font-bold text-primary-text bg-primary rounded-lg shadow-lg hover:bg-primary-hover transition-transform transform hover:scale-105"
      >
        <SparklesIcon className="w-6 h-6" /> Tôi đã sẵn sàng!
      </button>
    </div>
  );
};

export default MemorizeScreen;