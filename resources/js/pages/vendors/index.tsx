import { Head, Link } from '@inertiajs/react';
import { index as vendorsIndex } from '@/routes/vendors';
import { show as serviceShow } from '@/actions/App/Http/Controllers/Public/ServiceController';
import type { CatalogPagination, Category, ServiceCard } from '@/types/marketplace';
import { formatRupiah, priceUnitLabel } from '@/types/marketplace';

type VendorSearchProps = {
    services: CatalogPagination;
    categories: Array<Pick<Category, 'name' | 'slug'>>;
    filters: {
        q: string;
        category: string[];
        city: string;
        price_min: string | number;
        price_max: string | number;
        rating_min: string | number;
        date: string;
        sort: string;
    };
    resultCount: number;
};

function ServiceResultCard({ service }: { service: ServiceCard }) {
    return (
        <article className="overflow-hidden rounded-xl border bg-card">
            <Link href={serviceShow(service.slug)} className="grid h-full sm:grid-cols-[220px_1fr]">
                <img
                    src={service.cover_url}
                    alt={`Foto ${service.name}`}
                    className="h-52 w-full bg-muted object-cover sm:h-full"
                    loading="lazy"
                />
                <div className="space-y-3 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{service.category.name}</span>
                        {service.vendor_profile.is_verified && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">Terverifikasi</span>
                        )}
                    </div>
                    <h2 className="text-xl font-semibold">{service.name}</h2>
                    <p className="text-sm text-muted-foreground">
                        {service.vendor_profile.business_name} · {service.vendor_profile.city}
                    </p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                    <p className="text-sm text-muted-foreground">
                        {service.rating_count > 0 ? `★ ${service.rating_avg} (${service.rating_count} ulasan)` : 'Belum ada ulasan'}
                    </p>
                    <p className="font-semibold">
                        Mulai dari {formatRupiah(service.base_price)}{' '}
                        <span className="font-normal text-muted-foreground">/ {priceUnitLabel(service.price_unit)}</span>
                    </p>
                </div>
            </Link>
        </article>
    );
}

export default function VendorIndex({ services, categories, filters, resultCount }: VendorSearchProps) {
    return (
        <>
            <Head title="Cari Vendor" />
            <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[280px_1fr]">
                <aside className="h-fit rounded-xl border bg-card p-5">
                    <h1 className="text-xl font-semibold">Cari Vendor</h1>
                    <form action={vendorsIndex.url()} method="get" className="mt-5 grid gap-4">
                        <label className="grid gap-2 text-sm font-medium">
                            Kata kunci
                            <input name="q" defaultValue={filters.q} className="h-10 rounded-md border bg-background px-3" />
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                            Kategori
                            <select name="category[]" defaultValue={filters.category[0] ?? ''} className="h-10 rounded-md border bg-background px-3">
                                <option value="">Semua kategori</option>
                                {categories.map((category) => (
                                    <option key={category.slug} value={category.slug}>{category.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                            Kota
                            <input name="city" defaultValue={filters.city} className="h-10 rounded-md border bg-background px-3" />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="grid gap-2 text-sm font-medium">
                                Harga min.
                                <input type="number" min="0" name="price_min" defaultValue={filters.price_min} className="h-10 min-w-0 rounded-md border bg-background px-3" />
                            </label>
                            <label className="grid gap-2 text-sm font-medium">
                                Harga maks.
                                <input type="number" min="0" name="price_max" defaultValue={filters.price_max} className="h-10 min-w-0 rounded-md border bg-background px-3" />
                            </label>
                        </div>
                        <label className="grid gap-2 text-sm font-medium">
                            Rating minimal
                            <select name="rating_min" defaultValue={filters.rating_min} className="h-10 rounded-md border bg-background px-3">
                                <option value="">Semua rating</option>
                                <option value="3">3 bintang</option>
                                <option value="4">4 bintang</option>
                                <option value="4.5">4,5 bintang</option>
                            </select>
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                            Tanggal acara
                            <input type="date" name="date" defaultValue={filters.date} className="h-10 rounded-md border bg-background px-3" />
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                            Urutkan
                            <select name="sort" defaultValue={filters.sort} className="h-10 rounded-md border bg-background px-3">
                                <option value="relevance">Paling relevan</option>
                                <option value="price_asc">Harga terendah</option>
                                <option value="price_desc">Harga tertinggi</option>
                                <option value="rating">Rating tertinggi</option>
                                <option value="newest">Terbaru</option>
                            </select>
                        </label>
                        <button className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground" type="submit">Terapkan filter</button>
                        <Link href={vendorsIndex()} className="text-center text-sm text-primary hover:underline">Reset filter</Link>
                    </form>
                </aside>

                <section className="space-y-5">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="text-sm text-muted-foreground">{resultCount} layanan ditemukan</p>
                            <h2 className="text-2xl font-semibold">Layanan vendor</h2>
                        </div>
                    </div>
                    {services.data.length === 0 ? (
                        <div className="rounded-xl border border-dashed p-10 text-center">
                            <h3 className="font-semibold">Belum ada layanan yang cocok</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Coba ubah kata kunci atau filter pencarian Anda.</p>
                            <Link href={vendorsIndex()} className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">Hapus semua filter</Link>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {services.data.map((service) => <ServiceResultCard key={service.id} service={service} />)}
                        </div>
                    )}
                    {services.last_page > 1 && (
                        <nav aria-label="Halaman hasil pencarian" className="flex flex-wrap justify-center gap-2 pt-4">
                            {services.links.map((link) => (
                                <Link
                                    key={`${link.label}-${link.url}`}
                                    href={link.url ?? '#'}
                                    aria-disabled={!link.url}
                                    className={`rounded-md border px-3 py-2 text-sm ${link.active ? 'border-primary bg-primary text-primary-foreground' : 'hover:bg-muted'} ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    )}
                </section>
            </main>
        </>
    );
}
