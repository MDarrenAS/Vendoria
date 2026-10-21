import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Store, UsersRound } from 'lucide-react';
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
                <div className="rounded-3xl bg-gradient-to-r from-brand-950 to-brand-800 p-7 text-white shadow-xl shadow-brand-950/15 md:p-9">
                    <p className="text-sm font-bold tracking-wide text-white/75">
                        PUSAT OPERASIONAL
                    </p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight">
                        Semua dalam kendali.
                    </h2>
                    <p className="mt-2 max-w-2xl text-white/80">
                        Pantau aktivitas pengguna, vendor, dan pesanan di
                        marketplace Vendoria.
                    </p>
                </div>
                <section
                    className="grid gap-4 sm:grid-cols-3"
                    aria-label="Statistik utama"
                >
                    {[
                        {
                            label: 'Pengguna',
                            value: stats.users,
                            href: users.index(),
                            icon: UsersRound,
                            color: 'from-brand-100 to-brand-50 text-brand-800',
                        },
                        {
                            label: 'Vendor',
                            value: stats.vendors,
                            href: vendors.index(),
                            icon: Store,
                            color: 'from-teal-100 to-teal-50 text-teal-700',
                        },
                        {
                            label: 'Pesanan',
                            value: stats.orders,
                            href: orders.index(),
                            icon: ClipboardList,
                            color: 'from-amber-100 to-amber-50 text-amber-800',
                        },
                    ].map((stat) => (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div
                                className={`flex items-center justify-between bg-gradient-to-br p-5 ${stat.color}`}
                            >
                                <span className="text-sm font-semibold">
                                    {stat.label}
                                </span>
                                <span className="flex size-10 items-center justify-center rounded-xl bg-white/70 shadow-sm">
                                    <stat.icon className="size-5" />
                                </span>
                            </div>
                            <div className="flex items-end justify-between p-5">
                                <p className="text-3xl font-bold tracking-tight">
                                    {stat.value.toLocaleString('id-ID')}
                                </p>
                                <span className="text-sm font-semibold text-primary transition group-hover:translate-x-1">
                                    Kelola →
                                </span>
                            </div>
                        </Link>
                    ))}
                </section>
                <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-7">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ClipboardList className="size-5" />
                        </span>
                        <div>
                            <h3 className="text-lg font-bold">
                                Pesanan berdasarkan status
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Ringkasan distribusi pesanan saat ini.
                            </p>
                        </div>
                    </div>
                    <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.ordersByStatus.map((status, index) => (
                            <div
                                key={status.value}
                                className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${
                                    [
                                        'border-brand-200 bg-brand-50/80',
                                        'border-amber-200 bg-amber-50/80',
                                        'border-teal-200 bg-teal-50/80',
                                    ][index % 3]
                                }`}
                            >
                                <dt className="text-sm">{status.label}</dt>
                                <dd className="text-lg font-bold">
                                    {status.total.toLocaleString('id-ID')}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </main>
        </AdminShell>
    );
}
