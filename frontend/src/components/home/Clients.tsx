import Icons from '@/utils/Icons';
import { motion } from 'framer-motion';
import { Key, Check } from 'lucide-react'; // Added Check for a smooth indicator fallback if needed
import { useState } from 'react';
import { demoClient } from './const';

const Clients = () => {
    const [showClientSecret, setShowClientSecret] = useState(false);

    // States to track clipboard success states independently
    const [copiedId, setCopiedId] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);

    // Dynamic copy handler
    //@ts-expect-error unused
    const handleCopyToClipboard = async (text, target) => {
        try {
            await navigator.clipboard.writeText(text);

            if (target === 'id') {
                setCopiedId(true);
                setTimeout(() => setCopiedId(false), 3000);
            } else if (target === 'secret') {
                setCopiedSecret(true);
                setTimeout(() => setCopiedSecret(false), 3000);
            }
        } catch (err) {
            console.error('Failed to copy text to clipboard: ', err);
        }
    };

    return (
        <motion.div
            key="clients"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 flex w-full sm:mx-10 flex-col justify-center space-y-8 px-4 sm:px-8 py-6 sm:py-12 text-neutral-900 dark:text-neutral-50"
        >
            <div className="space-y-3">
                <h3 className="flex sm:flex-row flex-col items-center gap-2 text-2xl sm:text-3xl font-bold uppercase tracking-tighter">
                    <Key className="h-6 w-6" /> Client Credentials
                </h3>
                <p className="text-sm sm:text-base sm:text-start text-center font-medium uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                    Get your client id and secret
                </p>
            </div>

            <div className="space-y-5 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 sm:p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
                    <div className="min-w-0">
                        <p className="text-base font-semibold">
                            {demoClient.appName}
                        </p>
                        <p className="break-all text-sm text-neutral-500 dark:text-neutral-400">
                            {demoClient.redirectUri}
                        </p>
                    </div>
                    <span className="shrink-0 rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Active
                    </span>
                </div>

                <div className="space-y-4 flex flex-col sm:flex-row justify-between items-center gap-5">
                    {/* CLIENT ID PANEL */}
                    <div className=" mb-0 w-full">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-neutral-500">
                            Client ID
                        </p>
                        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white/45 p-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-white/[0.04]">
                            <code className="min-w-0 flex-1 break-all text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                                {demoClient.clientId}
                            </code>
                            <button
                                type="button"
                                title="Copy client id"
                                onClick={() =>
                                    handleCopyToClipboard(
                                        demoClient.clientId,
                                        'id',
                                    )
                                }
                                className={`shrink-0 transition-colors ${
                                    copiedId
                                        ? 'text-emerald-500 dark:text-emerald-400'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                            >
                                {copiedId ? (
                                    <Check
                                        size={20}
                                        className="animate-scale-in"
                                    />
                                ) : (
                                    <Icons.Copy size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* CLIENT SECRET PANEL */}
                    <div className="mb-0 w-full">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-neutral-500">
                            Client Secret
                        </p>
                        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white/45 p-4 backdrop-blur-sm dark:border-neutral-800 dark:bg-white/[0.04]">
                            <code className="min-w-0 flex-1 break-all text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                                {showClientSecret
                                    ? demoClient.clientSecret
                                    : '************************'}
                            </code>

                            {/* Toggle visibility visibility */}
                            <button
                                type="button"
                                title={
                                    showClientSecret
                                        ? 'Hide client secret'
                                        : 'Show client secret'
                                }
                                onClick={() =>
                                    setShowClientSecret(
                                        (isVisible) => !isVisible,
                                    )
                                }
                                className="shrink-0 text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
                            >
                                {showClientSecret ? (
                                    <Icons.EyeClose size={20} />
                                ) : (
                                    <Icons.EyeOpen size={20} />
                                )}
                            </button>

                            {/* Copy Secret Button */}
                            <button
                                type="button"
                                title="Copy client secret"
                                onClick={() =>
                                    handleCopyToClipboard(
                                        demoClient.clientSecret,
                                        'secret',
                                    )
                                }
                                className={`shrink-0 transition-colors ${
                                    copiedSecret
                                        ? 'text-emerald-500 dark:text-emerald-400'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                                }`}
                            >
                                {copiedSecret ? (
                                    <Check
                                        size={20}
                                        className="animate-scale-in"
                                    />
                                ) : (
                                    <Icons.Copy size={20} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Clients;
