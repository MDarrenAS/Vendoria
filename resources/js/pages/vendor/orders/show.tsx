import { Form, Head, Link } from '@inertiajs/react';
import { CalendarDays, Clock3, MapPin, ShieldCheck } from 'lucide-react';
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
    payment_status: string;
    paid_at: string | null;
    payment_method: PaymentMethod | null;
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

type PaymentMethod = 'bca' | 'mandiri' | 'bri' | 'bni';
type Status = { value: string; label: string };
type Props = {
    order: Order;
    statuses: Status[];
    dateConflict: boolean;
    whatsAppUrl: string | null;
};

export default function VendorOrderShow({
    order,
    statuses,
    dateConflict,
    whatsAppUrl,
}: Props) {
    const changeUrl = vendorOrders.status(order.order_number);
    const statusLabel =
        statuses.find(({ value }) => value === order.status)?.label ??
        order.status;

    return (
        <VendorShell title="Detail Pesanan">
            <Head title={`Pesanan ${order.order_number}`} />
            <main className="mx-auto max-w-[1200px] space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Link
                            href={vendorOrders.index()}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            ← Kembali ke daftar pesanan
                        </Link>
                        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                            Pesanan {order.order_number}
                        </h2>
                        <p className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-800">
                                {statusLabel}
                            </span>
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600">
                                Customer: {order.customer.name}
                            </span>
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-900">
                        <ShieldCheck className="size-5 shrink-0 text-primary" />
                        <span>
                            <strong className="block">Status pembayaran</strong>
                            {order.payment_status === 'paid'
                                ? 'Pembayaran berhasil dikonfirmasi.'
                                : 'Menunggu pembayaran dari customer.'}
                        </span>
                    </div>
                </div>

                {dateConflict && order.status === 'pending' && (
                    <div
                        role="status"
                        className="rounded-xl border border-amber-500/30 bg-amber-50 p-4 text-sm text-amber-950"
                    >
                        Perhatian: sudah ada pesanan terkonfirmasi pada tanggal
                        ini. Periksa jadwal sebelum menerima.
                    </div>
                )}

                <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
                    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                        <h3 className="border-b border-border/70 pb-4 text-lg font-semibold">
                            Detail acara
                        </h3>
                        <dl className="grid gap-x-6 gap-y-4 pt-5 text-sm sm:grid-cols-2">
                            <Row
                                label="Layanan"
                                value={order.service_name_snapshot}
                            />
                            <Row
                                label="Paket"
                                value={
                                    order.package_name_snapshot ??
                                    'Harga dasar layanan'
                                }
                            />
                            <Row label="Nama acara" value={order.event_name} />
                            <Row
                                label="Tanggal"
                                value={formatDate(order.event_date)}
                                icon="calendar"
                            />
                            <Row
                                label="Lokasi"
                                value={`${order.event_location}, ${order.event_city}`}
                                icon="location"
                            />
                            <Row
                                label="Kontak panitia"
                                value={`${order.contact_name} · ${order.contact_phone}`}
                            />
                            <Row
                                label="Jumlah"
                                value={String(order.quantity)}
                            />
                            {order.extras &&
                                Object.entries(order.extras).map(
                                    ([key, value]) => (
                                        <Row
                                            key={key}
                                            label={key}
                                            value={value}
                                        />
                                    ),
                                )}
                        </dl>
                        {order.notes && (
                            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                                <Row
                                    label="Catatan tambahan panitia"
                                    value={order.notes}
                                />
                            </div>
                        )}
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                        <div>
                            <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-4">
                                <h3 className="text-lg font-semibold">
                                    Harga & Pembayaran
                                </h3>
                                <span
                                    className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${
                                        order.payment_status === 'paid'
                                            ? 'bg-emerald-50 text-emerald-800'
                                            : 'bg-amber-50 text-amber-800'
                                    }`}
                                >
                                    {order.payment_status === 'paid'
                                        ? 'LUNAS'
                                        : 'MENUNGGU PEMBAYARAN'}
                                </span>
                            </div>
                            <dl className="mt-4 grid gap-3 text-sm">
                                <Row
                                    label="Estimasi"
                                    value={formatRupiah(order.price_estimate)}
                                />
                                {order.price_final && (
                                    <Row
                                        label="Harga final"
                                        value={formatRupiah(order.price_final)}
                                    />
                                )}
                                {order.payment_status === 'paid' &&
                                    order.payment_method && (
                                        <Row
                                            label="Metode pembayaran"
                                            value={
                                                paymentMethodLabels[
                                                    order.payment_method
                                                ]
                                            }
                                        />
                                    )}
                                {order.price_note && (
                                    <Row
                                        label="Catatan harga"
                                        value={order.price_note}
                                    />
                                )}
                                {order.cancel_reason && (
                                    <Row
                                        label="Alasan pembatalan"
                                        value={order.cancel_reason}
                                    />
                                )}
                            </dl>
                            {order.vendor_note && (
                                <div className="mt-4 rounded-lg bg-secondary/60 p-3">
                                    <Row
                                        label="Catatan vendor"
                                        value={order.vendor_note}
                                    />
                                </div>
                            )}
                            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs leading-5 text-emerald-950">
                                <div className="flex items-center gap-2 font-semibold">
                                    <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                                    Informasi pembayaran
                                </div>
                                <p className="mt-2">
                                    {order.payment_status === 'paid'
                                        ? `Status pembayaran dikonfirmasi${order.paid_at ? ` pada ${formatDateTime(order.paid_at)}` : ''} oleh customer.`
                                        : 'Pembayaran menunggu konfirmasi customer.'}
                                </p>
                            </div>
                        </div>
                        {whatsAppUrl && (
                            <a
                                href={whatsAppUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 active:scale-[0.98]"
                            >
                                Hubungi customer via WhatsApp
                            </a>
                        )}
                        {order.status === 'pending' && (
                            <div className="grid gap-4 border-t pt-5">
                                <Form
                                    {...vendorOrders.status.form(
                                        order.order_number,
                                    )}
                                    className="grid gap-3 rounded-xl bg-secondary/60 p-4"
                                >
                                    <input
                                        type="hidden"
                                        name="status"
                                        value="confirmed"
                                    />
                                    <label className="grid gap-2 text-sm font-medium">
                                        Harga final
                                        <input
                                            name="price_final"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            defaultValue={order.price_estimate}
                                            required
                                            className="h-10 rounded-lg border border-border/70 bg-background px-3 font-normal"
                                        />
                                    </label>
                                    <label className="grid gap-2 text-sm font-medium">
                                        Catatan harga (opsional)
                                        <textarea
                                            name="price_note"
                                            maxLength={2000}
                                            className="rounded-lg border border-border/70 bg-background p-3 font-normal"
                                        />
                                    </label>
                                    <button className="h-11 rounded-full bg-primary px-4 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98]">
                                        Terima pesanan
                                    </button>
                                </Form>
                                <Form
                                    {...vendorOrders.status.form(
                                        order.order_number,
                                    )}
                                    className="grid gap-3 rounded-xl border border-destructive/20 p-4"
                                >
                                    <input
                                        type="hidden"
                                        name="status"
                                        value="rejected"
                                    />
                                    <label className="grid gap-2 text-sm font-medium">
                                        Alasan penolakan
                                        <textarea
                                            name="vendor_note"
                                            required
                                            maxLength={2000}
                                            className="rounded-md border bg-background p-3 font-normal"
                                        />
                                    </label>
                                    <button className="h-10 rounded-lg border border-destructive/40 px-4 font-semibold text-destructive transition-colors hover:bg-destructive/5">
                                        Tolak pesanan
                                    </button>
                                </Form>
                            </div>
                        )}
                        {order.status === 'confirmed' && (
                            <div className="grid gap-3 border-t pt-5">
                                <StatusForm
                                    url={changeUrl.url}
                                    status="in_progress"
                                    label="Mulai proses"
                                />
                                <Form
                                    {...vendorOrders.status.form(
                                        order.order_number,
                                    )}
                                    className="grid gap-3"
                                >
                                    <input
                                        type="hidden"
                                        name="status"
                                        value="cancelled"
                                    />
                                    <label className="grid gap-2 text-sm font-medium">
                                        Alasan pembatalan (wajib)
                                        <textarea
                                            name="cancel_reason"
                                            required
                                            maxLength={2000}
                                            className="rounded-md border bg-background p-3 font-normal"
                                        />
                                    </label>
                                    <button className="h-10 rounded-md border border-destructive px-4 font-semibold text-destructive">
                                        Batalkan pesanan
                                    </button>
                                </Form>
                            </div>
                        )}
                        {order.status === 'in_progress' && (
                            <StatusForm
                                url={changeUrl.url}
                                status="completed"
                                label="Tandai selesai"
                            />
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-border/70 pb-4">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-primary">
                            <Clock3 className="size-5" />
                        </span>
                        <div>
                            <h3 className="font-semibold">Riwayat status</h3>
                            <p className="text-xs text-muted-foreground">
                                Jejak perubahan pesanan dari customer dan vendor
                            </p>
                        </div>
                    </div>
                    {order.status_histories.length === 0 ? (
                        <p className="mt-5 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                            Belum ada perubahan status untuk pesanan ini.
                        </p>
                    ) : (
                        <ol className="mt-5 space-y-5">
                            {order.status_histories.map((history) => (
                                <li
                                    key={history.id}
                                    className="relative border-l-2 border-primary/20 pb-2 pl-5 last:pb-0"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute top-1 -left-[7px] size-3 rounded-full border-2 border-card bg-primary"
                                    />
                                    <p className="font-medium">
                                        {statuses.find(
                                            ({ value }) =>
                                                value === history.to_status,
                                        )?.label ?? history.to_status}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {history.changed_by.name} ·{' '}
                                        {new Intl.DateTimeFormat('id-ID', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(new Date(history.created_at))}
                                    </p>
                                    {history.note && (
                                        <p className="mt-1 text-sm">
                                            {history.note}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ol>
                    )}
                </section>
            </main>
        </VendorShell>
    );
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
    bca: 'BCA Virtual Account',
    mandiri: 'Mandiri Virtual Account',
    bri: 'BRI Virtual Account',
    bni: 'BNI Virtual Account',
};

function StatusForm({
    url,
    status,
    label,
}: {
    url: string;
    status: string;
    label: string;
}) {
    return (
        <Form action={url} method="patch" className="contents">
            <input type="hidden" name="status" value={status} />
            <button className="h-11 rounded-full bg-primary px-4 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98]">
                {label}
            </button>
        </Form>
    );
}

function Row({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon?: 'calendar' | 'location';
}) {
    return (
        <div className="min-w-0">
            <dt className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {label}
            </dt>
            <dd className="mt-1 flex items-start gap-1.5 font-medium whitespace-pre-line">
                {icon === 'calendar' && (
                    <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-primary" />
                )}
                {icon === 'location' && (
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                )}
                <span className="min-w-0">{value}</span>
            </dd>
        </div>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeZone: 'Asia/Jakarta',
    }).format(new Date(`${value.slice(0, 10)}T12:00:00`));
}

function formatDateTime(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value));
}
