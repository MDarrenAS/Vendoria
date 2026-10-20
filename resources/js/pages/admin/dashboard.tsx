import { Head, Link } from '@inertiajs/react';
import AdminShell from '@/components/admin-shell';
import orders from '@/routes/admin/orders';
import users from '@/routes/admin/users';
import vendors from '@/routes/admin/vendors';

type Stats = {
    users: number;
    vendors: number;
    orders: number;
    ordersByStatus: Array<{ value: string; label: string; total: number }>;
};

export default function AdminDashboard({ stats }: { stats: Stats }) {
    return (
        <AdminShell title="Panel Admin">
            <Head title="Panel Admin" />
            <main className="space-y-6">
                <div>
                    <h2 className="text-3xl font-semibold">Ringkasan operasional</h2>
                    <p className="mt-2 text-muted-foreground">Pantau pengguna, vendor, dan pesanan Vendoria.</p>
                </div>
                <section className="grid gap-4 sm:grid-cols-3" aria-label="Statistik utama">
                    {[
                        { label: 'Pengguna', value: stats.users, href: users.index() },
                        { label: 'Vendor', value: stats.vendors, href: vendors.index() },
                        { label: 'Pesanan', value: stats.orders, href: orders.index() },
                    ].map((stat) => (
                        <Link key={stat.label} href={stat.href} className="rounded-xl border bg-card p-5 transition hover:border-primary">
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="mt-2 text-3xl font-semibold">{stat.value.toLocaleString('id-ID')}</p>
                        </Link>
                    ))}
                </section>
                <section className="rounded-xl border bg-card p-5">
                    <h3 className="text-lg font-semibold">Pesanan berdasarkan status</h3>
                    <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.ordersByStatus.map((status) => (
                            <div key={status.value} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 p-3">
                                <dt className="text-sm">{status.label}</dt>
                                <dd className="font-semibold">{status.total.toLocaleString('id-ID')}</dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </main>
        </AdminShell>
    );
}
