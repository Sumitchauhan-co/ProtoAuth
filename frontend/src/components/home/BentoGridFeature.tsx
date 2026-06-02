import {
    Globe,
    BarChart3,
    Shield,
    Zap,
    ArrowUpRight,
    UserCheck,
    ShieldAlert,
    KeyRound,
} from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { BentoGrid, BentoCard } from '@/components/ui/bento-grid';
import { Calendar } from '@/components/ui/calendar';
import { Marquee } from '@/components/ui/marquee';

import { AnimatedBeam } from '@/components/ui/animated-beam';
import { AnimatedList } from '@/components/ui/animated-list';
const tokenPayloads = [
    {
        name: 'id_token.jwt',
        body: JSON.stringify(
            {
                typ: 'JWT',
                alg: 'RS256',
                iss: 'https://auth.locus.dev',
                sub: 'usr_8f3a29x0',
                aud: 'locus-web-client',
                name: 'Sumit Chauhan',
                email: 'sumit@locus.dev',
                email_verified: true,
                auth_time: 171821042,
            },
            null,
            2,
        ),
    },
    {
        name: 'access_token.jwt',
        body: JSON.stringify(
            {
                iss: 'https://auth.locus.dev',
                sub: 'usr_8f3a29x0',
                aud: 'https://api.locus.dev/v1',
                scope: 'openid profile email workspace:write',
                client_id: 'cl_client_48b2',
                exp: 171821402,
                jti: 'b5c92c72-91a5-4f4b',
            },
            null,
            2,
        ),
    },
    {
        name: 'jwks.json',
        body: JSON.stringify(
            {
                keys: [
                    {
                        kty: 'RSA',
                        use: 'sig',
                        alg: 'RS256',
                        kid: 'k1_locus_2026',
                        n: 'u1x9a83b...m3n9x8',
                        e: 'AQAB',
                    },
                ],
            },
            null,
            2,
        ),
    },
    {
        name: 'userinfo.json',
        body: JSON.stringify(
            {
                sub: 'usr_8f3a29x0',
                name: 'Sumit Chauhan',
                preferred_username: 'sumit',
                picture: 'https://cdn.locus.dev/avatars/sumit.png',
                updated_at: 171821042,
            },
            null,
            2,
        ),
    },
];

const auditLogs = [
    {
        label: 'Token Issued',
        detail: 'usr_9b21 via PKCE flow',
        icon: UserCheck,
        color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
        label: 'JWKS Rotate',
        detail: 'Asymmetric keys updated',
        icon: KeyRound,
        color: 'text-blue-500 bg-blue-500/10',
    },
    {
        label: 'Policy Block',
        detail: 'Suspicious origin handshake',
        icon: ShieldAlert,
        color: 'text-amber-500 bg-amber-500/10',
    },
];

