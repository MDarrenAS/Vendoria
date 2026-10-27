import AppHeaderLayout from '@/layouts/app/app-header-layout';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppHeaderLayout breadcrumbs={breadcrumbs}>{children}</AppHeaderLayout>
    );
}
