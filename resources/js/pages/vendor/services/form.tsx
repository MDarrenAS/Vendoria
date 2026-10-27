import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import VendorShell from '@/components/vendor-shell';
import {
    index as servicesIndex,
    store,
    update,
} from '@/routes/vendor/services';
import { formatRupiah, priceUnitLabel } from '@/types/marketplace';

type Package = {
    id: number;
    name: string;
    description: string | null;
    price: string;
    features: string[];
    sort_order: number;
    is_active: boolean;
};

type Image = {
    id: number;
    url: string | null;
    is_cover: boolean;
    sort_order: number;
};

type Service = {
    id: number;
    slug: string;
    category_id: number;
    name: string;
    description: string;
    base_price: string;
    price_unit: string;
    min_quantity: number;
    max_quantity: number | null;
    city_coverage: string | null;
    terms: string | null;
    is_active: boolean;
    packages: Package[];
    images: Image[];
};

type Category = { id: number; name: string };
type PackageDraft = Package & { draftKey: string };

export default function VendorServiceForm({
    service,
    categories,
}: {
    service: Service | null;
    categories: Category[];
}) {
    const [packages, setPackages] = useState<PackageDraft[]>(
        service?.packages.map((item) => ({
            ...item,
            draftKey: `package-${item.id}`,
        })) ?? [
            {
                id: 0,
                name: '',
                description: null,
                price: '',
                features: [],
                sort_order: 0,
                is_active: true,
                draftKey: 'package-new-0',
            },
        ],
    );
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const action = service ? update.form(service.slug) : store.form();
    const currentCover = service?.images.find((image) => image.is_cover);
    const imageIdsToDelete = Array.from(
        new Set([
            ...deletedImageIds,
            ...(selectedImages.length > 0 && currentCover
                ? [currentCover.id]
                : []),
        ]),
    );

    return (
        <VendorShell title={service ? 'Ubah Layanan' : 'Tambah Layanan'}>
            <Head title={service ? 'Ubah Layanan' : 'Tambah Layanan'} />
            <main className="mx-auto max-w-4xl space-y-5">
                <div>
                    <Link
                        href={servicesIndex()}
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        ← Kembali ke daftar layanan
                    </Link>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Harga paket dikalikan jumlah yang diminta customer.
                    </p>
                </div>

                <Form
                    {...action}
                    encType="multipart/form-data"
                    className="grid gap-6 rounded-2xl border border-border/70 bg-card p-5 shadow-sm md:p-7"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="Nama layanan"
                                    name="name"
                                    defaultValue={service?.name ?? ''}
                                    error={errors.name}
                                    required
                                />
                                <label className="grid gap-2 text-sm font-medium">
                                    Kategori
                                    <select
                                        name="category_id"
                                        defaultValue={
                                            service?.category_id ?? ''
                                        }
                                        required
                                        className="h-10 rounded-md border bg-background px-3 font-normal"
                                    >
                                        <option value="" disabled>
                                            Pilih kategori
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Error message={errors.category_id} />
                                </label>
                            </div>
                            <TextArea
                                label="Deskripsi"
                                name="description"
                                defaultValue={service?.description ?? ''}
                                error={errors.description}
                                required
                            />
                            <div className="grid gap-5 sm:grid-cols-3">
                                <Field
                                    label="Harga dasar"
                                    name="base_price"
                                    type="number"
                                    defaultValue={service?.base_price ?? ''}
                                    error={errors.base_price}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                                <label className="grid gap-2 text-sm font-medium">
                                    Satuan harga
                                    <select
                                        name="price_unit"
                                        defaultValue={
                                            service?.price_unit ?? 'per_event'
                                        }
                                        className="h-10 rounded-md border bg-background px-3 font-normal"
                                    >
                                        {[
                                            'per_event',
                                            'per_pax',
                                            'per_day',
                                            'per_hour',
                                            'per_item',
                                        ].map((unit) => (
                                            <option key={unit} value={unit}>
                                                Per {priceUnitLabel(unit)}
                                            </option>
                                        ))}
                                    </select>
                                    <Error message={errors.price_unit} />
                                </label>
                                <Field
                                    label="Kota/area layanan"
                                    name="city_coverage"
                                    defaultValue={service?.city_coverage ?? ''}
                                    error={errors.city_coverage}
                                />
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field
                                    label="Jumlah minimum"
                                    name="min_quantity"
                                    type="number"
                                    defaultValue={String(
                                        service?.min_quantity ?? 1,
                                    )}
                                    error={errors.min_quantity}
                                    required
                                    min="1"
                                />
                                <Field
                                    label="Jumlah maksimum (opsional)"
                                    name="max_quantity"
                                    type="number"
                                    defaultValue={
                                        service?.max_quantity == null
                                            ? ''
                                            : String(service.max_quantity)
                                    }
                                    error={errors.max_quantity}
                                    min="1"
                                />
                            </div>
                            <TextArea
                                label="Syarat dan ketentuan"
                                name="terms"
                                defaultValue={service?.terms ?? ''}
                                error={errors.terms}
                            />

                            <section className="grid gap-4 rounded-2xl border border-border/70 bg-secondary/30 p-4 md:p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold">
                                            Paket layanan
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Minimal satu paket aktif dibutuhkan
                                            untuk mengaktifkan layanan.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPackages((current) => [
                                                ...current,
                                                {
                                                    id: 0,
                                                    name: '',
                                                    description: null,
                                                    price: '',
                                                    features: [],
                                                    sort_order: current.length,
                                                    is_active: true,
                                                    draftKey: `package-new-${Date.now()}`,
                                                },
                                            ])
                                        }
                                        className="rounded-md border px-3 py-2 text-sm font-medium"
                                    >
                                        Tambah paket
                                    </button>
                                </div>
                                {packages.map((servicePackage, index) => (
                                    <fieldset
                                        key={servicePackage.draftKey}
                                        className="grid gap-4 rounded-xl border border-border/70 bg-card p-4"
                                    >
                                        <legend className="px-1 text-sm font-medium">
                                            Paket {index + 1}
                                        </legend>
                                        {servicePackage.id > 0 && (
                                            <input
                                                type="hidden"
                                                name={`packages[${index}][id]`}
                                                value={servicePackage.id}
                                            />
                                        )}
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field
                                                label="Nama paket"
                                                name={`packages[${index}][name]`}
                                                defaultValue={
                                                    servicePackage.name
                                                }
                                                error={
                                                    errors[
                                                        `packages.${index}.name`
                                                    ]
                                                }
                                                required
                                            />
                                            <Field
                                                label="Harga paket"
                                                name={`packages[${index}][price]`}
                                                type="number"
                                                defaultValue={
                                                    servicePackage.price
                                                }
                                                error={
                                                    errors[
                                                        `packages.${index}.price`
                                                    ]
                                                }
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <Field
                                            label="Deskripsi paket"
                                            name={`packages[${index}][description]`}
                                            defaultValue={
                                                servicePackage.description ?? ''
                                            }
                                            error={
                                                errors[
                                                    `packages.${index}.description`
                                                ]
                                            }
                                        />
                                        <TextArea
                                            label="Fasilitas (satu baris per fasilitas)"
                                            name={`packages[${index}][features_text]`}
                                            defaultValue={servicePackage.features.join(
                                                '\n',
                                            )}
                                            error={
                                                errors[
                                                    `packages.${index}.features_text`
                                                ]
                                            }
                                        />
                                        <input
                                            type="hidden"
                                            name={`packages[${index}][sort_order]`}
                                            value={index}
                                        />
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                name={`packages[${index}][is_active]`}
                                                value="1"
                                                defaultChecked={
                                                    servicePackage.is_active
                                                }
                                            />
                                            Paket aktif
                                        </label>
                                        {packages.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPackages((current) =>
                                                        current.filter(
                                                            ({ draftKey }) =>
                                                                draftKey !==
                                                                servicePackage.draftKey,
                                                        ),
                                                    )
                                                }
                                                className="justify-self-start text-sm text-destructive hover:underline"
                                            >
                                                Hapus paket dari layanan
                                            </button>
                                        )}
                                    </fieldset>
                                ))}
                                <Error message={errors.packages} />
                            </section>

                            <section className="grid gap-4 rounded-2xl border border-border/70 bg-secondary/30 p-4 md:p-5">
                                <div>
                                    <h3 className="font-semibold">
                                        Foto layanan
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Maksimal 8 foto, JPG/PNG/WebP, maksimal
                                        2 MB per foto.
                                    </p>
                                </div>
                                {currentCover &&
                                    !deletedImageIds.includes(
                                        currentCover.id,
                                    ) && (
                                        <div className="flex items-center gap-4 rounded-xl bg-card p-3">
                                            {currentCover.url && (
                                                <img
                                                    src={currentCover.url}
                                                    alt="Foto cover saat ini"
                                                    className="size-20 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium">
                                                    Cover saat ini
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {selectedImages.length > 0
                                                        ? 'Cover ini akan diganti saat disimpan.'
                                                        : 'Pilih foto baru di bawah untuk menggantinya.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                {service?.images
                                    .filter((image) => !image.is_cover)
                                    .map((image) => {
                                        const isDeleted =
                                            deletedImageIds.includes(image.id);

                                        return (
                                            <div
                                                key={image.id}
                                                className="flex items-center gap-3 rounded-xl bg-card p-3"
                                            >
                                                {image.url && (
                                                    <img
                                                        src={image.url}
                                                        alt="Foto tambahan layanan"
                                                        className="size-16 rounded-lg object-cover"
                                                    />
                                                )}
                                                <span className="flex-1 text-sm">
                                                    {isDeleted
                                                        ? 'Foto akan dihapus saat disimpan.'
                                                        : 'Foto tambahan'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDeletedImageIds(
                                                            (current) =>
                                                                isDeleted
                                                                    ? current.filter(
                                                                          (
                                                                              id,
                                                                          ) =>
                                                                              id !==
                                                                              image.id,
                                                                      )
                                                                    : [
                                                                          ...current,
                                                                          image.id,
                                                                      ],
                                                        )
                                                    }
                                                    className="text-sm font-medium text-destructive hover:underline"
                                                >
                                                    {isDeleted
                                                        ? 'Batalkan'
                                                        : 'Hapus'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                {imageIdsToDelete.map((imageId) => (
                                    <input
                                        key={imageId}
                                        type="hidden"
                                        name="delete_image_ids[]"
                                        value={imageId}
                                    />
                                ))}
                                {selectedImages.length > 0 && (
                                    <input
                                        type="hidden"
                                        name="cover_image_index"
                                        value="0"
                                    />
                                )}
                                <label className="grid gap-2 text-sm font-medium">
                                    {currentCover
                                        ? 'Ganti atau tambah foto'
                                        : 'Pilih foto layanan'}
                                    <input
                                        type="file"
                                        name="images[]"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        onChange={(event) =>
                                            setSelectedImages(
                                                Array.from(
                                                    event.currentTarget.files ??
                                                        [],
                                                ),
                                            )
                                        }
                                        className="font-normal"
                                    />
                                    <span className="font-normal text-muted-foreground">
                                        Foto pertama yang dipilih otomatis
                                        menjadi cover. Foto berikutnya menjadi
                                        foto tambahan.
                                    </span>
                                    {selectedImages.length > 0 && (
                                        <span className="font-normal text-muted-foreground">
                                            {selectedImages.length} foto
                                            dipilih:{' '}
                                            {selectedImages
                                                .map((image) => image.name)
                                                .join(', ')}
                                        </span>
                                    )}
                                    <Error message={errors.images} />
                                    <Error message={errors.cover_image_index} />
                                </label>
                            </section>

                            <label className="flex items-center gap-3 rounded-lg border p-4 text-sm">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    value="1"
                                    defaultChecked={service?.is_active ?? false}
                                />
                                <span>
                                    <strong className="block">
                                        Aktifkan layanan
                                    </strong>
                                    <span className="text-muted-foreground">
                                        Layanan hanya dapat diaktifkan jika
                                        memiliki paket aktif dan foto cover.
                                    </span>
                                </span>
                            </label>

                            {service && (
                                <p className="text-sm text-muted-foreground">
                                    Harga dasar saat ini:{' '}
                                    {formatRupiah(service.base_price)}.
                                </p>
                            )}
                            <Error message={errors.service} />
                            <button
                                disabled={processing}
                                className="h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan layanan'}
                            </button>
                        </>
                    )}
                </Form>
            </main>
        </VendorShell>
    );
}

function Field({
    label,
    name,
    defaultValue,
    error,
    required = false,
    type = 'text',
    min,
    step,
}: {
    label: string;
    name: string;
    defaultValue: string;
    error?: string;
    required?: boolean;
    type?: string;
    min?: string;
    step?: string;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            <input
                name={name}
                type={type}
                defaultValue={defaultValue}
                required={required}
                min={min}
                step={step}
                className="h-10 rounded-lg border border-border/70 bg-background px-3 font-normal transition outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
            />
            <Error message={error} />
        </label>
    );
}

function TextArea({
    label,
    name,
    defaultValue,
    error,
    required = false,
}: {
    label: string;
    name: string;
    defaultValue: string;
    error?: string;
    required?: boolean;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium">
            {label}
            <textarea
                name={name}
                defaultValue={defaultValue}
                rows={4}
                required={required}
                className="rounded-lg border border-border/70 bg-background p-3 font-normal transition outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/15"
            />
            <Error message={error} />
        </label>
    );
}

function Error({ message }: { message?: string }) {
    return message ? (
        <span role="alert" className="text-sm font-normal text-destructive">
            {message}
        </span>
    ) : null;
}
