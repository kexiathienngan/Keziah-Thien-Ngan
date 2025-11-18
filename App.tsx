import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, ChallengeData, GameMode } from './types';
import { getVerseAndCreateChallenge } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import ChallengeScreen from './components/ChallengeScreen';
import LoadingSpinner from './components/LoadingSpinner';
import MemorizeScreen from './components/MemorizeScreen';
import ModeSelectionScreen from './components/ModeSelectionScreen';
import ScrambleScreen from './components/ScrambleScreen';
import MultipleChoiceScreen from './components/MultipleChoiceScreen';
import FirstLetterScreen from './components/FirstLetterScreen';
import ReconstructScreen from './components/ReconstructScreen';
import LearningPlanScreen from './components/LearningPlanScreen';
import { MusicalNoteIcon, PaintBrushIcon } from './components/icons';
import { useTheme } from './contexts/ThemeContext';
import { useProgress } from './contexts/ProgressContext';

type MusicOption = 'off' | 'relaxing' | 'baroque';

const musicTracks = {
    relaxing: 'https://cdn.pixabay.com/audio/2022/11/17/audio_872730a210.mp3',
    baroque: 'https://cdn.pixabay.com/audio/2022/05/23/audio_27481f7292.mp3',
};


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [incorrectIndices, setIncorrectIndices] = useState<number[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [lastUserInput, setLastUserInput] = useState<string>('');
  const [currentPlanDay, setCurrentPlanDay] = useState<number | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicOption, setMusicOption] = useState<MusicOption>('off');
  const [showMusicMenu, setShowMusicMenu] = useState(false);

  const { toggleTheme } = useTheme();
  const { markDayAsComplete } = useProgress();

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
        if (musicOption !== 'off') {
            const trackUrl = musicTracks[musicOption];
            if (audioElement.src !== trackUrl) {
                audioElement.src = trackUrl;
            }
            audioElement.play().catch(error => console.error("Audio playback failed:", error));
        } else {
            audioElement.pause();
        }
    }
  }, [musicOption]);


  const handleStartChallenge = useCallback(async (userInput: string, dayIndex: number | null = null) => {
    setGameState(GameState.Loading);
    setError(null);
    setIsCorrect(null);
    setIncorrectIndices([]);
    setLastUserInput(userInput);
    setCurrentPlanDay(dayIndex);
    setDifficulty(1);

    try {
      const data = await getVerseAndCreateChallenge(userInput, 1);
      setChallengeData(data);
      setUserAnswers(new Array(data.answers.length).fill(''));
      setGameState(GameState.Memorize);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đã có lỗi xảy ra.');
      setGameState(GameState.Welcome);
    }
  }, []);

  const handleShowLearningPlan = useCallback(() => {
    setGameState(GameState.LearningPlan);
  }, []);

  const handleProceedToModeSelection = useCallback(() => {
    setGameState(GameState.ModeSelection);
  }, []);

  const handleSelectMode = useCallback((mode: GameMode) => {
    const newGameState = {
        [GameMode.FillInTheBlanks]: GameState.Challenge,
        [GameMode.Scramble]: GameState.Scramble,
        [GameMode.MultipleChoice]: GameState.MultipleChoice,
        [GameMode.FirstLetter]: GameState.FirstLetter,
        [GameMode.Reconstruct]: GameState.Reconstruct,
    }[mode];
    setGameState(newGameState);
  }, []);
  
  const handleNextLevel = useCallback(async () => {
    if (!lastUserInput) return;
    const nextDifficulty = difficulty + 1;
    setGameState(GameState.Loading);
    setError(null);
    setIsCorrect(null);
    setIncorrectIndices([]);

    try {
      const data = await getVerseAndCreateChallenge(lastUserInput, nextDifficulty);
      setChallengeData(data);
      setUserAnswers(new Array(data.answers.length).fill(''));
      setDifficulty(nextDifficulty);
      setGameState(GameState.Memorize);
    } catch (e) {
        setError("Không thể tăng độ khó thêm. Vui lòng thử một câu mới!");
        setGameState(GameState.Result);
        setIsCorrect(true); // stay on result screen
    }
  }, [lastUserInput, difficulty]);


  const handleCheckAnswers = useCallback((answers: string[]) => {
    if (!challengeData) return;

    const incorrect: number[] = [];
    challengeData.answers.forEach((correctAnswer, index) => {
      const userAnswer = answers[index] || '';
      const normalizedUserAnswer = userAnswer.trim().toLowerCase().replace(/[.,;:!?]/g, '');
      const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase().replace(/[.,;:!?]/g, '');

      if (normalizedUserAnswer !== normalizedCorrectAnswer) {
        incorrect.push(index);
      }
    });

    setIncorrectIndices(incorrect);
    if (incorrect.length === 0) {
      setIsCorrect(true);
      if (currentPlanDay !== null) {
          markDayAsComplete(currentPlanDay);
      }
      setGameState(GameState.Result);
    } else {
      setIsCorrect(false);
    }
  }, [challengeData, currentPlanDay, markDayAsComplete]);

  const handleTryAgain = useCallback(() => {
    if (!challengeData) return;
    setIsCorrect(null);
    setIncorrectIndices([]);
    setUserAnswers(new Array(challengeData.answers.length).fill(''));
    setGameState(GameState.Challenge);
  }, [challengeData]);

  const handleNewVerse = useCallback(() => {
    setChallengeData(null);
    setUserAnswers([]);
    setIncorrectIndices([]);
    setIsCorrect(null);
    setError(null);
    setDifficulty(1);
    setCurrentPlanDay(null);
    setGameState(GameState.Welcome);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Loading:
        return <LoadingSpinner />;
      case GameState.LearningPlan:
        return <LearningPlanScreen onSelectVerse={handleStartChallenge} onBack={handleNewVerse} />;
      case GameState.Welcome:
        return <WelcomeScreen onStart={handleStartChallenge} onShowLearningPlan={handleShowLearningPlan} error={error} />;
    }

    if (!challengeData) {
        // Fallback if challengeData is null for game states
        return <WelcomeScreen onStart={handleStartChallenge} onShowLearningPlan={handleShowLearningPlan} error={error} />;
    }

    switch (gameState) {
      case GameState.Memorize:
        return <MemorizeScreen challengeData={challengeData} onStartChallenge={handleProceedToModeSelection} />;
      case GameState.ModeSelection:
        return <ModeSelectionScreen onSelectMode={handleSelectMode} reference={challengeData.reference} />;
      case GameState.Scramble:
        return <ScrambleScreen challengeData={challengeData} onNewVerse={handleNewVerse} />;
      case GameState.MultipleChoice:
        return <MultipleChoiceScreen challengeData={challengeData} onNewVerse={handleNewVerse} />;
       case GameState.FirstLetter:
        return <FirstLetterScreen challengeData={challengeData} onNewVerse={handleNewVerse} />;
       case GameState.Reconstruct:
        return <ReconstructScreen challengeData={challengeData} onNewVerse={handleNewVerse} />;
      case GameState.Challenge:
      case GameState.Result:
        return (
            <ChallengeScreen
              challengeData={challengeData}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
              onCheckAnswers={handleCheckAnswers}
              incorrectIndices={incorrectIndices}
              isCorrect={isCorrect}
              onTryAgain={handleTryAgain}
              onNewVerse={handleNewVerse}
              onNextLevel={handleNextLevel}
              difficulty={difficulty}
            />
          );
      default:
        return <WelcomeScreen onStart={handleStartChallenge} onShowLearningPlan={handleShowLearningPlan} error={error} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <audio ref={audioRef} loop />
        <div className="fixed top-4 right-4 z-10 flex gap-2">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-surface backdrop-blur-sm hover:bg-white/90 transition-colors shadow-md"
                aria-label="Đổi giao diện"
            >
                <PaintBrushIcon className="w-6 h-6 text-accent" />
            </button>
            <div className="relative">
                <button
                    onClick={() => setShowMusicMenu(prev => !prev)}
                    className="p-2 rounded-full bg-surface backdrop-blur-sm hover:bg-white/90 transition-colors shadow-md"
                    aria-label="Tùy chọn nhạc"
                >
                    <MusicalNoteIcon className={`w-6 h-6 ${musicOption !== 'off' ? 'text-accent' : 'text-secondary'}`} />
                </button>
                {showMusicMenu && (
                     <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-xl border border-main py-1 animate-fade-in" onMouseLeave={() => setShowMusicMenu(false)}>
                        <button onClick={() => { setMusicOption('relaxing'); setShowMusicMenu(false); }} className={`w-full text-left px-4 py-2 text-sm ${musicOption === 'relaxing' ? 'text-accent font-bold' : 'text-primary'} hover:bg-secondary-bg`}>Nhạc Thư Giãn</button>
                        <button onClick={() => { setMusicOption('baroque'); setShowMusicMenu(false); }} className={`w-full text-left px-4 py-2 text-sm ${musicOption === 'baroque' ? 'text-accent font-bold' : 'text-primary'} hover:bg-secondary-bg`}>Nhạc Baroque</button>
                        <div className="border-t border-main my-1"></div>
                        <button onClick={() => { setMusicOption('off'); setShowMusicMenu(false); }} className={`w-full text-left px-4 py-2 text-sm ${musicOption === 'off' ? 'text-accent font-bold' : 'text-primary'} hover:bg-secondary-bg`}>Tắt nhạc</button>
                    </div>
                )}
            </div>
        </div>
      <main className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;