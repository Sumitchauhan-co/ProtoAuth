import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Globe } from 'lucide-react';
import { useRef } from 'react';

const Register = () => {
    const formRef = useRef<HTMLFormElement>(null);

    const handleRegister = () => {
        formRef.current?.reset();
    };
    return (
        <motion.div
            key="register"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex w-full sm:max-w-[420px] flex-col justify-center space-y-8 px-4 py-6 sm:px-8 sm:py-12 text-neutral-900 dark:text-neutral-50"
        >
            <div className="space-y-3">
                <h3 className="flex sm:flex-row flex-col items-center gap-2 text-2xl sm:text-3xl font-bold uppercase tracking-tighter">
                    <Globe className="h-6 w-6" /> App Registration
                </h3>
                <p className="sm:text-base text-sm sm:text-start text-center font-medium uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                    Create a client
                </p>
            </div>

            <form
                ref={formRef}
                className="space-y-5"
            >
                <div className="space-y-2">
                    <label className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
                        Application Name
                    </label>
                    <Input
                        name="applicationName"
                        placeholder="example.com"
                        className="h-12 rounded-xl border-neutral-300 bg-neutral-100 px-4 text-base text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
                        Redirect URI
                    </label>
                    <Input
                        name="redirectUri"
                        placeholder="https://example.com/dashboard"
                        className="h-12 rounded-xl border-neutral-300 bg-neutral-100 px-4 text-base text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
                    />
                </div>
            </form>

            <Button
                size="lg"
                onClick={handleRegister}
                className="h-12 w-full rounded-xl bg-black text-sm sm:text-base font-semibold text-white hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
            >
                Initialize Client
            </Button>
        </motion.div>
    );
};

export default Register;
