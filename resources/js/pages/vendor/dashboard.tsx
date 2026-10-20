import { Head, Link } from '@inertiajs/react';
import VendorShell from '@/components/vendor-shell';
import { edit as serviceEdit, index as servicesIndex } from '@/routes/vendor/services';
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
    notifications: Array<{ id: string; data: { message?: string }; created_at: string }>;
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
                <div>
                    <h2 className="text-3xl font-semibold">Ringkasan Usaha</h2>
                    <p className="mt-2 text-muted-foreground">Pantau performa layanan dan pesanan terbaru.</p>
                </div>

                {stats.staleOrders > 0 && (
                    <div role="alert" className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
                        Ada {stats.staleOrders} pesanan menunggu konfirmasi lebih dari 24 jam.
                    </div>
                )}

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-label="Statistik usaha">
                    {[
                        ['Pesanan menunggu', stats.pendingOrders],
                        ['Pesanan bulan ini', stats.monthlyOrders],
                        ['Layanan aktif', stats.activeServices],
                        ['Pendapatan selesai', formatRupiah(stats.monthlyRevenue)],
                        ['Rating', `${Number(stats.ratingAverage).toFixed(1)} (${stats.ratingCount})`],
                    ].map(([label, value]) => (
                        <article key={label} className="rounded-xl border bg-card p-5">
                            <p className="text-sm text-muted-foreground">{label}</p>
                            <p className="mt-2 text-2xl font-semibold">{value}</p>
                        </article>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                    <div className="space-y-4 rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold">Menunggu konfirmasi</h3>
                            <Link href={vendorOrders.index()} className="text-sm text-primary hover:underline">Semua pesanan</Link>
                        </div>
                        {pendingOrders.length === 0 ? (
                            <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">Belum ada pesanan baru.</p>
                        ) : (
                            <ul className="divide-y">
                                {pendingOrders.map((order) => (
                                    <li key={order.order_number} className="flex flex-wrap items-center justify-between gap-3 py-4">
                                        <div>
                                            <p className="font-medium">{order.order_number} · {order.event_name}</p>
                                            <p className="text-sm text-muted-foreground">{order.customer.name} · {order.service.name} · {order.event_date.slice(0, 10)}</p>
                                        </div>
                                        <Link href={vendorOrders.show(order.order_number)} className="text-sm font-medium text-primary hover:underline">Lihat</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="space-y-4 rounded-xl border bg-card p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold">Layanan</h3>
                            <Link href={servicesIndex()} className="text-sm text-primary hover:underline">Kelola</Link>
                        </div>
                        {services.length === 0 ? (
                            <p className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">Tambahkan layanan pertama Anda.</p>
                        ) : (
                            <ul className="divide-y">
                                {services.map((service) => (
                                    <li key={service.id} className="flex items-center justify-between gap-3 py-3">
                                        <div>
                                            <p className="font-medium">{service.name}</p>
                                            <p className="text-sm text-muted-foreground">{service.category.name} · {formatRupiah(service.base_price)}</p>
                                        </div>
                                        <Link href={serviceEdit(service.slug)} className="text-sm text-primary hover:underline">Ubah</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                <section className="rounded-xl border bg-card p-5">
                    <h3 className="text-lg font-semibold">Notifikasi terbaru</h3>
                    {notifications.length === 0 ? (
                        <p className="mt-3 text-sm text-muted-foreground">Belum ada notifikasi baru.</p>
                    ) : (
                        <ul className="mt-3 divide-y">
                            {notifications.map((notification) => (
                                <li key={notification.id} className="py-3 text-sm">
                                    {notification.data.message ?? 'Ada pembaruan untuk usaha Anda.'}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </VendorShell>
    );
}
