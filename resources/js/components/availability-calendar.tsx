import { Link } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Lock,
    MessageSquare,
    Unlock,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import vendorOrders from '@/routes/vendor/orders';

export type PublicAvailabilityEntry = {
    date: string;
    type: 'booked' | 'day_off';
};

export type VendorAvailabilityEntry = {
    date: string;
    type: 'booked' | 'day_off';
    order_id: string | null;
    note: string | null;
    blocked_date_id: number | null;
    order_details: {
        order_number: string;
        customer_name: string;
        service_name: string;
        package_name: string | null;
        status: string;
    } | null;
};

type CalendarEntry = PublicAvailabilityEntry | VendorAvailabilityEntry;

type AvailabilityCalendarProps = {
    mode: 'public' | 'vendor';
    entries: CalendarEntry[];
    onSelectAvailableDate?: (date: string) => void;
    onBlockDate?: (date: string, reason: string) => void;
    onUnblockDate?: (blockedDateId: number) => void;
    isSubmitting?: boolean;
    requestDateHref?: string;
};

const DAY_HEADERS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function toDateKey(year: number, monthIndex: number, day: number): string {
    return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayKeyJakarta(): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());
}

function formatLongDate(dateKey: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeZone: 'Asia/Jakarta',
    }).format(new Date(`${dateKey}T12:00:00`));
}

