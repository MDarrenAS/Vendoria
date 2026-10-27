import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    CalendarDays,
    ClipboardList,
    LayoutGrid,
    Search,
    Star,
    Store,
    Tags,
    UsersRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard, home, login, register } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import adminCategories from '@/routes/admin/categories';
import adminOrders from '@/routes/admin/orders';
import adminReviews from '@/routes/admin/reviews';
import adminServices from '@/routes/admin/services';
import adminUsers from '@/routes/admin/users';
import adminVendors from '@/routes/admin/vendors';
import { index as notificationsIndex } from '@/routes/notifications';
import { index as ordersIndex } from '@/routes/orders';
import vendorWorkspace, { dashboard as vendorDashboard } from '@/routes/vendor';
import vendorAvailability from '@/routes/vendor/availability';
import vendorOrders from '@/routes/vendor/orders';
import vendorReviews from '@/routes/vendor/reviews';
import vendorServices from '@/routes/vendor/services';
import { edit as vendorProfileEdit } from '@/routes/vendor/profile';
import { index as vendorsIndex } from '@/routes/vendors';
import type { BreadcrumbItem, NavItem } from '@/types';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const activeItemStyles =
    'bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const isVendorOnboardingPage =
        page.url.split('?')[0] === '/vendor/onboarding';
    const mainNavItems: NavItem[] =
        auth.user?.role === 'vendor'
            ? isVendorOnboardingPage
                ? [
                      {
                          title: 'Lengkapi Profil',
                          href: vendorWorkspace.onboarding(),
                          icon: Store,
                      },
                  ]
                : [
                      {
                          title: 'Dashboard',
                          href: vendorDashboard(),
                          icon: LayoutGrid,
                      },
                      {
                          title: 'Pesanan',
                          href: vendorOrders.index(),
                          icon: ClipboardList,
                      },
                      {
                          title: 'Ulasan',
                          href: vendorReviews.index(),
                          icon: Star,
                      },
                      {
                          title: 'Layanan',
                          href: vendorServices.index(),
                          icon: Store,
                      },
                      {
                          title: 'Ketersediaan',
                          href: vendorAvailability.index(),
                          icon: CalendarDays,
                      },
                      {
                          title: 'Profil Usaha',
                          href: vendorProfileEdit(),
                      },
                  ]
            : auth.user?.role === 'admin'
              ? [
                    { title: 'Beranda', href: home(), icon: LayoutGrid },
                    {
                        title: 'Panel Admin',
                        href: adminDashboard(),
                        icon: UsersRound,
                    },
                    {
                        title: 'Vendor',
                        href: adminVendors.index(),
                        icon: Store,
                    },
                    {
                        title: 'Layanan',
                        href: adminServices.index(),
                        icon: Search,
                    },
                    {
                        title: 'Kategori',
                        href: adminCategories.index(),
                        icon: Tags,
                    },
                    {
                        title: 'Pesanan',
                        href: adminOrders.index(),
                        icon: ClipboardList,
                    },
                    {
                        title: 'Ulasan',
                        href: adminReviews.index(),
                        icon: Star,
                    },
                    {
                        title: 'Pengguna',
                        href: adminUsers.index(),
                        icon: UsersRound,
                    },
                ]
              : auth.user
                ? [
                      { title: 'Beranda', href: home(), icon: LayoutGrid },
                      {
                          title: 'Cari Vendor',
                          href: vendorsIndex(),
                          icon: Search,
                      },
                      {
                          title: 'Pesanan Saya',
                          href: ordersIndex(),
                          icon: ClipboardList,
                      },
                      {
                          title: 'Dashboard',
                          href: dashboard(),
                          icon: LayoutGrid,
                      },
                  ]
                : [
                      { title: 'Beranda', href: home(), icon: LayoutGrid },
                      {
                          title: 'Cari Vendor',
                          href: vendorsIndex(),
                          icon: Search,
                      },
                  ];
    const homeHref = auth.user?.role === 'vendor' ? vendorDashboard() : home();
    const getInitials = useInitials();
    const { isCurrentOrParentUrl, isCurrentUrl } = useCurrentUrl();
    const isNavItemActive = (item: NavItem): boolean => {
        const isTopLevelDestination = [
            'Beranda',
            'Panel Admin',
            'Dashboard',
        ].includes(item.title);

        return (
            isCurrentUrl(item.href) ||
            (!isTopLevelDestination && isCurrentOrParentUrl(item.href))
        );
    };

    return (
        <>
            <div className="sticky top-0 z-40 border-b border-primary/10 bg-card/90 shadow-sm backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex h-14 items-center gap-4">
                        <Link
                            href={homeHref}
                            prefetch
                            className="flex shrink-0 items-center"
                        >
                            <AppLogo />
                        </Link>

                        <nav
                            aria-label="Navigasi utama"
                            className="hidden min-w-0 items-center gap-1 overflow-x-auto lg:flex"
                        >
                            {mainNavItems.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    aria-current={
                                        isNavItemActive(item)
                                            ? 'page'
                                            : undefined
                                    }
                                    className={cn(
                                        'inline-flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                        isNavItemActive(item) &&
                                            activeItemStyles,
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </nav>

                        <div className="ml-auto flex shrink-0 items-center gap-2">
                            {!auth.user && (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                            {auth.user && (
                                <Link
                                    href={notificationsIndex()}
                                    aria-label={`Notifikasi${page.props.unreadNotificationCount ? `, ${page.props.unreadNotificationCount} belum dibaca` : ''}`}
                                    className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-muted"
                                >
                                    <Bell className="size-5" />
                                    {page.props.unreadNotificationCount > 0 && (
                                        <span className="absolute top-1 right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-4 text-destructive-foreground">
                                            {page.props
                                                .unreadNotificationCount > 99
                                                ? '99+'
                                                : page.props
                                                      .unreadNotificationCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                            {auth.user && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="size-10 rounded-full p-1"
                                        >
                                            <Avatar className="size-8 overflow-hidden rounded-full">
                                                <AvatarImage
                                                    src={
                                                        auth.user.avatar_url ??
                                                        undefined
                                                    }
                                                    alt={auth.user.name}
                                                />
                                                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                    {getInitials(
                                                        auth.user.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                    >
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </div>
                <nav
                    aria-label="Navigasi utama"
                    className="flex items-center gap-1 overflow-x-auto border-t border-border/60 px-4 py-2 lg:hidden"
                >
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            aria-current={
                                isNavItemActive(item) ? 'page' : undefined
                            }
                            className={cn(
                                'inline-flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                isNavItemActive(item) && activeItemStyles,
                            )}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
