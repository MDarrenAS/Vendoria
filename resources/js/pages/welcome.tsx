import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BadgeCheck,
    Building2,
    Bus,
    Camera,
    Flower2,
    MicVocal,
    Music2,
    Printer,
    Search,
    Sparkles,
    Star,
    TentTree,
    Utensils,
} from 'lucide-react';
import { register } from '@/routes';
import { index as vendorsIndex } from '@/routes/vendors';
import type { Category, ServiceCard } from '@/types/marketplace';
import {
    formatRupiah,
    priceUnitLabel,
    serviceCoverPhoto,
} from '@/types/marketplace';

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
                <article
                    key={service.id}
                    className="group overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:border-primary/30 hover:shadow-lg active:scale-[0.99]"
                >
                    <Link href={`/services/${service.slug}`} className="block">
                        <div className="relative overflow-hidden">
                            <img
                                src={serviceCoverPhoto(
                                    service.cover_url,
                                    service.category.name,
                                    service.slug,
                                )}
                                alt={`Foto ${service.name}`}
                                onError={(event) => {
                                    event.currentTarget.src = serviceCoverPhoto(
                                        null,
                                        service.category.name,
                                        service.slug,
                                    );
                                }}
                                className="h-40 w-full bg-muted object-cover sm:h-44"
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

    return (
        <>
            <Head title="Temukan Vendor Acara" />
            <div className="min-h-screen bg-background text-foreground">
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
                        <div className="relative mx-auto grid max-w-[1280px] items-center gap-7 px-5 py-12 md:px-8 lg:grid-cols-[1fr_0.72fr_0.92fr] lg:gap-6 lg:py-14">
                            <div className="space-y-6">
                                <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                                    <Sparkles className="size-4 text-amber-200" />
                                    Marketplace vendor acara Indonesia
                                </p>
                                <h1 className="max-w-3xl text-4xl leading-[1.08] font-bold tracking-tight md:text-5xl">
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
                            <div className="relative hidden min-h-72 items-center justify-center lg:flex">
                                <span
                                    aria-hidden="true"
                                    className="absolute size-64 rounded-full bg-white/10 blur-3xl"
                                />
                                <img
                                    src="/images/mascot.png"
                                    alt="Maskot Vendoria menyambut Anda"
                                    className="relative z-10 w-full max-w-[280px] object-contain drop-shadow-[0_18px_28px_rgba(0,30,90,0.28)]"
                                    fetchPriority="high"
                                />
                            </div>
                            <form
                                action={vendorsIndex.url()}
                                method="get"
                                className="my-auto grid gap-4 rounded-2xl border border-white/70 bg-card p-5 text-card-foreground shadow-2xl shadow-brand-950/20 md:p-6"
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

                    <section className="bg-[#f7f8ff]">
                        <div className="mx-auto max-w-7xl space-y-5 px-5 py-10">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs font-bold tracking-wide text-primary">
                                        JELAJAHI KATEGORI
                                    </p>
                                    <h2 className="mt-1 text-xl font-bold tracking-tight">
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
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {categories.map((category, index) => {
                                        const categoryIcons = [
                                            Utensils,
                                            Flower2,
                                            Music2,
                                            Camera,
                                            MicVocal,
                                            TentTree,
                                            Printer,
                                            Bus,
                                            Building2,
                                        ];
                                        const iconColors = [
                                            'bg-amber-100 text-amber-600',
                                            'bg-rose-100 text-rose-600',
                                            'bg-blue-100 text-blue-600',
                                            'bg-teal-100 text-teal-600',
                                            'bg-violet-100 text-violet-600',
                                            'bg-cyan-100 text-cyan-600',
                                            'bg-orange-100 text-orange-600',
                                            'bg-orange-100 text-orange-600',
                                            'bg-emerald-100 text-emerald-700',
                                        ];
                                        const CategoryIcon =
                                            categoryIcons[
                                                index % categoryIcons.length
                                            ];

                                        return (
                                            <Link
                                                key={category.id}
                                                href={vendorsIndex({
                                                    query: {
                                                        category: category.slug,
                                                    },
                                                })}
                                                className="group flex min-h-16 items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm transition-shadow duration-200 hover:border-primary/30 hover:shadow-md active:scale-[0.99]"
                                            >
                                                <span
                                                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconColors[index % iconColors.length]}`}
                                                    aria-hidden="true"
                                                >
                                                    <CategoryIcon className="size-4" />
                                                </span>
                                                <span className="grid gap-0.5">
                                                    <span className="text-sm leading-tight font-semibold">
                                                        {category.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {category.vendor_count
                                                            ? `${category.vendor_count}+ vendor`
                                                            : 'Belum ada vendor'}
                                                    </span>
                                                </span>
                                                <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
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
                            {!auth.user && (
                                <Link
                                    href={register({
                                        query: { role: 'vendor' },
                                    })}
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
