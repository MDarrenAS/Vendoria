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
    return (
        <>
            <Head title="Pesanan Saya" />
            <main className="mx-auto max-w-6xl space-y-7 px-5 py-10">
                <div>
                    <h1 className="text-3xl font-semibold">Pesanan Saya</h1>
                    <p className="mt-2 text-muted-foreground">
                        Pantau permintaan dan konfirmasi dari vendor.
                    </p>
                </div>

                <Form
                    {...ordersIndex.form()}
                    method="get"
                    className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_220px_auto]"
                >
                    <input
                        name="q"
                        defaultValue={filters.q}
                        placeholder="Cari nomor pesanan"
                        className="h-10 rounded-md border bg-background px-3 text-sm"
                    />
                    <select
                        name="status"
                        defaultValue={filters.status ?? ''}
                        className="h-10 rounded-md border bg-background px-3 text-sm"
                    >
                        <option value="">Semua status</option>
                        {statuses.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                    <button className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground">
                        Terapkan
                    </button>
                </Form>

                {orders.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                        <p className="font-medium">Belum ada pesanan yang cocok.</p>
                        <Link href="/vendors" className="mt-3 inline-block text-primary hover:underline">
                            Cari vendor
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.data.map((order) => (
                            <Link
                                key={order.order_number}
                                href={orderShow(order.order_number)}
                                className="grid gap-3 rounded-xl border bg-card p-5 transition hover:border-primary/50 sm:grid-cols-[1fr_auto] sm:items-center"
                            >
                                <div>
                                    <p className="text-sm text-muted-foreground">{order.order_number}</p>
                                    <h2 className="mt-1 font-semibold">{order.service_name_snapshot}</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {order.vendor_profile.business_name} · {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(`${order.event_date.slice(0, 10)}T12:00:00`))}
                                    </p>
                                </div>
                                <div className="sm:text-right">
                                    <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">{statuses.find(({ value }) => value === order.status)?.label ?? order.status}</span>
                                    <p className="mt-2 font-semibold">{formatRupiah(order.price_final ?? order.price_estimate)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {orders.links.length > 3 && (
                    <nav aria-label="Halaman pesanan" className="flex flex-wrap justify-center gap-2">
                        {orders.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? ordersIndex.url()}
                                className={`rounded-md border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-card'} ${link.url === null ? 'pointer-events-none opacity-50' : ''}`}
                                aria-current={link.active ? 'page' : undefined}
                            >
                                {link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}
                            </Link>
                        ))}
                    </nav>
                )}
            </main>
        </>
    );
}
