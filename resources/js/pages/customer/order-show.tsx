import { Form, Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    Activity,
    CalendarDays,
    Check,
    CheckCircle2,
    Clock3,
    Copy,
    Landmark,
    LoaderCircle,
    MapPin,
    ShieldCheck,
    X,
} from 'lucide-react';
import { store as storeReview } from '@/actions/App/Http/Controllers/Customer/ReviewController';
import {
    index as ordersIndex,
    cancel as cancelOrder,
    payment as confirmPayment,
} from '@/routes/orders';
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

type PaymentMethod = 'bca' | 'mandiri' | 'bri' | 'bni';

const paymentMethods: Array<{
    id: PaymentMethod;
    name: string;
    description: string;
    accountPrefix: string;
    brandClass: string;
}> = [
    {
        id: 'bca',
        name: 'BCA',
        description: 'BCA Virtual Account',
        accountPrefix: '8801',
        brandClass: 'text-blue-700',
    },
    {
        id: 'mandiri',
        name: 'Mandiri',
        description: 'Mandiri VA',
        accountPrefix: '8870',
        brandClass: 'text-amber-700',
    },
    {
        id: 'bri',
        name: 'BRI',
        description: 'BRIVA',
        accountPrefix: '8877',
        brandClass: 'text-sky-700',
    },
    {
        id: 'bni',
        name: 'BNI',
        description: 'BNI Virtual Account',
        accountPrefix: '8810',
        brandClass: 'text-orange-700',
    },
];

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
    const paymentForm = useForm({
        payment_method: order.payment_method ?? 'bca',
    });
    const [isCheckingPayment, setIsCheckingPayment] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const selectedPaymentMethod =
        paymentMethods.find(
            ({ id }) => id === paymentForm.data.payment_method,
        ) ?? paymentMethods[0];
    const virtualAccountNumber = getVirtualAccountNumber(
        order.order_number,
        order.payment_method ?? selectedPaymentMethod.id,
    );
    const canPay =
        ['confirmed', 'in_progress'].includes(order.status) &&
        order.price_final !== null &&
        order.payment_status !== 'paid';
    const paymentUnavailableMessage =
        order.status === 'pending'
            ? 'Menunggu konfirmasi vendor'
            : ['confirmed', 'in_progress'].includes(order.status) &&
                order.price_final === null
              ? 'Menunggu harga final dari vendor'
              : 'Pembayaran tidak tersedia untuk status pesanan ini';

    useEffect(() => {
        if (!isCopied) {
            return;
        }

        const timeoutId = window.setTimeout(() => setIsCopied(false), 2000);

        return () => window.clearTimeout(timeoutId);
    }, [isCopied]);

    async function copyVirtualAccount(): Promise<void> {
        try {
            await navigator.clipboard.writeText(virtualAccountNumber);
            setCopyError(false);
            setIsCopied(true);
        } catch {
            setCopyError(true);
            setIsCopied(false);
        }
    }

    function cancel(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.delete(cancelOrder(order.order_number).url, {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={`Pesanan ${order.order_number}`} />
            <main className="mx-auto max-w-[1080px] space-y-5 px-4 py-6 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
                    <div>
                        <Link
                            href={ordersIndex()}
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            ← Pesanan Saya
                        </Link>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                            {order.order_number}
                        </h1>
                        <p className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-900">
                                {statusLabels[order.status] ?? order.status}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="font-medium">
                                {order.vendor_profile.business_name}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                                Dibuat {formatDate(order.created_at)}
                            </span>
                        </p>
                    </div>
                </div>

                <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.9fr)]">
                    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-3 border-b border-border/70 pb-4">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-primary">
                                <CalendarDays className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-semibold">Detail Acara</h2>
                                <p className="text-xs text-muted-foreground">
                                    Informasi lengkap spesifikasi pesanan vendor
                                </p>
                            </div>
                        </div>
                        <dl className="grid gap-x-6 gap-y-5 pt-5 text-sm sm:grid-cols-2">
                            <DetailRow
                                label="Layanan"
                                value={order.service_name_snapshot}
                            />
                            <DetailRow
                                label="Paket dipilih"
                                value={
                                    order.package_name_snapshot ??
                                    'Harga dasar layanan'
                                }
                            />
                            <DetailRow
                                label="Nama acara"
                                value={order.event_name}
                            />
                            <DetailRow
                                label="Tanggal pelaksanaan"
                                value={formatDate(order.event_date)}
                                icon="calendar"
                            />
                            <DetailRow
                                label="Lokasi acara"
                                value={`${order.event_location}, ${order.event_city}`}
                                icon="location"
                            />
                            <DetailRow
                                label="Kontak panitia"
                                value={`${order.contact_name} · ${order.contact_phone}`}
                            />
                            <DetailRow
                                label="Jumlah paket"
                                value={`${order.quantity} Paket`}
                            />
                            {order.extras &&
                                Object.entries(order.extras).map(
                                    ([label, value]) => (
                                        <DetailRow
                                            key={label}
                                            label={label}
                                            value={value}
                                        />
                                    ),
                                )}
                            {order.notes && (
                                <div className="sm:col-span-2">
                                    <DetailRow
                                        label="Catatan tambahan"
                                        value={order.notes}
                                    />
                                </div>
                            )}
                        </dl>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
                        <div className="flex items-center gap-3 border-b border-border/70 pb-4">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                <ShieldCheck className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-semibold">
                                    Ringkasan Harga
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Rincian biaya pesanan
                                </p>
                            </div>
                        </div>
                        <dl className="mt-4 grid gap-3 text-sm">
                            <div className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">
                                    Jumlah
                                </dt>
                                <dd>{order.quantity} Paket</dd>
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

                <section className="rounded-2xl border border-blue-200 bg-card p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
                        <div className="flex items-center gap-3">
                            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-white">
                                {order.payment_status === 'paid' ? (
                                    <CheckCircle2 className="size-5" />
                                ) : (
                                    <Landmark className="size-5" />
                                )}
                            </span>
                            <div>
                                <h2 className="font-semibold">
                                    {order.payment_status === 'paid'
                                        ? 'Pembayaran berhasil'
                                        : 'Pembayaran Virtual Account'}
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    {order.payment_status === 'paid'
                                        ? `Dikonfirmasi ${order.paid_at ? `pada ${formatDateTime(order.paid_at)}` : ''}`
                                        : 'Status dan instruksi pembayaran'}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                order.payment_status === 'paid'
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                    : 'border-amber-200 bg-amber-50 text-amber-800'
                            }`}
                        >
                            {order.payment_status === 'paid'
                                ? 'LUNAS'
                                : canPay
                                  ? 'MENUNGGU PEMBAYARAN'
                                  : 'BELUM DAPAT DIBAYAR'}
                        </span>
                    </div>
                    <div className="mt-4 grid gap-4 rounded-xl bg-indigo-50/80 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-5">
                        <div>
                            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                Total tagihan
                            </p>
                            <p className="mt-1 text-2xl font-bold tracking-wide text-primary">
                                {formatRupiah(
                                    order.price_final ?? order.price_estimate,
                                )}
                            </p>
                        </div>
                        <div className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2 text-xs text-muted-foreground sm:text-right">
                            <p>
                                {canPay || order.payment_method
                                    ? `${selectedPaymentMethod.name} Virtual Account`
                                    : 'Status pembayaran'}
                            </p>
                            <p className="mt-0.5 font-semibold text-slate-700">
                                {order.payment_status === 'paid'
                                    ? 'Pembayaran terkonfirmasi'
                                    : canPay
                                      ? 'Siap untuk dibayar'
                                      : paymentUnavailableMessage}
                            </p>
                        </div>
                    </div>
                    {order.payment_status !== 'paid' && canPay && (
                        <div className="mt-5">
                            <fieldset>
                                <legend className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    Pilih bank Virtual Account
                                </legend>
                                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {paymentMethods.map((method) => {
                                        const isSelected =
                                            paymentForm.data.payment_method ===
                                            method.id;

                                        return (
                                            <label
                                                key={method.id}
                                                className={`relative flex min-h-20 cursor-pointer flex-col justify-between rounded-xl border p-3 transition-colors ${
                                                    isSelected
                                                        ? 'border-primary bg-blue-50 ring-1 ring-primary'
                                                        : 'border-border bg-card hover:border-primary/40'
                                                } focus-within:ring-2 focus-within:ring-primary/40`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={method.id}
                                                    checked={isSelected}
                                                    onChange={() => {
                                                        paymentForm.setData(
                                                            'payment_method',
                                                            method.id,
                                                        );
                                                        setIsCopied(false);
                                                        setCopyError(false);
                                                    }}
                                                    disabled={isCheckingPayment}
                                                    className="sr-only"
                                                />
                                                <span className="flex items-center justify-between gap-2">
                                                    <span
                                                        className={`text-sm font-bold ${method.brandClass}`}
                                                    >
                                                        {method.name}
                                                    </span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={`flex size-4 items-center justify-center rounded-full border ${
                                                            isSelected
                                                                ? 'border-primary'
                                                                : 'border-slate-300'
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <span className="size-2 rounded-full bg-primary" />
                                                        )}
                                                    </span>
                                                </span>
                                                <span className="mt-3 text-[11px] leading-4 text-muted-foreground">
                                                    {method.description}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </fieldset>
                            {paymentForm.errors.payment_method && (
                                <p
                                    role="alert"
                                    className="mt-2 text-sm text-destructive"
                                >
                                    {paymentForm.errors.payment_method}
                                </p>
                            )}
                            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/80 p-4 sm:p-5">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                            {selectedPaymentMethod.name} Virtual
                                            Account Number
                                        </p>
                                        <p className="mt-1 font-mono text-xl font-bold tracking-[0.12em] break-all text-slate-900 sm:text-2xl">
                                            {formatVirtualAccount(
                                                virtualAccountNumber,
                                            )}
                                        </p>
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Atas nama:{' '}
                                            <span className="font-semibold text-foreground">
                                                Vendoria ({order.contact_name})
                                            </span>
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-left sm:text-right">
                                        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                            Total tagihan
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-primary">
                                            {formatRupiah(
                                                order.price_final ??
                                                    order.price_estimate,
                                            )}
                                        </p>
                                        <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                                            Nomor VA sesuai bank pilihan
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-100 pt-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={copyVirtualAccount}
                                            className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 text-xs font-semibold text-primary transition-colors hover:bg-indigo-50"
                                        >
                                            {isCopied ? (
                                                <Check className="size-3.5" />
                                            ) : (
                                                <Copy className="size-3.5" />
                                            )}
                                            {isCopied
                                                ? 'Nomor VA disalin'
                                                : 'Salin No. VA'}
                                        </button>
                                        {copyError && (
                                            <span
                                                role="alert"
                                                className="text-xs text-destructive"
                                            >
                                                Gagal menyalin. Silakan salin
                                                nomor secara manual.
                                            </span>
                                        )}
                                    </div>
                                    <span className="inline-flex items-center gap-2 text-xs font-medium text-amber-800">
                                        <Clock3 className="size-4" />
                                        Menunggu pembayaran
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div
                        aria-live="polite"
                        className={`mt-4 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
                            order.payment_status === 'paid'
                                ? 'border-emerald-200 bg-emerald-50/70'
                                : 'border-blue-100 bg-blue-50/60'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            {isCheckingPayment ? (
                                <LoaderCircle
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0 animate-spin text-primary"
                                />
                            ) : order.payment_status === 'paid' ? (
                                <CheckCircle2
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0 text-emerald-600"
                                />
                            ) : (
                                <Clock3
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0 text-primary"
                                />
                            )}
                            <div>
                                <p className="text-sm font-semibold">
                                    {isCheckingPayment
                                        ? 'Memproses pembayaran...'
                                        : order.payment_status === 'paid'
                                          ? 'Pembayaran berhasil dikonfirmasi'
                                          : canPay
                                            ? 'Menunggu pembayaran'
                                            : paymentUnavailableMessage}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                    {isCheckingPayment
                                        ? 'Permintaan pembayaran sedang diproses.'
                                        : order.payment_status === 'paid'
                                          ? 'Status pembayaran pesanan telah diperbarui.'
                                          : canPay
                                            ? 'Selesaikan pembayaran untuk melanjutkan pesanan.'
                                            : paymentUnavailableMessage}
                                </p>
                            </div>
                        </div>
                        {canPay ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCheckingPayment(true);
                                    window.setTimeout(() => {
                                        paymentForm.post(
                                            confirmPayment(order.order_number)
                                                .url,
                                            {
                                                preserveScroll: true,
                                                onFinish: () =>
                                                    setIsCheckingPayment(false),
                                            },
                                        );
                                    }, 2200);
                                }}
                                disabled={isCheckingPayment}
                                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
                            >
                                {isCheckingPayment && (
                                    <LoaderCircle
                                        aria-hidden="true"
                                        className="size-4 animate-spin"
                                    />
                                )}
                                {isCheckingPayment
                                    ? 'Memeriksa...'
                                    : 'Konfirmasi pembayaran'}
                            </button>
                        ) : order.payment_status !== 'paid' ? (
                            <p className="text-xs font-medium text-muted-foreground">
                                {paymentUnavailableMessage}
                            </p>
                        ) : null}
                    </div>
                    {canPay && (
                        <PaymentInstructions
                            accountNumber={virtualAccountNumber}
                            amount={formatRupiah(
                                order.price_final ?? order.price_estimate,
                            )}
                            bankName={selectedPaymentMethod.name}
                        />
                    )}
                </section>

                <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
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

function DetailRow({
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
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-rose-600" />
                )}
                <span className="min-w-0">{value}</span>
            </dd>
        </div>
    );
}

function getVirtualAccountNumber(
    orderNumber: string,
    paymentMethod: PaymentMethod,
): string {
    const bank = paymentMethods.find(({ id }) => id === paymentMethod);
    const orderSuffix = orderNumber
        .replace(/\D/g, '')
        .slice(-10)
        .padStart(10, '0');

    return `${bank?.accountPrefix ?? paymentMethods[0].accountPrefix}${orderSuffix}`;
}

function formatVirtualAccount(accountNumber: string): string {
    return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function PaymentInstructions({
    accountNumber,
    amount,
    bankName,
}: {
    accountNumber: string;
    amount: string;
    bankName: string;
}) {
    const [activeChannel, setActiveChannel] = useState('mobile');
    const instructions: Record<string, string[]> = {
        mobile: [
            `Buka aplikasi mobile banking ${bankName} dan masuk ke akun Anda.`,
            'Pilih menu Transfer, lalu pilih Virtual Account atau pembayaran VA.',
            `Masukkan nomor Virtual Account ${formatVirtualAccount(accountNumber)}.`,
            `Periksa nama penerima dan pastikan jumlah pembayaran ${amount}.`,
            'Konfirmasi transaksi menggunakan PIN atau metode keamanan aplikasi.',
        ],
        atm: [
            `Masukkan kartu ATM ${bankName}, lalu pilih bahasa dan masukkan PIN.`,
            'Pilih menu Transaksi Lainnya, Transfer, lalu Virtual Account.',
            `Masukkan nomor Virtual Account ${formatVirtualAccount(accountNumber)}.`,
            `Periksa nama penerima dan pastikan jumlah pembayaran ${amount}.`,
            'Selesaikan transaksi dan simpan bukti pembayaran.',
        ],
        internet: [
            `Buka internet banking ${bankName} dan masuk ke akun Anda.`,
            'Pilih menu Transfer atau Pembayaran Virtual Account.',
            `Masukkan nomor Virtual Account ${formatVirtualAccount(accountNumber)}.`,
            `Periksa nama penerima dan pastikan jumlah pembayaran ${amount}.`,
            'Konfirmasi transaksi sesuai instruksi keamanan dari bank.',
        ],
    };
    const channels = [
        { id: 'mobile', label: 'Mobile Banking' },
        { id: 'atm', label: 'ATM' },
        { id: 'internet', label: 'Internet Banking' },
    ];

    return (
        <div className="mt-5 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
            <h3 className="text-sm font-semibold">
                Cara pembayaran melalui {bankName}
            </h3>
            <div
                role="tablist"
                aria-label="Pilih cara pembayaran"
                className="mt-4 flex flex-wrap gap-2 border-b border-border/70"
            >
                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        type="button"
                        role="tab"
                        aria-selected={activeChannel === channel.id}
                        aria-controls={`payment-instructions-${channel.id}`}
                        onClick={() => setActiveChannel(channel.id)}
                        className={`min-h-10 border-b-2 px-3 text-xs font-semibold transition-colors ${
                            activeChannel === channel.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {channel.label}
                    </button>
                ))}
            </div>
            {channels.map((channel) => (
                <ol
                    key={channel.id}
                    id={`payment-instructions-${channel.id}`}
                    role="tabpanel"
                    aria-hidden={activeChannel !== channel.id}
                    className={`mt-4 gap-3 ${
                        activeChannel === channel.id ? 'grid' : 'hidden'
                    }`}
                >
                    {instructions[channel.id].map((instruction, index) => (
                        <li
                            key={instruction}
                            className="flex items-start gap-3 text-xs leading-5 text-muted-foreground"
                        >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-primary">
                                {index + 1}
                            </span>
                            {instruction}
                        </li>
                    ))}
                </ol>
            ))}
        </div>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value.length === 10 ? `${value}T12:00:00` : value));
}

function formatDateTime(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Jakarta',
    }).format(new Date(value));
}
