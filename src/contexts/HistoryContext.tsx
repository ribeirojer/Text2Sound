import React, { createContext, useContext, useState, useEffect } from 'react';

interface HistoryEntry {
  timestamp: string | number | Date;
  text: string;
  audioUrl: string;
  type: 'text' | 'audio' | 'epub';
}

interface HistoryContextType {
  history: HistoryEntry[];
  addEntry: (entry: HistoryEntry) => void;
  removeEntry: (index: number) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistoryContext must be used within a HistoryProvider');
  }
  return context;
};

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('conversionHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const addEntry = (entry: HistoryEntry) => {
    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));
  };

  const removeEntry = (index: number) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem('conversionHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('conversionHistory');
  };

  return (
    <HistoryContext.Provider value={{ history, addEntry, removeEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
