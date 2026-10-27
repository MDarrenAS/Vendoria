import { Head, Link } from '@inertiajs/react';
import { CalendarDays, CircleCheck, ShieldCheck } from 'lucide-react';
import { show as vendorShow } from '@/actions/App/Http/Controllers/Public/VendorController';
import type { ServicePackage } from '@/types/marketplace';
import {
    formatRupiah,
    priceUnitLabel,
    serviceCoverPhoto,
} from '@/types/marketplace';

type ServiceDetail = {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: string;
    price_unit: string;
    rating_avg: string;
    rating_count: number;
    min_quantity: number;
    max_quantity: number | null;
    terms: string | null;
    cover_url: string;
    vendor_profile: {
        business_name: string;
        slug: string;
        city: string;
        province: string;
        is_verified: boolean;
        rating_avg: string;
        rating_count: number;
        blocked_dates: Array<{ date: string }>;
    };
    category: { name: string; slug: string };
    packages: ServicePackage[];
    images: Array<{
        id: number;
        url: string;
        caption: string | null;
        is_cover: boolean;
    }>;
};

export default function ServiceShow({
    service,
    reviews,
    whatsappUrl,
}: {
    service: ServiceDetail;
    reviews: {
        data: Array<{
            id: number;
            rating: number;
            comment: string | null;
            created_at: string;
            customer: { name: string };
        }>;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    extraFields: Array<{ name: string; label: string; type: string }>;
    whatsappUrl: string | null;
}) {
    return (
        <>
            <Head title={service.name}>
                <meta
                    head-key="description"
                    name="description"
                    content={`${service.name} oleh ${service.vendor_profile.business_name} di ${service.vendor_profile.city}. Lihat paket dan harga di Vendoria.`}
                />
            </Head>
            <main className="mx-auto max-w-[1280px] space-y-9 px-4 py-6 sm:px-6 lg:px-8">
                <nav
                    aria-label="Breadcrumb"
                    className="inline-flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
                >
                    <Link href="/vendors" className="hover:text-primary">
                        Cari Vendor
                    </Link>
                    {' / '}
                    <Link
                        href={vendorShow(service.vendor_profile.slug)}
                        className="hover:text-primary"
                    >
                        {service.vendor_profile.business_name}
                    </Link>
                    {' / '}
                    <span aria-current="page">{service.name}</span>
                </nav>
                <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-3">
                        <img
                            src={serviceCoverPhoto(
                                service.cover_url,
                                service.category.name,
                                service.slug,
                            )}
                            alt={`Foto utama ${service.name}`}
                            onError={(event) => {
                                event.currentTarget.src = serviceCoverPhoto(
                                    null,
                                    service.category.name,
                                    service.slug,
                                );
                            }}
                            className="h-72 w-full rounded-xl border border-border/70 bg-muted object-cover sm:h-80 md:h-[420px]"
                        />
                        {service.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {service.images
                                    .filter((image) => !image.is_cover)
                                    .map((image) => (
                                        <img
                                            key={image.id}
                                            src={image.url}
                                            alt={
                                                image.caption ??
                                                `Foto ${service.name}`
                                            }
                                            className="h-20 w-full rounded-lg border border-border/70 object-cover sm:h-24"
                                            loading="lazy"
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-5 rounded-xl border border-border/70 bg-card p-5 shadow-sm md:p-6">
                        <p className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
                            {service.category.name}
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                            {service.name}
                        </h1>
                        <Link
                            href={vendorShow(service.vendor_profile.slug)}
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"
                        >
                            <span>{service.vendor_profile.business_name}</span>
                            {service.vendor_profile.is_verified && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                                    Terverifikasi
                                </span>
                            )}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            {service.vendor_profile.city},{' '}
                            {service.vendor_profile.province} ·{' '}
                            {service.rating_count > 0
                                ? `★ ${service.rating_avg} (${service.rating_count} ulasan)`
                                : 'Belum ada ulasan'}
                        </p>
                        <p className="rounded-lg bg-secondary p-4 text-2xl font-bold text-primary">
                            Mulai dari {formatRupiah(service.base_price)}{' '}
                            <span className="text-base font-normal text-muted-foreground">
                                / {priceUnitLabel(service.price_unit)}
                            </span>
                        </p>
                        <p className="leading-7 text-muted-foreground">
                            {service.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#paket"
                                className="rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                Lihat paket
                            </a>
                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full border border-primary/20 bg-card px-5 py-3 font-semibold text-primary transition hover:bg-primary/5"
                                >
                                    Tanya via WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                <section id="paket" className="space-y-5">
                    <div>
                        <p className="text-xs font-bold tracking-wide text-primary">
                            PILIH SESUAI KEBUTUHAN ACARA
                        </p>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight">
                            Paket layanan
                        </h2>
                    </div>
                    {service.packages.length === 0 ? (
                        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                            Belum ada paket aktif untuk layanan ini.
                        </p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {service.packages.map((servicePackage, index) => (
                                <article
                                    key={servicePackage.id}
                                    className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${index === 1 ? 'border-primary/20' : 'border-border/70'}`}
                                >
                                    <div className="grid gap-3">
                                        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                                            {index === 0
                                                ? 'Reguler'
                                                : 'Paket lengkap'}
                                        </span>
                                        <h3 className="text-lg font-bold tracking-tight">
                                            {servicePackage.name}
                                        </h3>
                                        {servicePackage.description && (
                                            <p className="text-sm leading-6 text-muted-foreground">
                                                {servicePackage.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="rounded-xl bg-blue-50 px-4 py-3">
                                        <p className="text-xl font-bold text-primary">
                                            {formatRupiah(servicePackage.price)}{' '}
                                            <span className="text-xs font-normal text-muted-foreground">
                                                /{' '}
                                                {priceUnitLabel(
                                                    service.price_unit,
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                    <ul className="grid gap-2 text-sm">
                                        {servicePackage.features.map(
                                            (feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-start gap-2 text-muted-foreground"
                                                >
                                                    <CircleCheck
                                                        className="mt-0.5 size-4 shrink-0 text-primary"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{feature}</span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                    <Link
                                        href={`/order/create?service=${service.id}&package=${servicePackage.id}`}
                                        className="mt-auto rounded-full bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground shadow-md shadow-primary/15 transition hover:-translate-y-0.5"
                                    >
                                        Pesan Sekarang
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="grid gap-4 lg:grid-cols-2">
                    {service.terms && (
                        <article className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-primary">
                                    <ShieldCheck className="size-5" />
                                </span>
                                <div>
                                    <h2 className="font-bold">
                                        Ketentuan layanan
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        Harap dibaca sebelum melakukan pemesanan
                                    </p>
                                </div>
                            </div>
                            <p className="rounded-xl bg-blue-50/70 p-4 text-sm leading-6 text-muted-foreground">
                                {service.terms}
                            </p>
                        </article>
                    )}

                    <article className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm">
                        <div className="mb-3 flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                <CalendarDays className="size-5" />
                            </span>
                            <div>
                                <h2 className="font-bold">
                                    Ketersediaan Tanggal
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Pemantauan otomatis sistem Vendoria
                                </p>
                            </div>
                        </div>
                        {service.vendor_profile.blocked_dates.length ? (
                            <ul className="flex flex-wrap gap-2 rounded-xl bg-emerald-50/70 p-4">
                                {service.vendor_profile.blocked_dates.map(
                                    ({ date }) => (
                                        <li
                                            key={date}
                                            className="rounded-full bg-white px-3 py-2 text-sm"
                                        >
                                            {new Intl.DateTimeFormat('id-ID', {
                                                dateStyle: 'long',
                                                timeZone: 'Asia/Jakarta',
                                            }).format(
                                                new Date(`${date}T12:00:00`),
                                            )}
                                        </li>
                                    ),
                                )}
                            </ul>
                        ) : (
                            <p className="flex items-start gap-2 rounded-xl bg-emerald-50/70 p-4 text-sm leading-6 text-muted-foreground">
                                <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                Belum ada tanggal yang ditandai penuh oleh
                                vendor ini. Silakan pilih dan cantumkan tanggal
                                yang Anda kehendaki saat proses checkout.
                            </p>
                        )}
                    </article>
                </section>
                <section className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            Ulasan pelanggan
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {service.rating_count > 0
                                ? `Rata-rata ★ ${service.rating_avg} dari ${service.rating_count} ulasan`
                                : 'Belum ada ulasan untuk layanan ini.'}
                        </p>
                    </div>
                    {reviews.data.length > 0 && (
                        <div className="grid gap-3">
                            {reviews.data.map((review) => (
                                <article
                                    key={review.id}
                                    className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
                                >
                                    <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-900">
                                        ★ {review.rating}/5
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {review.customer.name} ·{' '}
                                        {new Intl.DateTimeFormat('id-ID', {
                                            dateStyle: 'medium',
                                            timeZone: 'Asia/Jakarta',
                                        }).format(new Date(review.created_at))}
                                    </p>
                                    <p className="mt-3 whitespace-pre-line">
                                        {review.comment ||
                                            'Tidak ada komentar.'}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                    {reviews.links.length > 3 && (
                        <nav
                            className="flex flex-wrap justify-center gap-2"
                            aria-label="Halaman ulasan layanan"
                        >
                            {reviews.links.map((link, index) => (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url ?? '#'}
                                    aria-disabled={!link.url}
                                    className={`rounded-md border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-card'} ${link.url ? '' : 'pointer-events-none opacity-50'}`}
                                >
                                    {link.label
                                        .replace('&laquo;', '‹')
                                        .replace('&raquo;', '›')}
                                </Link>
                            ))}
                        </nav>
                    )}
                </section>
            </main>
        </>
    );
}
