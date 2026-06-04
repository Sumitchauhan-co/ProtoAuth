'use client';

import React from 'react';
import { Shield, FileText, Cookie } from 'lucide-react';

interface LegalBlockProps {
    title: string;
    lastUpdated: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

const LegalBlock = ({ title, lastUpdated, icon, content }: LegalBlockProps) => {
    return (
        <article className="relative w-full rounded-xl p-6 shadow-xs backdrop-blur-md">
            {/* Header Block */}
            <div className="flex items-center gap-4 border-b pb-4 mb-5">
                <div className="p-2.5 rounded-xl border text-neutral-800 dark:border-neutral-800 dark:text-neutral-200 shrink-0">
                    {icon}
                </div>
                <div className="space-y-0.5">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-50 uppercase">
                        {title}
                    </h3>
                    <p className="text-[10px] sm:text-xs font-mono text-neutral-400 dark:text-neutral-500">
                        {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Core Body Content */}
            <div className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-3xl space-y-4">
                {content}
            </div>
        </article>
    );
};

export default function LegalSection() {
    return (
        <section className="bg-neutral-50 px-4 sm:px-8 py-12 sm:py-24 transition-colors duration-500 dark:bg-neutral-950 w-full min-h-screen flex items-center justify-center">
            <div className="mx-auto w-full max-w-4xl space-y-12">
                {/* Clean High-Contrast Section Header */}
                <div className="text-left border-b border-neutral-200/60 pb-6 dark:border-neutral-800/60 space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl uppercase">
                        Legal Agreements
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base font-medium max-w-2xl">
                        Review our runtime compliance documentation, protocol
                        guidelines, and data processing terms.
                    </p>
                </div>

                {/* Statically Displayed Registry Stack */}
                <div className="space-y-6">
                    {/* 1. PRIVACY POLICY */}
                    <LegalBlock
                        title="Privacy Policy"
                        lastUpdated="Last Updated: June 2, 2026"
                        icon={<Shield className="h-5 w-5" />}
                        content={
                            <>
                                <p>
                                    Our platform operates under strict
                                    privacy-by-design frameworks. We collect
                                    cryptographically secure token metadata
                                    solely required to authorize your active
                                    applications against our global
                                    authentication nodes.
                                </p>
                                <p className="font-bold text-neutral-900 dark:text-neutral-200">
                                    No cleartext user credentials, passwords, or
                                    handshake secrets are ever tracked, logged,
                                    or recorded in our platform traces.
                                </p>
                            </>
                        }
                    />

                    {/* 2. TERMS & CONDITIONS */}
                    <LegalBlock
                        title="Terms & Conditions"
                        lastUpdated="Last Updated: June 2, 2026"
                        icon={<FileText className="h-5 w-5" />}
                        content={
                            <>
                                <p>
                                    By building integrations or authenticating
                                    clients on this service fabric, you confirm
                                    full adherence to OpenID Connect
                                    specification workflows, including mandatory
                                    PKCE handling configurations.
                                </p>
                                <p>
                                    Any attempt to run script-based injection
                                    loops or scrape raw authentication tokens on
                                    endpoints will cause immediate system-level
                                    client ID token revocation.
                                </p>
                            </>
                        }
                    />

                    {/* 3. COOKIES POLICY */}
                    <LegalBlock
                        title="Cookies Policy"
                        lastUpdated="Last Updated: June 2, 2026"
                        icon={<Cookie className="h-5 w-5" />}
                        content={
                            <>
                                <p>
                                    We use strictly functional, necessary
                                    temporary cookies to establish session
                                    validation and maintain multi-factor
                                    authorization checkpoints across client
                                    request states.
                                </p>
                                <p className="font-bold text-neutral-900 dark:text-neutral-200">
                                    All tracking tokens deploy structural
                                    HttpOnly, Secure, and SameSite=Lax headers
                                    to neutralize Cross-Site Request Forgery
                                    (CSRF) attack routes.
                                </p>
                            </>
                        }
                    />
                </div>
            </div>
        </section>
    );
}
