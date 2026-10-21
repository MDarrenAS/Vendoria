import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    CircleDollarSign,
    ClipboardList,
    Star,
    Store,
} from 'lucide-react';
import VendorShell from '@/components/vendor-shell';
import {
    edit as serviceEdit,
    index as servicesIndex,
} from '@/routes/vendor/services';
import vendorOrders from '@/routes/vendor/orders';
import { formatRupiah } from '@/types/marketplace';

type Order = {
    order_number: string;
    event_name: string;
    event_date: string;
    service: { name: string; slug: string };
    customer: { name: string };
};

type Service = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    base_price: string;
    category: { name: string };
};

type Props = {
    stats: {
        pendingOrders: number;
        monthlyOrders: number;
        activeServices: number;
        monthlyRevenue: string;
        ratingAverage: string;
        ratingCount: number;
        staleOrders: number;
    };
    pendingOrders: Order[];
    services: Service[];
    notifications: Array<{
        id: string;
        data: { message?: string };
        created_at: string;
    }>;
};

export default function VendorDashboard({
    stats,
    pendingOrders,
    services,
    notifications,
}: Props) {
    return (
        <VendorShell title="Dashboard Vendor">
            <Head title="Dashboard Vendor" />
            <main className="space-y-8">
                <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-brand-950 via-brand-800 to-brand-700 p-7 text-white shadow-xl shadow-brand-950/15 md:p-9">
                    <span
                        aria-hidden="true"
                        className="absolute -right-12 -bottom-32 size-72 rounded-full bg-amber-300/20 blur-2xl"
                    />
                    <p className="relative text-sm font-bold tracking-wide text-white/75">
                        RUANG USAHAMU
                    </p>
                    <h2 className="relative mt-2 text-3xl font-bold tracking-tight">
                        Selamat datang kembali.
                    </h2>
                    <p className="relative mt-2 max-w-2xl text-white/80">
                        Pantau performa layanan dan pesanan terbaru dalam satu
                        tempat.
                    </p>
                </div>

                {stats.staleOrders > 0 && (
                    <div
                        role="alert"
                        className="rounded-2xl border border-amber-500/40 bg-amber-100/80 p-4 text-sm font-medium text-amber-950"
                    >
                        Ada {stats.staleOrders} pesanan menunggu konfirmasi
                        lebih dari 24 jam.
                    </div>
                )}

                <section
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
                    aria-label="Statistik usaha"
                >
                    {[
                        {
                            label: 'Pesanan menunggu',
                            value: stats.pendingOrders,
                            icon: ClipboardList,
                            color: 'bg-brand-100 text-brand-800',
                        },
                        {
                            label: 'Pesanan bulan ini',
                            value: stats.monthlyOrders,
                            icon: CalendarDays,
                            color: 'bg-sky-100 text-sky-700',
                        },
                        {
                            label: 'Layanan aktif',
                            value: stats.activeServices,
                            icon: Store,
                            color: 'bg-teal-100 text-teal-700',
                        },
                        {
                            label: 'Pendapatan selesai',
                            value: formatRupiah(stats.monthlyRevenue),
                            icon: CircleDollarSign,
                            color: 'bg-amber-100 text-amber-800',
                        },
                        {
                            label: 'Rating',
                            value: `${Number(stats.ratingAverage).toFixed(1)} (${stats.ratingCount})`,
                            icon: Star,
                            color: 'bg-accent-50 text-accent-ink',
                        },
                    ].map((stat) => (
                        <article
                            key={stat.label}
                            className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <span
                                className={`mb-4 flex size-10 items-center justify-center rounded-xl ${stat.color}`}
                            >
                                <stat.icon className="size-5" />
                            </span>
                            <p className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </p>
                            <p className="mt-2 text-2xl font-bold tracking-tight">
                                {stat.value}
                            </p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                    <div className="space-y-4 rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold">
                                Menunggu konfirmasi
                            </h3>
                            <Link
                                href={vendorOrders.index()}
                                className="text-sm font-semibold text-primary hover:underline"
                            >
                                Semua pesanan
                            </Link>
                        </div>
                        {pendingOrders.length === 0 ? (
                            <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                                Belum ada pesanan baru.
                            </p>
                        ) : (
                            <ul className="divide-y">
                                {pendingOrders.map((order) => (
                                    <li
                                        key={order.order_number}
                                        className="flex flex-wrap items-center justify-between gap-3 py-4"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {order.order_number} ·{' '}
                                                {order.event_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.customer.name} ·{' '}
                                                {order.service.name} ·{' '}
                                                {order.event_date.slice(0, 10)}
                                            </p>
                                        </div>
                                        <Link
                                            href={vendorOrders.show(
                                                order.order_number,
                                            )}
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Lihat
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="space-y-4 rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-bold">Layanan</h3>
                            <Link
                                href={servicesIndex()}
                                className="text-sm font-semibold text-primary hover:underline"
                            >
                                Kelola
                            </Link>
                        </div>
                        {services.length === 0 ? (
                            <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                                Tambahkan layanan pertama Anda.
                            </p>
                        ) : (
                            <ul className="divide-y">
                                {services.map((service) => (
                                    <li
                                        key={service.id}
                                        className="flex items-center justify-between gap-3 py-3"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {service.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {service.category.name} ·{' '}
                                                {formatRupiah(
                                                    service.base_price,
                                                )}
                                            </p>
                                        </div>
                                        <Link
                                            href={serviceEdit(service.slug)}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Ubah
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                    <h3 className="text-lg font-bold">Notifikasi terbaru</h3>
                    {notifications.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">
                            Belum ada notifikasi baru.
                        </p>
                    ) : (
                        <ul className="mt-3 divide-y">
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className="py-3 text-sm"
                                >
                                    {notification.data.message ??
                                        'Ada pembaruan untuk usaha Anda.'}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </VendorShell>
    );
}
