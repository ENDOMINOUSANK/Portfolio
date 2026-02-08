'use client';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useAIMode } from '@/contexts/AIModeContext';
import { useLenis } from 'lenis/react';

// Gesture types for hand tracking
export type GestureType = 'none' | 'point_up' | 'point_down' | 'open_palm' | 'pinch' | 'peace' | 'three_fingers';

// Cache the model at module level so it only loads once
let cachedModel: any = null;
let modelLoadingPromise: Promise<any> | null = null;

// Global stream reference for cleanup
let globalStream: MediaStream | null = null;
let globalVideoElement: HTMLVideoElement | null = null;
let isGlobalCleanupDone = false;
let cleanupTimeoutId: ReturnType<typeof setTimeout> | null = null;

// Export function to stop camera from anywhere
export const stopCamera = () => {
    if (isGlobalCleanupDone) {
        console.log('[Camera] Already cleaned up, skipping');
        return;
    }
    isGlobalCleanupDone = true;
    console.log('[Camera] === STOPPING CAMERA ===');
    
    // Clear any pending cleanup timeout
    if (cleanupTimeoutId) {
        clearTimeout(cleanupTimeoutId);
        cleanupTimeoutId = null;
    }
    
    // Function to stop all tracks on a stream
    const stopAllTracks = (stream: MediaStream | null, label: string) => {
        if (!stream) return;
        const tracks = stream.getTracks();
        console.log(`[Camera] ${label}: Found ${tracks.length} tracks`);
        tracks.forEach(track => {
            console.log(`[Camera] ${label}: Stopping ${track.label} | enabled: ${track.enabled} | state: ${track.readyState}`);
            track.enabled = false;
            track.stop();
        });
    };
    
    // Stop global stream
    stopAllTracks(globalStream, 'Global stream');
    globalStream = null;
    
    // Clear video element
    if (globalVideoElement) {
        console.log('[Camera] Clearing video element');
        globalVideoElement.pause();
        const oldSrc = globalVideoElement.srcObject;
        globalVideoElement.srcObject = null;
        
        // Stop tracks from video srcObject if it's a different stream
        if (oldSrc && oldSrc instanceof MediaStream) {
            stopAllTracks(oldSrc, 'Video srcObject');
        }
        
        globalVideoElement = null;
        console.log('[Camera] Video element cleared');
    }
    
    // Schedule a delayed aggressive cleanup to catch any lingering tracks
    cleanupTimeoutId = setTimeout(() => {
        console.log('[Camera] Running delayed cleanup check...');
        // Try to enumerate all media devices and check for active tracks
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            // This doesn't stop tracks but helps log what's happening
            navigator.mediaDevices.enumerateDevices().then(devices => {
                const videoInputs = devices.filter(d => d.kind === 'videoinput');
                console.log('[Camera] Video input devices:', videoInputs.length);
            });
        }
    }, 500);
        
    console.log('[Camera] === CLEANUP COMPLETE ===');
};

// Reset cleanup flag when starting new session
export const resetCameraCleanup = () => {
    isGlobalCleanupDone = false;
    if (cleanupTimeoutId) {
        clearTimeout(cleanupTimeoutId);
        cleanupTimeoutId = null;
    }
};

interface HandGestureControllerProps {
    onGestureDetected: (gesture: GestureType) => void;
    onCursorMove?: (x: number, y: number) => void;
}

