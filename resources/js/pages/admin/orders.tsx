import { Form, Head } from '@inertiajs/react';
import AdminShell, { AdminPagination, type PaginationLink } from '@/components/admin-shell';
import orders from '@/routes/admin/orders';

type Order = {
    order_number: string;
    event_name: string;
    event_date: string;
    price_estimate: string;
    price_final: string | null;
    status: string;
    customer: { name: string; email: string };
    vendor_profile: { business_name: string };
};

type Status = { value: string; label: string };

export default function AdminOrders({ orders: page, filters, statuses }: {
    orders: { data: Order[]; links: PaginationLink[] };
    filters: { q?: string; status?: string };
    statuses: Status[];
}) {
    return (
        <AdminShell title="Daftar pesanan">
            <Head title="Daftar pesanan" />
            <main className="space-y-5">
                <div>
                    <h2 className="text-3xl font-semibold">Pesanan</h2>
                    <p className="mt-2 text-muted-foreground">Daftar pesanan untuk kebutuhan operasional dan penelusuran.</p>
                </div>
                <Form {...orders.index.form()} method="get" className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_220px_auto]">
                    <input name="q" defaultValue={filters.q} maxLength={24} placeholder="Cari nomor pesanan" className="h-10 rounded-md border bg-background px-3 text-sm" />
                    <select name="status" defaultValue={filters.status ?? ''} className="h-10 rounded-md border bg-background px-3 text-sm">
                        <option value="">Semua status</option>
                        {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                    <button className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground">Cari</button>
                </Form>
                {page.data.length === 0 ? (
                    <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Tidak ada pesanan yang cocok.</p>
                ) : (
                    <div className="overflow-x-auto rounded-xl border bg-card">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground"><tr><th className="p-3">Nomor</th><th className="p-3">Customer</th><th className="p-3">Vendor</th><th className="p-3">Acara</th><th className="p-3">Tanggal</th><th className="p-3">Status</th></tr></thead>
                            <tbody>
                                {page.data.map((order) => (
                                    <tr key={order.order_number} className="border-t">
                                        <td className="p-3 font-medium">{order.order_number}</td>
                                        <td className="p-3">{order.customer.name}<span className="block text-muted-foreground">{order.customer.email}</span></td>
                                        <td className="p-3">{order.vendor_profile.business_name}</td>
                                        <td className="p-3">{order.event_name}</td>
                                        <td className="p-3">{new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' }).format(new Date(`${order.event_date.slice(0, 10)}T12:00:00`))}</td>
                                        <td className="p-3">{statuses.find(({ value }) => value === order.status)?.label ?? order.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <AdminPagination links={page.links} />
            </main>
        </AdminShell>
    );
}
