import { Head, Link } from '@inertiajs/react';
import { show as vendorShow } from '@/actions/App/Http/Controllers/Public/VendorController';
import type { ServicePackage } from '@/types/marketplace';
import { formatRupiah, priceUnitLabel } from '@/types/marketplace';

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
            <main className="mx-auto max-w-7xl space-y-12 px-5 py-10">
                <nav
                    aria-label="Breadcrumb"
                    className="inline-flex flex-wrap items-center gap-1.5 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm"
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
                            src={service.cover_url}
                            alt={`Foto utama ${service.name}`}
                            className="h-80 w-full rounded-3xl border border-border/70 bg-muted object-cover shadow-xl shadow-primary/10 md:h-[460px]"
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
                                            className="h-24 w-full rounded-2xl border border-border/70 object-cover shadow-sm"
                                            loading="lazy"
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-5 rounded-3xl border border-border/70 bg-card/90 p-6 shadow-xl shadow-primary/5 md:p-8">
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
                        <p className="rounded-2xl bg-accent/70 p-4 text-2xl font-bold text-accent-foreground">
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
                        <p className="text-sm text-primary">
                            Pilih sesuai kebutuhan acara
                        </p>
                        <h2 className="text-2xl font-semibold">
                            Paket layanan
                        </h2>
                    </div>
                    {service.packages.length === 0 ? (
                        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                            Belum ada paket aktif untuk layanan ini.
                        </p>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {service.packages.map((servicePackage) => (
                                <article
                                    key={servicePackage.id}
                                    className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-gradient-to-br from-brand-50/70 via-card to-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {servicePackage.name}
                                        </h3>
                                        {servicePackage.description && (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {servicePackage.description}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatRupiah(servicePackage.price)}{' '}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            /{' '}
                                            {priceUnitLabel(service.price_unit)}
                                        </span>
                                    </p>
                                    <ul className="grid gap-2 text-sm">
                                        {servicePackage.features.map(
                                            (feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex gap-2"
                                                >
                                                    <span
                                                        className="text-primary"
                                                        aria-hidden="true"
                                                    >
                                                        ✓
                                                    </span>
                                                    {feature}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                    <Link
                                        href={`/order/create?service=${service.id}&package=${servicePackage.id}`}
                                        className="mt-auto rounded-xl bg-primary px-4 py-3 text-center font-bold text-primary-foreground shadow-md shadow-primary/15 transition hover:-translate-y-0.5"
                                    >
                                        Pesan Sekarang
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {service.terms && (
                    <section className="space-y-3 rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                        <h2 className="text-xl font-semibold">
                            Ketentuan layanan
                        </h2>
                        <p className="leading-7 text-muted-foreground">
                            {service.terms}
                        </p>
                    </section>
                )}

                <section className="space-y-3 rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold">
                        Tanggal tidak tersedia
                    </h2>
                    {service.vendor_profile.blocked_dates.length ? (
                        <ul className="flex flex-wrap gap-2">
                            {service.vendor_profile.blocked_dates.map(
                                ({ date }) => (
                                    <li
                                        key={date}
                                        className="rounded-md bg-muted px-3 py-2 text-sm"
                                    >
                                        {new Intl.DateTimeFormat('id-ID', {
                                            dateStyle: 'long',
                                            timeZone: 'Asia/Jakarta',
                                        }).format(new Date(`${date}T12:00:00`))}
                                    </li>
                                ),
                            )}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Belum ada tanggal yang ditandai penuh.
                        </p>
                    )}
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
