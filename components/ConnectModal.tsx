'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import { GENERAL_INFO } from '@/lib/data';
import { X, Mail, Linkedin, Github, Link2 } from 'lucide-react';
import gsap from 'gsap';

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const isClosingRef = useRef(false);

    const handleClose = useCallback(() => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;
        
        // Animate out
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
        gsap.to(contentRef.current, { 
            opacity: 0, y: 30, scale: 0.95, duration: 0.2,
            onComplete: () => {
                isClosingRef.current = false;
                onClose();
            }
        });
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            isClosingRef.current = false;
            document.body.style.overflow = 'hidden';
            
            // Animate in
            gsap.fromTo(overlayRef.current, 
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.7)' }
            );

            // Listen for Escape key
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    handleClose();
                }
            };
            document.addEventListener('keydown', handleEscape);
            
            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = '';
            };
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, handleClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            handleClose();
        }
    };

    if (!isOpen) return null;

    const links = [
        {
            name: 'Email',
            icon: <Mail className="w-6 h-6" />,
            href: `mailto:${GENERAL_INFO.email}?subject=${encodeURIComponent(GENERAL_INFO.emailSubject)}&body=${encodeURIComponent(GENERAL_INFO.emailBody)}`,
            label: GENERAL_INFO.email,
            color: 'hover:bg-red-500/20 hover:border-red-500/50',
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin className="w-6 h-6" />,
            href: GENERAL_INFO.linkedIn,
            label: 'linkedin.com/in/ankitsneh',
            color: 'hover:bg-blue-500/20 hover:border-blue-500/50',
        },
        {
            name: 'GitHub',
            icon: <Github className="w-6 h-6" />,
            href: GENERAL_INFO.github,
            label: 'github.com/ankitsneh',
            color: 'hover:bg-gray-500/20 hover:border-gray-500/50',
        },
        {
            name: 'Linktree',
            icon: <Link2 className="w-6 h-6" />,
            href: GENERAL_INFO.linktree,
            label: 'linktr.ee/ankitsneh',
            color: 'hover:bg-green-500/20 hover:border-green-500/50',
        },
    ];

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={handleOverlayClick}
        >
            <div
                ref={contentRef}
                className="relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl p-6 shadow-2xl"
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    data-close-modal
                    aria-label="Close"
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-anton text-primary">Connect with Me</h2>
                    <p className="text-muted-foreground mt-2">
                        Let&apos;s collaborate on your next AI project
                    </p>
                </div>

                {/* Links */}
                <div className="space-y-3">
                    {links.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-4 p-4 rounded-xl border border-border bg-background transition-all duration-300 ${link.color}`}
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary">
                                {link.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground">{link.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{link.label}</p>
                            </div>
                            <div className="flex-shrink-0 text-muted-foreground">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    Looking forward to hearing from you! 🚀
                </p>
            </div>
        </div>
    );
};

export default ConnectModal;
