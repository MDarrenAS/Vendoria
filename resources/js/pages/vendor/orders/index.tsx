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
    orders: { data: Order[]; links: Array<{ url: string | null; label: string; active: boolean }> };
    filters: { status?: string; q?: string; event_date?: string };
    statuses: Status[];
};

export default function VendorOrdersIndex({ orders, filters, statuses }: Props) {
    return (
        <VendorShell title="Pesanan Vendor">
            <Head title="Pesanan Vendor" />
            <main className="space-y-6">
                <div>
                    <h2 className="text-3xl font-semibold">Pesanan</h2>
                    <p className="mt-2 text-muted-foreground">Kelola permintaan dan jadwal layanan dari customer.</p>
                </div>

                <Form {...vendorOrders.index.form()} method="get" className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-3">
                    <input name="q" defaultValue={filters.q} placeholder="Nomor pesanan atau nama customer" className="h-10 rounded-md border bg-background px-3 text-sm" />
                    <select name="status" defaultValue={filters.status ?? ''} className="h-10 rounded-md border bg-background px-3 text-sm">
                        <option value="">Semua status</option>
                        {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                    <input type="date" name="event_date" defaultValue={filters.event_date} className="h-10 rounded-md border bg-background px-3 text-sm" />
                    <button className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground sm:col-span-3 sm:justify-self-end">Terapkan filter</button>
                </Form>

                {orders.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                        <p className="font-medium">Belum ada pesanan yang cocok.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.data.map((order) => (
                            <Link key={order.order_number} href={vendorOrders.show(order.order_number)} className="grid gap-3 rounded-xl border bg-card p-5 transition hover:border-primary/50 sm:grid-cols-[1fr_auto] sm:items-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">{order.order_number} · {order.customer.name}</p>
                                    <h3 className="mt-1 font-semibold">{order.event_name} · {order.service_name_snapshot}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(`${order.event_date.slice(0, 10)}T12:00:00`))}</p>
                                </div>
                                <div className="sm:text-right">
                                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{statuses.find(({ value }) => value === order.status)?.label ?? order.status}</span>
                                    <p className="mt-2 font-semibold">{formatRupiah(order.price_final ?? order.price_estimate)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {orders.links.length > 3 && (
                    <nav className="flex justify-center gap-2" aria-label="Halaman pesanan">
                        {orders.links.map((link, index) => (
                            <Link key={`${link.label}-${index}`} href={link.url ?? vendorOrders.index()} className={`rounded border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-card'} ${link.url ? '' : 'pointer-events-none opacity-50'}`}>
                                {link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}
                            </Link>
                        ))}
                    </nav>
                )}
            </main>
        </VendorShell>
    );
}
