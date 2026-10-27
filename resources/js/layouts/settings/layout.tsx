import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const settingsNavItems: NavItem[] = [
    {
        title: 'Profil',
        href: edit(),
        icon: null,
    },
    {
        title: 'Keamanan & Sandi',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Tampilan & Notifikasi',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Heading
                title="Pengaturan Akun"
                description="Kelola informasi profil pribadi, preferensi komunikasi, dan keamanan akun Vendoria Anda."
            />

            <div className="mt-7 space-y-6">
                <nav
                    className="sticky top-[6.875rem] z-30 flex flex-wrap gap-1 rounded-2xl border border-border/70 bg-card/95 p-2 shadow-sm backdrop-blur-xl lg:top-14"
                    aria-label="Navigasi pengaturan"
                >
                    {settingsNavItems.map((item, index) => (
                        <Button
                            key={`${toUrl(item.href)}-${index}`}
                            size="default"
                            variant="ghost"
                            asChild
                            className={cn(
                                'min-h-11 flex-1 justify-center rounded-xl px-3 text-sm whitespace-nowrap sm:flex-none',
                                isCurrentOrParentUrl(item.href) &&
                                    'bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary',
                            )}
                        >
                            <Link href={item.href}>
                                {item.icon && <item.icon className="size-4" />}
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </nav>

                <div className="min-w-0">
                    <section className="max-w-none space-y-8">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
