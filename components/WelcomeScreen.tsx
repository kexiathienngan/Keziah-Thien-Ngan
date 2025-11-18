import React, { useState } from 'react';
import { BookOpenIcon, CalendarDaysIcon } from './icons';

interface WelcomeScreenProps {
  onStart: (userInput: string) => void;
  onShowLearningPlan: () => void;
  error: string | null;
}

const suggestedVerses = [
    { reference: "Giăng 3:16", topic: "Tình Yêu" },
    { reference: "Rô-ma 8:28", topic: "Hy Vọng" },
    { reference: "Phi-líp 4:13", topic: "Sức Mạnh" },
    { reference: "Châm-ngôn 3:5-6", topic: "Tin Cậy" },
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onShowLearningPlan, error }) => {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onStart(userInput.trim());
    }
  };

  const handleSuggestionClick = (reference: string) => {
    onStart(reference);
  }

  const handleRandomClick = () => {
    const randomVerse = suggestedVerses[Math.floor(Math.random() * suggestedVerses.length)];
    onStart(randomVerse.reference);
  }

  return (
    <div className="text-center p-8 bg-surface backdrop-blur-sm rounded-2xl shadow-lg border border-main animate-fade-in">
      <div className="flex justify-center items-center mb-4">
        <BookOpenIcon className="w-12 h-12 text-accent" />
      </div>
      <h1 className="text-3xl font-bold text-primary mb-2">Gia Sư Kinh Thánh</h1>
      <p className="text-secondary mb-6">Chào bạn! Tôi rất vui được đồng hành cùng bạn trên hành trình học thuộc Lời Chúa. Bạn muốn bắt đầu với câu gốc nào (ví dụ: Giăng 3:16) hay chủ đề nào hôm nay?</p>
      
      <button 
        onClick={onShowLearningPlan}
        className="w-full mb-6 px-6 py-4 text-lg font-semibold text-primary-text bg-primary rounded-lg shadow-md hover:bg-primary-hover transition-transform transform hover:scale-105 flex items-center justify-center gap-3"
      >
        <CalendarDaysIcon className="w-6 h-6"/> Lộ trình học 365 ngày
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-main" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-2 text-sm text-secondary">HOẶC</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Nhập địa chỉ hoặc chủ đề..."
          className="flex-grow w-full px-4 py-3 text-lg text-primary bg-white border-2 border-main rounded-lg focus:ring-2 ring-accent focus:border-accent transition duration-200"
          aria-label="Kinh Thánh tham khảo hoặc chủ đề"
        />
        <button
          type="submit"
          disabled={!userInput.trim()}
          className="px-6 py-3 text-lg font-semibold text-primary-text bg-primary rounded-lg shadow-md hover:bg-primary-hover disabled:bg-stone-300 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          Bắt đầu
        </button>
      </form>
      {error && <p className="mt-4 text-error font-medium">{error}</p>}

      <div className="mt-8">
        <p className="text-secondary mb-4">Hoặc thử một trong những câu này:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {suggestedVerses.map(verse => (
            <button key={verse.reference} onClick={() => handleSuggestionClick(verse.reference)} className="px-4 py-2 font-semibold text-secondary-text bg-secondary-bg rounded-full hover:bg-secondary-hover transition-colors">
              {verse.reference}
            </button>
          ))}
          <button onClick={handleRandomClick} className="px-4 py-2 font-semibold text-secondary-text bg-secondary-bg rounded-full hover:bg-secondary-hover transition-colors">
            Ngẫu nhiên
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;