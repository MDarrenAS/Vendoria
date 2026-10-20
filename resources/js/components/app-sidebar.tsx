import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { home, dashboard } from '@/routes';
import { dashboard as adminDashboard } from '@/routes/admin';
import { dashboard as vendorDashboard } from '@/routes/vendor';
import { index as ordersIndex } from '@/routes/orders';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const mainNavItems: NavItem[] =
        auth.user?.role === 'vendor'
            ? [
                  {
                      title: 'Dashboard Vendor',
                      href: vendorDashboard(),
                      icon: LayoutGrid,
                  },
              ]
            : auth.user?.role === 'admin'
              ? [
                    {
                        title: 'Panel Admin',
                        href: adminDashboard(),
                        icon: LayoutGrid,
                    },
                ]
              : [
                    {
                        title: 'Beranda',
                        href: home(),
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Pesanan Saya',
                        href: ordersIndex(),
                    },
                    {
                        title: 'Dashboard',
                        href: dashboard(),
                    },
                ];

    const homeHref = mainNavItems[0].href;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