const HandGestureController: React.FC<HandGestureControllerProps> = ({ onGestureDetected, onCursorMove }) => {
    const { state, exitAIMode } = useAIMode();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState('Starting...');
    const [error, setError] = useState<string | null>(null);
    const lastGestureRef = useRef<GestureType>('none');
    const gestureCountRef = useRef(0);
    const lenis = useLenis();
    const lenisRef = useRef(lenis);
    
    // Keep lenis ref updated
    lenisRef.current = lenis;
    
    // Refs to prevent race conditions during cleanup
    const isCleaningUpRef = useRef(false);
    const detectorRef = useRef<any>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationIdRef = useRef<number | null>(null);
    
    // Use refs for callbacks to avoid effect re-runs
    const detectGestureRef = useRef<(keypoints: { x: number; y: number }[]) => GestureType>();
    const handleGestureRef = useRef<(gesture: GestureType) => void>();
    const onCursorMoveRef = useRef(onCursorMove);
    
    // Keep cursor callback updated
    onCursorMoveRef.current = onCursorMove;
    
    // Cursor position ref
    const cursorPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    
    // Click debounce - prevent multiple clicks from one pinch
    const lastClickTimeRef = useRef(0);
    const hasClickedRef = useRef(false);
    
    // Three finger gesture debounce
    const hasTriggeredThreeFingersRef = useRef(false);
    
    // Peace gesture debounce (for exiting)
    const hasTriggeredPeaceRef = useRef(false);

    // Scroll control - use refs for stability
    const scrollSpeed = 8;
    const isScrollingRef = useRef(false);
    const scrollDirectionRef = useRef<'up' | 'down' | null>(null);

    const startScrolling = useCallback((direction: 'up' | 'down') => {
        scrollDirectionRef.current = direction;
        if (isScrollingRef.current) return;
        isScrollingRef.current = true;
        
        const scroll = () => {
            if (!isScrollingRef.current || !scrollDirectionRef.current) return;
            
            const amount = scrollDirectionRef.current === 'up' ? -scrollSpeed * 3 : scrollSpeed * 3;
            
            // Use window.scrollBy directly - more stable than lenis
            window.scrollBy({ top: amount, behavior: 'auto' });
            
            if (isScrollingRef.current) {
                requestAnimationFrame(scroll);
            }
        };
        
        requestAnimationFrame(scroll);
    }, []);

    const stopScrolling = useCallback(() => {
        isScrollingRef.current = false;
        scrollDirectionRef.current = null;
    }, []);

    // Gesture detection from keypoints
    const detectGesture = useCallback((keypoints: { x: number; y: number; name?: string }[]): GestureType => {
        if (!keypoints || keypoints.length < 21) return 'none';

        // Convert to normalized coordinates (0-1) based on canvas size
        const canvasWidth = 320;
        const canvasHeight = 240;
        
        const landmarks = keypoints.map(kp => ({
            x: kp.x / canvasWidth,
            y: kp.y / canvasHeight,
            z: 0
        }));

        const wrist = landmarks[0];
        const thumbTip = landmarks[4];
        const thumbMcp = landmarks[2];
        const indexTip = landmarks[8];
        const indexPip = landmarks[6];
        const indexMcp = landmarks[5];
        const middleTip = landmarks[12];
        const middlePip = landmarks[10];
        const middleMcp = landmarks[9];
        const ringTip = landmarks[16];
        const ringPip = landmarks[14];
        const ringMcp = landmarks[13];
        const pinkyTip = landmarks[20];
        const pinkyPip = landmarks[18];
        const pinkyMcp = landmarks[17];

        // Check if hand is upright: wrist should be below middle finger MCP
        // In screen coordinates, higher Y = lower on screen
        const isHandUpright = wrist.y > middleMcp.y + 0.08;
        
        // Check if hand is pointing down: wrist should be above fingers (inverted hand)
        const isHandPointingDown = wrist.y < middleTip.y - 0.08;

        // For UPRIGHT hand: finger extended when tip is ABOVE pip (lower Y)
        const indexExtendedUp = indexTip.y < indexPip.y - 0.03;
        const middleExtendedUp = middleTip.y < middlePip.y - 0.03;
        const ringExtendedUp = ringTip.y < ringPip.y - 0.03;
        const pinkyExtendedUp = pinkyTip.y < pinkyPip.y - 0.03;
        
        // For DOWNWARD pointing: finger extended when tip is BELOW pip (higher Y)
        const indexExtendedDown = indexTip.y > indexPip.y + 0.03;
        const middleExtendedDown = middleTip.y > middlePip.y + 0.03;
        const ringExtendedDown = ringTip.y > ringPip.y + 0.03;
        const pinkyExtendedDown = pinkyTip.y > pinkyPip.y + 0.03;

        // Pinch detection: thumb and index tips close together
        // BUT only valid if other fingers are somewhat curled (not open palm)
        const thumbIndexDistance = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) + 
            Math.pow(thumbTip.y - indexTip.y, 2)
        );
        // Pinch requires: thumb-index close AND middle/ring NOT fully extended
        const isPinching = thumbIndexDistance < 0.07 && !middleExtendedUp && !ringExtendedUp;

        let detectedGesture: GestureType = 'none';

        // POINTING DOWN: hand inverted, only index extended downward
        if (isHandPointingDown && indexExtendedDown && !middleExtendedDown && !ringExtendedDown && !pinkyExtendedDown) {
            detectedGesture = 'point_down';
        }
        // All other gestures require upright hand
        else if (isHandUpright) {
            // Point UP: only index extended, pointing up
            if (indexExtendedUp && !middleExtendedUp && !ringExtendedUp && !pinkyExtendedUp) {
                detectedGesture = 'point_up';
            }
            // Pinch: thumb and index close together (already checked middle/ring in isPinching)
            else if (isPinching) {
                detectedGesture = 'pinch';
            }
            // Open palm: all fingers extended
            else if (indexExtendedUp && middleExtendedUp && ringExtendedUp && pinkyExtendedUp) {
                detectedGesture = 'open_palm';
            }
            // Peace sign (V): ONLY index and middle extended, ring and pinky must be curled
            else if (indexExtendedUp && middleExtendedUp && !ringExtendedUp && !pinkyExtendedUp) {
                // Additional check: make sure ring and pinky tips are below their MCPs (curled)
                const ringCurled = ringTip.y > ringMcp.y;
                const pinkyCurled = pinkyTip.y > pinkyMcp.y;
                if (ringCurled && pinkyCurled) {
                    detectedGesture = 'peace';
                }
            }
            // Three fingers: index, middle, ring extended, pinky curled
            else if (indexExtendedUp && middleExtendedUp && ringExtendedUp && !pinkyExtendedUp) {
                // Additional check: pinky must be curled
                const pinkyCurled = pinkyTip.y > pinkyMcp.y;
                if (pinkyCurled) {
                    detectedGesture = 'three_fingers';
                }
            }
        }

        // Log the detected gesture for debugging
        if (detectedGesture !== 'none') {
            console.log(`[Gesture] ${detectedGesture} | upright: ${isHandUpright} | down: ${isHandPointingDown} | fingers: I:${indexExtendedUp} M:${middleExtendedUp} R:${ringExtendedUp} P:${pinkyExtendedUp} | pinch: ${isPinching}`);
        }

        return detectedGesture;
    }, []);

    // Handle gesture actions
    const handleGesture = useCallback((gesture: GestureType) => {
        if (gesture === lastGestureRef.current) {
            gestureCountRef.current++;
        } else {
            gestureCountRef.current = 0;
            lastGestureRef.current = gesture;
            // Reset action states when gesture changes
            if (gesture !== 'pinch') {
                hasClickedRef.current = false;
            }
            if (gesture !== 'three_fingers') {
                hasTriggeredThreeFingersRef.current = false;
            }
            if (gesture !== 'peace') {
                hasTriggeredPeaceRef.current = false;
            }
        }

        // Require 10 consecutive frames of the same gesture for stability
        if (gestureCountRef.current < 10) return;

        onGestureDetected(gesture);

        switch (gesture) {
            case 'point_up':
                startScrolling('up');
                break;
            case 'point_down':
                startScrolling('down');
                break;
            case 'open_palm':
            case 'none':
                stopScrolling();
                break;
            case 'peace':
                stopScrolling();
                // Only trigger once per gesture
                if (!hasTriggeredPeaceRef.current) {
                    hasTriggeredPeaceRef.current = true;
                    console.log('[Gesture] PEACE SIGN - Exiting AI Mode and stopping camera');
                    // Stop camera immediately before exiting
                    stopCamera();
                    exitAIMode();
                }
                break;
            case 'three_fingers':
                stopScrolling();
                // Only trigger once per gesture
                if (!hasTriggeredThreeFingersRef.current) {
                    hasTriggeredThreeFingersRef.current = true;
                    console.log('[Gesture] THREE FINGERS - Closing modal');
                    
                    // Trigger Escape key to close modals
                    const escEvent = new KeyboardEvent('keydown', {
                        key: 'Escape',
                        code: 'Escape',
                        keyCode: 27,
                        bubbles: true,
                        cancelable: true
                    });
                    document.dispatchEvent(escEvent);
                    
                    // Also try clicking any visible close buttons
                    const closeBtn = document.querySelector('[data-close-modal], .modal-close, [aria-label="Close"]');
                    if (closeBtn instanceof HTMLElement) {
                        console.log('Found close button, clicking it');
                        closeBtn.click();
                    }
                }
                break;
            case 'pinch':
                stopScrolling();
                // Only click once per pinch gesture (debounce)
                if (!hasClickedRef.current) {
                    hasClickedRef.current = true;
                    lastClickTimeRef.current = Date.now();
                    
                    // Click at cursor position (controlled by hand)
                    const cursorX = cursorPosRef.current.x;
                    const cursorY = cursorPosRef.current.y;
                    
                    // Use pointer-events instead of display to hide overlays temporarily
                    // This avoids breaking the video stream
                    const aiModeElements = document.querySelectorAll('[data-ai-mode-overlay]');
                    const originalPointerEvents: { el: HTMLElement; value: string }[] = [];
                    
                    aiModeElements.forEach((el) => {
                        if (el instanceof HTMLElement) {
                            originalPointerEvents.push({ el, value: el.style.pointerEvents });
                            el.style.pointerEvents = 'none';
                            el.style.visibility = 'hidden';
                        }
                    });
                    
                    // Now get the actual element underneath
                    const element = document.elementFromPoint(cursorX, cursorY);
                    
                    // Restore pointer events and visibility immediately
                    originalPointerEvents.forEach(({ el, value }) => {
                        el.style.pointerEvents = value || '';
                        el.style.visibility = '';
                    });
                    
                    if (element && element instanceof HTMLElement) {
                        console.log('[Click] Target:', element.tagName, element.className?.substring(0, 50));
                        
                        // Create a visual click effect
                        const clickEffect = document.createElement('div');
                        clickEffect.style.cssText = `
                            position: fixed;
                            left: ${cursorX}px;
                            top: ${cursorY}px;
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            background: rgba(139, 92, 246, 0.5);
                            transform: translate(-50%, -50%) scale(0);
                            animation: clickPulse 0.3s ease-out forwards;
                            pointer-events: none;
                            z-index: 9999;
                        `;
                        document.body.appendChild(clickEffect);
                        setTimeout(() => clickEffect.remove(), 300);
                        
                        // Find the closest clickable element (button, link, etc.)
                        const clickable = element.closest('a, button, [role="button"], [onclick], input, select, textarea');
                        const targetElement = (clickable as HTMLElement) || element;
                        
                        // Trigger the click with proper events
                        const mouseDownEvent = new MouseEvent('mousedown', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: cursorX,
                            clientY: cursorY,
                        });
                        const mouseUpEvent = new MouseEvent('mouseup', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: cursorX,
                            clientY: cursorY,
                        });
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: cursorX,
                            clientY: cursorY,
                        });
                        
                        targetElement.dispatchEvent(mouseDownEvent);
                        targetElement.dispatchEvent(mouseUpEvent);
                        targetElement.dispatchEvent(clickEvent);
                        
                        console.log('Clicked:', targetElement.tagName, targetElement.className);
                    }
                }
                break;
        }
    }, [onGestureDetected, startScrolling, stopScrolling, exitAIMode]);

    // Keep refs updated
    detectGestureRef.current = detectGesture;
    handleGestureRef.current = handleGesture;

    // Initialize hand tracking
    useEffect(() => {
        if (state !== 'active') {
            stopScrolling();
            return;
        }

        // Reset cleanup flag for new session
        isGlobalCleanupDone = false;
        isCleaningUpRef.current = false;
        let isInitialized = false;

        console.log('[Init] Starting AI Mode initialization...');

        const initializeHandTracking = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (isCleaningUpRef.current) return;

                // Check if model is already cached
                if (cachedModel) {
                    setLoadingStatus('Using cached model...');
                    detectorRef.current = cachedModel;
                } else {
                    // Import TensorFlow.js
                    setLoadingStatus('Loading TensorFlow.js...');
                    const tf = await import('@tensorflow/tfjs');
                    await tf.ready();
                    
                    if (isCleaningUpRef.current) return;
                    
                    setLoadingStatus('Loading hand detection model...');
                    
                    // Import handpose model (pure TensorFlow.js, no MediaPipe)
                    const handpose = await import('@tensorflow-models/handpose');
                    
                    if (isCleaningUpRef.current) return;

                    // Load the model (or wait if already loading)
                    setLoadingStatus('Creating detector (first time only)...');
                    
                    if (!modelLoadingPromise) {
                        modelLoadingPromise = handpose.load();
                    }
                    
                    const model = await modelLoadingPromise;
                    cachedModel = model;
                    detectorRef.current = model;

                    if (isCleaningUpRef.current) {
                        return;
                    }
                }

                // Get camera stream
                setLoadingStatus('Starting camera...');
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 320, height: 240, facingMode: 'user' },
                    audio: false,
                });

                streamRef.current = stream;
                globalStream = stream; // Set global reference for cleanup

                // Add track ended listener to detect stream loss
                stream.getVideoTracks().forEach(track => {
                    track.onended = () => {
                        console.log('Video track ended unexpectedly');
                        if (!isCleaningUpRef.current && state === 'active') {
                            setError('Camera stream lost. Please restart AI Mode.');
                        }
                    };
                });

                if (isCleaningUpRef.current) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                if (!videoRef.current) return;

                // Set up video element properly
                const video = videoRef.current;
                video.srcObject = stream;
                globalVideoElement = video; // Store global reference for cleanup
                
                // Wait for video to be ready before playing
                await new Promise<void>((resolve, reject) => {
                    if (isCleaningUpRef.current) {
                        reject(new Error('Cleanup during load'));
                        return;
                    }
                    
                    const onLoadedData = () => {
                        video.removeEventListener('loadeddata', onLoadedData);
                        video.removeEventListener('error', onError);
                        resolve();
                    };
                    
                    const onError = (e: Event) => {
                        video.removeEventListener('loadeddata', onLoadedData);
                        video.removeEventListener('error', onError);
                        reject(new Error('Video load error'));
                    };
                    
                    video.addEventListener('loadeddata', onLoadedData);
                    video.addEventListener('error', onError);
                    
                    // If already loaded
                    if (video.readyState >= 2) {
                        video.removeEventListener('loadeddata', onLoadedData);
                        video.removeEventListener('error', onError);
                        resolve();
                    }
                });

                if (isCleaningUpRef.current) return;

                // Now safe to play
                try {
                    await video.play();
                } catch (playError) {
                    // Ignore AbortError from cleanup
                    if (!isCleaningUpRef.current) {
                        throw playError;
                    }
                    return;
                }

                // Add pause listener to auto-resume
                video.onpause = () => {
                    if (!isCleaningUpRef.current && !video.ended) {
                        console.log('Video paused unexpectedly, attempting to resume...');
                        video.play().catch(e => console.log('Could not auto-resume:', e));
                    }
                };

                if (isCleaningUpRef.current) return;
                
                isInitialized = true;
                setIsLoading(false);
                setLoadingStatus('');

                // Start detection loop
                const detectFrame = async () => {
                    if (isCleaningUpRef.current || !videoRef.current || !canvasRef.current || !detectorRef.current) {
                        return;
                    }

                    const ctx = canvasRef.current.getContext('2d');
                    if (!ctx) return;

                    try {
                        // Check if video is ready to be drawn
                        if (videoRef.current.readyState < 2) {
                            // Video not ready, draw a placeholder
                            ctx.fillStyle = '#1a1a2e';
                            ctx.fillRect(0, 0, 320, 240);
                            ctx.fillStyle = '#8b5cf6';
                            ctx.font = '14px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Loading camera...', 160, 120);
                            console.log('[Video] Waiting for video, readyState:', videoRef.current.readyState);
                            
                            if (!isCleaningUpRef.current) {
                                animationIdRef.current = requestAnimationFrame(detectFrame);
                            }
                            return;
                        }

                        // Check if video has valid dimensions
                        if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
                            ctx.fillStyle = '#1a1a2e';
                            ctx.fillRect(0, 0, 320, 240);
                            ctx.fillStyle = '#ff6b6b';
                            ctx.font = '14px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('No video signal', 160, 120);
                            console.log('[Video] No video dimensions');
                            
                            if (!isCleaningUpRef.current) {
                                animationIdRef.current = requestAnimationFrame(detectFrame);
                            }
                            return;
                        }

                        // Draw mirrored video
                        ctx.save();
                        ctx.scale(-1, 1);
                        ctx.drawImage(videoRef.current, -320, 0, 320, 240);
                        ctx.restore();

                        // Detect hands using handpose API
                        const predictions = await detectorRef.current.estimateHands(videoRef.current);

                        if (predictions && predictions.length > 0) {
                            const hand = predictions[0];
                            // handpose returns landmarks as [x, y, z] arrays
                            const keypoints = hand.landmarks.map((lm: number[]) => ({
                                x: lm[0],
                                y: lm[1],
                            }));

                            // Get index finger tip for cursor (landmark 8)
                            const indexTip = keypoints[8];
                            if (indexTip) {
                                // Mirror the x coordinate and map to screen
                                // Camera is 320x240, map to full screen
                                const mirroredX = 320 - indexTip.x;
                                const screenX = (mirroredX / 320) * window.innerWidth;
                                const screenY = (indexTip.y / 240) * window.innerHeight;
                                
                                // Update cursor position
                                cursorPosRef.current = { x: screenX, y: screenY };
                                onCursorMoveRef.current?.(screenX, screenY);
                            }

                            // Draw keypoints (mirrored)
                            keypoints.forEach((kp: {x: number, y: number}, index: number) => {
                                const x = 320 - kp.x;
                                const y = kp.y;
                                
                                ctx.beginPath();
                                ctx.arc(x, y, index === 8 ? 6 : 4, 0, 2 * Math.PI);
                                ctx.fillStyle = index === 8 ? '#a78bfa' : '#7c3aed';
                                ctx.fill();
                            });

                            // Detect gesture
                            const gesture = detectGestureRef.current?.(keypoints) || 'none';
                            handleGestureRef.current?.(gesture);
                        } else {
                            handleGestureRef.current?.('none');
                        }
                    } catch (err) {
                        if (!isCleaningUpRef.current) {
                            console.error('Detection error:', err);
                        }
                    }

                    if (!isCleaningUpRef.current) {
                        animationIdRef.current = requestAnimationFrame(detectFrame);
                    }
                };

                detectFrame();

            } catch (err) {
                console.error('Failed to initialize hand tracking:', err);
                if (!isCleaningUpRef.current) {
                    setError(`Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`);
                    setIsLoading(false);
                }
            }
        };

        initializeHandTracking();

        return () => {
            console.log('[Cleanup] useEffect cleanup running...');
            isCleaningUpRef.current = true;
            
            // Stop scrolling immediately
            isScrollingRef.current = false;
            scrollDirectionRef.current = null;
            
            // Cancel animation frame
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
                console.log('[Cleanup] Animation frame cancelled');
            }

            // Use the global cleanup function (handles all stream cleanup)
            stopCamera();

            // Also stop local stream ref if it exists and differs from global
            if (streamRef.current && streamRef.current !== globalStream) {
                console.log('[Cleanup] Stopping local stream ref');
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                });
                streamRef.current = null;
            }

            // Clear video source
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.srcObject = null;
                console.log('[Cleanup] Video ref cleared');
            }

            // Don't dispose model - keep it cached
            detectorRef.current = null;
            console.log('[Cleanup] Cleanup complete');
        };
    }, [state]); // Only depend on state for stability

    if (state !== 'active') return null;

    return (
        <>
            <video
                ref={videoRef}
                className="hidden"
                playsInline
                muted
                width={320}
                height={240}
            />
            <canvas
                ref={canvasRef}
                data-ai-mode-overlay
                width={320}
                height={240}
                className="fixed bottom-24 right-6 z-[95] rounded-xl border-2 border-violet-500/50 shadow-lg bg-[#1a1a2e]"
            />
            {isLoading && (
                <div data-ai-mode-overlay className="fixed bottom-24 right-6 z-[96] w-[320px] h-[240px] rounded-xl bg-black/80 flex items-center justify-center">
                    <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500 mx-auto mb-2"></div>
                        <p className="text-sm">{loadingStatus}</p>
                        {!cachedModel && <p className="text-xs text-gray-400 mt-1">First load only - will be instant next time</p>}
                    </div>
                </div>
            )}
            {error && (
                <div data-ai-mode-overlay className="fixed bottom-24 right-6 z-[96] w-[320px] h-[240px] rounded-xl bg-red-900/80 flex items-center justify-center p-4">
                    <p className="text-white text-sm text-center">{error}</p>
                </div>
            )}
        </>
    );
};

export default HandGestureController;
