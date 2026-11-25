import { Head, Link, router } from '@inertiajs/react';
import {
    Banknote,
    ClipboardList,
    Store,
    TrendingUp,
    UsersRound,
} from 'lucide-react';
import AdminShell from '@/components/admin-shell';
import admin from '@/routes/admin';
import orders from '@/routes/admin/orders';
import users from '@/routes/admin/users';
import vendors from '@/routes/admin/vendors';
import { formatRupiah } from '@/types/marketplace';

type Stats = {
    users: number;
    vendors: number;
    orders: number;
    totalEarnings: number;
    periodEarnings: number;
    periodPaidOrders: number;
    periodTransactionVolume: number;
    ordersByStatus: Array<{ value: string; label: string; total: number }>;
};

const periodOptions = [
    { value: 'all', label: 'Semua waktu' },
    { value: 'month', label: 'Bulan ini' },
    { value: '30d', label: '30 hari' },
    { value: '7d', label: '7 hari' },
    { value: 'today', label: 'Hari ini' },
];

export default function AdminDashboard({
    stats,
    period = 'all',
}: {
    stats: Stats;
    period?: string;
}) {
    function changePeriod(nextPeriod: string) {
        router.get(
            admin.dashboard.url(),
            nextPeriod === 'all' ? {} : { period: nextPeriod },
            { preserveState: true, preserveScroll: true },
        );
    }

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
                        Pantau aktivitas pengguna, vendor, pesanan, dan
                        pendapatan biaya admin 3% di marketplace Vendoria.
                    </p>
                </div>

                <section
                    aria-label="Pendapatan admin"
                    className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm md:p-7"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-5">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                <Banknote className="size-5" />
                            </span>
                            <div>
                                <h3 className="text-lg font-bold">
                                    Pendapatan Admin (Biaya Admin 3%)
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Hanya menghitung biaya admin 3% dari
                                    transaksi lunas (tidak termasuk pesanan
                                    batal/ditolak).
                                </p>
                            </div>
                        </div>
                        <div
                            role="group"
                            aria-label="Filter periode pendapatan"
                            className="flex flex-wrap gap-1.5 rounded-xl bg-secondary p-1"
                        >
                            {periodOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => changePeriod(option.value)}
                                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                        period === option.value
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                            <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
                                Pendapatan Admin
                            </p>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-950">
                                {formatRupiah(stats.periodEarnings)}
                            </p>
                            <p className="mt-1 text-xs text-emerald-800/80">
                                Total sepanjang waktu:{' '}
                                {formatRupiah(stats.totalEarnings)}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-5">
                            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                Nilai Layanan Terbayar (Vendor)
                            </p>
                            <p className="mt-2 text-2xl font-bold tracking-tight">
                                {formatRupiah(stats.periodTransactionVolume)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                100% diteruskan ke vendor
                            </p>
                        </div>
                        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-5">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    Transaksi Lunas
                                </p>
                                <TrendingUp className="size-4 text-primary" />
                            </div>
                            <p className="mt-2 text-2xl font-bold tracking-tight">
                                {stats.periodPaidOrders.toLocaleString('id-ID')}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Pesanan berstatus lunas & aktif
                            </p>
                        </div>
                    </div>
                </section>

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
