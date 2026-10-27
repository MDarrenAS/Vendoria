import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import VendorShell from '@/components/vendor-shell';
import { create, edit } from '@/routes/vendor/services';
import { formatRupiah, serviceCoverPhoto } from '@/types/marketplace';

type Service = {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: string;
    is_active: boolean;
    category: { name: string };
    packages: Array<{
        id: number;
        name: string;
        price: string;
        is_active: boolean;
    }>;
    images: Array<{ id: number; url: string | null; is_cover: boolean }>;
};

type Pagination = {
    data: Service[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export default function VendorServicesIndex({
    services,
}: {
    services: Pagination;
}) {
    const [query, setQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const categories = Array.from(
        new Set(services.data.map((service) => service.category.name)),
    );
    const filteredServices = services.data.filter((service) => {
        const matchesQuery = `${service.name} ${service.description}`
            .toLocaleLowerCase('id-ID')
            .includes(query.toLocaleLowerCase('id-ID'));
        const matchesCategory =
            categoryFilter === 'Semua' ||
            service.category.name === categoryFilter;

        return matchesQuery && matchesCategory;
    });

    return (
        <VendorShell title="Layanan Saya">
            <Head title="Layanan Saya" />
            <main className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="max-w-xl text-sm text-muted-foreground">
                            Atur katalog layanan, rincian paket, ketersediaan
                            harga, dan portofolio foto usaha Anda.
                        </p>
                    </div>
                    <Link
                        href={create()}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98]"
                    >
                        + Tambah Layanan
                    </Link>
                </div>
                <section className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
                    <label className="sr-only" htmlFor="service-search">
                        Cari layanan
                    </label>
                    <input
                        id="service-search"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cari nama layanan atau deskripsi..."
                        className="h-10 min-w-0 rounded-full border-0 bg-secondary px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <div
                        className="flex flex-wrap gap-2"
                        aria-label="Filter kategori layanan"
                    >
                        {['Semua', ...categories].map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setCategoryFilter(category)}
                                aria-pressed={categoryFilter === category}
                                className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${categoryFilter === category ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-primary/10'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-emerald-600">
                            {
                                services.data.filter(
                                    ({ is_active }) => is_active,
                                ).length
                            }
                        </span>{' '}
                        layanan aktif
                    </p>
                </section>
                {services.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                        <p className="font-medium">
                            Anda belum memiliki layanan.
                        </p>
                        <Link
                            href={create()}
                            className="mt-3 inline-block text-primary hover:underline"
                        >
                            Buat layanan pertama
                        </Link>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
                        Tidak ada layanan yang cocok dengan pencarian ini.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredServices.map((service) => (
                            <article
                                key={service.id}
                                className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"
                            >
                                <img
                                    src={serviceCoverPhoto(
                                        service.images.find(
                                            ({ is_cover }) => is_cover,
                                        )?.url ?? null,
                                        service.category.name,
                                        service.slug,
                                    )}
                                    alt={`Cover ${service.name}`}
                                    onError={(event) => {
                                        event.currentTarget.src =
                                            serviceCoverPhoto(
                                                null,
                                                service.category.name,
                                                service.slug,
                                            );
                                    }}
                                    className="h-44 w-full bg-muted object-cover"
                                    loading="lazy"
                                />
                                <div className="grid gap-3 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="inline-flex rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold tracking-wide text-primary uppercase">
                                                {service.category.name}
                                            </p>
                                            <h3 className="mt-2 font-semibold tracking-tight">
                                                {service.name}
                                            </h3>
                                        </div>
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs ${service.is_active ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground'}`}
                                        >
                                            {service.is_active
                                                ? 'Aktif'
                                                : 'Nonaktif'}
                                        </span>
                                    </div>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center justify-between rounded-lg bg-secondary/70 px-3 py-2">
                                        <span className="text-xs text-muted-foreground">
                                            Mulai dari
                                        </span>
                                        <span className="text-sm font-bold text-primary">
                                            {formatRupiah(service.base_price)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {
                                            service.packages.filter(
                                                ({ is_active }) => is_active,
                                            ).length
                                        }{' '}
                                        paket aktif
                                    </p>
                                    <Link
                                        href={edit(service.slug)}
                                        className="mt-1 inline-flex h-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                                    >
                                        Kelola layanan
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                {services.links.length > 3 && (
                    <nav
                        className="flex justify-center gap-2"
                        aria-label="Halaman layanan"
                    >
                        {services.links.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                href={link.url ?? create()}
                                className={`rounded border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-card'} ${link.url ? '' : 'pointer-events-none opacity-50'}`}
                            >
                                {link.label
                                    .replace('&laquo;', '‹')
                                    .replace('&raquo;', '›')}
                            </Link>
                        ))}
                    </nav>
                )}
            </main>
        </VendorShell>
    );
}
