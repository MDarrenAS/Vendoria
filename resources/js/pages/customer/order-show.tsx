import { Form, Head, Link, useForm } from '@inertiajs/react';
import { store as storeReview } from '@/actions/App/Http/Controllers/Customer/ReviewController';
import { index as ordersIndex, cancel as cancelOrder } from '@/routes/orders';
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
    price_estimate: string;
    price_final: string | null;
    price_note: string | null;
    vendor_note: string | null;
    cancel_reason: string | null;
    status: string;
    created_at: string;
    review: { rating: number; comment: string | null; created_at: string } | null;
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

const statusLabels: Record<string, string> = {
    pending: 'Menunggu Konfirmasi',
    confirmed: 'Dikonfirmasi',
    in_progress: 'Sedang Diproses',
    completed: 'Selesai',
    rejected: 'Ditolak',
    cancelled: 'Dibatalkan',
};

export default function CustomerOrderShow({
    order,
    whatsAppUrl,
}: {
    order: Order;
    whatsAppUrl: string | null;
}) {
    const form = useForm({ cancel_reason: '' });

    function cancel(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.delete(cancelOrder(order.order_number).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={`Pesanan ${order.order_number}`} />
            <main className="mx-auto max-w-5xl space-y-8 px-5 py-10">
                <div>
                    <Link href={ordersIndex()} className="text-sm text-primary hover:underline">
                        Pesanan Saya
                    </Link>
                    <h1 className="mt-3 text-3xl font-semibold">
                        {order.order_number}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {statusLabels[order.status] ?? order.status} ·{' '}
                        {order.vendor_profile.business_name}
                    </p>
                </div>

                <section className="grid gap-6 rounded-xl border bg-card p-6 md:grid-cols-2">
                    <div>
                        <h2 className="font-semibold">Detail acara</h2>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <div><dt className="text-muted-foreground">Layanan</dt><dd>{order.service_name_snapshot}</dd></div>
                            <div><dt className="text-muted-foreground">Paket</dt><dd>{order.package_name_snapshot ?? 'Harga dasar layanan'}</dd></div>
                            <div><dt className="text-muted-foreground">Nama acara</dt><dd>{order.event_name}</dd></div>
                            <div><dt className="text-muted-foreground">Tanggal</dt><dd>{new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(`${order.event_date}T12:00:00`))}</dd></div>
                            <div><dt className="text-muted-foreground">Lokasi</dt><dd>{order.event_location}, {order.event_city}</dd></div>
                            <div><dt className="text-muted-foreground">Kontak</dt><dd>{order.contact_name} · {order.contact_phone}</dd></div>
                            {order.notes && <div><dt className="text-muted-foreground">Catatan</dt><dd className="whitespace-pre-line">{order.notes}</dd></div>}
                        </dl>
                    </div>
                    <div>
                        <h2 className="font-semibold">Ringkasan harga</h2>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Jumlah</dt><dd>{order.quantity}</dd></div>
                            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Estimasi</dt><dd>{formatRupiah(order.price_estimate)}</dd></div>
                            {order.price_final && <div className="flex justify-between gap-4 font-semibold"><dt>Harga final</dt><dd>{formatRupiah(order.price_final)}</dd></div>}
                            {order.price_note && <div><dt className="text-muted-foreground">Catatan harga</dt><dd>{order.price_note}</dd></div>}
                            {order.vendor_note && <div><dt className="text-muted-foreground">Catatan vendor</dt><dd>{order.vendor_note}</dd></div>}
                            {order.cancel_reason && <div><dt className="text-muted-foreground">Alasan pembatalan</dt><dd>{order.cancel_reason}</dd></div>}
                        </dl>
                        {whatsAppUrl && (
                            <a
                                href={whatsAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 font-medium text-primary-foreground"
                            >
                                Hubungi Vendor via WhatsApp
                            </a>
                        )}
                        {order.status === 'pending' && (
                            <form onSubmit={cancel} className="mt-6 grid gap-3 border-t pt-5">
                                <label htmlFor="cancel_reason" className="text-sm font-medium">Alasan pembatalan (opsional)</label>
                                <textarea
                                    id="cancel_reason"
                                    value={form.data.cancel_reason}
                                    onChange={(event) => form.setData('cancel_reason', event.target.value)}
                                    maxLength={1000}
                                    className="min-h-20 rounded-md border bg-background p-3 text-sm"
                                />
                                {form.errors.cancel_reason && <p role="alert" className="text-sm text-destructive">{form.errors.cancel_reason}</p>}
                                <button type="submit" disabled={form.processing} className="h-10 rounded-md border border-destructive px-4 font-medium text-destructive disabled:opacity-60">
                                    {form.processing ? 'Membatalkan...' : 'Batalkan Pesanan'}
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                <section className="rounded-xl border bg-card p-6">
                    <h2 className="font-semibold">Riwayat status</h2>
                    <ol className="mt-5 space-y-5">
                        {order.status_histories.map((history) => (
                            <li key={history.id} className="border-l-2 border-primary/30 pl-4">
                                <p className="font-medium">{statusLabels[history.to_status] ?? history.to_status}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {history.changed_by.name} · {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(history.created_at))}
                                </p>
                                {history.note && <p className="mt-1 text-sm">{history.note}</p>}
                            </li>
                        ))}
                    </ol>
                </section>
                {order.status === 'completed' && (
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="text-xl font-semibold">Ulasan layanan</h2>
                        {order.review ? (
                            <div className="mt-3">
                                <p className="font-medium">★ {order.review.rating}/5</p>
                                <p className="mt-2 whitespace-pre-line text-muted-foreground">{order.review.comment || 'Anda tidak menambahkan komentar.'}</p>
                            </div>
                        ) : (
                            <Form {...storeReview.form(order.order_number)} className="mt-4 grid gap-4">
                                {({ errors, processing }) => (
                                    <>
                                        <label htmlFor="rating" className="grid gap-2 text-sm font-medium">
                                            Nilai ulasan
                                            <select id="rating" name="rating" required defaultValue="5" className="h-10 rounded-md border bg-background px-3">
                                                <option value="5">5 - Sangat puas</option>
                                                <option value="4">4 - Puas</option>
                                                <option value="3">3 - Cukup</option>
                                                <option value="2">2 - Kurang puas</option>
                                                <option value="1">1 - Tidak puas</option>
                                            </select>
                                        </label>
                                        {errors.rating && <p role="alert" className="text-sm text-destructive">{errors.rating}</p>}
                                        <label htmlFor="review_comment" className="grid gap-2 text-sm font-medium">
                                            Ceritakan pengalaman Anda (opsional)
                                            <textarea id="review_comment" name="comment" maxLength={2000} className="min-h-24 rounded-md border bg-background p-3 font-normal" />
                                        </label>
                                        {errors.comment && <p role="alert" className="text-sm text-destructive">{errors.comment}</p>}
                                        {errors.order && <p role="alert" className="text-sm text-destructive">{errors.order}</p>}
                                        <button disabled={processing} className="h-10 w-fit rounded-md bg-primary px-4 font-medium text-primary-foreground disabled:opacity-60">
                                            {processing ? 'Mengirim ulasan...' : 'Kirim ulasan'}
                                        </button>
                                    </>
                                )}
                            </Form>
                        )}
                    </section>
                )}
            </main>
        </>
    );
}
