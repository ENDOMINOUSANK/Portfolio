'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useAIMode } from '@/contexts/AIModeContext';
import AIToggleButton from './AIToggleButton';
import CameraPermissionModal from './CameraPermissionModal';
import HandGestureController, { GestureType } from './HandGestureController';
import GestureOverlay from './GestureOverlay';

// Hand cursor component
const HandCursor: React.FC<{ x: number; y: number }> = ({ x, y }) => {
    return (
        <div 
            data-ai-mode-overlay
            className="fixed pointer-events-none z-[1000] transition-transform duration-75"
            style={{ 
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)'
            }}
        >
            {/* Outer ring */}
            <div className="w-12 h-12 rounded-full border-2 border-violet-400 animate-pulse" />
            {/* Inner dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-violet-500" />
        </div>
    );
};

const AIMode: React.FC = () => {
    const { activateAIMode, state } = useAIMode();
    const [currentGesture, setCurrentGesture] = useState<GestureType>('none');
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [showCursor, setShowCursor] = useState(false);

    const handleCameraGranted = () => {
        activateAIMode();
    };

    const handleGestureDetected = (gesture: GestureType) => {
        setCurrentGesture(gesture);
    };

    const handleCursorMove = (x: number, y: number) => {
        setCursorPos({ x, y });
        if (!showCursor) setShowCursor(true);
    };

    // Hide cursor when AI mode is off
    useEffect(() => {
        if (state !== 'active') {
            setShowCursor(false);
        }
    }, [state]);

    return (
        <>
            <AIToggleButton />
            <CameraPermissionModal onGranted={handleCameraGranted} />
            {state === 'active' && (
                <>
                    <HandGestureController 
                        onGestureDetected={handleGestureDetected}
                        onCursorMove={handleCursorMove}
                    />
                    <GestureOverlay currentGesture={currentGesture} />
                    {showCursor && <HandCursor x={cursorPos.x} y={cursorPos.y} />}
                </>
            )}
        </>
    );
};

export default AIMode;
