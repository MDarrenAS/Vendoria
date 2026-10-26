import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Bell,
    CalendarDays,
    ClipboardList,
    LayoutGrid,
    Menu,
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
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
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
    'bg-primary/10 text-primary dark:bg-primary/15 dark:text-primary';

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="xl:hidden">
                        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 h-[34px] w-[34px]"
                                    aria-label="Buka menu navigasi"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar"
                            >
                                <SheetTitle className="sr-only">
                                    Menu navigasi
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <img
                                        src="/images/VendoriaLogo.png"
                                        alt="Logo Vendoria"
                                        className="h-9 w-auto object-contain"
                                    />
                                </SheetHeader>
                                <nav
                                    aria-label="Navigasi utama"
                                    className="flex flex-1 flex-col gap-2 p-4 text-sm"
                                >
                                    {mainNavItems.map((item) => {
                                        const isActive = isNavItemActive(item);

                                        return (
                                            <Link
                                                key={item.title}
                                                href={item.href}
                                                aria-current={
                                                    isActive
                                                        ? 'page'
                                                        : undefined
                                                }
                                                onClick={() =>
                                                    setIsMenuOpen(false)
                                                }
                                                className={cn(
                                                    'flex min-h-11 items-center gap-3 rounded-xl px-3 font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                                    isActive &&
                                                        activeItemStyles,
                                                )}
                                            >
                                                {item.icon && (
                                                    <item.icon className="size-5" />
                                                )}
                                                <span>{item.title}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link
                        href={homeHref}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav
                        aria-label="Navigasi utama"
                        className="ml-6 hidden h-full items-center space-x-6 xl:flex"
                    >
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item) => (
                                    <NavigationMenuItem
                                        key={item.title}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                isNavItemActive(item) &&
                                                    activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                            aria-current={
                                                isNavItemActive(item)
                                                    ? 'page'
                                                    : undefined
                                            }
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            {item.title}
                                        </Link>
                                        {isNavItemActive(item) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>

                    <div className="ml-auto flex items-center space-x-2">
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
                                        {page.props.unreadNotificationCount > 99
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
                                                {getInitials(auth.user.name)}
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
