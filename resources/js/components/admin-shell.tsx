import { Link } from '@inertiajs/react';
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
        <nav className="flex flex-wrap justify-center gap-2" aria-label="Navigasi halaman">
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
    const items = [
        { label: 'Ringkasan', href: admin.dashboard() },
        { label: 'Vendor', href: vendors.index() },
        { label: 'Layanan', href: services.index() },
        { label: 'Kategori', href: categories.index() },
        { label: 'Pesanan', href: orders.index() },
        { label: 'Ulasan', href: reviews.index() },
        { label: 'Pengguna', href: users.index() },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="border-b bg-background">
                <div className="mx-auto grid max-w-7xl gap-4 px-5 py-4">
                    <Link href={admin.dashboard()} className="flex w-fit items-center gap-2">
                        <AppLogo />
                        <span className="text-sm font-semibold">Panel Admin</span>
                    </Link>
                    <nav aria-label="Navigasi admin" className="flex flex-wrap gap-2">
                        {items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>
            <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
                <h1 className="sr-only">{title}</h1>
                {children}
            </div>
        </div>
    );
}
