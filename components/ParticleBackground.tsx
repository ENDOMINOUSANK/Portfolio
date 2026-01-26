'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, useState, useEffect } from 'react';

gsap.registerPlugin(useGSAP);

// Star colors: white (70%), violet (20%), gold (10%)
const getStarColor = (index: number) => {
    const rand = index % 10;
    if (rand < 7) return 'bg-white';
    if (rand < 9) return 'bg-violet-300';
    return 'bg-amber-200';
};

const getStarGlow = (index: number) => {
    const rand = index % 10;
    if (rand < 7) return 'shadow-[0_0_4px_1px_rgba(255,255,255,0.6)]';
    if (rand < 9) return 'shadow-[0_0_6px_2px_rgba(167,139,250,0.7)]';
    return 'shadow-[0_0_6px_2px_rgba(251,191,36,0.6)]';
};

const ParticleBackground = () => {
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Only render particles on client to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useGSAP(() => {
        if (!isMounted) return;
        
        particlesRef.current.forEach((particle, index) => {
            if (!particle) return;
            
            // Random size (smaller stars more common)
            const size = Math.random() < 0.8 
                ? Math.random() * 2 + 1  // 1-3px (80% of stars)
                : Math.random() * 3 + 2; // 2-5px (20% bigger stars)
            
            // Set initial position and size
            gsap.set(particle, {
                width: size,
                height: size,
                opacity: Math.random() * 0.5 + 0.3, // Start with varying opacity
                left: Math.random() * window.innerWidth,
                top: Math.random() * window.innerHeight,
            });

            // Twinkling animation (opacity pulsing at random intervals)
            gsap.to(particle, {
                opacity: Math.random() * 0.4 + 0.1, // Fade to dimmer
                duration: Math.random() * 2 + 1,    // 1-3 seconds
                repeat: -1,                          // Infinite
                yoyo: true,                          // Pulse back
                ease: 'sine.inOut',
                delay: Math.random() * 3,           // Staggered start
            });

            // Subtle scale pulsing for some stars (makes them "breathe")
            if (index % 5 === 0) {
                gsap.to(particle, {
                    scale: 1.3,
                    duration: Math.random() * 3 + 2,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: Math.random() * 2,
                });
            }
        });
    }, [isMounted]);

    // Don't render anything on server
    if (!isMounted) {
        return <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" />;
    }

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {[...Array(150)].map((_, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        if (el) particlesRef.current[i] = el;
                    }}
                    className={`absolute rounded-full ${getStarColor(i)} ${getStarGlow(i)}`}
                />
            ))}
        </div>
    );
};

export default ParticleBackground;
