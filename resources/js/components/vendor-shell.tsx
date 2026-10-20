import { Link } from '@inertiajs/react';
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
    const items = [
        { label: 'Dashboard', href: vendor.dashboard() },
        { label: 'Pesanan', href: vendorOrders.index() },
        { label: 'Ulasan', href: vendorReviews.index() },
        { label: 'Layanan', href: vendor.services.index() },
        { label: 'Ketersediaan', href: vendor.availability.index() },
        { label: 'Profil Usaha', href: vendor.profile.edit() },
    ];

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="border-b bg-background">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3">
                    <Link href={vendor.dashboard()} className="flex items-center gap-2">
                        <AppLogo />
                        <span className="sr-only">Kembali ke dashboard vendor</span>
                    </Link>
                    <nav aria-label="Navigasi vendor" className="flex flex-wrap gap-2">
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
                    <Link href={notificationsIndex()} className="text-sm font-medium text-primary hover:underline">
                        Notifikasi
                    </Link>
                </div>
            </header>
            <div className="mx-auto max-w-7xl px-5 py-8">
                <h1 className="sr-only">{title}</h1>
                {children}
            </div>
        </div>
    );
}
