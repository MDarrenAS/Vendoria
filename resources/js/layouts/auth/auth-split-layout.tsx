import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col overflow-hidden bg-gradient-to-br from-brand-950 via-brand-800 to-brand-700 p-10 text-white lg:flex">
                <div
                    aria-hidden="true"
                    className="absolute -top-24 -right-24 size-96 rounded-full bg-white/15 blur-2xl"
                />
                <div
                    aria-hidden="true"
                    className="absolute right-16 bottom-24 size-72 rounded-full bg-amber-300/20 blur-3xl"
                />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center text-lg font-medium"
                >
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    {name}
                </Link>
                <div className="relative z-10 my-auto max-w-lg space-y-6">
                    <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                        Satu tempat untuk merayakan momen
                    </span>
                    <h2 className="text-5xl leading-[1.08] font-bold tracking-tight">
                        Rencanakan acara, temukan orang-orang terbaik.
                    </h2>
                    <p className="max-w-md text-lg leading-8 text-white/80">
                        Jelajahi layanan, bandingkan paket, dan atur kebutuhan
                        acaramu dengan lebih mudah.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-3">
                        {[
                            'Cari vendor',
                            'Bandingkan paket',
                            'Pesan dengan mudah',
                        ].map((item) => (
                            <span
                                key={item}
                                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="relative z-10 text-sm text-white/70">
                    Momen spesial dimulai dari pilihan yang tepat.
                </p>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden"
                    >
                        <AppLogoIcon className="h-10 fill-current text-black sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
