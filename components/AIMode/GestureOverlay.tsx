'use client';
import React from 'react';
import { useAIMode } from '@/contexts/AIModeContext';
import { ArrowUp, ArrowDown, Hand, MousePointerClick, LogOut, Pause } from 'lucide-react';

// Define locally to avoid import issues
type GestureType = 'none' | 'point_up' | 'point_down' | 'open_palm' | 'pinch' | 'peace';

interface GestureOverlayProps {
    currentGesture: GestureType;
}

const gestureInfo: Record<GestureType, { icon: React.ReactNode; label: string; color: string }> = {
    none: { icon: <Pause className="w-5 h-5" />, label: 'Waiting...', color: 'text-gray-400' },
    point_up: { icon: <ArrowUp className="w-5 h-5" />, label: 'Scrolling Up', color: 'text-green-400' },
    point_down: { icon: <ArrowDown className="w-5 h-5" />, label: 'Scrolling Down', color: 'text-green-400' },
    open_palm: { icon: <Hand className="w-5 h-5" />, label: 'Paused', color: 'text-yellow-400' },
    pinch: { icon: <MousePointerClick className="w-5 h-5" />, label: 'Click!', color: 'text-blue-400' },
    peace: { icon: <LogOut className="w-5 h-5" />, label: 'Exiting...', color: 'text-red-400' },
};

const GestureOverlay: React.FC<GestureOverlayProps> = ({ currentGesture }) => {
    const { state } = useAIMode();

    if (state !== 'active') return null;

    const current = gestureInfo[currentGesture];

    return (
        <>
            {/* Gesture instructions panel */}
            <div data-ai-mode-overlay className="fixed top-24 right-6 z-[95] bg-black/70 backdrop-blur-sm rounded-xl p-4 border border-violet-500/30 w-[320px]">
                <h3 className="text-sm font-medium text-violet-300 mb-3 flex items-center gap-2">
                    <Hand className="w-4 h-4" />
                    Gesture Controls Active
                </h3>
                
                {/* Current gesture display */}
                <div className={`flex items-center gap-3 p-3 rounded-lg bg-violet-900/30 mb-3 ${current.color}`}>
                    {current.icon}
                    <span className="font-medium">{current.label}</span>
                </div>

                {/* Gesture reference */}
                <div className="space-y-2 text-xs">
                    <div className={`flex items-center gap-2 ${currentGesture === 'point_up' ? 'text-green-400' : 'text-gray-400'}`}>
                        <ArrowUp className="w-3 h-3" />
                        <span>☝️ Point Up = Scroll Up</span>
                    </div>
                    <div className={`flex items-center gap-2 ${currentGesture === 'point_down' ? 'text-green-400' : 'text-gray-400'}`}>
                        <ArrowDown className="w-3 h-3" />
                        <span>👇 Point Down = Scroll Down</span>
                    </div>
                    <div className={`flex items-center gap-2 ${currentGesture === 'open_palm' ? 'text-yellow-400' : 'text-gray-400'}`}>
                        <Hand className="w-3 h-3" />
                        <span>✋ Open Palm = Pause</span>
                    </div>
                    <div className={`flex items-center gap-2 ${currentGesture === 'pinch' ? 'text-blue-400' : 'text-gray-400'}`}>
                        <MousePointerClick className="w-3 h-3" />
                        <span>👌 Pinch = Click</span>
                    </div>
                    <div className={`flex items-center gap-2 ${currentGesture === 'peace' ? 'text-red-400' : 'text-gray-400'}`}>
                        <LogOut className="w-3 h-3" />
                        <span>✌️ Peace Sign = Exit AI Mode</span>
                    </div>
                </div>
            </div>

            {/* Scroll direction indicator */}
            {(currentGesture === 'point_up' || currentGesture === 'point_down') && (
                <div data-ai-mode-overlay className="fixed left-1/2 -translate-x-1/2 z-[85] pointer-events-none animate-bounce"
                    style={{ top: currentGesture === 'point_up' ? '20%' : 'auto', bottom: currentGesture === 'point_down' ? '20%' : 'auto' }}
                >
                    {currentGesture === 'point_up' ? (
                        <ArrowUp className="w-12 h-12 text-green-400 drop-shadow-lg" />
                    ) : (
                        <ArrowDown className="w-12 h-12 text-green-400 drop-shadow-lg" />
                    )}
                </div>
            )}
        </>
    );
};

export default GestureOverlay;
