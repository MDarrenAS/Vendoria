import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AppLogo from '@/components/app-logo';
import admin from '@/routes/admin';
import categories from '@/routes/admin/categories';
import orders from '@/routes/admin/orders';
import reviews from '@/routes/admin/reviews';
import services from '@/routes/admin/services';
import users from '@/routes/admin/users';
import vendors from '@/routes/admin/vendors';

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
    const pathname = usePage().url.split('?')[0];
    const items = [
        {
            label: 'Ringkasan',
            href: admin.dashboard(),
            match: '/admin',
            exact: true,
        },
        { label: 'Vendor', href: vendors.index(), match: '/admin/vendors' },
        { label: 'Layanan', href: services.index(), match: '/admin/services' },
        {
            label: 'Kategori',
            href: categories.index(),
            match: '/admin/categories',
        },
        { label: 'Pesanan', href: orders.index(), match: '/admin/orders' },
        { label: 'Ulasan', href: reviews.index(), match: '/admin/reviews' },
        { label: 'Pengguna', href: users.index(), match: '/admin/users' },
    ];

    return (
        <div className="min-h-screen bg-background/80">
            <header className="border-b border-primary/10 bg-gradient-to-r from-brand-50 via-background to-teal-50/60">
                <div className="mx-auto grid max-w-7xl gap-5 px-5 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href={admin.dashboard()}
                            className="flex w-fit items-center gap-3"
                        >
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-100 ring-1 ring-brand-200">
                                <AppLogo />
                            </span>
                            <span>
                                <span className="block text-sm font-bold tracking-tight">
                                    Vendoria
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    Panel Admin
                                </span>
                            </span>
                        </Link>
                        <span className="rounded-full border border-primary/15 bg-background/70 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                            Ruang kendali
                        </span>
                    </div>
                    <nav
                        aria-label="Navigasi admin"
                        className="flex flex-wrap gap-2"
                    >
                        {items.map((item) => {
                            const active = item.exact
                                ? pathname === item.match
                                : pathname.startsWith(item.match);

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        active
                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                            : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </header>
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
        </div>
    );
}
