import { Form, Head } from '@inertiajs/react';
import VendorShell from '@/components/vendor-shell';
import { destroy as deleteBlockedDate, store as blockDates } from '@/routes/vendor/availability';

type BlockedDate = {
    id: number;
    date: string;
    reason: string | null;
};

type BookedDate = {
    order_number: string;
    event_date: string;
    status: string;
};

export default function VendorAvailability({
    blockedDates,
    bookedDates,
}: {
    blockedDates: { data: BlockedDate[] };
    bookedDates: BookedDate[];
}) {
    return (
        <VendorShell title="Ketersediaan">
            <Head title="Ketersediaan" />
            <main className="space-y-7">
                <div>
                    <h2 className="text-3xl font-semibold">Ketersediaan</h2>
                    <p className="mt-2 text-muted-foreground">Blokir tanggal libur atau tanggal ketika usaha tidak menerima pesanan.</p>
                </div>

                <Form {...blockDates.form()} className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
                    {({ errors, processing }) => (
                        <>
                            <DateField label="Dari tanggal" name="start_date" error={errors.start_date} />
                            <DateField label="Sampai tanggal" name="end_date" error={errors.end_date} />
                            <label className="grid gap-2 text-sm font-medium">
                                Alasan (opsional)
                                <input name="reason" maxLength={255} className="h-10 rounded-md border bg-background px-3 font-normal" />
                                {errors.reason && <span role="alert" className="font-normal text-destructive">{errors.reason}</span>}
                            </label>
                            <button disabled={processing} className="h-10 rounded-md bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-60">Blokir tanggal</button>
                            {errors.end_date && <p role="alert" className="text-sm text-destructive sm:col-span-4">{errors.end_date}</p>}
                        </>
                    )}
                </Form>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-card p-5">
                        <h3 className="font-semibold">Tanggal yang diblokir</h3>
                        {blockedDates.data.length === 0 ? (
                            <p className="mt-3 text-sm text-muted-foreground">Belum ada tanggal yang diblokir.</p>
                        ) : (
                            <ul className="mt-4 divide-y">
                                {blockedDates.data.map((date) => (
                                    <li key={date.id} className="flex items-center justify-between gap-3 py-3">
                                        <div>
                                            <p className="font-medium">{formatDate(date.date)}</p>
                                            {date.reason && <p className="text-sm text-muted-foreground">{date.reason}</p>}
                                        </div>
                                        <Form {...deleteBlockedDate.form(date.id)}>
                                            <button className="text-sm text-destructive hover:underline">Hapus</button>
                                        </Form>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="rounded-xl border bg-card p-5">
                        <h3 className="font-semibold">Tanggal pesanan terkonfirmasi</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Tanggal ini terisi otomatis dan tidak dapat dihapus dari ketersediaan.</p>
                        {bookedDates.length === 0 ? (
                            <p className="mt-3 text-sm text-muted-foreground">Belum ada pesanan terkonfirmasi.</p>
                        ) : (
                            <ul className="mt-4 divide-y">
                                {bookedDates.map((booking) => (
                                    <li key={booking.order_number} className="flex items-center justify-between gap-3 py-3 text-sm">
                                        <span>{formatDate(booking.event_date)}</span>
                                        <span className="text-muted-foreground">{booking.order_number}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
        </VendorShell>
    );
}

function DateField({ label, name, error }: { label: string; name: string; error?: string }) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            <input type="date" name={name} min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} required className="h-10 rounded-md border bg-background px-3 font-normal" />
            {error && <span role="alert" className="font-normal text-destructive">{error}</span>}
        </label>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' })
        .format(new Date(`${value.slice(0, 10)}T12:00:00`));
}
