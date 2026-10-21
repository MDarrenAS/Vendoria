import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative isolate flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-brand-50 via-background to-amber-50/80 p-6 md:p-10">
            <span
                aria-hidden="true"
                className="absolute -top-32 -left-24 size-96 rounded-full bg-brand-400/20 blur-3xl"
            />
            <span
                aria-hidden="true"
                className="absolute -right-24 -bottom-32 size-96 rounded-full bg-amber-400/20 blur-3xl"
            />
            <div className="relative flex w-full max-w-md flex-col gap-6">
                <Link
                    href={home()}
                    className="flex items-center gap-3 self-center font-semibold"
                >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15">
                        <AppLogoIcon className="size-7 fill-current text-primary" />
                    </div>
                    <span className="text-lg tracking-tight">Vendoria</span>
                </Link>

                <div className="flex flex-col gap-6">
                    <Card className="rounded-3xl border-white/70 bg-card/95 shadow-2xl shadow-brand-950/10 backdrop-blur-xl">
                        <CardHeader className="px-10 pt-8 pb-0 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="px-10 py-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
