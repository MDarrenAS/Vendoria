import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AppLogo from '@/components/app-logo';
import vendor from '@/routes/vendor';
import { index as notificationsIndex } from '@/routes/notifications';
import vendorOrders from '@/routes/vendor/orders';
import vendorReviews from '@/routes/vendor/reviews';

export default function VendorShell({
    children,
    title,
}: {
    children: ReactNode;
    title: string;
}) {
    const pathname = usePage().url.split('?')[0];
    const items = [
        {
            label: 'Dashboard',
            href: vendor.dashboard(),
            match: '/vendor',
            exact: true,
        },
        {
            label: 'Pesanan',
            href: vendorOrders.index(),
            match: '/vendor/orders',
        },
        {
            label: 'Ulasan',
            href: vendorReviews.index(),
            match: '/vendor/reviews',
        },
        {
            label: 'Layanan',
            href: vendor.services.index(),
            match: '/vendor/services',
        },
        {
            label: 'Ketersediaan',
            href: vendor.availability.index(),
            match: '/vendor/availability',
        },
        {
            label: 'Profil Usaha',
            href: vendor.profile.edit(),
            match: '/vendor/profile',
        },
    ];

    return (
        <div className="min-h-screen bg-background/80">
            <header className="border-b border-brand-200/60 bg-gradient-to-r from-brand-50 via-background to-amber-50/70">
                <div className="mx-auto grid max-w-7xl gap-4 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href={vendor.dashboard()}
                            className="flex items-center gap-3"
                        >
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-100 ring-1 ring-brand-200">
                                <AppLogo />
                            </span>
                            <span>
                                <span className="block text-sm font-bold tracking-tight">
                                    Vendoria
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    Ruang Vendor
                                </span>
                            </span>
                        </Link>
                        <Link
                            href={notificationsIndex()}
                            className="rounded-full border border-brand-200 bg-background/70 px-4 py-2 text-sm font-semibold text-brand-800 shadow-sm transition hover:bg-brand-50"
                        >
                            Notifikasi
                        </Link>
                    </div>
                    <nav
                        aria-label="Navigasi vendor"
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
                                            ? 'bg-brand-600 text-white shadow-md shadow-brand-900/15'
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
        </div>
    );
}
