import { Form, Head, Link } from '@inertiajs/react';
import VendorShell from '@/components/vendor-shell';
import vendorOrders from '@/routes/vendor/orders';
import { formatRupiah } from '@/types/marketplace';

type Order = {
    order_number: string;
    service_name_snapshot: string;
    event_name: string;
    event_date: string;
    contact_name: string;
    price_estimate: string;
    price_final: string | null;
    status: string;
    customer: { name: string };
    service: { name: string };
};

type Status = { value: string; label: string };
type Props = {
    orders: {
        data: Order[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { status?: string; q?: string; event_date?: string };
    statuses: Status[];
};

export default function VendorOrdersIndex({
    orders,
    filters,
    statuses,
}: Props) {
    return (
        <VendorShell title="Pesanan Vendor">
            <Head title="Pesanan Vendor" />
            <main className="space-y-5">
                <div className="flex justify-end">
                    <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                        Mode Operasional Aktif
                    </span>
                </div>

                <Form
                    {...vendorOrders.index.form()}
                    method="get"
                    className="grid gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:grid-cols-3"
                >
                    <label className="grid gap-2 text-xs font-medium">
                        Nomor pesanan atau nama customer
                        <input
                            name="q"
                            defaultValue={filters.q}
                            placeholder="Cari pesanan..."
                            className="h-10 rounded-lg border-0 bg-secondary px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </label>
                    <label className="grid gap-2 text-xs font-medium">
                        Status transaksi
                        <select
                            name="status"
                            defaultValue={filters.status ?? ''}
                            className="h-10 rounded-lg border-0 bg-secondary px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <option value="">Semua status</option>
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="grid gap-2 text-xs font-medium">
                        Tanggal pelaksanaan
                        <input
                            type="date"
                            name="event_date"
                            defaultValue={filters.event_date}
                            className="h-10 rounded-lg border-0 bg-secondary px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                    </label>
                    <button className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98] sm:col-span-3 sm:justify-self-start">
                        Terapkan filter
                    </button>
                </Form>

                <nav
                    aria-label="Filter status pesanan"
                    className="flex flex-wrap gap-2"
                >
                    {[{ value: '', label: 'Semua' }, ...statuses].map(
                        (status) => {
                            const isActive =
                                (filters.status ?? '') === status.value;

                            return (
                                <Link
                                    key={status.value || 'all'}
                                    href={vendorOrders.index({
                                        query: status.value
                                            ? { status: status.value }
                                            : {},
                                    })}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-primary/10'}`}
                                >
                                    {status.label}
                                </Link>
                            );
                        },
                    )}
                </nav>

                {orders.data.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-card p-10 text-center">
                        <p className="font-medium">
                            Belum ada pesanan yang cocok.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.data.map((order) => (
                            <Link
                                key={order.order_number}
                                href={vendorOrders.show(order.order_number)}
                                className="grid gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:border-primary/30 hover:shadow-md sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                            >
                                <div>
                                    <p className="text-xs font-medium text-primary">
                                        {order.order_number} ·{' '}
                                        {order.customer.name}
                                    </p>
                                    <h3 className="mt-1 font-semibold tracking-tight">
                                        {order.event_name} ·{' '}
                                        {order.service_name_snapshot}
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
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
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
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
                        className="flex justify-center gap-2"
                        aria-label="Halaman pesanan"
                    >
                        {orders.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? vendorOrders.index()}
                                className={`rounded border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-card'} ${link.url ? '' : 'pointer-events-none opacity-50'}`}
                            >
                                {link.label
                                    .replace('&laquo;', '‹')
                                    .replace('&raquo;', '›')}
                            </Link>
                        ))}
                    </nav>
                )}
            </main>
        </VendorShell>
    );
}