export default function AvailabilityCalendar({
    mode,
    entries,
    onSelectAvailableDate,
    onBlockDate,
    onUnblockDate,
    isSubmitting = false,
    requestDateHref,
}: AvailabilityCalendarProps) {
    const todayKey = useMemo(() => todayKeyJakarta(), []);
    const [viewDate, setViewDate] = useState(() => {
        const now = new Date();

        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [activeDate, setActiveDate] = useState<string | null>(null);
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);
    const [blockReason, setBlockReason] = useState('');

    const entriesByDate = useMemo(() => {
        const map = new Map<string, CalendarEntry>();

        for (const entry of entries) {
            map.set(entry.date.slice(0, 10), entry);
        }

        return map;
    }, [entries]);

    const year = viewDate.getFullYear();
    const monthIndex = viewDate.getMonth();
    const monthLabel = new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
    }).format(viewDate);

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    // Convert JS getDay() (0=Sun..6=Sat) to Monday-first (0=Mon..6=Sun)
    const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;

    const cells: Array<{ day: number; dateKey: string } | null> = [];
    for (let i = 0; i < firstWeekday; i++) {
        cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push({
            day,
            dateKey: toDateKey(year, monthIndex, day),
        });
    }

    const activeEntry = activeDate ? entriesByDate.get(activeDate) : undefined;
    const isVendorEntry = (
        entry: CalendarEntry | undefined,
    ): entry is VendorAvailabilityEntry =>
        mode === 'vendor' && entry !== undefined && 'order_details' in entry;

    function getTooltipText(entry: CalendarEntry | undefined): string | null {
        if (!entry) {
            return null;
        }

        if (mode === 'public') {
            return entry.type === 'booked'
                ? 'Sudah terbooking'
                : 'Vendor tidak tersedia';
        }

        if (entry.type === 'booked' && isVendorEntry(entry) && entry.order_details) {
            return `Booked: ${entry.order_details.order_number} (${entry.order_details.customer_name})`;
        }

        const note = isVendorEntry(entry) ? entry.note : null;

        return note
            ? `Libur: ${note}`
            : 'Libur / tidak menerima pesanan';
    }

    function handleDayClick(dateKey: string, isPast: boolean, entry: CalendarEntry | undefined) {
        if (isPast) {
            return;
        }

        setActiveDate(dateKey);
        setBlockReason('');

        if (!entry && onSelectAvailableDate) {
            onSelectAvailableDate(dateKey);
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-primary" />
                    <h3 className="text-base font-semibold capitalize">
                        {monthLabel}
                    </h3>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        aria-label="Bulan sebelumnya"
                        onClick={() =>
                            setViewDate(new Date(year, monthIndex - 1, 1))
                        }
                        className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const now = new Date();
                            setViewDate(
                                new Date(now.getFullYear(), now.getMonth(), 1),
                            );
                        }}
                        className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                        Hari ini
                    </button>
                    <button
                        type="button"
                        aria-label="Bulan berikutnya"
                        onClick={() =>
                            setViewDate(new Date(year, monthIndex + 1, 1))
                        }
                        className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center">
                {DAY_HEADERS.map((label) => (
                    <div
                        key={label}
                        className="py-1 text-xs font-semibold text-muted-foreground"
                    >
                        {label}
                    </div>
                ))}

                {cells.map((cell, idx) => {
                    if (cell === null) {
                        return <div key={`empty-${idx}`} aria-hidden="true" />;
                    }

                    const { day, dateKey } = cell;
                    const entry = entriesByDate.get(dateKey);
                    const isToday = dateKey === todayKey;
                    const isPast = dateKey < todayKey;
                    const isSelected = activeDate === dateKey;
                    const tooltipText = getTooltipText(entry);
                    const showHoverTooltip =
                        hoveredDate === dateKey && tooltipText !== null;

                    let stateClasses =
                        'border-border bg-white text-foreground hover:border-emerald-300 hover:bg-emerald-50/70';

                    if (isPast) {
                        stateClasses =
                            'cursor-not-allowed border-border/40 bg-muted/40 text-muted-foreground/50';
                    } else if (entry?.type === 'booked') {
                        stateClasses =
                            'border-rose-200 bg-rose-100 text-rose-800 hover:bg-rose-200/70';
                    } else if (entry?.type === 'day_off') {
                        stateClasses =
                            'border-slate-300 bg-slate-200/80 text-slate-600 line-through hover:bg-slate-200';
                    }

                    return (
                        <div key={dateKey} className="relative">
                            <button
                                type="button"
                                disabled={isPast}
                                onClick={() =>
                                    handleDayClick(dateKey, isPast, entry)
                                }
                                onMouseEnter={() => setHoveredDate(dateKey)}
                                onMouseLeave={() => setHoveredDate(null)}
                                onFocus={() => setHoveredDate(dateKey)}
                                onBlur={() => setHoveredDate(null)}
                                aria-label={`${formatLongDate(dateKey)}${tooltipText ? ` - ${tooltipText}` : ' - Tersedia'}`}
                                aria-pressed={isSelected}
                                className={`flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium transition-all sm:h-11 ${stateClasses} ${
                                    isToday
                                        ? 'ring-2 ring-primary ring-offset-1'
                                        : ''
                                } ${
                                    isSelected && !isPast
                                        ? 'outline-2 outline-offset-1 outline-slate-900'
                                        : ''
                                }`}
                            >
                                {day}
                            </button>

                            {showHoverTooltip && (
                                <div
                                    role="tooltip"
                                    className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 w-max max-w-52 -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-center text-xs font-medium text-white shadow-lg"
                                >
                                    {tooltipText}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/70 pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <span className="size-3 rounded border border-rose-300 bg-rose-100" />
                    {mode === 'public'
                        ? 'Sudah terbooking'
                        : 'Booked (ada pesanan)'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="size-3 rounded border border-slate-300 bg-slate-200" />
                    {mode === 'public'
                        ? 'Vendor tidak tersedia'
                        : 'Libur (diblokir)'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <span className="size-3 rounded border border-emerald-300 bg-white" />
                    Tersedia
                </span>
            </div>

            {/* Selected date detail / mobile tap panel */}
            {activeDate && (
                <div className="rounded-xl border border-border bg-secondary/40 p-4 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">
                            {formatLongDate(activeDate)}
                        </p>
                        <button
                            type="button"
                            onClick={() => setActiveDate(null)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Tutup
                        </button>
                    </div>

                    {mode === 'public' ? (
                        activeEntry ? (
                            <div className="mt-2 space-y-2">
                                <p className="font-medium text-rose-700">
                                    {activeEntry.type === 'booked'
                                        ? 'Sudah terbooking'
                                        : 'Vendor tidak tersedia'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Tanggal yang sudah diblokir hanya bisa
                                    dipesan dengan persetujuan vendor.
                                </p>
                                {requestDateHref && (
                                    <Link
                                        href={requestDateHref}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/5"
                                    >
                                        <MessageSquare className="size-3.5" />
                                        Hubungi vendor untuk request tanggal ini
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <p className="mt-1.5 text-xs text-emerald-700">
                                Tanggal ini tersedia untuk pemesanan.
                            </p>
                        )
                    ) : activeEntry?.type === 'booked' &&
                      isVendorEntry(activeEntry) &&
                      activeEntry.order_details ? (
                        <div className="mt-2 space-y-2">
                            <p className="text-xs font-semibold text-rose-700">
                                Terisi oleh pesanan aktif (tidak dapat dibuka
                                langsung dari kalender)
                            </p>
                            <dl className="grid gap-1 text-xs sm:grid-cols-2">
                                <div>
                                    <dt className="text-muted-foreground">
                                        Nomor pesanan
                                    </dt>
                                    <dd className="font-medium">
                                        {activeEntry.order_details.order_number}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Customer
                                    </dt>
                                    <dd className="font-medium">
                                        {
                                            activeEntry.order_details
                                                .customer_name
                                        }
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Layanan / Paket
                                    </dt>
                                    <dd className="font-medium">
                                        {activeEntry.order_details.service_name}
                                        {activeEntry.order_details.package_name
                                            ? ` · ${activeEntry.order_details.package_name}`
                                            : ''}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">
                                        Status
                                    </dt>
                                    <dd className="font-medium">
                                        {activeEntry.order_details.status}
                                    </dd>
                                </div>
                            </dl>
                            <Link
                                href={vendorOrders.show(
                                    activeEntry.order_details.order_number,
                                )}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                            >
                                <ExternalLink className="size-3.5" />
                                Lihat detail pesanan
                            </Link>
                        </div>
                    ) : activeEntry?.type === 'day_off' &&
                      isVendorEntry(activeEntry) ? (
                        <div className="mt-2 space-y-2">
                            <p className="text-xs font-medium text-slate-700">
                                Libur / tidak menerima pesanan
                            </p>
                            {activeEntry.note && (
                                <p className="rounded-lg bg-white px-3 py-2 text-xs text-muted-foreground">
                                    Catatan: {activeEntry.note}
                                </p>
                            )}
                            {onUnblockDate &&
                                activeEntry.blocked_date_id !== null && (
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => {
                                            if (
                                                activeEntry.blocked_date_id !==
                                                null
                                            ) {
                                                onUnblockDate(
                                                    activeEntry.blocked_date_id,
                                                );
                                                setActiveDate(null);
                                            }
                                        }}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-white px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5 disabled:opacity-60"
                                    >
                                        <Unlock className="size-3.5" />
                                        Buka kembali tanggal ini
                                    </button>
                                )}
                        </div>
                    ) : (
                        onBlockDate && (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    onBlockDate(activeDate, blockReason);
                                    setActiveDate(null);
                                    setBlockReason('');
                                }}
                                className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center"
                            >
                                <input
                                    type="text"
                                    value={blockReason}
                                    onChange={(event) =>
                                        setBlockReason(event.target.value)
                                    }
                                    maxLength={255}
                                    placeholder="Catatan libur (opsional)"
                                    className="h-9 flex-1 rounded-lg border bg-white px-3 text-xs"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                                >
                                    <Lock className="size-3.5" />
                                    Blokir tanggal ini
                                </button>
                            </form>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
