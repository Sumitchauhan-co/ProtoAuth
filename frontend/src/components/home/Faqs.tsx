'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

const FaqItem = ({ question, answer, isOpen, onToggle }: FaqItemProps) => {
    return (
        <div
            onClick={onToggle}
            className="cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 w-full"
        >
            <div
                className={cn(
                    'relative rounded-xl border p-6 transition-all duration-300 flex flex-col justify-between',
                    isOpen
                        ? 'bg-white border-neutral-950 dark:bg-neutral-900 dark:border-neutral-100 shadow-md'
                        : 'bg-white/40 border-neutral-200/80 dark:bg-neutral-900/20 dark:border-neutral-800/60 hover:border-neutral-400 dark:hover:border-neutral-500',
                )}
            >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Larger Icon Container */}
                        <div
                            className={cn(
                                'p-1 sm:p-1.5 rounded-xl border transition-colors duration-300 shrink-0',
                                isOpen
                                    ? 'bg-neutral-950 text-white border-neutral-800 dark:bg-white dark:text-black dark:border-neutral-200'
                                    : 'bg-neutral-100 border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800 text-neutral-500',
                            )}
                        >
                            <HelpCircle className="h-5 w-5" />{' '}
                            {/* Increased size */}
                        </div>
                        {/* Larger Question Text */}
                        <h3 className="text-sm sm:text-lg font-bold tracking-tight text-neutral-800 dark:text-neutral-100 leading-tight">
                            {question}
                        </h3>
                    </div>

                    {/* Larger Action Toggle Indicator */}
                    <div
                        className={cn(
                            'p-1 sm:p-1.5 rounded-full border shrink-0 transition-all duration-300',
                            isOpen
                                ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-black rotate-180'
                                : 'border-neutral-200 dark:border-neutral-800 text-neutral-400',
                        )}
                    >
                        {isOpen ? (
                            <Minus className="h-4 w-4" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                    </div>
                </div>

                {/* Content Pane */}
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{
                                height: 'auto',
                                opacity: 1,
                                marginTop: 20,
                                transition: {
                                    height: {
                                        duration: 0.25,
                                        ease: 'easeInOut',
                                    },
                                    opacity: { duration: 0.2, delay: 0.05 },
                                },
                            }}
                            exit={{
                                height: 0,
                                opacity: 0,
                                marginTop: 0,
                                transition: {
                                    height: {
                                        duration: 0.2,
                                        ease: 'easeInOut',
                                    },
                                    opacity: { duration: 0.1 },
                                },
                            }}
                            className="overflow-hidden"
                        >
                            {/* Larger Answer Text */}
                            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-3xl border-t border-neutral-100 dark:border-neutral-800/60 pt-4">
                                {answer}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default function FaqsSection() {
    const [openId, setOpenId] = useState<string | null>('');

    const faqs = [
        {
            id: 'pkce',
            question:
                'Why does this matrix strictly enforce PKCE authorization flows?',
            answer: 'Proof Key for Code Exchange (PKCE) blocks authorization code interception vectors. By requiring runtime verifiers, public front-end applications are guarded securely without storing exposed static secret variables.',
        },
        {
            id: 'jwks',
            question:
                'How often are the public cryptographic signing keys rotated?',
            answer: 'Key sets rotate automatically every 30 days. Active sessions continue validating seamlessly via the JWKS dynamic metadata caches without producing token runtime execution breaks.',
        },
        {
            id: 'scopes',
            question:
                'Can resource handlers requests custom consent configurations?',
            answer: 'Yes. Custom scopes map directly inside your dynamic client application registries. Users retain complete visual granular opt-in controls during initial authorization handshakes.',
        },
        {
            id: 'tokens',
            question: 'What strategies mitigate token theft or replay attacks?',
            answer: 'We deploy aggressive refresh token rotation (RTR) combined with tight 15-minute access lifetimes. Attempting token reuse triggers family revocation, invalidating downstream authentication keys.',
        },
    ];

    return (
        <section className="bg-neutral-50 px-4 sm:px-8 py-12 sm:py-24 transition-colors duration-500 dark:bg-neutral-950 w-full min-h-screen flex items-center justify-center">
            <div className="mx-auto w-full max-w-4xl">
                {/* Only Main Header and Sub-Heading */}
                <div className="mb-12 text-center border-b tracking-wider border-neutral-200/60 pb-6 dark:border-neutral-800/60 space-y-2">
                    <h2 className="text-3xl font-black  text-neutral-900 dark:text-neutral-50 sm:text-4xl">
                        FAQS
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base font-medium">
                        Protocol Specifications & Cryptographic Trust
                        Architecture
                    </p>
                </div>

                {/* Accordion Stack Box */}
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <FaqItem
                            key={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openId === faq.id}
                            onToggle={() =>
                                setOpenId(openId === faq.id ? null : faq.id)
                            }
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
