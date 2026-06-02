'use client';

import { motion } from 'framer-motion';

const providers = [
    { name: 'Vercel', url: 'https://cdn.simpleicons.org/vercel/black' },
    { name: 'Auth0', url: 'https://cdn.simpleicons.org/auth0/EB5424' },
    { name: 'Stripe', url: 'https://cdn.simpleicons.org/stripe/008CDD' },
    { name: 'GitHub', url: 'https://cdn.simpleicons.org/github/181717' },
    { name: 'Google', url: 'https://cdn.simpleicons.org/googlecloud/4285F4' },
    { name: 'Supabase', url: 'https://cdn.simpleicons.org/supabase/3FCF8E' },
    {
        name: 'Cloudflare',
        url: 'https://cdn.simpleicons.org/cloudflare/F38020',
    },
];

interface Provider {
    name: string;
    url: string;
}

const LogoCloud = () => {
    return (
        <div className="w-full py-24 overflow-hidden bg-white dark:bg-black">
            {/* --- Header --- */}
            <div className="flex flex-col items-center mb-20 px-6 text-center">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.6em] text-emerald-600 dark:text-emerald-400 mb-6">
                    Interoperability Layer
                </h3>

                <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl leading-tight">
                    Built to integrate with <br />
                    <span className="text-neutral-400 dark:text-neutral-600">
                        the modern ecosystem.
                    </span>
                </h2>
            </div>

            <div className="group relative flex overflow-hidden py-3">
                <motion.div
                    className="flex min-w-full shrink-0 items-center gap-20 px-10"
                    animate={{ x: '-100%' }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {providers.map((provider, idx) => (
                        <ProviderTile
                            key={idx}
                            provider={provider}
                        />
                    ))}
                </motion.div>

                <motion.div
                    aria-hidden="true"
                    className="flex min-w-full shrink-0 items-center gap-20 px-10"
                    animate={{ x: '-100%' }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {providers.map((provider, idx) => (
                        <ProviderTile
                            key={`dup-${idx}`}
                            provider={provider}
                        />
                    ))}
                </motion.div>

                {/* Edge Blurs - Reduced width on mobile for better visibility */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-48 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-black dark:via-black/80 z-20"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-48 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-black dark:via-black/80 z-20"></div>
            </div>
        </div>
    );
};

const ProviderTile = ({ provider }: { provider: Provider }) => {
    return (
        <motion.div
            className="flex items-center gap-4 shrink-0 cursor-pointer"
            whileHover="hovered"
            whileTap="tapped"
            initial="initial"
        >
            <motion.div
                className="flex items-center gap-4"
                variants={{
                    initial: {
                        opacity: 0.5,
                        filter: 'grayscale(100%)',
                        scale: 1,
                    },
                    hovered: {
                        opacity: 1,
                        filter: 'grayscale(0%)',
                        scale: 1.1,
                    },
                    tapped: {
                        opacity: 1,
                        filter: 'grayscale(0%)',
                        scale: 1.1,
                        transition: { duration: 0.3 },
                    },
                }}
            >
                <img
                    src={provider.url}
                    alt={provider.name}
                    className="h-7 w-auto object-contain dark:invert dark:brightness-200"
                    loading="lazy"
                />
                <span
                    className="text-[11px] font-bold tracking-[0.2em] uppercase dark:hover:text-white"
                >
                    {provider.name}
                </span>
            </motion.div>
        </motion.div>
    );
};

export default LogoCloud;
