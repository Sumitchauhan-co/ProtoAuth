import Icons from '@/utils/Icons';
import { useState } from 'react';

const LoadingAnimation = () => {
    // State for interactive 3D perspective manipulation
    const [matrixPos, setMatrixPos] = useState({ x: 0, y: 0 });
    const [isSecuring, setIsSecuring] = useState(false);

    //@ts-expect-error e check
    const handleDataStream = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Dynamic multi-axis coordinate tracking
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 45;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -45;
        setMatrixPos({ x, y });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
            <div
                className="flex items-center justify-center h-full w-full cursor-pointer select-none bg-transparent"
                onMouseMove={handleDataStream}
                onMouseEnter={() => setIsSecuring(true)}
                onMouseLeave={() => {
                    setIsSecuring(false);
                    setMatrixPos({ x: 0, y: 0 });
                }}
            >
                {/* Monochromatic 3D Node Container */}
                <div
                    className="relative flex items-center justify-center h-28 w-28 transition-transform duration-500 ease-out [perspective:1200px]"
                    style={{
                        transform: `rotateX(${matrixPos.y}deg) rotateY(${matrixPos.x}deg) scale(${isSecuring ? 1.12 : 1})`,
                    }}
                >
                    {/* Layer 1: Outer Perimeter Ring */}
                    <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.02)] dark:shadow-[0_0_15px_rgba(255,255,255,0.02)]" />

                    {/* Layer 2: Core Token Stream Ring (Clockwise) */}
                    <div
                        className="absolute inset-2 rounded-full border border-dashed border-black/30 dark:border-white/30 flex items-center justify-between p-1"
                        style={{
                            animation: `spin ${isSecuring ? '1.2s' : '3.5s'} linear infinite`,
                        }}
                    >
                        {/* Balanced High-Contrast Nodes */}
                        <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-black via-zinc-600 to-zinc-400 dark:from-white dark:via-zinc-300 dark:to-zinc-500 shadow-md dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                        <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-zinc-400 via-zinc-600 to-black dark:from-zinc-500 dark:via-zinc-300 dark:to-white shadow-md dark:shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                    </div>

                    {/* Layer 3: Inner Validation Ring (Counter-Clockwise) */}
                    <div
                        className="absolute inset-5 rounded-full border-2 border-double border-black/20 dark:border-white/20 flex items-center justify-center"
                        style={{
                            animation: `spin ${isSecuring ? '2.2s' : '6s'} linear infinite reverse`,
                        }}
                    >
                        {/* Tiny Binary Matrix Particles */}
                        <div className="absolute top-0 h-1.5 w-1.5 rounded-full bg-black dark:bg-white shadow-[0_0_6px_rgba(0,0,0,0.5)] dark:shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                        <div className="absolute bottom-0 h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                    </div>

                    {/* Central Verified Identity Anchor (Logo) */}
                    <div
                        className={`z-10 text-black dark:text-white transition-all duration-300 ${
                            isSecuring
                                ? 'scale-110 drop-shadow-[0_0_12px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]'
                                : 'opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]'
                        }`}
                    >
                        <Icons.Logo />
                    </div>

                    {/* Ambient Shadow/Glow Backdrop (Responsive to Light/Dark Mode) */}
                    <div
                        className={`absolute inset-4 -z-10 rounded-full bg-black/5 dark:bg-white/5 blur-xl transition-all duration-500 ${
                            isSecuring
                                ? 'opacity-100 scale-125 blur-2xl'
                                : 'opacity-30'
                        }`}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingAnimation;
