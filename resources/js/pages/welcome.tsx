import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard as adminDashboard } from '@/routes/admin';
import { dashboard as vendorDashboard } from '@/routes/vendor';
import { login, logout, register } from '@/routes';
import { index as ordersIndex } from '@/routes/orders';
import { index as vendorsIndex } from '@/routes/vendors';
import { edit as profileEdit } from '@/routes/profile';
import type { User } from '@/types';
import type { Category, ServiceCard } from '@/types/marketplace';
import { formatRupiah, priceUnitLabel } from '@/types/marketplace';

type WelcomeProps = {
    categories: Category[];
    featuredServices: ServiceCard[];
    newestServices: ServiceCard[];
};

function ServiceGrid({ services }: { services: ServiceCard[] }) {
    if (services.length === 0) {
        return (
            <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                Belum ada layanan yang ditampilkan. Silakan kembali lagi nanti.
            </p>
        );
    }

    return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
                <article
                    key={service.id}
                    className="overflow-hidden rounded-xl border bg-card text-card-foreground"
                >
                    <Link href={`/services/${service.slug}`} className="block">
                        <img
                            src={service.cover_url}
                            alt={`Foto ${service.name}`}
                            className="h-44 w-full bg-muted object-cover"
                            loading="lazy"
                        />
                        <div className="space-y-2 p-4">
                            <p className="text-xs font-medium text-primary">
                                {service.category.name}
                            </p>
                            <h3 className="line-clamp-2 min-h-12 font-semibold">
                                {service.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {service.vendor_profile.business_name}
                                {service.vendor_profile.is_verified && (
                                    <span className="ml-1 text-primary">
                                        · Terverifikasi
                                    </span>
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {service.vendor_profile.city}
                            </p>
                            <p className="font-semibold">
                                Mulai dari {formatRupiah(service.base_price)}
                                <span className="font-normal text-muted-foreground">
                                    {' '}
                                    / {priceUnitLabel(service.price_unit)}
                                </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {service.rating_count > 0
                                    ? `★ ${service.rating_avg} (${service.rating_count} ulasan)`
                                    : 'Belum ada ulasan'}
                            </p>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );
}

export default function Welcome({
    categories,
    featuredServices,
    newestServices,
}: WelcomeProps) {
    const { auth } = usePage().props;
    const user = auth.user as User | null;

    return (
        <>
            <Head title="Temukan Vendor Acara" />
            <div className="min-h-screen bg-background text-foreground">
                <header className="border-b bg-background">
                    <nav
                        aria-label="Navigasi utama"
                        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4"
                    >
                        <Link href="/" aria-label="Vendoria, beranda">
                            <img
                                src="/images/VendoriaLogo.png"
                                alt="Vendoria"
                                className="h-11 w-auto object-contain"
                            />
                        </Link>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <Link href="/" className="hover:underline">Beranda</Link>
                            <Link href={vendorsIndex()} className="hover:underline">Cari Vendor</Link>
                            <a href="#cara-kerja" className="hover:underline">Cara Kerja</a>
                            {user?.role === 'customer' && (
                                <Link href={ordersIndex()} className="hover:underline">Pesanan Saya</Link>
                            )}
                            {user?.role === 'vendor' && (
                                <Link href={vendorDashboard()} className="hover:underline">Dashboard Vendor</Link>
                            )}
                            {user?.role === 'admin' && (
                                <Link href={adminDashboard()} className="hover:underline">Panel Admin</Link>
                            )}
                            {user ? (
                                <>
                                    <Link href={profileEdit()} className="hover:underline">Profil</Link>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="rounded-md border px-4 py-2 font-medium hover:bg-muted"
                                    >
                                        Keluar
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href={login()} className="hover:underline">Masuk</Link>
                                    <Link
                                        href={register()}
                                        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                    {user?.role === 'vendor' && (
                        <p className="bg-primary/10 px-5 py-2 text-center text-sm">
                            Anda masuk sebagai Vendor.
                        </p>
                    )}
                </header>

                <main>
                    <section className="bg-gradient-to-br from-primary/10 via-background to-muted/60">
                        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1fr_0.8fr] md:py-24">
                            <div className="space-y-6">
                                <p className="font-medium text-primary">
                                    Marketplace vendor acara Indonesia
                                </p>
                                <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
                                    Temukan vendor yang tepat untuk acara Anda.
                                </h1>
                                <p className="max-w-2xl text-lg text-muted-foreground">
                                    Bandingkan layanan, paket, dan harga dari penyedia kebutuhan acara pilihan.
                                </p>
                                <Link
                                    href={vendorsIndex()}
                                    className="inline-flex rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90"
                                >
                                    Jelajahi semua vendor
                                </Link>
                            </div>
                            <form
                                action={vendorsIndex.url()}
                                method="get"
                                className="my-auto grid gap-4 rounded-2xl border bg-card p-6 shadow-sm"
                                aria-label="Cari layanan vendor"
                            >
                                <label htmlFor="home-query" className="font-semibold">
                                    Cari kebutuhan acara
                                </label>
                                <input
                                    id="home-query"
                                    name="q"
                                    type="search"
                                    placeholder="Contoh: katering pernikahan"
                                    className="h-11 rounded-md border bg-background px-3"
                                />
                                <label htmlFor="home-category" className="text-sm font-medium">
                                    Kategori
                                </label>
                                <select
                                    id="home-category"
                                    name="category"
                                    defaultValue=""
                                    className="h-11 rounded-md border bg-background px-3"
                                >
                                    <option value="">Semua kategori</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="h-11 rounded-md bg-primary px-4 font-medium text-primary-foreground hover:opacity-90"
                                >
                                    Cari vendor
                                </button>
                            </form>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl space-y-6 px-5 py-14">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-primary">Temukan berdasarkan kebutuhan</p>
                                <h2 className="mt-1 text-2xl font-semibold">Kategori layanan</h2>
                            </div>
                            <Link href={vendorsIndex()} className="text-sm font-medium text-primary hover:underline">
                                Lihat semua layanan
                            </Link>
                        </div>
                        {categories.length === 0 ? (
                            <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                                Kategori layanan akan segera tersedia.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={vendorsIndex({ query: { category: category.slug } })}
                                        className="rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-sm"
                                    >
                                        <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary" aria-hidden="true">
                                            {category.name.slice(0, 1)}
                                        </span>
                                        <span className="font-medium">{category.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="border-y bg-muted/20">
                        <div className="mx-auto max-w-7xl space-y-6 px-5 py-14">
                            <div>
                                <p className="text-sm font-medium text-primary">Pilihan terpercaya</p>
                                <h2 className="mt-1 text-2xl font-semibold">Vendor pilihan</h2>
                            </div>
                            <ServiceGrid services={featuredServices} />
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl space-y-6 px-5 py-14">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-primary">Baru di Vendoria</p>
                                <h2 className="mt-1 text-2xl font-semibold">Layanan terbaru</h2>
                            </div>
                            <Link href={vendorsIndex()} className="text-sm font-medium text-primary hover:underline">
                                Lihat semua
                            </Link>
                        </div>
                        <ServiceGrid services={newestServices} />
                    </section>

                    <section id="cara-kerja" className="border-y bg-muted/20">
                        <div className="mx-auto max-w-7xl px-5 py-14">
                            <h2 className="text-2xl font-semibold">Cara kerja Vendoria</h2>
                            <ol className="mt-8 grid gap-5 md:grid-cols-4">
                                {[
                                    'Cari layanan sesuai kebutuhan acara.',
                                    'Pilih vendor dan paket yang sesuai.',
                                    'Ajukan pesanan dengan detail acara.',
                                    'Vendor mengonfirmasi dan menghubungi Anda.',
                                ].map((step, index) => (
                                    <li key={step} className="rounded-xl border bg-card p-5">
                                        <span className="text-sm font-semibold text-primary">LANGKAH {index + 1}</span>
                                        <p className="mt-3">{step}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </section>

                    <section className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-14">
                        <div>
                            <h2 className="text-2xl font-semibold">Punya usaha acara?</h2>
                            <p className="mt-2 text-muted-foreground">Jangkau lebih banyak pelanggan bersama Vendoria.</p>
                        </div>
                        {!user && (
                            <Link href={register()} className="rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground hover:opacity-90">
                                Gabung sebagai Vendor
                            </Link>
                        )}
                    </section>
                </main>

                <footer className="border-t bg-muted/20">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground">
                        <img src="/images/VendoriaLogo.png" alt="Vendoria" className="h-9 w-auto object-contain" />
                        <p>Vendoria — Temukan vendor terbaik untuk acara Anda.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
