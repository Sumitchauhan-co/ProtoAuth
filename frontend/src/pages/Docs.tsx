import { useEffect } from 'react';

const Docs = () => {
    const docsRedirectUrl = import.meta.env.VITE_DOCS_URL;
    console.log(docsRedirectUrl);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (docsRedirectUrl) {
                window.location.href = docsRedirectUrl;
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [docsRedirectUrl]);

    return (
        <div className="min-h-screen bg-[#09090b] dark:bg-[#09090b] flex flex-col items-center justify-center p-6 antialiased font-sans selection:bg-neutral-800 selection:text-white">
            <div className="w-full max-w-[480px] text-center space-y-8 px-4">
                <div className="flex justify-center">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl">
                        <svg
                            className="h-5 w-5 text-neutral-400 animate-pulse"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-200"></span>
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-neutral-200">
                        Redirecting to docs
                    </h1>
                    <p className="text-sm text-neutral-400 font-normal tracking-wide">
                        Taking you straight to our documentation page.
                    </p>
                </div>

                <div className="w-48 mx-auto pt-2">
                    <div className="h-0.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-neutral-400 rounded-full w-1/3 animate-[shimmer_1.5s_infinite] [animation-name:pulse]"
                            style={{ animationDuration: '1.5s' }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Docs;
