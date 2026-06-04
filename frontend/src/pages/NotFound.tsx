import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Home, Search } from 'lucide-react';

// Define your keyword-to-page mappings
const ROUTE_MAP: Record<string, string> = {
    dashboard: '/dashboard',
    dash: '/dashboard',
    stats: '/dashboard',
    analytics: '/dashboard',
    docs: '/docs',
    documentation: '/docs',
    api: '/docs',
    help: '/docs',
    security: '/legal',
    privacy: '/legal',
    terms: '/legal',
    home: '/',
    main: '/',
};

export default function NotFound() {
    const [searchQuery, setSearchQuery] = useState('');
    const [hasError, setHasError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input on ⌘K / Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setHasError(false);

        const cleanQuery = searchQuery.trim().toLowerCase();
        if (!cleanQuery) return;

        // Check if what they typed matches any of our keywords
        if (cleanQuery in ROUTE_MAP) {
            const destinationPath = ROUTE_MAP[cleanQuery];

            // Get the base frontend URL from environment variables, fallback to current origin
            const baseUrl =
                import.meta.env.VITE_FRONTEND_URL || window.location.origin;

            // Execute the immediate redirect
            window.location.href = `${baseUrl}${destinationPath}`;
        } else {
            // Show an inline error state if the keyword wasn't recognized
            setHasError(true);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground antialiased selection:bg-primary/10 relative overflow-hidden transition-colors duration-300">
            {/* Background aesthetics */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border/50 shadow-sm backdrop-blur-md">
                    <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    Error 404
                </div>

                <h1 className="mt-6 text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-b from-foreground via-foreground/90 to-foreground/40 bg-clip-text text-transparent select-none drop-shadow-sm">
                    404
                </h1>

                <h2 className="mt-4 text-xl md:text-2xl font-semibold tracking-tight">
                    Lost in the void
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-[320px] leading-relaxed">
                    The page you are looking for doesn't exist. Type where you
                    want to go below.
                </p>

                {/* Search Bar Form */}
                <form
                    onSubmit={handleSearchSubmit}
                    className={`w-full mt-8 relative rounded-lg border bg-muted/40 p-1 flex items-center shadow-inner group transition-all duration-200 ${
                        hasError
                            ? 'border-destructive/60 focus-within:border-destructive'
                            : 'border-border focus-within:border-primary/50'
                    }`}
                >
                    <Search className="w-4 h-4 ml-2.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (hasError) setHasError(false); // Clear error layout on type
                        }}
                        placeholder="Try 'dashboard', 'docs', 'settings'..."
                        className="w-full bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground/60 text-foreground"
                    />
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm mr-1">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </form>

                {/* Dynamic Error State feedback */}
                {hasError && (
                    <p className="text-xs text-destructive mt-2 animate-fade-in self-start pl-1">
                        Unknown location. Try checking your spelling or use the
                        home buttons.
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 py-2 text-sm font-medium transition-colors rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm active:scale-[0.98] transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>

                    <a
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-9 px-4 py-2 text-sm font-medium transition-colors rounded-md bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.98] transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
