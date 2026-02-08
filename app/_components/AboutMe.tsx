'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-in',
                    trigger: container.current,
                    start: 'top 70%',
                    end: 'bottom bottom',
                    scrub: 0.5,
                },
            });

            tl.from('.slide-up-and-fade', {
                y: 150,
                opacity: 0,
                stagger: 0.05,
            });
        },
        { scope: container },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-out',
                    trigger: container.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 0.5,
                },
            });

            tl.to('.slide-up-and-fade', {
                y: -150,
                opacity: 0,
                stagger: 0.02,
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-section" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-4xl md:text-6xl font-thin mb-20 slide-up-and-fade">
                    I believe in building AI systems that are not just intelligent, but reliable, scalable, and ready for real-world production environments (i.e., they don't crash when more than 3 people use them).
                </h2>

                <p className="pb-3 border-b text-muted-foreground slide-up-and-fade">
                    This is me(on a normal day).
                </p>

                <div className="grid md:grid-cols-12 mt-9 gap-8">
                    {/* Profile Picture */}
                    <div className="md:col-span-4 slide-up-and-fade">
                        <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border-2 border-violet-500/30 glow-purple-sm bg-gradient-to-br from-violet-600/30 to-purple-900/50">
                            {/* Add your photo at /public/profile.jpeg */}
                            <Image
                                src="/profile.jpeg"
                                alt="Ankit Sneh"
                                fill
                                className="object-cover"
                                priority
                                onError={(e) => {
                                    // Hide broken image
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-purple-900/20 pointer-events-none" />
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="md:col-span-8">
                        <p className="text-5xl slide-up-and-fade mb-6">
                            Hi, I&apos;m Ankit Sneh.
                        </p>
                        <div className="text-lg text-muted-foreground max-w-[500px]">
                            <p className="slide-up-and-fade">
                                I&apos;m an AI/ML Engineer and DevOps
                                specialist passionate about bridging the gap
                                between experimental AI and production-ready
                                systems. I specialize in deploying deep
                                learning models, LLMs, and multimodal AI in
                                industrial environments.
                            </p>
                            <p className="mt-3 slide-up-and-fade">
                                My approach combines MLOps best practices (read: trying not to break production) with scalable backend architecture.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