export default function BentoGridFeature() {
    const containerRef = useRef<HTMLDivElement>(null);
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);

    const features = [
        {
            Icon: Zap,
            name: 'Stateless Token Minting',
            description:
                'Cryptographically secure, signed JWT production at edge speeds.',
            href: '/docs/tokens',
            cta: 'Signature specs',
            className: 'col-span-3 md:col-span-1',
            background: (
                <Marquee
                    pauseOnHover
                    className="absolute top-0 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
                >
                    {tokenPayloads.map((f, idx) => (
                        <figure
                            key={idx}
                            className={cn(
                                'relative w-32 scale-90 cursor-pointer overflow-hidden rounded-xl border p-4',
                                'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
                                'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]',
                                'transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none',
                            )}
                        >
                            <div className="flex flex-row items-center gap-2">
                                <div className="flex flex-col">
                                    <figcaption className="text-sm font-medium dark:text-white">
                                        {f.name}
                                    </figcaption>
                                </div>
                            </div>
                            <blockquote className="mt-2 text-xs">
                                {f.body}
                            </blockquote>
                        </figure>
                    ))}
                </Marquee>
            ),
        },
        {
            Icon: BarChart3,
            name: 'Session Telemetry',
            description: 'Real-time pipeline monitoring and active handshakes.',
            href: '/dashboard/analytics',
            cta: 'Open console',
            className: 'col-span-3 md:col-span-2',
            background: (
                <div className="absolute inset-x-0 left-35 md:top-10 md:left-75 scale-120 opacity-90 transition-all duration-500 ease-out group-hover:scale-135 [mask-image:linear-gradient(to_top,transparent_5%,#000_90%)]">
                    <AnimatedList delay={1600}>
                        {auditLogs.map((log, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2.5 w-full border border-neutral-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70 rounded-xl p-2 shadow-2xs"
                            >
                                <div
                                    className={cn(
                                        'p-1.5 rounded-lg',
                                        log.color,
                                    )}
                                >
                                    <log.icon className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 leading-none">
                                        {log.label}
                                    </span>
                                    <span className="text-[9px] font-medium text-neutral-400 truncate mt-0.5">
                                        {log.detail}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </AnimatedList>
                </div>
            ),
        },
        {
            Icon: Globe,
            name: 'Federated Identity Clusters',
            description:
                'Decentralized single sign-on cross globally distributed secure layers.',
            href: '/docs/sso',
            cta: 'Integration guides',
            className: 'col-span-3 md:col-span-2',
            background: (
                <div
                    ref={containerRef}
                    className="absolute inset-x-0 top-10 md:top-20 flex items-center justify-around px-6 transition-all duration-500 ease-out [mask-image:linear-gradient(to_top,transparent_5%,#000_95%)]"
                >
                    <div
                        ref={fromRef}
                        className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-2xs dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <UserCheck className="h-7 w-7 text-neutral-500" />
                    </div>
                    <div
                        ref={toRef}
                        className="z-10 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-2xs dark:border-neutral-800 dark:bg-neutral-950"
                    >
                        <Globe className="h-7 w-7 text-primary" />
                    </div>
                    <AnimatedBeam
                        containerRef={containerRef}
                        fromRef={fromRef}
                        toRef={toRef}
                        curvature={-15}
                        duration={2.5}
                        pathColor="#e5e5e5"
                    />
                </div>
            ),
        },
        {
            Icon: Shield,
            name: 'Private PKCE Sandboxes',
            description:
                'Strict, automated code exchange security proofs for client apps.',
            href: '/docs/pkce',
            cta: 'Verify protocol flows',
            className: 'col-span-3 md:col-span-1',
            background: (
                <Calendar
                    mode="single"
                    selected={new Date()}
                    className="absolute -top-5 -right-5 rounded-xl scale-70 border border-neutral-200/50 bg-white/40 shadow-2xs transition-all duration-500 ease-out dark:border-neutral-800/50 dark:bg-neutral-950/30 backdrop-blur-xs group-hover:scale-60 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_100%)]"
                />
            ),
        },
    ];

    return (
        <section className="bg-background relative w-full overflow-hidden px-6 py-10 sm:py-20 md:px-12">
            {/* Soft Ambient Radial Backlight */}
            <div className="bg-primary/[0.015] pointer-events-none absolute top-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full blur-3xl" />

            <div className="mx-auto max-w-7xl space-y-10">
                {/* Clean Minimalist Header */}
                <div className="flex flex-col items-start justify-between gap-4 border-b border-border/40 pb-6 md:flex-row md:items-end">
                    <div className="space-y-2.5">
                        <div className="bg-neutral-100 border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-mono font-medium tracking-wider uppercase">
                            Protocol System
                        </div>
                        <h2 className="text-foreground/90 font-sans text-2xl font-black tracking-tight sm:text-3xl">
                            Engineered for modern identity security.
                        </h2>
                    </div>
                    <p className="text-muted-foreground/60 max-w-xs text-xs font-medium leading-relaxed">
                        A low-latency OpenID Connect implementation engineered
                        for strict cryptographic compliance.
                    </p>
                </div>

                {/* Premium Height Adjusted Bento Grid Matrix */}
                <BentoGrid className="w-full grid-cols-3 gap-4">
                    {features.map((feature, idx) => (
                        <BentoCard
                            key={idx}
                            {...feature}
                            className={cn(
                                feature.className,
                                'border-border/50 bg-card/5 hover:bg-card/25 hover:border-primary/25 dark:hover:border-primary/10',
                                'group relative overflow-hidden rounded-2xl border p-6 shadow-3xs backdrop-blur-sm',
                                'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xs',
                            )}
                            Icon={() => (
                                <div className="flex w-full items-center justify-between mb-1 z-20 relative">
                                    <div className="border-neutral-200/50 bg-white/90 dark:border-neutral-800/50 dark:bg-neutral-900/90 group-hover:border-primary/20 rounded-lg border p-1.5 transition-colors duration-300 shadow-3xs">
                                        <feature.Icon className="text-foreground/60 group-hover:text-primary h-4 w-4 transition-colors duration-300" />
                                    </div>
                                    <ArrowUpRight className="text-muted-foreground/20 opacity-0 transition-all duration-300 -translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                                </div>
                            )}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
