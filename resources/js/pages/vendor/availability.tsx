import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AvailabilityCalendar, {
    type VendorAvailabilityEntry,
} from '@/components/availability-calendar';
import VendorShell from '@/components/vendor-shell';
import {
    destroy as deleteBlockedDate,
    store as blockDates,
} from '@/routes/vendor/availability';

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
    calendarDates,
}: {
    blockedDates: { data: BlockedDate[] };
    bookedDates: BookedDate[];
    calendarDates: VendorAvailabilityEntry[];
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleBlockSingleDate(date: string, reason: string) {
        setIsSubmitting(true);
        router.post(
            blockDates.url(),
            {
                start_date: date,
                end_date: date,
                reason: reason || null,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
            },
        );
    }

    function handleUnblockDate(blockedDateId: number) {
        setIsSubmitting(true);
        router.delete(deleteBlockedDate.url(blockedDateId), {
            preserveScroll: true,
            onFinish: () => setIsSubmitting(false),
        });
    }

    return (
        <VendorShell title="Ketersediaan">
            <Head title="Ketersediaan" />
            <main className="space-y-7">
                <div>
                    <h2 className="text-3xl font-semibold">Ketersediaan</h2>
                    <p className="mt-2 text-muted-foreground">
                        Klik tanggal di kalender untuk memblokir/membuka hari
                        libur, atau gunakan rentang tanggal di bawah.
                    </p>
                </div>

                <section className="rounded-xl border bg-card p-5 shadow-sm">
                    <AvailabilityCalendar
                        mode="vendor"
                        entries={calendarDates}
                        onBlockDate={handleBlockSingleDate}
                        onUnblockDate={handleUnblockDate}
                        isSubmitting={isSubmitting}
                    />
                </section>

                <section className="rounded-xl border bg-card p-5 shadow-sm">
                    <h3 className="mb-3 font-semibold">
                        Blokir rentang tanggal sekaligus
                    </h3>
                    <Form
                        {...blockDates.form()}
                        className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end"
                    >
                        {({ errors, processing }) => (
                            <>
                                <DateField
                                    label="Dari tanggal"
                                    name="start_date"
                                    error={errors.start_date}
                                />
                                <DateField
                                    label="Sampai tanggal"
                                    name="end_date"
                                    error={errors.end_date}
                                />
                                <label className="grid gap-2 text-sm font-medium">
                                    Alasan (opsional)
                                    <input
                                        name="reason"
                                        maxLength={255}
                                        className="h-10 rounded-md border bg-background px-3 font-normal"
                                    />
                                    {errors.reason && (
                                        <span
                                            role="alert"
                                            className="font-normal text-destructive"
                                        >
                                            {errors.reason}
                                        </span>
                                    )}
                                </label>
                                <button
                                    disabled={processing}
                                    className="h-10 rounded-md bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-60"
                                >
                                    Blokir tanggal
                                </button>
                                {errors.end_date && (
                                    <p
                                        role="alert"
                                        className="text-sm text-destructive sm:col-span-4"
                                    >
                                        {errors.end_date}
                                    </p>
                                )}
                            </>
                        )}
                    </Form>
                </section>
            </main>
        </VendorShell>
    );
}

function DateField({
    label,
    name,
    error,
}: {
    label: string;
    name: string;
    error?: string;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            <input
                type="date"
                name={name}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                required
                className="h-10 rounded-md border bg-background px-3 font-normal"
            />
            {error && (
                <span role="alert" className="font-normal text-destructive">
                    {error}
                </span>
            )}
        </label>
    );
}
