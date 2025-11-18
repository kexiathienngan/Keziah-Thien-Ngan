import React, { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react';

interface ProgressContextType {
  completedDays: Set<number>;
  markDayAsComplete: (dayIndex: number) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'bible-tutor-progress';

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedDays, setCompletedDays] = useState<Set<number>>(() => {
    try {
      const storedProgress = localStorage.getItem(STORAGE_KEY);
      if (storedProgress) {
        const dayArray: number[] = JSON.parse(storedProgress);
        return new Set(dayArray);
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
    }
    return new Set();
  });

  useEffect(() => {
    try {
      const dayArray = Array.from(completedDays);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dayArray));
    } catch (error) {
      console.error("Failed to save progress to localStorage", error);
    }
  }, [completedDays]);

  const markDayAsComplete = useCallback((dayIndex: number) => {
    setCompletedDays(prev => {
      const newSet = new Set(prev);
      newSet.add(dayIndex);
      return newSet;
    });
  }, []);

  const value = useMemo(() => ({ completedDays, markDayAsComplete }), [completedDays, markDayAsComplete]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};