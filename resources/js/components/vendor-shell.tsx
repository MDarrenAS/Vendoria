import type { ReactNode } from 'react';

export default function VendorShell({
    children,
    title,
}: {
    children: ReactNode;
    title: string;
}) {
    return (
        <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
            <div>
                <p className="text-xs font-bold tracking-[0.18em] text-brand-700 uppercase">
                    Vendoria · Ruang Vendor
                </p>
                <h1 className="mt-1 text-3xl font-bold tracking-tight">
                    {title}
                </h1>
            </div>
            {children}
        </div>
    );
}
