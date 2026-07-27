import { useEffect, useState } from "react";

const Docs = () => {
    const docsRedirectUrl = import.meta.env.VITE_DOCS_URL;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!docsRedirectUrl) {
            console.error("Redirection failed: VITE_DOCS_URL is not defined.");
            setError("Documentation URL configuration is missing.");
            return;
        }

        const timer = setTimeout(() => {
            window.location.href = docsRedirectUrl;
        }, 600);

        return () => clearTimeout(timer);
    }, [docsRedirectUrl]);

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 antialiased font-sans select-none">
            <div className="w-full max-w-md text-center space-y-6 px-4">
                <div className="flex justify-center">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl">
                        <svg
                            className={`h-5 w-5 ${error ? "text-red-400" : "text-zinc-400 animate-pulse"}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>

                        {!error && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-300"></span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-medium tracking-tight text-zinc-100">
                        {error ? "Redirection Failed" : "Redirecting to docs"}
                    </h1>
                    <p className="text-sm text-zinc-400 font-normal">
                        {error
                            ? error
                            : "Taking you straight to our documentation page."}
                    </p>
                </div>

                <div
                    className="w-32 mx-auto pt-2"
                    role="progressbar"
                    aria-label="Loading destination"
                >
                    {error ? (
                        <div className="text-xs text-red-400 font-mono bg-red-950/30 border border-red-900/50 py-1 px-2 rounded">
                            ERR_ENV_MISSING
                        </div>
                    ) : (
                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden relative">
                            <div className="absolute inset-0 bg-zinc-400 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Docs;
