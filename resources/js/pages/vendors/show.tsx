import { Head, Link } from '@inertiajs/react';
import { show as serviceShow } from '@/actions/App/Http/Controllers/Public/ServiceController';
import type { Category, ServicePackage } from '@/types/marketplace';
import { formatRupiah, priceUnitLabel } from '@/types/marketplace';

type VendorService = {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: string;
    price_unit: string;
    cover_url: string;
    rating_avg: string;
    rating_count: number;
    category: Pick<Category, 'name' | 'slug'>;
    packages: ServicePackage[];
};

type Vendor = {
    id: number;
    business_name: string;
    slug: string;
    description: string;
    city: string;
    province: string;
    logo_url: string | null;
    cover_url: string | null;
    is_verified: boolean;
    rating_avg: string;
    rating_count: number;
    services: VendorService[];
};

type Review = {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    customer: { name: string };
};

export default function VendorShow({
    vendor,
    reviews,
    whatsappUrl,
}: {
    vendor: Vendor;
    reviews: {
        data: Review[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    whatsappUrl: string | null;
}) {
    return (
        <>
            <Head title={vendor.business_name} />
            <main className="mx-auto max-w-7xl space-y-12 px-5 py-10">
                <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl shadow-primary/5">
                    <img
                        src={vendor.cover_url ?? '/images/VendoriaLogo.png'}
                        alt={`Sampul ${vendor.business_name}`}
                        className="h-56 w-full bg-muted object-cover md:h-96"
                    />
                    <div className="flex flex-wrap items-center gap-5 bg-gradient-to-r from-brand-50 via-card to-teal-50/70 p-6 md:p-8">
                        <img
                            src={
                                vendor.logo_url ??
                                '/images/VendoriaLogoNoWord.png'
                            }
                            alt={`Logo ${vendor.business_name}`}
                            className="-mt-14 size-24 rounded-3xl border-4 border-card bg-background object-contain p-3 shadow-lg"
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {vendor.business_name}
                                </h1>
                                {vendor.is_verified && (
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                                        Terverifikasi
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 text-muted-foreground">
                                {vendor.city}, {vendor.province}
                            </p>
                            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
                                {vendor.rating_count > 0
                                    ? `★ ${vendor.rating_avg} · ${vendor.rating_count} ulasan`
                                    : 'Belum ada ulasan'}
                            </p>
                        </div>
                        {whatsappUrl && (
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full border border-primary/20 bg-card px-5 py-3 font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/5"
                            >
                                Hubungi via WhatsApp
                            </a>
                        )}
                    </div>
                    <p className="max-w-4xl px-6 pb-8 leading-7 text-muted-foreground md:px-8">
                        {vendor.description}
                    </p>
                </section>

                <section className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-semibold">
                            Ulasan pelanggan
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {vendor.rating_count > 0
                                ? `Rata-rata ★ ${vendor.rating_avg} dari ${vendor.rating_count} ulasan`
                                : 'Belum ada ulasan untuk vendor ini.'}
                        </p>
                    </div>
                    {reviews.data.length > 0 && (
                        <div className="grid gap-3 md:grid-cols-2">
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
                            aria-label="Halaman ulasan vendor"
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

                <section className="space-y-5">
                    <div>
                        <p className="text-sm font-bold tracking-wide text-primary">
                            KATALOG USAHA
                        </p>
                        <h2 className="mt-1 text-3xl font-bold tracking-tight">
                            Layanan dari {vendor.business_name}
                        </h2>
                    </div>
                    {vendor.services.length === 0 ? (
                        <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                            Vendor ini belum memiliki layanan aktif.
                        </p>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {vendor.services.map((service) => (
                                <Link
                                    key={service.id}
                                    href={serviceShow(service.slug)}
                                    className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
                                >
                                    <img
                                        src={service.cover_url}
                                        alt={`Foto ${service.name}`}
                                        className="h-48 w-full bg-muted object-cover transition duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="space-y-2 p-5">
                                        <p className="text-sm font-semibold text-primary">
                                            {service.category.name}
                                        </p>
                                        <h3 className="font-bold transition group-hover:text-primary">
                                            {service.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {service.rating_count > 0
                                                ? `★ ${service.rating_avg} (${service.rating_count})`
                                                : 'Belum ada ulasan'}
                                        </p>
                                        <p className="font-semibold">
                                            Mulai dari{' '}
                                            {formatRupiah(service.base_price)} /{' '}
                                            {priceUnitLabel(service.price_unit)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
