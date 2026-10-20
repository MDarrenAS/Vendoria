import { Form, Head, Link } from '@inertiajs/react';
import { read as markRead, readAll } from '@/routes/notifications';

type Notification = {
    id: string;
    data: { message?: string; url?: string };
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
    return (
        <>
            <Head title="Notifikasi" />
            <main className="mx-auto max-w-4xl space-y-7 px-5 py-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold">Notifikasi</h1>
                        <p className="mt-2 text-muted-foreground">Pembaruan pesanan dan aktivitas akun Anda.</p>
                    </div>
                    {unreadCount > 0 && (
                        <Form {...readAll.form()} className="contents">
                            <button type="submit" className="text-sm font-medium text-primary hover:underline">
                                Tandai semua dibaca
                            </button>
                        </Form>
                    )}
                </div>

                {notifications.data.length === 0 ? (
                    <p className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
                        Notifikasi Anda akan muncul di sini.
                    </p>
                ) : (
                    <ul className="divide-y rounded-xl border bg-card">
                        {notifications.data.map((notification) => (
                            <li key={notification.id} className={`flex items-start gap-4 p-5 ${notification.read_at === null ? 'bg-primary/5' : ''}`}>
                                <span aria-hidden="true" className={`mt-2 size-2 shrink-0 rounded-full ${notification.read_at === null ? 'bg-primary' : 'bg-muted'}`} />
                                <div className="min-w-0 flex-1">
                                    <p>{notification.data.message ?? 'Ada pembaruan untuk Anda.'}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.created_at))}
                                    </p>
                                    <div className="mt-2 flex gap-4 text-sm">
                                        {notification.data.url && (
                                            <Link href={notification.data.url} className="text-primary hover:underline">
                                                Lihat detail
                                            </Link>
                                        )}
                                        {notification.read_at === null && (
                                            <Form {...markRead.form(notification.id)} className="contents">
                                                <button type="submit" className="text-muted-foreground hover:text-foreground">
                                                    Tandai dibaca
                                                </button>
                                            </Form>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </>
    );
}
