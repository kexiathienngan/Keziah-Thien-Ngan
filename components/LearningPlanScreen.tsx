import React, { useMemo } from 'react';
import { learningPlan, PlanVerse } from '../data/learningPlan';
import { useProgress } from '../contexts/ProgressContext';
import { CheckCircleIcon, BookOpenIcon, LockClosedIcon } from './icons';

interface LearningPlanScreenProps {
  onSelectVerse: (reference: string, dayIndex: number) => void;
  onBack: () => void;
}

const LearningPlanScreen: React.FC<LearningPlanScreenProps> = ({ onSelectVerse, onBack }) => {
    const { completedDays } = useProgress();

    const weeks = useMemo(() => {
        const result: PlanVerse[][] = [];
        for (let i = 0; i < learningPlan.length; i += 7) {
            result.push(learningPlan.slice(i, i + 7));
        }
        return result;
    }, []);

    const firstUncompletedDay = useMemo(() => {
        for (let i = 0; i < learningPlan.length; i++) {
            if (!completedDays.has(i + 1)) {
                return i + 1;
            }
        }
        return learningPlan.length + 1; // All completed
    }, [completedDays]);

    const completedCount = completedDays.size;
    const totalCount = learningPlan.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="p-4 md:p-8 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main text-center animate-fade-in w-full max-w-3xl">
            <h1 className="text-3xl font-bold text-primary mb-2">Lộ Trình 365 Ngày</h1>
            <p className="text-secondary mb-4">Học một câu Kinh Thánh mỗi ngày để xây dựng nền tảng đức tin vững chắc.</p>
            
            <div className="w-full bg-secondary-bg rounded-full h-4 mb-6">
                <div 
                    className="bg-primary h-4 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
            <p className="text-sm text-secondary -mt-4 mb-6">{completedCount} / {totalCount} câu đã hoàn thành</p>


            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="p-4 bg-primary/5 rounded-lg border border-main">
                        <h3 className="text-xl font-bold text-accent mb-4">Tuần {weekIndex + 1}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {week.map(verse => {
                                const isCompleted = completedDays.has(verse.day);
                                const isCurrent = verse.day === firstUncompletedDay;
                                const isLocked = verse.day > firstUncompletedDay;

                                let statusIcon = <BookOpenIcon className="w-5 h-5 text-secondary-text" />;
                                let bgColor = 'bg-secondary-bg hover:bg-secondary-hover';
                                let textColor = 'text-secondary-text';
                                if (isCompleted) {
                                    statusIcon = <CheckCircleIcon className="w-5 h-5 text-green-600" />;
                                    bgColor = 'bg-green-100';
                                    textColor = 'text-green-800';
                                } else if (isCurrent) {
                                     statusIcon = <BookOpenIcon className="w-5 h-5 text-primary" />;
                                     bgColor = 'bg-amber-200 hover:bg-amber-300 ring-2 ring-accent';
                                     textColor = 'text-amber-800';
                                } else if (isLocked) {
                                     statusIcon = <LockClosedIcon className="w-5 h-5 text-stone-400" />;
                                     bgColor = 'bg-stone-100';
                                     textColor = 'text-stone-500';
                                }

                                return (
                                    <button 
                                        key={verse.day}
                                        onClick={() => !isLocked && onSelectVerse(verse.reference, verse.day)}
                                        disabled={isLocked}
                                        className={`p-3 rounded-lg text-left transition-colors duration-200 flex flex-col justify-between h-32 ${bgColor} ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`text-sm font-bold ${textColor}`}>Ngày {verse.day}</span>
                                                {statusIcon}
                                            </div>
                                            <p className={`font-bold ${textColor}`}>{verse.reference}</p>
                                        </div>
                                        <p className={`text-xs ${textColor} opacity-80`}>{verse.topic}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
             <button
                onClick={onBack}
                className="mt-6 px-6 py-2 text-lg font-semibold text-secondary-text bg-secondary-bg rounded-lg shadow-md hover:bg-secondary-hover transition-transform transform hover:scale-105"
            >
                Quay lại
            </button>
        </div>
    );
};

export default LearningPlanScreen;