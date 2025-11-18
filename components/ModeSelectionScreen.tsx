import React from 'react';
import { GameMode } from '../types';
import { PencilSquareIcon, Bars3Icon, CheckBadgeIcon, DocumentTextIcon, PencilIcon } from './icons';

interface ModeSelectionScreenProps {
  onSelectMode: (mode: GameMode) => void;
  reference: string;
}

const modes = [
    { 
        mode: GameMode.FillInTheBlanks, 
        icon: PencilSquareIcon, 
        title: 'Điền từ', 
        description: 'Thử thách điền vào những từ còn thiếu trong câu.' 
    },
    { 
        mode: GameMode.Scramble, 
        icon: Bars3Icon, 
        title: 'Sắp xếp câu', 
        description: 'Sắp xếp lại các cụm từ bị xáo trộn để tạo thành câu đúng.' 
    },
    {
        mode: GameMode.MultipleChoice,
        icon: CheckBadgeIcon,
        title: 'Chọn từ đúng',
        description: 'Chọn đáp án đúng từ danh sách các từ gợi ý.'
    },
    {
        mode: GameMode.FirstLetter,
        icon: DocumentTextIcon,
        title: 'Gõ chữ cái đầu',
        description: 'Gõ lại câu dựa trên các chữ cái đầu được gợi ý.'
    },
    {
        mode: GameMode.Reconstruct,
        icon: PencilIcon,
        title: 'Tái tạo từ trí nhớ',
        description: 'Gõ lại toàn bộ câu gốc từ trí nhớ của bạn.'
    }
];

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onSelectMode, reference }) => {
  return (
    <div className="text-center p-8 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main animate-fade-in">
      <h2 className="text-2xl font-bold text-primary mb-2">Tuyệt vời!</h2>
      <p className="text-secondary text-lg mb-8">Bạn muốn học câu <span className="font-bold text-accent">{reference}</span> theo cách nào?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map(({mode, icon: Icon, title, description}) => (
             <button
                key={mode}
                onClick={() => onSelectMode(mode)}
                className="p-4 bg-primary/5 rounded-lg border-2 border-primary/10 hover:bg-primary/10 hover:border-accent transition-all duration-200 text-left group flex items-center gap-4"
            >
                <div className="flex-shrink-0 bg-secondary-bg p-3 rounded-full">
                    <Icon className="w-8 h-8 text-secondary-text" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-primary mb-1">{title}</h3>
                    <p className="text-sm text-secondary group-hover:text-primary">{description}</p>
                </div>
            </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelectionScreen;