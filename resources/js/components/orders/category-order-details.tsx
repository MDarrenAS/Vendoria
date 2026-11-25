import {
    AlertTriangle,
    Armchair,
    Building2,
    Bus,
    Camera,
    Clock,
    ExternalLink,
    Flower2,
    MapPin,
    Mic,
    Printer,
    Speaker,
    Utensils,
    type LucideIcon,
} from 'lucide-react';

export type ExtraField = {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'time';
    placeholder?: string;
    options?: string[];
};

type CategoryTheme = {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    badgeClass: string;
    iconWrapClass: string;
};

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
    katering: {
        title: 'Spesifikasi Katering & Konsumsi',
        subtitle: 'Gaya penyajian, menu utama, dan catatan diet/alergi',
        icon: Utensils,
        badgeClass: 'border-orange-200 bg-orange-50 text-orange-800',
        iconWrapClass: 'bg-orange-100 text-orange-700',
    },
    dekorasi: {
        title: 'Konsep & Dimensi Dekorasi',
        subtitle: 'Tema visual, tipe lokasi, ukuran area, dan jadwal loading',
        icon: Flower2,
        badgeClass: 'border-pink-200 bg-pink-50 text-pink-800',
        iconWrapClass: 'bg-pink-100 text-pink-700',
    },
    'sound-system-lighting': {
        title: 'Spesifikasi Teknis & Kelistrikan',
        subtitle: 'Akustik lokasi, daya listrik, check sound, dan kebutuhan audio',
        icon: Speaker,
        badgeClass: 'border-violet-200 bg-violet-50 text-violet-800',
        iconWrapClass: 'bg-violet-100 text-violet-700',
    },
    'dokumentasi-foto-video': {
        title: 'Deliverables & Gaya Liputan',
        subtitle: 'Durasi liputan, format output, gaya editing, dan shot list',
        icon: Camera,
        badgeClass: 'border-sky-200 bg-sky-50 text-sky-800',
        iconWrapClass: 'bg-sky-100 text-sky-700',
    },
    'mc-hiburan': {
        title: 'Profil Penampilan & Susunan Acara',
        subtitle: 'Nuansa pembawaan, bahasa, dresscode, dan segmen penting',
        icon: Mic,
        badgeClass: 'border-amber-200 bg-amber-50 text-amber-800',
        iconWrapClass: 'bg-amber-100 text-amber-700',
    },
    'sewa-perlengkapan': {
        title: 'Inventaris & Jadwal Logistik',
        subtitle: 'Rincian barang sewaan, jadwal antar-jemput, dan akses lokasi',
        icon: Armchair,
        badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        iconWrapClass: 'bg-emerald-100 text-emerald-700',
    },
    'percetakan-merchandise': {
        title: 'Spesifikasi Produksi & Desain',
        subtitle: 'Ukuran produk, bahan finishing, status desain, dan deadline',
        icon: Printer,
        badgeClass: 'border-teal-200 bg-teal-50 text-teal-800',
        iconWrapClass: 'bg-teal-100 text-teal-700',
    },
    transportasi: {
        title: 'Rute Perjalanan & Armada',
        subtitle: 'Tipe armada, kapasitas penumpang, serta titik jemput-tujuan',
        icon: Bus,
        badgeClass: 'border-indigo-200 bg-indigo-50 text-indigo-800',
        iconWrapClass: 'bg-indigo-100 text-indigo-700',
    },
    'venue-tempat': {
        title: 'Konfigurasi Ruangan & Fasilitas',
        subtitle: 'Slot waktu, tata letak ruangan, kapasitas, dan kebijakan konsumsi',
        icon: Building2,
        badgeClass: 'border-rose-200 bg-rose-50 text-rose-800',
        iconWrapClass: 'bg-rose-100 text-rose-700',
    },
};

function isHttpUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export default function CategoryOrderDetails({
    categorySlug,
    categoryName,
    extras,
    extraFields = [],
}: {
    categorySlug?: string | null;
    categoryName?: string | null;
    extras?: Record<string, string> | null;
    extraFields?: ExtraField[];
}) {
    if (!extras) {
        return null;
    }

    const filledEntries = Object.entries(extras).filter(
        ([, value]) => typeof value === 'string' && value.trim() !== '',
    );

    if (filledEntries.length === 0) {
        return null;
    }

    const theme = categorySlug ? CATEGORY_THEMES[categorySlug] : undefined;
    const Icon = theme?.icon ?? Clock;
    const labelMap = new Map(extraFields.map((field) => [field.name, field.label]));

    const getVal = (key: string): string | undefined => {
        const val = extras[key];
        return typeof val === 'string' && val.trim() !== '' ? val.trim() : undefined;
    };

    const renderBadge = (text: string, variant: 'theme' | 'warning' = 'theme') => (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                variant === 'warning'
                    ? 'border-amber-300 bg-amber-50 text-amber-900'
                    : (theme?.badgeClass ?? 'border-border bg-secondary text-foreground')
            }`}
        >
            {variant === 'warning' && <AlertTriangle className="size-3.5" />}
            {text}
        </span>
    );

    const renderField = (key: string, fullWidth = false) => {
        const value = getVal(key);
        if (!value) {
            return null;
        }
        const label = labelMap.get(key) ?? key;
        const isUrl = isHttpUrl(value);

        return (
            <div key={key} className={fullWidth ? 'sm:col-span-2' : undefined}>
                <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-sm font-medium whitespace-pre-line text-foreground">
                    {isUrl ? (
                        <a
                            href={value}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center gap-1.5 text-primary underline-offset-2 hover:underline"
                        >
                            <span>Buka tautan referensi</span>
                            <ExternalLink className="size-3.5" />
                        </a>
                    ) : (
                        value
                    )}
                </dd>
            </div>
        );
    };

    const renderCategoryBody = () => {
        switch (categorySlug) {
            case 'katering': {
                const style = getVal('service_style');
                const time = getVal('serving_time');
                const allergies = getVal('allergies');
                return (
                    <div className="space-y-4">
                        {(style || time) && (
                            <div className="flex flex-wrap gap-2">
                                {style && renderBadge(style)}
                                {time && renderBadge(`Jam saji: ${time} WIB`)}
                            </div>
                        )}
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {renderField('menu')}
                            {renderField('equipment_needed')}
                        </dl>
                        {allergies && (
                            <div className="rounded-xl border border-amber-300/80 bg-amber-50/70 p-3.5 text-sm">
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                                    <AlertTriangle className="size-4 shrink-0" />
                                    Alergi, pantangan, atau kebutuhan khusus
                                </p>
                                <p className="mt-1 whitespace-pre-line text-amber-950">
                                    {allergies}
                                </p>
                            </div>
                        )}
                    </div>
                );
            }

            case 'dekorasi': {
                const venueType = getVal('venue_type');
                const dimension = getVal('area_dimension');
                return (
                    <div className="space-y-4">
                        {(venueType || dimension) && (
                            <div className="flex flex-wrap gap-2">
                                {venueType && renderBadge(venueType)}
                                {dimension && renderBadge(`Area: ${dimension}`)}
                            </div>
                        )}
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {renderField('theme_concept')}
                            {renderField('loading_time')}
                            {renderField('reference_link', true)}
                        </dl>
                    </div>
                );
            }

            case 'sound-system-lighting': {
                const power = getVal('power_source');
                const checkSound = getVal('check_sound_time');
                const acoustics = getVal('venue_acoustics');
                const needsGenset = power?.toLowerCase().includes('genset') ?? false;
                return (
                    <div className="space-y-4">
                        {(acoustics || power || checkSound) && (
                            <div className="flex flex-wrap gap-2">
                                {acoustics && renderBadge(acoustics)}
                                {power && renderBadge(power, needsGenset ? 'warning' : 'theme')}
                                {checkSound && renderBadge(`Check sound: ${checkSound} WIB`)}
                            </div>
                        )}
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {renderField('duration')}
                            {renderField('guest_count')}
                            {renderField('mic_needs', true)}
                        </dl>
                    </div>
                );
            }

            case 'dokumentasi-foto-video': {
                const deliverable = getVal('deliverable_type');
                const format = getVal('delivery_format');
                const duration = getVal('coverage_duration');
                return (
                    <div className="space-y-4">
                        {(deliverable || format || duration) && (
                            <div className="flex flex-wrap gap-2">
                                {deliverable && renderBadge(deliverable)}
                                {duration && renderBadge(`Liputan: ${duration}`)}
                                {format && renderBadge(format)}
                            </div>
                        )}
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {renderField('editing_style', true)}
                            {renderField('shot_list', true)}
                        </dl>
                    </div>
                );
            }

            case 'mc-hiburan': {
                const vibe = getVal('event_vibe');
                const language = getVal('language');
                const dresscode = getVal('dresscode');
                return (
                    <div className="space-y-4">
                        {(vibe || language || dresscode) && (
                            <div className="flex flex-wrap gap-2">
                                {vibe && renderBadge(vibe)}
                                {language && renderBadge(language)}
                                {dresscode && renderBadge(`Dresscode: ${dresscode}`)}
                            </div>
                        )}
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {renderField('entertainment_genre', true)}
                            {renderField('rundown_notes', true)}
                        </dl>
                    </div>
                );
            }

            case 'sewa-perlengkapan': {
                const days = getVal('rental_days');
                const itemList = getVal('item_list');
                return (
                    <div className="space-y-4">
                        {days && (
                            <div className="flex flex-wrap gap-2">
                                {renderBadge(`Durasi sewa: ${days} hari`)}
                            </div>
                        )}
                        {itemList && (
                            <div className="rounded-xl border border-border/70 bg-secondary/40 p-3.5 text-sm">
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Daftar rincian barang sewaan
                                </p>
                                <p className="mt-1 font-medium whitespace-pre-line">
                                    {itemList}
                                </p>
                            </div>
                        )}
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {renderField('delivery_time')}
                            {renderField('pickup_time')}
                            {renderField('access_notes', true)}
                        </dl>
                    </div>
                );
            }

            case 'percetakan-merchandise': {
                const designStatus = getVal('design_status');
                const needsDesign = designStatus?.toLowerCase().includes('butuh') ?? false;
                return (
                    <div className="space-y-4">
                        {designStatus && (
                            <div className="flex flex-wrap gap-2">
                                {renderBadge(designStatus, needsDesign ? 'warning' : 'theme')}
                            </div>
                        )}
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {renderField('item_spec')}
                            {renderField('material_finishing')}
                            {renderField('production_deadline')}
                            {renderField('design_link')}
                        </dl>
                    </div>
                );
            }

            case 'transportasi': {
                const tripType = getVal('trip_type');
                const pickup = getVal('pickup_point');
                const destination = getVal('destination_point');
                const passengers = getVal('passenger_count');
                return (
                    <div className="space-y-4">
                        {(tripType || passengers) && (
                            <div className="flex flex-wrap gap-2">
                                {tripType && renderBadge(tripType)}
                                {passengers && renderBadge(`${passengers} penumpang`)}
                            </div>
                        )}
                        {(pickup || destination) && (
                            <div className="space-y-2.5 rounded-xl border border-border/70 bg-secondary/35 p-3.5 text-sm">
                                {pickup && (
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Titik penjemputan & jam berangkat
                                            </p>
                                            <p className="font-medium">{pickup}</p>
                                        </div>
                                    </div>
                                )}
                                {destination && (
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">
                                                Titik tujuan & rute perjalanan
                                            </p>
                                            <p className="font-medium">{destination}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {renderField('vehicle_type', true)}
                        </dl>
                    </div>
                );
            }

            case 'venue-tempat': {
                const timeSlot = getVal('time_slot');
                const layout = getVal('seating_layout');
                const capacity = getVal('guest_capacity');
                return (
                    <div className="space-y-4">
                        {(timeSlot || layout || capacity) && (
                            <div className="flex flex-wrap gap-2">
                                {timeSlot && renderBadge(timeSlot)}
                                {layout && renderBadge(`Layout: ${layout}`)}
                                {capacity && renderBadge(`Estimasi ${capacity} tamu`)}
                            </div>
                        )}
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {renderField('catering_policy')}
                            {renderField('facilities_needed')}
                        </dl>
                    </div>
                );
            }

            default:
                return (
                    <dl className="grid gap-4 sm:grid-cols-2">
                        {filledEntries.map(([key]) => renderField(key))}
                    </dl>
                );
        }
    };

    return (
        <div className="mt-5 rounded-2xl border border-border/70 bg-background/70 p-4 sm:p-5">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3.5">
                <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                        theme?.iconWrapClass ?? 'bg-primary/10 text-primary'
                    }`}
                >
                    <Icon className="size-4.5" />
                </span>
                <div>
                    <h4 className="text-sm font-semibold">
                        {theme?.title ??
                            `Spesifikasi ${categoryName ?? 'Layanan'}`}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        {theme?.subtitle ??
                            'Detail kebutuhan khusus sesuai kategori layanan'}
                    </p>
                </div>
            </div>
            <div className="pt-4">{renderCategoryBody()}</div>
        </div>
    );
}
