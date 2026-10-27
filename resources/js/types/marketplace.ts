export type Category = {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    vendor_count?: number;
};

export type ServicePackage = {
    id: number;
    name: string;
    description: string | null;
    price: string;
    features: string[];
    sort_order: number;
};

export type VendorSummary = {
    business_name: string;
    slug: string;
    city: string;
    is_verified: boolean;
    rating_avg: string;
    rating_count: number;
};

export type ServiceCard = {
    id: number;
    name: string;
    slug: string;
    description: string;
    base_price: string;
    price_unit: string;
    rating_avg: string;
    rating_count: number;
    cover_url: string;
    vendor_profile: VendorSummary;
    category: Pick<Category, 'name' | 'slug'>;
    packages: ServicePackage[];
};

export type CatalogPagination = {
    data: ServiceCard[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

export function formatRupiah(amount: string | number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(amount));
}

export function priceUnitLabel(unit: string): string {
    const labels: Record<string, string> = {
        per_event: 'acara',
        per_pax: 'orang',
        per_day: 'hari',
        per_hour: 'jam',
        per_item: 'item',
    };

    return labels[unit] ?? unit;
}

export function stockPhotoForCategory(category: string): string {
    const normalizedCategory = category.toLocaleLowerCase('id-ID');

    if (
        normalizedCategory.includes('katering') ||
        normalizedCategory.includes('catering')
    ) {
        return '/images/stock-catering.jpg';
    }

    if (normalizedCategory.includes('dekor')) {
        return '/images/stock-decor.jpg';
    }

    return '/images/stock-event.jpg';
}

export function serviceCoverPhoto(
    imageUrl: string | null,
    category: string,
    serviceSlug?: string,
): string {
    const isPlaceholder =
        !imageUrl ||
        ['/vendorialogo.png', '/event-placeholder.jpg'].some((placeholder) =>
            imageUrl.toLocaleLowerCase('id-ID').includes(placeholder),
        );

    if (isPlaceholder) {
        const demoServiceNumber = Number(serviceSlug?.match(/-(\d{2})$/)?.[1]);

        if (demoServiceNumber >= 1 && demoServiceNumber <= 40) {
            return `/images/services/service-${String(demoServiceNumber).padStart(2, '0')}.jpg`;
        }

        return stockPhotoForCategory(category);
    }

    return imageUrl;
}
