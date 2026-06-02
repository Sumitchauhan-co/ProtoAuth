import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRef } from 'react';
import { demoClient } from './const';

const SigninFeature = () => {
    const signinFormRef = useRef<HTMLFormElement>(null);
    const handleSigninDemo = () => {
        signinFormRef.current?.reset();
    };

    return (
        <motion.div
            key="signin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex w-full max-w-[420px] flex-col justify-center space-y-8 px-4 py-6 sm:px-8 sm:py-12 text-neutral-900 dark:text-neutral-50"
        >
            <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white/60 text-neutral-900 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-white/[0.04] dark:text-white">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <div className="space-y-2 text-center">
                    <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">
                        Sign in to{' '}
                        <span className="font-bold">{demoClient.appName}</span>
                    </h3>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Continue with your ProtoAuth account
                    </p>
                </div>
            </div>

            <form
                ref={signinFormRef}
                className="space-y-5"
            >
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Email
                    </label>
                    <Input
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        className="h-12 rounded-xl border-neutral-200 bg-white/55 px-4 text-neutral-900 backdrop-blur-sm focus-visible:ring-neutral-300 dark:border-neutral-800 dark:bg-white/[0.04] dark:text-neutral-50 dark:focus-visible:ring-neutral-700"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Password
                        </label>
                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                            Forgot?
                        </span>
                    </div>
                    <Input
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 rounded-xl border-neutral-200 bg-white/55 px-4 text-neutral-900 backdrop-blur-sm focus-visible:ring-neutral-300 dark:border-neutral-800 dark:bg-white/[0.04] dark:text-neutral-50 dark:focus-visible:ring-neutral-700"
                    />
                </div>

                <Button
                    type="button"
                    onClick={handleSigninDemo}
                    size="lg"
                    className="h-12 w-full rounded-xl bg-black font-semibold text-white transition-transform hover:bg-neutral-900 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-neutral-100"
                >
                    Continue
                </Button>
            </form>
        </motion.div>
    );
};

export default SigninFeature;
