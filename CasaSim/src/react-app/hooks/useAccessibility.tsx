import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSize = 'Pequeño' | 'Mediano' | 'Grande';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('Pequeño');
  const [highContrast, setHighContrast] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('accessibility-fontSize') as FontSize;
    const savedHighContrast = localStorage.getItem('accessibility-highContrast') === 'true';
    
    if (savedFontSize && ['Pequeño', 'Mediano', 'Grande'].includes(savedFontSize)) {
      setFontSize(savedFontSize);
    }
    setHighContrast(savedHighContrast);
  }, []);

  // Apply CSS variables and classes when settings change
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size scaling
    let scale = 1;
    switch (fontSize) {
      case 'Pequeño':
        scale = 1;
        break;
      case 'Mediano':
        scale = 1.125; // +2 equivalent (roughly 18px from 16px)
        break;
      case 'Grande':
        scale = 1.25; // +4 equivalent (roughly 20px from 16px)
        break;
    }
    
    root.style.setProperty('--font-scale', scale.toString());
    
    // Apply high contrast mode
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Save to localStorage
    localStorage.setItem('accessibility-fontSize', fontSize);
    localStorage.setItem('accessibility-highContrast', highContrast.toString());
  }, [fontSize, highContrast]);

  const value = {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
