import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronRight,
    LogIn,
    ShieldCheck,
    Sparkles,
    UserPlus,
} from 'lucide-react';
import { RetroGrid } from '@/components/ui/retro-grid';
import { MagicCard } from '../ui/magic-card';
import { BorderBeam } from '@/components/ui/border-beam';

import Start from './Start';
import Register from './Register';
import Clients from './Clients';
import SignupFeature from './SignupFeature';
import SigninFeature from './SigninFeature';

const OidcShowcase = () => {
    const [activeTab, setActiveTab] = useState('start');
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    const steps = [
        {
            id: 'start',
            title: 'Start',
            icon: <Sparkles className="h-4 w-4" />,
        },
        {
            id: 'register',
            title: 'Register',
            icon: <UserPlus className="h-4 w-4" />,
        },
        {
            id: 'clients',
            title: 'Credentials',
            icon: <ShieldCheck className="h-4 w-4" />,
        },
        {
            id: 'signin',
            title: 'Sign In',
            icon: <LogIn className="h-4 w-4" />,
        },
        {
            id: 'signup',
            title: 'Sign Up',
            icon: <UserPlus className="h-4 w-4" />,
        },
    ];

    const renderForm = () => {
        switch (activeTab) {
            case 'start':
                return <Start />;
            case 'register':
                return <Register />;
            case 'clients':
                return <Clients />;
            case 'signin':
                return <SigninFeature />;
            case 'signup':
                return <SignupFeature />;
            default:
                return null;
        }
    };

    return (
        <section className="bg-white sm:px-6 py-10 sm:py-20 transition-colors duration-500 dark:bg-neutral-950">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 items-start gap-8 sm:rounded-2xl border border-neutral-200 bg-neutral-50/60 p-5 shadow-xl shadow-neutral-200/40 dark:border-neutral-800 dark:bg-white/[0.02] dark:shadow-black/20 lg:grid-cols-12 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative z-10 space-y-8 lg:col-span-4"
                    >
                        <div className="space-y-4">
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                                Get The Flow
                            </p>
                            <h2 className="bg-gradient-to-b from-black via-neutral-800 to-neutral-500 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent dark:from-white dark:via-neutral-200 dark:to-neutral-600 md:text-5xl">
                                Digital Identity Management
                            </h2>
                        </div>

                        <div className="space-y-2">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    onClick={() => setActiveTab(step.id)}
                                    onMouseEnter={() => setHoveredTab(step.id)}
                                    onMouseLeave={() => setHoveredTab(null)}
                                    className="cursor-pointer  relative overflow-hidden rounded-md"
                                >
                                    <MagicCard
                                        className={`relative rounded-md border px-5 py-4 transition-all duration-300 ${
                                            activeTab === step.id
                                                ? 'border-black bg-white dark:border-white dark:bg-white/5'
                                                : 'border-neutral-200 dark:border-white/5 opacity-60 grayscale border-none hover:grayscale-0 hover:border-transparent'
                                        }`}
                                        gradientColor={
                                            activeTab === step.id
                                                ? '#00000010'
                                                : '#ffffff05'
                                        }
                                    >
                                        <div className="flex items-center justify-between text-black dark:text-white">
                                            <div className="flex items-center gap-4">
                                                {step.icon}
                                                <span className="text-xs font-bold uppercase tracking-widest">
                                                    {step.title}
                                                </span>
                                            </div>
                                            {activeTab === step.id && (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </div>
                                    </MagicCard>

                                    {/* The BorderBeam now contains the exact mixed blue gradient, showing up cleanly while the border stays completely invisible */}
                                    {hoveredTab === step.id && (
                                        <BorderBeam
                                            size={75}
                                            duration={3.5}
                                            borderWidth={1.5}
                                            colorFrom="#ffffff"
                                            colorTo="#ffffff"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative lg:col-span-8">
                        <div className="relative flex h-auto min-h-[520px] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-neutral-300 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 shadow-2xl dark:border-neutral-700 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 sm:min-h-[560px]">
                            <RetroGrid className="pointer-events-none absolute inset-0 z-0 opacity-10" />
                            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-neutral-50/50 to-transparent dark:from-neutral-900/50" />

                            <AnimatePresence mode="wait">
                                <div className="relative z-20 flex h-full w-full items-center justify-center">
                                    {renderForm()}
                                </div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OidcShowcase;
