import { Head, Link } from '@inertiajs/react';
import VendorShell from '@/components/vendor-shell';
import { create, edit } from '@/routes/vendor/services';
import { formatRupiah } from '@/types/marketplace';

type Service = {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: string;
    is_active: boolean;
    category: { name: string };
    packages: Array<{ id: number; name: string; price: string; is_active: boolean }>;
    images: Array<{ id: number; url: string | null; is_cover: boolean }>;
};

type Pagination = {
    data: Service[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export default function VendorServicesIndex({ services }: { services: Pagination }) {
    return (
        <VendorShell title="Layanan Saya">
            <Head title="Layanan Saya" />
            <main className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-semibold">Layanan Saya</h2>
                        <p className="mt-2 text-muted-foreground">Atur katalog layanan, paket, dan foto usaha.</p>
                    </div>
                    <Link href={create()} className="inline-flex h-10 items-center rounded-md bg-primary px-4 font-semibold text-primary-foreground">Tambah layanan</Link>
                </div>
                {services.data.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-10 text-center">
                        <p className="font-medium">Anda belum memiliki layanan.</p>
                        <Link href={create()} className="mt-3 inline-block text-primary hover:underline">Buat layanan pertama</Link>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {services.data.map((service) => (
                            <article key={service.id} className="overflow-hidden rounded-xl border bg-card">
                                {service.images.find(({ is_cover }) => is_cover)?.url && (
                                    <img src={service.images.find(({ is_cover }) => is_cover)?.url ?? ''} alt={`Cover ${service.name}`} className="h-48 w-full object-cover" />
                                )}
                                <div className="grid gap-3 p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{service.category.name}</p>
                                            <h3 className="mt-1 font-semibold">{service.name}</h3>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-xs ${service.is_active ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-muted text-muted-foreground'}`}>
                                            {service.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                                    <p className="font-semibold">Mulai {formatRupiah(service.base_price)}</p>
                                    <p className="text-sm text-muted-foreground">{service.packages.filter(({ is_active }) => is_active).length} paket aktif</p>
                                    <Link href={edit(service.slug)} className="mt-1 inline-flex h-10 items-center justify-center rounded-md border font-medium hover:bg-muted">Kelola layanan</Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                {services.links.length > 3 && (
                    <nav className="flex justify-center gap-2" aria-label="Halaman layanan">
                        {services.links.map((link, index) => (
                            <Link key={`${link.label}-${index}`} href={link.url ?? create()} className={`rounded border px-3 py-2 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-card'} ${link.url ? '' : 'pointer-events-none opacity-50'}`}>
                                {link.label.replace('&laquo;', '‹').replace('&raquo;', '›')}
                            </Link>
                        ))}
                    </nav>
                )}
            </main>
        </VendorShell>
    );
}
