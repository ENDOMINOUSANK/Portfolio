'use client';
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useAIMode } from '@/contexts/AIModeContext';
import { useLenis } from 'lenis/react';

// Gesture types for hand tracking
export type GestureType = 'none' | 'point_up' | 'point_down' | 'open_palm' | 'pinch' | 'peace';

// Cache the model at module level so it only loads once
let cachedModel: any = null;
let modelLoadingPromise: Promise<any> | null = null;

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

        // Calculate finger extension by checking if tip is far from MCP (finger is straight)
        // This works regardless of pointing direction
        const indexLength = Math.sqrt(
            Math.pow(indexTip.x - indexMcp.x, 2) + 
            Math.pow(indexTip.y - indexMcp.y, 2)
        );
        const middleLength = Math.sqrt(
            Math.pow(middleTip.x - middleMcp.x, 2) + 
            Math.pow(middleTip.y - middleMcp.y, 2)
        );
        const ringLength = Math.sqrt(
            Math.pow(ringTip.x - ringMcp.x, 2) + 
            Math.pow(ringTip.y - ringMcp.y, 2)
        );
        const pinkyLength = Math.sqrt(
            Math.pow(pinkyTip.x - pinkyMcp.x, 2) + 
            Math.pow(pinkyTip.y - pinkyMcp.y, 2)
        );

        // Finger is extended if length is greater than threshold
        const extendedThreshold = 0.12;
        const curledThreshold = 0.08;
        
        const indexExtended = indexLength > extendedThreshold;
        const middleExtended = middleLength > extendedThreshold;
        const ringExtended = ringLength > extendedThreshold;
        const pinkyExtended = pinkyLength > extendedThreshold;
        
        const indexCurled = indexLength < curledThreshold;
        const middleCurled = middleLength < curledThreshold;
        const ringCurled = ringLength < curledThreshold;
        const pinkyCurled = pinkyLength < curledThreshold;

        // Pinch detection: thumb and index tips close together
        const thumbIndexDistance = Math.sqrt(
            Math.pow(thumbTip.x - indexTip.x, 2) + 
            Math.pow(thumbTip.y - indexTip.y, 2)
        );
        const isPinching = thumbIndexDistance < 0.10; // Increased from 0.06 for easier detection

        // FIRST check pointing gestures (more specific)
        // Point: only index extended, others curled
        if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
            // Determine direction based on index finger angle
            const indexAngle = Math.atan2(indexTip.y - indexMcp.y, indexTip.x - indexMcp.x);
            const degrees = indexAngle * (180 / Math.PI);
            
            // Pointing up: angle is around -90 degrees (between -135 and -45)
            if (degrees < -45 && degrees > -135) {
                return 'point_up';
            }
            // Pointing down: angle is around 90 degrees (between 45 and 135)
            else if (degrees > 45 && degrees < 135) {
                return 'point_down';
            }
            // Otherwise horizontal pointing - treat as none
        }

        // Pinch: thumb and index close
        if (isPinching) {
            return 'pinch';
        }

        // Open palm: all fingers extended
        if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
            return 'open_palm';
        }

        // Peace sign (V): index and middle extended, ring and pinky curled
        if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
            return 'peace';
        }

        return 'none';
    }, []);

    // Handle gesture actions
    const handleGesture = useCallback((gesture: GestureType) => {
        if (gesture === lastGestureRef.current) {
            gestureCountRef.current++;
        } else {
            gestureCountRef.current = 0;
            lastGestureRef.current = gesture;
            // Reset click state when gesture changes
            if (gesture !== 'pinch') {
                hasClickedRef.current = false;
            }
        }

        if (gestureCountRef.current < 5) return;

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
                exitAIMode();
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
                    
                    // Temporarily hide all AI mode overlays to find the real element underneath
                    const aiModeElements = document.querySelectorAll('[data-ai-mode-overlay]');
                    const hiddenElements: { el: HTMLElement; display: string }[] = [];
                    
                    aiModeElements.forEach((el) => {
                        if (el instanceof HTMLElement) {
                            hiddenElements.push({ el, display: el.style.display });
                            el.style.display = 'none';
                        }
                    });
                    
                    // Also hide canvas and video refs
                    if (canvasRef.current) {
                        hiddenElements.push({ el: canvasRef.current, display: canvasRef.current.style.display });
                        canvasRef.current.style.display = 'none';
                    }
                    
                    // Now get the actual element
                    const element = document.elementFromPoint(cursorX, cursorY);
                    
                    // Restore visibility
                    hiddenElements.forEach(({ el, display }) => {
                        el.style.display = display;
                    });
                    
                    if (element && element instanceof HTMLElement) {
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

        isCleaningUpRef.current = false;
        let isInitialized = false;

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

                if (isCleaningUpRef.current) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                if (!videoRef.current) return;

                // Set up video element properly
                const video = videoRef.current;
                video.srcObject = stream;
                
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
            isCleaningUpRef.current = true;
            // Stop scrolling immediately
            isScrollingRef.current = false;
            scrollDirectionRef.current = null;
            
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }

            // Don't dispose model - keep it cached
            detectorRef.current = null;
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
                className="fixed bottom-24 right-6 z-[95] rounded-xl border-2 border-violet-500/50 shadow-lg"
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
