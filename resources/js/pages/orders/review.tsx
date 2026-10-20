import { Head, Link, useForm } from '@inertiajs/react';
import { show as serviceShow } from '@/actions/App/Http/Controllers/Public/ServiceController';
import { store as createOrder } from '@/actions/App/Http/Controllers/Customer/OrderController';
import type { ServicePackage } from '@/types/marketplace';
import { formatRupiah, priceUnitLabel } from '@/types/marketplace';

type Draft = {
    idempotency_key: string;
    event_name: string;
    event_date: string;
    event_location: string;
    event_city: string;
    contact_name: string;
    contact_phone: string;
    quantity: number;
    notes?: string;
    extras?: Record<string, string>;
};

type Service = {
    id: number;
    name: string;
    slug: string;
    base_price: string;
    price_unit: string;
    vendor_profile: { business_name: string; slug: string };
};

export default function OrderReview({
    draft,
    service,
    package: servicePackage,
    unitPrice,
    priceEstimate,
}: {
    draft: Draft;
    service: Service;
    package: ServicePackage | null;
    unitPrice: string;
    priceEstimate: string;
}) {
    const form = useForm<{
        idempotency_key: string;
        terms_accepted: boolean;
        order?: string;
    }>({
        idempotency_key: draft.idempotency_key,
        terms_accepted: false,
    });

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(createOrder.url(), { preserveScroll: true });
    }

    return (
        <>
            <Head title="Tinjau Pesanan" />
            <main className="mx-auto grid max-w-5xl gap-8 px-5 py-10 md:grid-cols-[1fr_320px]">
                <section className="space-y-6">
                    <div>
                        <Link href={serviceShow(service.slug)} className="text-sm text-primary hover:underline">Kembali ke layanan</Link>
                        <h1 className="mt-3 text-3xl font-semibold">Tinjau pesanan Anda</h1>
                        <p className="mt-2 text-muted-foreground">Pastikan detail acara sudah benar sebelum dikirim ke vendor.</p>
                    </div>
                    <dl className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-2">
                        <div><dt className="text-sm text-muted-foreground">Layanan</dt><dd className="mt-1 font-medium">{service.name}</dd></div>
                        <div><dt className="text-sm text-muted-foreground">Vendor</dt><dd className="mt-1 font-medium">{service.vendor_profile.business_name}</dd></div>
                        <div><dt className="text-sm text-muted-foreground">Paket</dt><dd className="mt-1 font-medium">{servicePackage?.name ?? 'Harga dasar layanan'}</dd></div>
                        <div><dt className="text-sm text-muted-foreground">Nama acara</dt><dd className="mt-1 font-medium">{draft.event_name}</dd></div>
                        <div><dt className="text-sm text-muted-foreground">Tanggal acara</dt><dd className="mt-1 font-medium">{new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(`${draft.event_date}T12:00:00`))}</dd></div>
                        <div><dt className="text-sm text-muted-foreground">Lokasi</dt><dd className="mt-1 font-medium">{draft.event_location}, {draft.event_city}</dd></div>
                        <div><dt className="text-sm text-muted-foreground">Kontak</dt><dd className="mt-1 font-medium">{draft.contact_name} · {draft.contact_phone}</dd></div>
                        <div><dt className="text-sm text-muted-foreground">Jumlah</dt><dd className="mt-1 font-medium">{draft.quantity} {priceUnitLabel(service.price_unit)}</dd></div>
                        {draft.notes && <div className="sm:col-span-2"><dt className="text-sm text-muted-foreground">Catatan</dt><dd className="mt-1 whitespace-pre-line">{draft.notes}</dd></div>}
                    </dl>
                </section>

                <aside className="h-fit space-y-5 rounded-xl border bg-card p-5">
                    <h2 className="text-lg font-semibold">Estimasi harga</h2>
                    <div className="flex justify-between gap-4 text-sm">
                        <span className="text-muted-foreground">{formatRupiah(unitPrice)} × {draft.quantity}</span>
                        <span>{formatRupiah(priceEstimate)}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-t pt-4 text-lg font-semibold">
                        <span>Estimasi</span>
                        <span>{formatRupiah(priceEstimate)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Harga final ditetapkan oleh vendor setelah konfirmasi ketersediaan.</p>
                    <form onSubmit={submit} className="grid gap-4">
                        <label className="flex items-start gap-3 text-sm">
                            <input
                                type="checkbox"
                                checked={form.data.terms_accepted}
                                onChange={(event) => form.setData('terms_accepted', event.target.checked)}
                                className="mt-1 size-4 accent-primary"
                            />
                            <span>Saya menyatakan detail pesanan sudah benar dan setuju untuk mengirim permintaan ini kepada vendor.</span>
                        </label>
                        {form.errors.terms_accepted && <p role="alert" className="text-sm text-destructive">{form.errors.terms_accepted}</p>}
                        {form.errors.order && <p role="alert" className="text-sm text-destructive">{form.errors.order}</p>}
                        <button type="submit" disabled={form.processing || !form.data.terms_accepted} className="h-11 rounded-md bg-primary px-4 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
                            {form.processing ? 'Mengirim...' : 'Konfirmasi & Kirim Pesanan'}
                        </button>
                    </form>
                </aside>
            </main>
        </>
    );
}
