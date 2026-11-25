import { Head, Link, router } from '@inertiajs/react';
import { Bell, CheckCheck } from 'lucide-react';
import { read as markRead, readAll } from '@/routes/notifications';

type Notification = {
    id: string;
    data: {
        message?: string;
        url?: string;
        order_number?: string;
        service_name?: string;
    };
    read_at: string | null;
    created_at: string;
};

type Pagination = {
    data: Notification[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export default function NotificationsIndex({
    notifications,
    unreadCount,
}: {
    notifications: Pagination;
    unreadCount: number;
}) {
    function handleOpenNotification(notification: Notification) {
        const targetUrl = notification.data.url;
        if (!targetUrl) {
            return;
        }

        if (notification.read_at === null) {
            router.patch(
                markRead.url(notification.id),
                { redirect_to: targetUrl },
                { preserveScroll: true },
            );
            return;
        }

        router.visit(targetUrl);
    }

    return (
        <>
            <Head title="Notifikasi" />
            <main className="mx-auto max-w-4xl space-y-6 px-5 py-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">Notifikasi</h1>
                        <p className="mt-2 text-muted-foreground">
                            Pembaruan pesanan, lampiran, dan aktivitas akun Anda.
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={() =>
                                router.post(
                                    readAll.url(),
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-secondary"
                        >
                            <CheckCheck className="size-4" />
                            <span>Tandai semua dibaca ({unreadCount})</span>
                        </button>
                    )}
                </div>

                {notifications.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                        <Bell className="mb-3 size-8 opacity-40" />
                        <p>Notifikasi Anda akan muncul di sini.</p>
                    </div>
                ) : (
                    <ul className="divide-y rounded-xl border bg-card shadow-sm">
                        {notifications.data.map((notification) => (
                            <li
                                key={notification.id}
                                className={`flex items-start gap-4 p-5 transition-colors ${
                                    notification.read_at === null
                                        ? 'bg-primary/5'
                                        : ''
                                }`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`mt-2 size-2 shrink-0 rounded-full ${
                                        notification.read_at === null
                                            ? 'bg-primary'
                                            : 'bg-muted'
                                    }`}
                                />
                                <div className="min-w-0 flex-1">
                                    {(notification.data.order_number ||
                                        notification.data.service_name) && (
                                        <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
                                            {notification.data.order_number && (
                                                <span className="rounded-md bg-secondary px-2 py-0.5 font-semibold text-foreground">
                                                    {notification.data.order_number}
                                                </span>
                                            )}
                                            {notification.data.service_name && (
                                                <span className="text-muted-foreground">
                                                    {notification.data.service_name}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-sm font-medium">
                                        {notification.data.message ??
                                            'Ada pembaruan untuk Anda.'}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {new Intl.DateTimeFormat('id-ID', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        }).format(
                                            new Date(notification.created_at),
                                        )}
                                    </p>
                                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-sm">
                                        {notification.data.url && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenNotification(
                                                        notification,
                                                    )
                                                }
                                                className="font-medium text-primary hover:underline"
                                            >
                                                Lihat detail
                                            </button>
                                        )}
                                        {notification.read_at === null && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.patch(
                                                        markRead.url(
                                                            notification.id,
                                                        ),
                                                        {},
                                                        { preserveScroll: true },
                                                    )
                                                }
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                Tandai dibaca
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {notifications.links.length > 3 && (
                    <nav className="flex flex-wrap items-center justify-center gap-1.5">
                        {notifications.links.map((link, idx) =>
                            link.url ? (
                                <Link
                                    key={idx}
                                    href={link.url}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-card hover:bg-secondary'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ) : (
                                <span
                                    key={idx}
                                    className="rounded-lg border border-border/50 px-3 py-1.5 text-xs text-muted-foreground opacity-50"
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </nav>
                )}
            </main>
        </>
    );
}
