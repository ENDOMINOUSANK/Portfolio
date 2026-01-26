'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type AIModeState = 'off' | 'requesting' | 'active';

interface AIModeContextType {
    state: AIModeState;
    setState: (state: AIModeState) => void;
    toggleAIMode: () => void;
    exitAIMode: () => void;
    requestAIMode: () => void;
    activateAIMode: () => void;
}

const AIModeContext = createContext<AIModeContextType | undefined>(undefined);

export const AIModeProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<AIModeState>('off');

    const toggleAIMode = useCallback(() => {
        setState((prev) => (prev === 'off' ? 'requesting' : 'off'));
    }, []);

    const exitAIMode = useCallback(() => {
        setState('off');
    }, []);

    const requestAIMode = useCallback(() => {
        setState('requesting');
    }, []);

    const activateAIMode = useCallback(() => {
        setState('active');
    }, []);

    return (
        <AIModeContext.Provider
            value={{
                state,
                setState,
                toggleAIMode,
                exitAIMode,
                requestAIMode,
                activateAIMode,
            }}
        >
            {children}
        </AIModeContext.Provider>
    );
};

export const useAIMode = () => {
    const context = useContext(AIModeContext);
    if (context === undefined) {
        throw new Error('useAIMode must be used within an AIModeProvider');
    }
    return context;
};
