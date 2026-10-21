import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 via-background to-teal-50/80 p-6 md:p-10">
            <span
                aria-hidden="true"
                className="absolute -top-32 -left-24 size-96 rounded-full bg-accent-500/15 blur-3xl"
            />
            <span
                aria-hidden="true"
                className="absolute -right-28 -bottom-36 size-[30rem] rounded-full bg-teal-400/20 blur-3xl"
            />
            <div className="relative w-full max-w-md rounded-3xl border border-white/70 bg-card/90 p-7 shadow-2xl shadow-brand-950/10 backdrop-blur-xl md:p-10">
                <div className="flex flex-col gap-7">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-3 font-medium"
                        >
                            <img
                                src="/images/VendoriaLogo.png"
                                alt="Logo Vendoria"
                                className="h-14 w-auto object-contain"
                            />
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {title}
                            </h1>
                            <p className="mx-auto max-w-xs text-center text-sm leading-6 text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
