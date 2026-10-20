import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import InputError from '@/components/input-error';
import { show as serviceShow } from '@/actions/App/Http/Controllers/Public/ServiceController';
import { store as saveOrderDraft } from '@/actions/App/Http/Controllers/Customer/OrderDraftController';
import type { ServicePackage } from '@/types/marketplace';
import { formatRupiah, priceUnitLabel } from '@/types/marketplace';

type Service = {
    id: number;
    name: string;
    slug: string;
    base_price: string;
    price_unit: string;
    min_quantity: number;
    max_quantity: number | null;
    vendor_profile: { business_name: string; slug: string; city: string };
    category: { name: string };
    packages: ServicePackage[];
};

type ExtraField = {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number';
};

type OrderDraftData = {
    service_id: number;
    package_id: number | null;
    event_name: string;
    event_date: string;
    event_location: string;
    event_city: string;
    contact_name: string;
    contact_phone: string;
    quantity: number;
    notes: string;
    extras: Record<string, string>;
};

export default function CreateOrder({
    service,
    selectedPackageId,
    contactName,
    contactPhone,
    minimumDate,
    extraFields,
}: {
    service: Service;
    selectedPackageId?: number;
    contactName: string;
    contactPhone: string;
    minimumDate: string;
    extraFields: ExtraField[];
}) {
    const form = useForm<OrderDraftData>({
        service_id: service.id,
        package_id: selectedPackageId ?? null,
        event_name: '',
        event_date: '',
        event_location: '',
        event_city: service.vendor_profile.city,
        contact_name: contactName,
        contact_phone: contactPhone,
        quantity: service.min_quantity,
        notes: '',
        extras: {},
    });

    const selectedPackage = service.packages.find((item) => item.id === form.data.package_id);
    const unitPrice = Number(selectedPackage?.price ?? service.base_price);
    const priceEstimate = useMemo(
        () => formatRupiah(unitPrice * Number(form.data.quantity || 0)),
        [form.data.quantity, unitPrice],
    );

    function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(saveOrderDraft.url(), { preserveScroll: true });
    }

    return (
        <>
            <Head title={`Pesan ${service.name}`} />
            <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_340px]">
                <section className="space-y-5">
                    <div>
                        <Link href={serviceShow(service.slug)} className="text-sm text-primary hover:underline">Kembali ke detail layanan</Link>
                        <h1 className="mt-3 text-3xl font-semibold">Detail pesanan</h1>
                        <p className="mt-2 text-muted-foreground">{service.name} · {service.vendor_profile.business_name}</p>
                    </div>

                    <form onSubmit={submit} className="grid gap-5 rounded-xl border bg-card p-5 md:p-7">
                        <input type="hidden" name="service_id" value={form.data.service_id} />
                        <div className="grid gap-2">
                            <label htmlFor="package_id" className="text-sm font-medium">Pilih paket</label>
                            <select
                                id="package_id"
                                value={form.data.package_id ?? ''}
                                onChange={(event) => form.setData('package_id', event.target.value ? Number(event.target.value) : null)}
                                className="h-11 rounded-md border bg-background px-3"
                            >
                                {service.packages.length === 0 && <option value="">Harga dasar layanan</option>}
                                {service.packages.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name} — {formatRupiah(item.price)}</option>
                                ))}
                            </select>
                            <InputError message={form.errors.package_id} />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="event_name" className="text-sm font-medium">Nama acara</label>
                            <input id="event_name" name="event_name" value={form.data.event_name} onChange={(event) => form.setData('event_name', event.target.value)} required maxLength={160} className="h-11 rounded-md border bg-background px-3" />
                            <InputError message={form.errors.event_name} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <label htmlFor="event_date" className="text-sm font-medium">Tanggal acara</label>
                                <input id="event_date" name="event_date" type="date" min={minimumDate} value={form.data.event_date} onChange={(event) => form.setData('event_date', event.target.value)} required className="h-11 rounded-md border bg-background px-3" />
                                <InputError message={form.errors.event_date} />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="event_city" className="text-sm font-medium">Kota acara</label>
                                <input id="event_city" name="event_city" value={form.data.event_city} onChange={(event) => form.setData('event_city', event.target.value)} required maxLength={100} className="h-11 rounded-md border bg-background px-3" />
                                <InputError message={form.errors.event_city} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="event_location" className="text-sm font-medium">Alamat atau lokasi acara</label>
                            <input id="event_location" name="event_location" value={form.data.event_location} onChange={(event) => form.setData('event_location', event.target.value)} required maxLength={255} className="h-11 rounded-md border bg-background px-3" />
                            <InputError message={form.errors.event_location} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <label htmlFor="contact_name" className="text-sm font-medium">Nama kontak</label>
                                <input id="contact_name" name="contact_name" value={form.data.contact_name} onChange={(event) => form.setData('contact_name', event.target.value)} required maxLength={120} className="h-11 rounded-md border bg-background px-3" />
                                <InputError message={form.errors.contact_name} />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="contact_phone" className="text-sm font-medium">Nomor WhatsApp</label>
                                <input id="contact_phone" name="contact_phone" type="tel" autoComplete="tel" value={form.data.contact_phone} onChange={(event) => form.setData('contact_phone', event.target.value)} required maxLength={20} placeholder="08xxxxxxxxxx" className="h-11 rounded-md border bg-background px-3" />
                                <InputError message={form.errors.contact_phone} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="quantity" className="text-sm font-medium">Jumlah ({priceUnitLabel(service.price_unit)})</label>
                            <input id="quantity" name="quantity" type="number" min={service.min_quantity} max={service.max_quantity ?? 100000} value={form.data.quantity} onChange={(event) => form.setData('quantity', Number(event.target.value))} required className="h-11 rounded-md border bg-background px-3" />
                            <p className="text-xs text-muted-foreground">
                                Minimum {service.min_quantity}{service.max_quantity !== null ? ` · Maksimum ${service.max_quantity}` : ''}
                            </p>
                            <InputError message={form.errors.quantity} />
                        </div>

                        {extraFields.map((field) => (
                            <div key={field.name} className="grid gap-2">
                                <label htmlFor={`extra-${field.name}`} className="text-sm font-medium">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        id={`extra-${field.name}`}
                                        value={form.data.extras[field.name] ?? ''}
                                        onChange={(event) => form.setData('extras', { ...form.data.extras, [field.name]: event.target.value })}
                                        maxLength={1000}
                                        rows={3}
                                        className="rounded-md border bg-background px-3 py-2"
                                    />
                                ) : (
                                    <input
                                        id={`extra-${field.name}`}
                                        type={field.type}
                                        value={form.data.extras[field.name] ?? ''}
                                        onChange={(event) => form.setData('extras', { ...form.data.extras, [field.name]: event.target.value })}
                                        maxLength={field.type === 'text' ? 1000 : undefined}
                                        className="h-11 rounded-md border bg-background px-3"
                                    />
                                )}
                                <InputError message={form.errors[`extras.${field.name}`]} />
                            </div>
                        ))}

                        <div className="grid gap-2">
                            <label htmlFor="notes" className="text-sm font-medium">Catatan tambahan <span className="font-normal text-muted-foreground">(opsional)</span></label>
                            <textarea id="notes" name="notes" value={form.data.notes} onChange={(event) => form.setData('notes', event.target.value)} maxLength={2000} rows={4} className="rounded-md border bg-background px-3 py-2" />
                            <InputError message={form.errors.notes} />
                        </div>

                        <button type="submit" disabled={form.processing} className="h-12 rounded-md bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">
                            {form.processing ? 'Menyimpan...' : 'Ajukan Pesanan'}
                        </button>
                    </form>
                </section>

                <aside className="h-fit space-y-4 rounded-xl border bg-card p-5 lg:sticky lg:top-6">
                    <h2 className="text-lg font-semibold">Ringkasan harga</h2>
                    <div className="flex justify-between gap-4 text-sm">
                        <span className="text-muted-foreground">{selectedPackage?.name ?? 'Harga dasar'} × {form.data.quantity}</span>
                        <span>{formatRupiah(unitPrice)}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-t pt-4 font-semibold">
                        <span>Estimasi</span>
                        <span>{priceEstimate}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Harga final akan dikonfirmasi vendor setelah memeriksa kebutuhan acara Anda.</p>
                    <p className="text-xs text-muted-foreground">Tanggal yang dipilih tetap perlu dikonfirmasi oleh vendor.</p>
                </aside>
            </main>
        </>
    );
}
