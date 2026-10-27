import { Form, Head, Link } from '@inertiajs/react';
import { index as ordersIndex, show as orderShow } from '@/routes/orders';
import { formatRupiah } from '@/types/marketplace';

type Order = {
    order_number: string;
    service_name_snapshot: string;
    event_date: string;
    price_estimate: string;
    price_final: string | null;
    status: string;
    vendor_profile: { business_name: string };
};

type Pagination = {
    data: Order[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    total: number;
};

type Props = {
    orders: Pagination;
    filters: { status?: string; q?: string };
    statuses: Array<{ value: string; label: string }>;
};

export default function CustomerOrders({ orders, filters, statuses }: Props) {
    const statusFilters = [
        { value: '', label: 'Semua Pesanan' },
        ...statuses.map(({ value, label }) => ({ value, label })),
    ];

    return (
        <>
            <Head title="Pesanan Saya" />
            <main className="mx-auto max-w-[1080px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                        Aktivitas transaksi
                    </p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight">
                        Pesanan Saya
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                        Pantau permintaan dan konfirmasi dari vendor serta
                        kelola jadwal acara Anda secara real-time.
                    </p>
                </div>

                <nav
                    aria-label="Filter status pesanan"
                    className="flex flex-wrap gap-2"
                >
                    {statusFilters.map((status) => {
                        const isActive =
                            (filters.status ?? '') === status.value;

                        return (
                            <Link
                                key={status.value || 'all'}
                                href={ordersIndex({
                                    query: status.value
                                        ? { status: status.value }
                                        : {},
                                })}
                                aria-current={isActive ? 'page' : undefined}
                                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary text-foreground hover:bg-primary/10'}`}
                            >
                                {status.label}
                            </Link>
                        );
                    })}
                </nav>

                <Form
                    {...ordersIndex.form()}
                    method="get"
                    className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_210px_auto]"
                >
                    <input
                        name="q"
                        defaultValue={filters.q}
                        placeholder="Cari nomor pesanan"
                        className="h-10 rounded-lg border-0 bg-secondary px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <select
                        name="status"
                        defaultValue={filters.status ?? ''}
                        className="h-10 rounded-lg border-0 bg-secondary px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">Semua status</option>
                        {statuses.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                    <button className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98]">
                        Terapkan
                    </button>
                </Form>

                {orders.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
                        <p className="font-medium">
                            Belum ada pesanan yang cocok.
                        </p>
                        <Link
                            href="/vendors"
                            className="mt-3 inline-block text-primary hover:underline"
                        >
                            Cari vendor
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.data.map((order) => (
                            <Link
                                key={order.order_number}
                                href={orderShow(order.order_number)}
                                className="grid gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:border-primary/30 hover:shadow-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                            >
                                <div>
                                    <p className="text-xs font-medium text-primary">
                                        {order.order_number}
                                    </p>
                                    <h2 className="mt-1 font-semibold tracking-tight">
                                        {order.service_name_snapshot}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {order.vendor_profile.business_name} ·{' '}
                                        {new Intl.DateTimeFormat('id-ID', {
                                            dateStyle: 'long',
                                            timeZone: 'Asia/Jakarta',
                                        }).format(
                                            new Date(
                                                `${order.event_date.slice(0, 10)}T12:00:00`,
                                            ),
                                        )}
                                    </p>
                                </div>
                                <div className="sm:text-right">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : order.status === 'rejected' || order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'}`}
                                    >
                                        {statuses.find(
                                            ({ value }) =>
                                                value === order.status,
                                        )?.label ?? order.status}
                                    </span>
                                    <p className="mt-2 text-lg font-bold tracking-tight">
                                        {formatRupiah(
                                            order.price_final ??
                                                order.price_estimate,
                                        )}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {orders.links.length > 3 && (
                    <nav
                        aria-label="Halaman pesanan"
                        className="flex flex-wrap justify-center gap-2"
                    >
                        {orders.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? ordersIndex.url()}
                                className={`rounded-md border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-card'} ${link.url === null ? 'pointer-events-none opacity-50' : ''}`}
                                aria-current={link.active ? 'page' : undefined}
                            >
                                {link.label
                                    .replace('&laquo;', '‹')
                                    .replace('&raquo;', '›')}
                            </Link>
                        ))}
                    </nav>
                )}
            </main>
        </>
    );
}
