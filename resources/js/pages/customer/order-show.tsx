import { Form, Head, Link, useForm } from '@inertiajs/react';
import { Activity, Check, Clock3, X } from 'lucide-react';
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
    review: {
        rating: number;
        comment: string | null;
        created_at: string;
    } | null;
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
            <main className="mx-auto max-w-[1080px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <Link
                        href={ordersIndex()}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        ← Pesanan Saya
                    </Link>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight">
                        {order.order_number}
                    </h1>
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">
                            {statusLabels[order.status] ?? order.status}
                        </span>
                        <span aria-hidden="true">·</span>
                        {order.vendor_profile.business_name}
                    </p>
                </div>

                <section className="grid gap-6 rounded-2xl border border-border/70 bg-card p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_320px] md:p-6">
                    <div>
                        <h2 className="text-lg font-semibold">Detail acara</h2>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <div>
                                <dt className="text-muted-foreground">
                                    Layanan
                                </dt>
                                <dd>{order.service_name_snapshot}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Paket</dt>
                                <dd>
                                    {order.package_name_snapshot ??
                                        'Harga dasar layanan'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Nama acara
                                </dt>
                                <dd>{order.event_name}</dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Tanggal
                                </dt>
                                <dd>
                                    {new Intl.DateTimeFormat('id-ID', {
                                        dateStyle: 'long',
                                        timeZone: 'Asia/Jakarta',
                                    }).format(
                                        new Date(
                                            `${order.event_date.slice(0, 10)}T12:00:00`,
                                        ),
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Lokasi
                                </dt>
                                <dd>
                                    {order.event_location}, {order.event_city}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Kontak
                                </dt>
                                <dd>
                                    {order.contact_name} · {order.contact_phone}
                                </dd>
                            </div>
                            {order.notes && (
                                <div>
                                    <dt className="text-muted-foreground">
                                        Catatan
                                    </dt>
                                    <dd className="whitespace-pre-line">
                                        {order.notes}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                    <div className="rounded-xl bg-secondary/70 p-5">
                        <h2 className="text-lg font-semibold">
                            Ringkasan harga
                        </h2>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Jumlah
                                </dt>
                                <dd>{order.quantity}</dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Estimasi
                                </dt>
                                <dd>{formatRupiah(order.price_estimate)}</dd>
                            </div>
                            {order.price_final && (
                                <div className="flex justify-between gap-4 border-t border-border pt-3 text-base font-bold text-primary">
                                    <dt>Harga final</dt>
                                    <dd>{formatRupiah(order.price_final)}</dd>
                                </div>
                            )}
                            {order.price_note && (
                                <div>
                                    <dt className="text-muted-foreground">
                                        Catatan harga
                                    </dt>
                                    <dd>{order.price_note}</dd>
                                </div>
                            )}
                            {order.vendor_note && (
                                <div>
                                    <dt className="text-muted-foreground">
                                        Catatan vendor
                                    </dt>
                                    <dd>{order.vendor_note}</dd>
                                </div>
                            )}
                            {order.cancel_reason && (
                                <div>
                                    <dt className="text-muted-foreground">
                                        Alasan pembatalan
                                    </dt>
                                    <dd>{order.cancel_reason}</dd>
                                </div>
                            )}
                        </dl>
                        {whatsAppUrl && (
                            <a
                                href={whatsAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98]"
                            >
                                Hubungi Vendor via WhatsApp
                            </a>
                        )}
                        {order.status === 'pending' && (
                            <form
                                onSubmit={cancel}
                                className="mt-6 grid gap-3 border-t pt-5"
                            >
                                <label
                                    htmlFor="cancel_reason"
                                    className="text-sm font-medium"
                                >
                                    Alasan pembatalan (opsional)
                                </label>
                                <textarea
                                    id="cancel_reason"
                                    value={form.data.cancel_reason}
                                    onChange={(event) =>
                                        form.setData(
                                            'cancel_reason',
                                            event.target.value,
                                        )
                                    }
                                    maxLength={1000}
                                    className="min-h-20 rounded-md border bg-background p-3 text-sm"
                                />
                                {form.errors.cancel_reason && (
                                    <p
                                        role="alert"
                                        className="text-sm text-destructive"
                                    >
                                        {form.errors.cancel_reason}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="h-10 rounded-lg border border-destructive/40 px-4 font-medium text-destructive transition-colors hover:bg-destructive/5 disabled:opacity-60"
                                >
                                    {form.processing
                                        ? 'Membatalkan...'
                                        : 'Batalkan Pesanan'}
                                </button>
                            </form>
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-primary">
                                <Activity className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-bold">Riwayat Status</h2>
                                <p className="text-xs text-muted-foreground">
                                    Jejak pemesanan transparan antara panitia
                                    dan vendor
                                </p>
                            </div>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                            Zona Waktu: WIB (GMT+7)
                        </span>
                    </div>
                    {order.status_histories.length === 0 ? (
                        <p className="mt-5 rounded-xl bg-blue-50/70 p-4 text-sm text-muted-foreground">
                            Belum ada perubahan status untuk pesanan ini.
                        </p>
                    ) : (
                        <ol className="mt-5 grid gap-3">
                            {order.status_histories.map((history, index) => {
                                const isCurrent =
                                    index === order.status_histories.length - 1;
                                const isFinalized =
                                    history.to_status === 'cancelled' ||
                                    history.to_status === 'rejected';

                                return (
                                    <li
                                        key={history.id}
                                        className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-3"
                                    >
                                        {index <
                                            order.status_histories.length -
                                                1 && (
                                            <span
                                                aria-hidden="true"
                                                className="absolute top-8 bottom-[-12px] left-[11px] w-px bg-blue-200"
                                            />
                                        )}
                                        <span
                                            aria-hidden="true"
                                            className={`relative z-10 mt-1 flex size-6 items-center justify-center rounded-full text-white ${isFinalized ? 'bg-rose-500' : isCurrent ? 'bg-amber-400' : 'bg-primary'}`}
                                        >
                                            {isFinalized ? (
                                                <X className="size-3.5" />
                                            ) : isCurrent ? (
                                                <Clock3 className="size-3.5" />
                                            ) : (
                                                <Check className="size-3.5" />
                                            )}
                                        </span>
                                        <article
                                            className={`min-w-0 rounded-xl border p-3 sm:p-4 ${isCurrent ? 'border-amber-200 bg-amber-50/70' : 'border-transparent bg-blue-50/70'}`}
                                        >
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <h3 className="text-sm font-bold">
                                                    {statusLabels[
                                                        history.to_status
                                                    ] ?? history.to_status}
                                                </h3>
                                                <time
                                                    dateTime={
                                                        history.created_at
                                                    }
                                                    className="ml-auto text-[11px] text-muted-foreground"
                                                >
                                                    {new Intl.DateTimeFormat(
                                                        'id-ID',
                                                        {
                                                            dateStyle: 'medium',
                                                            timeStyle: 'short',
                                                            timeZone:
                                                                'Asia/Jakarta',
                                                        },
                                                    ).format(
                                                        new Date(
                                                            history.created_at,
                                                        ),
                                                    )}
                                                </time>
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {history.changed_by.name}
                                            </p>
                                            {history.note && (
                                                <p className="mt-2 rounded-lg bg-white/80 px-3 py-2 text-xs leading-5 text-slate-700">
                                                    {history.note}
                                                </p>
                                            )}
                                        </article>
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </section>
                {order.status === 'completed' && (
                    <section className="rounded-xl border bg-card p-6">
                        <h2 className="text-xl font-semibold">
                            Ulasan layanan
                        </h2>
                        {order.review ? (
                            <div className="mt-3">
                                <p className="font-medium">
                                    ★ {order.review.rating}/5
                                </p>
                                <p className="mt-2 whitespace-pre-line text-muted-foreground">
                                    {order.review.comment ||
                                        'Anda tidak menambahkan komentar.'}
                                </p>
                            </div>
                        ) : (
                            <Form
                                {...storeReview.form(order.order_number)}
                                className="mt-4 grid gap-4"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <label
                                            htmlFor="rating"
                                            className="grid gap-2 text-sm font-medium"
                                        >
                                            Nilai ulasan
                                            <select
                                                id="rating"
                                                name="rating"
                                                required
                                                defaultValue="5"
                                                className="h-10 rounded-md border bg-background px-3"
                                            >
                                                <option value="5">
                                                    5 - Sangat puas
                                                </option>
                                                <option value="4">
                                                    4 - Puas
                                                </option>
                                                <option value="3">
                                                    3 - Cukup
                                                </option>
                                                <option value="2">
                                                    2 - Kurang puas
                                                </option>
                                                <option value="1">
                                                    1 - Tidak puas
                                                </option>
                                            </select>
                                        </label>
                                        {errors.rating && (
                                            <p
                                                role="alert"
                                                className="text-sm text-destructive"
                                            >
                                                {errors.rating}
                                            </p>
                                        )}
                                        <label
                                            htmlFor="review_comment"
                                            className="grid gap-2 text-sm font-medium"
                                        >
                                            Ceritakan pengalaman Anda (opsional)
                                            <textarea
                                                id="review_comment"
                                                name="comment"
                                                maxLength={2000}
                                                className="min-h-24 rounded-md border bg-background p-3 font-normal"
                                            />
                                        </label>
                                        {errors.comment && (
                                            <p
                                                role="alert"
                                                className="text-sm text-destructive"
                                            >
                                                {errors.comment}
                                            </p>
                                        )}
                                        {errors.order && (
                                            <p
                                                role="alert"
                                                className="text-sm text-destructive"
                                            >
                                                {errors.order}
                                            </p>
                                        )}
                                        <button
                                            disabled={processing}
                                            className="h-10 w-fit rounded-md bg-primary px-4 font-medium text-primary-foreground disabled:opacity-60"
                                        >
                                            {processing
                                                ? 'Mengirim ulasan...'
                                                : 'Kirim ulasan'}
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
