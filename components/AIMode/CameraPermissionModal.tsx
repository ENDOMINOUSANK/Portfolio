'use client';
import React from 'react';
import { useAIMode } from '@/contexts/AIModeContext';
import { Camera, X, Hand, ArrowUp, ArrowDown, MousePointerClick, LogOut } from 'lucide-react';

interface CameraPermissionModalProps {
    onGranted: () => void;
}

const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({ onGranted }) => {
    const { state, exitAIMode } = useAIMode();

    if (state !== 'requesting') return null;

    const handleEnableCamera = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            onGranted();
        } catch (error) {
            console.error('Camera access denied:', error);
            // Show a brief message then exit
            alert('Camera access denied. AI Mode requires camera permissions to track hand gestures.');
            exitAIMode();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg mx-4 bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e] rounded-2xl p-8 border border-violet-500/30 shadow-2xl">
                {/* Close button */}
                <button
                    onClick={exitAIMode}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-600/20 mb-4">
                        <Hand className="w-8 h-8 text-violet-400" />
                    </div>
                    <h2 className="text-2xl font-anton text-white mb-2">Enable AI Mode</h2>
                    <p className="text-gray-400">
                        Navigate this portfolio using hand gestures! Your camera will be used to detect hand movements.
                    </p>
                </div>

                {/* Gesture Instructions */}
                <div className="bg-black/30 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-medium text-violet-300 mb-3">Available Gestures:</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                            <ArrowUp className="w-4 h-4 text-violet-400" />
                            <span>Point Up = Scroll Up</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <ArrowDown className="w-4 h-4 text-violet-400" />
                            <span>Point Down = Scroll Down</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <Hand className="w-4 h-4 text-violet-400" />
                            <span>Open Palm = Pause</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <MousePointerClick className="w-4 h-4 text-violet-400" />
                            <span>Pinch = Click</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 col-span-2">
                            <LogOut className="w-4 h-4 text-violet-400" />
                            <span>Closed Fist = Exit AI Mode</span>
                        </div>
                    </div>
                </div>

                {/* Privacy note */}
                <p className="text-xs text-gray-500 text-center mb-6">
                    🔒 Your camera feed is processed locally and never sent to any server.
                </p>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={exitAIMode}
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEnableCamera}
                        className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium hover:from-violet-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
                    >
                        <Camera className="w-5 h-5" />
                        Enable Camera
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CameraPermissionModal;
