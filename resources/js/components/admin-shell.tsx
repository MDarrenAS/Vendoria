import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export function AdminPagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            className="flex flex-wrap justify-center gap-2"
            aria-label="Navigasi halaman"
        >
            {links.map((link, index) => (
                <Link
                    key={`${link.label}-${index}`}
                    href={link.url ?? '#'}
                    aria-disabled={!link.url}
                    className={`rounded-md border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-card'} ${link.url ? '' : 'pointer-events-none opacity-50'}`}
                >
                    {link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}
                </Link>
            ))}
        </nav>
    );
}

export default function AdminShell({
    children,
    title,
}: {
    children: ReactNode;
    title: string;
}) {
    return (
        <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
                        Vendoria · Administrasi
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight">
                        {title}
                    </h1>
                </div>
                <span className="hidden rounded-2xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground sm:inline-flex">
                    Kelola marketplace dengan mudah
                </span>
            </div>
            {children}
        </div>
    );
}
