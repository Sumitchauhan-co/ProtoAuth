import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative flex h-full w-full items-center justify-center bg-white dark:bg-black overflow-hidden selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <div
                className={cn(
                    "absolute inset-0",
                    "[background-size:20px_20px]",
                    "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                    "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
                )}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

            <div className="relative flex flex-col items-center px-6">
                <div className="mb-8 flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50/50 px-4 py-1.5 dark:border-neutral-800 dark:bg-neutral-900/50 backdrop-blur-md">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] font-mono font-medium uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
                        Active
                    </span>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <h1 className="select-none max-w-4xl bg-gradient-to-b from-neutral-950 to-neutral-500 bg-clip-text text-center text-5xl font-bold tracking-[-0.04em] text-transparent dark:from-white dark:to-neutral-500 sm:text-7xl">
                        The Protocol for User Management
                    </h1>

                    <p className="max-w-[34rem] text-center text-lg font-light leading-relaxed tracking-tight text-neutral-500 dark:text-neutral-400 sm:text-xl">
                        The cryptographically verified identity layer for modern
                        distributed systems.
                    </p>
                </div>

                <div className="mt-14 flex flex-col items-center gap-5 sm:flex-row">
                    <Button
                        onClick={() => navigate("/dashboard")}
                        variant={"btn"}
                        className="h-12 px-10"
                    >
                        Connect Auth
                    </Button>
                    <Button
                        onClick={() =>
                            navigate(`${import.meta.env.VITE_DOCS_URL}`)
                        }
                        variant={"btn2"}
                        className="h-12 px-10"
                    >
                        View Specs
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-10 left-10 hidden font-mono text-[10px] font-medium leading-relaxed tracking-wider text-neutral-400 dark:text-neutral-600 sm:block">
                <span className="block">SEC_PROTOCOL: RS256</span>
                <span className="block">ENCRYPTION: AES-256-GCM</span>
                <span className="block text-emerald-500/70 dark:text-emerald-500/40">
                    COMPLIANCE: FAPI-2.0
                </span>
            </div>
        </section>
    );
};

export default Hero;
