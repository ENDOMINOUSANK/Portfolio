'use client';
import React from 'react';
import { useAIMode } from '@/contexts/AIModeContext';
import { Hand } from 'lucide-react';

const AIToggleButton = () => {
    const { state, toggleAIMode } = useAIMode();

    return (
        <button
            onClick={toggleAIMode}
            className={`
                hidden md:flex
                fixed bottom-6 right-6 z-[90]
                items-center gap-2 px-4 py-3
                rounded-full
                bg-gradient-to-r from-violet-600 to-purple-600
                text-white font-medium text-sm
                transition-all duration-300
                hover:scale-105 hover:shadow-lg
                ${state === 'active' ? 'animate-pulse-glow ring-2 ring-violet-400' : 'glow-purple-sm'}
                ${state === 'active' ? 'bg-gradient-to-r from-violet-500 to-purple-500' : ''}
            `}
            aria-label={state === 'active' ? 'Exit AI Mode' : 'Activate AI Mode'}
        >
            <Hand className={`w-5 h-5 ${state === 'active' ? 'animate-pulse' : ''}`} />
            <span>{state === 'active' ? 'Exit AI Mode' : 'AI Mode'}</span>
            {state !== 'active' && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                </span>
            )}
        </button>
    );
};

export default AIToggleButton;
