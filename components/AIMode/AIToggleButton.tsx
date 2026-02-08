'use client';
import React from 'react';
import { useAIMode } from '@/contexts/AIModeContext';
import { Sparkles, X } from 'lucide-react';

const AIToggleButton = () => {
    const { state, toggleAIMode } = useAIMode();

    return (
        <button
            onClick={toggleAIMode}
            className={`
                hidden md:flex
                fixed bottom-6 right-6 z-[90]
                items-center gap-3
                rounded-2xl
                text-white font-bold
                transition-all duration-300
                hover:scale-105
                shadow-2xl
                ${state === 'active' 
                    ? 'px-5 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700' 
                    : 'px-6 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-500 hover:via-purple-500 hover:to-fuchsia-500'
                }
            `}
            style={{
                boxShadow: state === 'active' 
                    ? '0 0 30px rgba(239, 68, 68, 0.5), 0 0 60px rgba(239, 68, 68, 0.3)' 
                    : '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3), 0 0 90px rgba(139, 92, 246, 0.2)'
            }}
            aria-label={state === 'active' ? 'Exit AI Mode' : 'Activate AI Mode'}
        >
            {state === 'active' ? (
                <>
                    <X className="w-5 h-5" />
                    <span className="text-sm">Exit AI</span>
                </>
            ) : (
                <>
                    <div className="relative">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        <div className="absolute inset-0 animate-ping">
                            <Sparkles className="w-6 h-6 opacity-50" />
                        </div>
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-base tracking-wide">Try Me!</span>
                        <span className="text-[10px] font-normal opacity-80">AI Hand Control</span>
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-fuchsia-500"></span>
                    </span>
                </>
            )}
        </button>
    );
};

export default AIToggleButton;
