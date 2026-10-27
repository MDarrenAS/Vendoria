import type { ReactNode } from 'react';

export default function VendorShell({
    children,
    title,
}: {
    children: ReactNode;
    title: string;
}) {
    return (
        <div className="min-h-full bg-background">
            <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <div>
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                        Vendoria · Ruang Vendor
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>
                </div>
                {children}
            </div>
            <footer className="mt-10 border-t border-border/70 bg-card">
                <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:px-6 lg:px-8">
                    <p>Vendoria © 2026 · Platform Manajemen Vendor & Event</p>
                    <p>
                        Ruang Vendor · Pembayaran aman melalui Escrow Vendoria
                    </p>
                </div>
            </footer>
        </div>
    );
}
