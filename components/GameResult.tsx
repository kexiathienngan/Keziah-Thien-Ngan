import React from 'react';
import { ArrowPathIcon } from './icons';
import { CheckCircleIcon, LightBulbIcon } from './icons';

interface GameResultProps {
    isCorrect: boolean;
    originalVerse: string;
    reference: string;
    onTryAgain: () => void;
    onNewVerse: () => void;
}

const GameResult: React.FC<GameResultProps> = ({ isCorrect, originalVerse, reference, onTryAgain, onNewVerse }) => {
    if (isCorrect) {
        return (
            <div className="p-6 md:p-10 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main text-center animate-fade-in">
                <div className="p-6 bg-success-light border-l-4 border-success rounded-r-lg">
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-8 h-8 text-success mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-success-dark">Chính xác! Hoan hô bạn!</h3>
                            <p className="font-serif text-xl mt-2 text-primary">{originalVerse}</p>
                            <p className="text-right font-semibold text-secondary mt-2">({reference})</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <button
                        onClick={onNewVerse}
                        className="px-6 py-3 text-lg font-semibold text-secondary-text bg-secondary-bg rounded-lg shadow-md hover:bg-secondary-hover transition-transform transform hover:scale-105"
                    >
                        Học câu mới
                    </button>
                </div>
            </div>
        );
    } else {
        return (
             <div className="p-6 md:p-10 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main text-center animate-fade-in">
                <div className="p-6 bg-error-light border-l-4 border-error rounded-r-lg">
                    <div className="flex items-center">
                        <LightBulbIcon className="w-8 h-8 text-error mr-4 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-error-dark">Chưa đúng lắm, nhưng đừng nản lòng!</h3>
                            <p className="mt-1 text-primary">Hãy xem lại câu gốc và thử lại nhé!</p>
                             <p className="font-serif text-lg mt-2 text-primary/70">{originalVerse} ({reference})</p>
                        </div>
                    </div>
                </div>
                 <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onTryAgain}
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
             </div>
        );
    }
};

export default GameResult;
