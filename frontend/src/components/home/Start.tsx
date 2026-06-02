import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const Start = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            key="start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex w-full sm:max-w-[500px] flex-col justify-center space-y-7 px-4 py-6 sm:px-8 sm:py-12 text-neutral-900 dark:text-neutral-50"
        >
            <div className="space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white/60 text-neutral-900 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-white/[0.04] dark:text-white">
                    <Sparkles className="h-8 w-8" />
                </div>
                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                        ProtoAuth Console
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                        Sign in once. Ship identity everywhere.
                    </h3>
                </div>
            </div>

            <div className="grid gap-3">
                {[
                    'Access your developer dashboard',
                    'Register your client application',
                    'Use client credentials in your website',
                    'Offer sign-in and sign-up with ProtoAuth',
                ].map((item, index) => (
                    <div
                        key={item}
                        className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white/45 p-3 text-sm font-medium shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-white/[0.04]"
                    >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-black text-xs font-bold text-white dark:bg-white dark:text-black">
                            {index + 1}
                        </span>
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            <Button
                size="lg"
                onClick={() => navigate('/signin')}
                className="h-12 w-full rounded-xl bg-black font-semibold text-white transition-transform hover:bg-neutral-900 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-neutral-100"
            >
                Continue to ProtoAuth
            </Button>
        </motion.div>
    );
};

export default Start;
