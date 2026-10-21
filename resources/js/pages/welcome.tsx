import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpRight, BadgeCheck, Search, Sparkles, Star } from 'lucide-react';
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
                    className="group overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
                >
                    <Link href={`/services/${service.slug}`} className="block">
                        <div className="relative overflow-hidden">
                            <img
                                src={service.cover_url}
                                alt={`Foto ${service.name}`}
                                className="h-48 w-full bg-muted object-cover transition duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                            <span className="absolute top-3 left-3 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                                {service.category.name}
                            </span>
                        </div>
                        <div className="space-y-3 p-5">
                            <h3 className="line-clamp-2 min-h-12 leading-snug font-semibold">
                                {service.name}
                            </h3>
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <span className="truncate">
                                    {service.vendor_profile.business_name}
                                </span>
                                {service.vendor_profile.is_verified && (
                                    <BadgeCheck
                                        className="size-4 shrink-0 text-teal-600"
                                        aria-label="Vendor terverifikasi"
                                    />
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {service.vendor_profile.city}
                            </p>
                            <div className="flex items-end justify-between gap-2 border-t border-border/70 pt-3">
                                <p className="text-sm font-bold">
                                    Mulai dari{' '}
                                    {formatRupiah(service.base_price)}
                                    <span className="block text-xs font-normal text-muted-foreground">
                                        / {priceUnitLabel(service.price_unit)}
                                    </span>
                                </p>
                                <p className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                                    {service.rating_count > 0 ? (
                                        <>
                                            <Star className="size-3.5 fill-amber-400 text-amber-500" />{' '}
                                            {service.rating_avg} (
                                            {service.rating_count})
                                        </>
                                    ) : (
                                        'Belum ada ulasan'
                                    )}
                                </p>
                            </div>
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
                <header className="sticky top-0 z-40 border-b border-primary/10 bg-background/85 shadow-sm backdrop-blur-xl">
                    <nav
                        aria-label="Navigasi utama"
                        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3"
                    >
                        <Link href="/" aria-label="Vendoria, beranda">
                            <img
                                src="/images/VendoriaLogo.png"
                                alt="Vendoria"
                                className="h-11 w-auto object-contain"
                            />
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                            <Link
                                href="/"
                                className="rounded-full bg-primary/10 px-3 py-2 text-primary"
                            >
                                Beranda
                            </Link>
                            <Link
                                href={vendorsIndex()}
                                className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                Cari Vendor
                            </Link>
                            <a
                                href="#cara-kerja"
                                className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                            >
                                Cara Kerja
                            </a>
                            {user?.role === 'customer' && (
                                <Link
                                    href={ordersIndex()}
                                    className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    Pesanan Saya
                                </Link>
                            )}
                            {user?.role === 'vendor' && (
                                <Link
                                    href={vendorDashboard()}
                                    className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    Dashboard Vendor
                                </Link>
                            )}
                            {user?.role === 'admin' && (
                                <Link
                                    href={adminDashboard()}
                                    className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                >
                                    Panel Admin
                                </Link>
                            )}
                            {user ? (
                                <>
                                    <Link
                                        href={profileEdit()}
                                        className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                    >
                                        Profil
                                    </Link>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="rounded-full border border-border/80 bg-card px-4 py-2 font-semibold shadow-sm transition hover:border-primary/30 hover:bg-primary/5"
                                    >
                                        Keluar
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="hover:underline"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                    {user?.role === 'vendor' && (
                        <p className="bg-danger-soft px-5 py-2 text-center text-sm font-medium text-danger-ink">
                            Anda masuk sebagai Vendor.
                        </p>
                    )}
                </header>

                <main>
                    <section className="relative isolate overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 text-white">
                        <span
                            aria-hidden="true"
                            className="absolute -top-40 -right-24 size-[32rem] rounded-full bg-amber-300/20 blur-3xl"
                        />
                        <span
                            aria-hidden="true"
                            className="absolute bottom-0 -left-24 size-80 rounded-full bg-teal-300/20 blur-3xl"
                        />
                        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1.05fr_0.8fr] md:py-24">
                            <div className="space-y-7">
                                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                                    <Sparkles className="size-4 text-amber-200" />
                                    Marketplace vendor acara Indonesia
                                </p>
                                <h1 className="max-w-3xl text-4xl leading-[1.08] font-bold tracking-tight md:text-6xl">
                                    Momen spesial, dimulai dari pilihan yang
                                    tepat.
                                </h1>
                                <p className="max-w-2xl text-lg leading-8 text-white/80">
                                    Temukan vendor acara, bandingkan layanan dan
                                    paket, lalu rencanakan hari istimewamu
                                    dengan lebih mudah.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={vendorsIndex()}
                                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-brand-800 shadow-lg shadow-brand-950/20 transition hover:-translate-y-0.5 hover:bg-brand-50"
                                    >
                                        Jelajahi vendor{' '}
                                        <ArrowUpRight className="size-4" />
                                    </Link>
                                    <a
                                        href="#cara-kerja"
                                        className="inline-flex items-center rounded-full border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
                                    >
                                        Cara kerja Vendoria
                                    </a>
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm font-medium text-white/80">
                                    <span className="inline-flex items-center gap-2">
                                        <BadgeCheck className="size-4 text-teal-200" />{' '}
                                        Profil vendor jelas
                                    </span>
                                    <span className="inline-flex items-center gap-2">
                                        <Sparkles className="size-4 text-amber-200" />{' '}
                                        Pilihan lebih praktis
                                    </span>
                                </div>
                            </div>
                            <form
                                action={vendorsIndex.url()}
                                method="get"
                                className="my-auto grid gap-4 rounded-3xl border border-white/70 bg-card p-6 text-card-foreground shadow-2xl shadow-brand-950/20 md:p-8"
                                aria-label="Cari layanan vendor"
                            >
                                <div className="space-y-2">
                                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Search className="size-5" />
                                    </span>
                                    <label
                                        htmlFor="home-query"
                                        className="block text-xl font-bold tracking-tight"
                                    >
                                        Mulai cari vendor
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                        Temukan layanan yang cocok untuk hari
                                        istimewamu.
                                    </p>
                                </div>
                                <input
                                    id="home-query"
                                    name="q"
                                    type="search"
                                    placeholder="Contoh: katering pernikahan"
                                    className="h-12 rounded-xl border bg-background px-4 transition outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                />
                                <label
                                    htmlFor="home-category"
                                    className="text-sm font-semibold"
                                >
                                    Kategori
                                </label>
                                <select
                                    id="home-category"
                                    name="category"
                                    defaultValue=""
                                    className="h-12 rounded-xl border bg-background px-4 transition outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                                >
                                    <option value="">Semua kategori</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.slug}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                                >
                                    <Search className="size-4" /> Cari vendor
                                </button>
                            </form>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl space-y-7 px-5 py-16">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold tracking-wide text-primary">
                                    JELAJAHI KATEGORI
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                    Apa yang sedang kamu cari?
                                </h2>
                            </div>
                            <Link
                                href={vendorsIndex()}
                                className="group inline-flex items-center gap-1 text-sm font-bold text-primary"
                            >
                                Lihat semua layanan{' '}
                                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                        {categories.length === 0 ? (
                            <p className="rounded-2xl border border-dashed bg-card/60 p-8 text-center text-muted-foreground">
                                Kategori layanan akan segera tersedia.
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                                {categories.map((category, index) => {
                                    const accents = [
                                        'bg-brand-100 text-brand-800 ring-brand-200',
                                        'bg-accent-50 text-accent-ink ring-accent-500/20',
                                        'bg-amber-100 text-amber-800 ring-amber-200',
                                        'bg-teal-100 text-teal-700 ring-teal-200',
                                        'bg-sky-100 text-sky-700 ring-sky-200',
                                    ];

                                    return (
                                        <Link
                                            key={category.id}
                                            href={vendorsIndex({
                                                query: {
                                                    category: category.slug,
                                                },
                                            })}
                                            className="group rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                                        >
                                            <span
                                                className={`mb-4 flex size-12 items-center justify-center rounded-2xl font-bold ring-1 transition group-hover:rotate-3 ${accents[index % accents.length]}`}
                                                aria-hidden="true"
                                            >
                                                {category.name.slice(0, 1)}
                                            </span>
                                            <span className="font-semibold">
                                                {category.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <section className="border-y border-primary/10 bg-gradient-to-br from-brand-50/80 via-background to-teal-50/60">
                        <div className="mx-auto max-w-7xl space-y-7 px-5 py-16">
                            <div>
                                <p className="text-sm font-bold tracking-wide text-primary">
                                    PILIHAN UNTUKMU
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                    Vendor pilihan
                                </h2>
                            </div>
                            <ServiceGrid services={featuredServices} />
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl space-y-7 px-5 py-16">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-bold tracking-wide text-primary">
                                    BARU DI VENDORIA
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                    Layanan terbaru
                                </h2>
                            </div>
                            <Link
                                href={vendorsIndex()}
                                className="group inline-flex items-center gap-1 text-sm font-bold text-primary"
                            >
                                Lihat semua{' '}
                                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                        <ServiceGrid services={newestServices} />
                    </section>

                    <section
                        id="cara-kerja"
                        className="border-y border-primary/10 bg-gradient-to-br from-amber-50/80 via-background to-accent-50/70"
                    >
                        <div className="mx-auto max-w-7xl px-5 py-16">
                            <p className="text-sm font-bold tracking-wide text-primary">
                                SIMPLE & TERARAH
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight">
                                Cara kerja Vendoria
                            </h2>
                            <ol className="mt-8 grid gap-5 md:grid-cols-4">
                                {[
                                    'Cari layanan sesuai kebutuhan acara.',
                                    'Pilih vendor dan paket yang sesuai.',
                                    'Ajukan pesanan dengan detail acara.',
                                    'Vendor mengonfirmasi dan menghubungi Anda.',
                                ].map((step, index) => (
                                    <li
                                        key={step}
                                        className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
                                    >
                                        <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-lg font-extrabold text-primary">
                                            {index + 1}
                                        </span>
                                        <p className="mt-4 leading-6 font-medium">
                                            {step}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-5 py-16">
                        <div className="relative isolate flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-brand-950 to-brand-800 px-7 py-9 text-white shadow-xl shadow-brand-950/15 md:px-10 md:py-11">
                            <span
                                aria-hidden="true"
                                className="absolute -right-10 -bottom-32 size-72 rounded-full bg-white/15 blur-2xl"
                            />
                            <div className="relative">
                                <p className="text-sm font-bold tracking-wide text-white/75">
                                    UNTUK MITRA VENDOR
                                </p>
                                <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                                    Punya usaha di bidang acara?
                                </h2>
                                <p className="mt-2 max-w-xl text-white/80">
                                    Tampilkan layananmu dan bantu lebih banyak
                                    orang merayakan momen mereka.
                                </p>
                            </div>
                            {!user && (
                                <Link
                                    href={register()}
                                    className="relative inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-brand-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-50"
                                >
                                    Gabung sebagai Vendor{' '}
                                    <ArrowUpRight className="size-4" />
                                </Link>
                            )}
                        </div>
                    </section>
                </main>

                <footer className="border-t border-primary/10 bg-card/70">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground">
                        <img
                            src="/images/VendoriaLogo.png"
                            alt="Vendoria"
                            className="h-9 w-auto object-contain"
                        />
                        <p>
                            Vendoria — Temukan vendor terbaik untuk acara Anda.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
