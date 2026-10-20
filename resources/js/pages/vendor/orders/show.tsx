import { Form, Head, Link } from '@inertiajs/react';
import VendorShell from '@/components/vendor-shell';
import vendorOrders from '@/routes/vendor/orders';
import { formatRupiah } from '@/types/marketplace';

type Order = {
    order_number: string;
    service_name_snapshot: string;
    package_name_snapshot: string | null;
    event_name: string;
    event_date: string;
    event_location: string;
    event_city: string;
    contact_name: string;
    contact_phone: string;
    quantity: number;
    notes: string | null;
    extras: Record<string, string> | null;
    price_estimate: string;
    price_final: string | null;
    price_note: string | null;
    vendor_note: string | null;
    cancel_reason: string | null;
    status: string;
    customer: { name: string };
    vendor_profile: { business_name: string };
    status_histories: Array<{
        id: number;
        from_status: string | null;
        to_status: string;
        note: string | null;
        created_at: string;
        changed_by: { name: string };
    }>;
};

type Status = { value: string; label: string };
type Props = {
    order: Order;
    statuses: Status[];
    dateConflict: boolean;
    whatsAppUrl: string | null;
};

export default function VendorOrderShow({ order, statuses, dateConflict, whatsAppUrl }: Props) {
    const changeUrl = vendorOrders.status(order.order_number);
    const statusLabel = statuses.find(({ value }) => value === order.status)?.label ?? order.status;

    return (
        <VendorShell title={`Pesanan ${order.order_number}`}>
            <Head title={`Pesanan ${order.order_number}`} />
            <main className="mx-auto max-w-5xl space-y-7">
                <div>
                    <Link href={vendorOrders.index()} className="text-sm text-primary hover:underline">Kembali ke daftar pesanan</Link>
                    <h2 className="mt-3 text-3xl font-semibold">{order.order_number}</h2>
                    <p className="mt-2 text-muted-foreground">{statusLabel} · Customer {order.customer.name}</p>
                </div>

                {dateConflict && order.status === 'pending' && (
                    <div role="status" className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
                        Perhatian: sudah ada pesanan terkonfirmasi pada tanggal ini. Periksa jadwal sebelum menerima.
                    </div>
                )}

                <section className="grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-2">
                    <div>
                        <h3 className="font-semibold">Detail acara</h3>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <Row label="Layanan" value={order.service_name_snapshot} />
                            <Row label="Paket" value={order.package_name_snapshot ?? 'Harga dasar layanan'} />
                            <Row label="Nama acara" value={order.event_name} />
                            <Row label="Tanggal" value={formatDate(order.event_date)} />
                            <Row label="Lokasi" value={`${order.event_location}, ${order.event_city}`} />
                            <Row label="Kontak" value={`${order.contact_name} · ${order.contact_phone}`} />
                            <Row label="Jumlah" value={String(order.quantity)} />
                            {order.notes && <Row label="Catatan customer" value={order.notes} />}
                            {order.extras && Object.entries(order.extras).map(([key, value]) => <Row key={key} label={key} value={value} />)}
                        </dl>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <h3 className="font-semibold">Harga</h3>
                            <dl className="mt-4 grid gap-3 text-sm">
                                <Row label="Estimasi" value={formatRupiah(order.price_estimate)} />
                                {order.price_final && <Row label="Harga final" value={formatRupiah(order.price_final)} />}
                                {order.price_note && <Row label="Catatan harga" value={order.price_note} />}
                                {order.vendor_note && <Row label="Catatan vendor" value={order.vendor_note} />}
                                {order.cancel_reason && <Row label="Alasan pembatalan" value={order.cancel_reason} />}
                            </dl>
                        </div>
                        {whatsAppUrl && <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-md border px-4 font-medium hover:bg-muted">Hubungi customer via WhatsApp</a>}
                        {order.status === 'pending' && (
                            <div className="grid gap-4 border-t pt-5">
                                <Form {...vendorOrders.status.form(order.order_number)} className="grid gap-3">
                                    <input type="hidden" name="status" value="confirmed" />
                                    <label className="grid gap-2 text-sm font-medium">
                                        Harga final
                                        <input name="price_final" type="number" min="0" step="0.01" defaultValue={order.price_estimate} required className="h-10 rounded-md border bg-background px-3 font-normal" />
                                    </label>
                                    <label className="grid gap-2 text-sm font-medium">
                                        Catatan harga (opsional)
                                        <textarea name="price_note" maxLength={2000} className="rounded-md border bg-background p-3 font-normal" />
                                    </label>
                                    <button className="h-10 rounded-md bg-primary px-4 font-semibold text-primary-foreground">Terima pesanan</button>
                                </Form>
                                <Form {...vendorOrders.status.form(order.order_number)} className="grid gap-3">
                                    <input type="hidden" name="status" value="rejected" />
                                    <label className="grid gap-2 text-sm font-medium">
                                        Alasan penolakan
                                        <textarea name="vendor_note" required maxLength={2000} className="rounded-md border bg-background p-3 font-normal" />
                                    </label>
                                    <button className="h-10 rounded-md border border-destructive px-4 font-semibold text-destructive">Tolak pesanan</button>
                                </Form>
                            </div>
                        )}
                        {order.status === 'confirmed' && (
                            <div className="grid gap-3 border-t pt-5">
                                <StatusForm url={changeUrl.url} status="in_progress" label="Mulai proses" />
                                <Form {...vendorOrders.status.form(order.order_number)} className="grid gap-3">
                                    <input type="hidden" name="status" value="cancelled" />
                                    <label className="grid gap-2 text-sm font-medium">
                                        Alasan pembatalan (wajib)
                                        <textarea name="cancel_reason" required maxLength={2000} className="rounded-md border bg-background p-3 font-normal" />
                                    </label>
                                    <button className="h-10 rounded-md border border-destructive px-4 font-semibold text-destructive">Batalkan pesanan</button>
                                </Form>
                            </div>
                        )}
                        {order.status === 'in_progress' && <StatusForm url={changeUrl.url} status="completed" label="Tandai selesai" />}
                    </div>
                </section>

                <section className="rounded-xl border bg-card p-6">
                    <h3 className="font-semibold">Riwayat status</h3>
                    <ol className="mt-5 space-y-5">
                        {order.status_histories.map((history) => (
                            <li key={history.id} className="border-l-2 border-primary/30 pl-4">
                                <p className="font-medium">{statuses.find(({ value }) => value === history.to_status)?.label ?? history.to_status}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{history.changed_by.name} · {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(history.created_at))}</p>
                                {history.note && <p className="mt-1 text-sm">{history.note}</p>}
                            </li>
                        ))}
                    </ol>
                </section>
            </main>
        </VendorShell>
    );
}

function StatusForm({ url, status, label }: { url: string; status: string; label: string }) {
    return (
        <Form action={url} method="patch" className="contents">
            <input type="hidden" name="status" value={status} />
            <button className="h-10 rounded-md bg-primary px-4 font-semibold text-primary-foreground">{label}</button>
        </Form>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="whitespace-pre-line">{value}</dd>
        </div>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' })
        .format(new Date(`${value.slice(0, 10)}T12:00:00`));
}
