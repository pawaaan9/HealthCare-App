import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ClickContextType {
  clickCount: number;
  incrementCount: () => void;
}

const ClickContext = createContext<ClickContextType | undefined>(undefined);

export const ClickProvider = ({ children }: { children: ReactNode }) => {
  const [clickCount, setClickCount] = useState(0);

  const incrementCount = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  return (
    <ClickContext.Provider value={{ clickCount, incrementCount }}>
      {children}
    </ClickContext.Provider>
  );
};

export const useClickContext = () => {
  const context = useContext(ClickContext);
  if (!context) {
    throw new Error('useClickContext must be used within a ClickProvider');
  }
  return context;
};
